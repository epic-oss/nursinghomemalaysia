-- ========================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ========================================
-- This will fix your production site!
-- Go to: https://supabase.com/dashboard/project/bgrtsijikctafnlqikzl/sql
-- ========================================

-- Step 1: Add new columns to companies table
ALTER TABLE nursing_homes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS featured_until DATE,
ADD COLUMN IF NOT EXISTS featured_images TEXT[];

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nursing_homes_user_id ON nursing_homes(user_id);
CREATE INDEX IF NOT EXISTS idx_nursing_homes_featured ON nursing_homes(is_featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_nursing_homes_premium ON nursing_homes(is_premium);

-- Step 3: Create claim_requests table
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

-- Step 4: Create indexes for claim_requests
CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_nursing_home_id ON claim_requests(nursing_home_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests(status);

-- Step 5: Enable Row Level Security on claim_requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for claim_requests
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

-- Step 7: Create RLS policies for companies (if not already exists)
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

-- Drop old policy and create new one that allows claiming unclaimed companies
DROP POLICY IF EXISTS "Users can update their own companies" ON companies;

CREATE POLICY "Users can update their own companies or claim unclaimed"
  ON nursing_homes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id);

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

-- ========================================
-- DONE! Your site should work now!
-- ========================================
-- After running this:
-- 1. Go to www.nursinghomemy.com
-- 2. Hard refresh (Ctrl+Shift+R)
-- 3. You should see all 81 companies!
-- ========================================
