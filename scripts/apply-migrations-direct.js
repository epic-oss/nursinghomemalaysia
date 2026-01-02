const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runSQL(sql, description) {
  console.log(`\n🔧 ${description}...`)
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) throw error
    console.log('✓ Success')
    return true
  } catch (err) {
    // If exec_sql doesn't exist, we need to use the SQL editor
    console.log('⚠️  exec_sql function not available')
    console.log('Please run this SQL manually in Supabase SQL Editor:')
    console.log('─'.repeat(60))
    console.log(sql)
    console.log('─'.repeat(60))
    return false
  }
}

async function applyMigrations() {
  console.log('🚀 Applying Database Migrations Directly\n')

  // Step 1: Add columns to companies table
  await runSQL(`
ALTER TABLE nursing_homes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS featured_until DATE,
ADD COLUMN IF NOT EXISTS featured_images TEXT[];
  `, 'Adding columns to companies table')

  // Step 2: Create indexes
  await runSQL(`
CREATE INDEX IF NOT EXISTS idx_nursing_homes_user_id ON nursing_homes(user_id);
CREATE INDEX IF NOT EXISTS idx_nursing_homes_featured ON nursing_homes(is_featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_nursing_homes_premium ON nursing_homes(is_premium);
  `, 'Creating indexes')

  // Step 3: Create claim_requests table
  await runSQL(`
CREATE TABLE IF NOT EXISTS claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nursing_home_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_at_company TEXT NOT NULL,
  verification_phone TEXT NOT NULL,
  proof_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  UNIQUE(user_id, nursing_home_id)
);
  `, 'Creating claim_requests table')

  // Step 4: Create claim_requests indexes
  await runSQL(`
CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_nursing_home_id ON claim_requests(nursing_home_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests(status);
  `, 'Creating claim_requests indexes')

  // Step 5: Enable RLS on claim_requests
  await runSQL(`
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;
  `, 'Enabling RLS on claim_requests')

  // Step 6: Create RLS policies for claim_requests
  await runSQL(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_requests'
    AND policyname = 'Users can view their own claim requests'
  ) THEN
    CREATE POLICY "Users can view their own claim requests"
      ON claim_requests FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;
  `, 'Creating SELECT policy for claim_requests')

  await runSQL(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_requests'
    AND policyname = 'Users can create claim requests'
  ) THEN
    CREATE POLICY "Users can create claim requests"
      ON claim_requests FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
  `, 'Creating INSERT policy for claim_requests')

  // Step 7: Create RLS policies for companies
  await runSQL(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'companies'
    AND policyname = 'Anyone can view companies'
  ) THEN
    CREATE POLICY "Anyone can view companies"
      ON nursing_homes FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;
  `, 'Creating public SELECT policy for companies')

  await runSQL(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'companies'
    AND policyname = 'Users can update their own companies'
  ) THEN
    CREATE POLICY "Users can update their own companies"
      ON nursing_homes FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
  `, 'Creating UPDATE policy for companies')

  await runSQL(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'companies'
    AND policyname = 'Authenticated users can insert companies'
  ) THEN
    CREATE POLICY "Authenticated users can insert companies"
      ON nursing_homes FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
  `, 'Creating INSERT policy for companies')

  console.log('\n' + '='.repeat(60))
  console.log('✅ Migration script completed!')
  console.log('='.repeat(60))
  console.log('\nIf any steps failed above, please run them manually in')
  console.log('Supabase SQL Editor: https://supabase.com/dashboard/project/bgrtsijikctafnlqikzl/sql')
}

applyMigrations()
