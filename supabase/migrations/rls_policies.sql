-- =====================================================
-- RLS POLICIES FOR NURSING HOME MALAYSIA
-- Run this SQL in Supabase Studio SQL Editor
-- =====================================================

-- =====================================================
-- 1. VENDOR_SUBMISSIONS TABLE
-- =====================================================
ALTER TABLE vendor_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "anon_insert_submissions" ON vendor_submissions;
DROP POLICY IF EXISTS "auth_select_submissions" ON vendor_submissions;
DROP POLICY IF EXISTS "auth_update_submissions" ON vendor_submissions;
DROP POLICY IF EXISTS "auth_delete_submissions" ON vendor_submissions;
DROP POLICY IF EXISTS "Anyone can submit vendor applications" ON vendor_submissions;
DROP POLICY IF EXISTS "Users can read their own submissions" ON vendor_submissions;

-- Anyone can submit vendor applications (public form)
CREATE POLICY "anon_insert_submissions" ON vendor_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users (admins) can read all submissions
CREATE POLICY "auth_select_submissions" ON vendor_submissions
  FOR SELECT TO authenticated USING (true);

-- Authenticated users (admins) can update submissions
CREATE POLICY "auth_update_submissions" ON vendor_submissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users (admins) can delete submissions
CREATE POLICY "auth_delete_submissions" ON vendor_submissions
  FOR DELETE TO authenticated USING (true);

-- =====================================================
-- 2. NURSING_HOMES TABLE (main listings)
-- =====================================================
ALTER TABLE nursing_homes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "anon_select_nursing_homes" ON nursing_homes;
DROP POLICY IF EXISTS "auth_all_nursing_homes" ON nursing_homes;
DROP POLICY IF EXISTS "Public read access" ON nursing_homes;

-- Anyone can read nursing homes (public directory)
CREATE POLICY "anon_select_nursing_homes" ON nursing_homes
  FOR SELECT TO anon USING (true);

-- Authenticated users have full access
CREATE POLICY "auth_all_nursing_homes" ON nursing_homes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- 3. INQUIRIES TABLE (leads)
-- =====================================================
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Add status column if it doesn't exist
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Drop existing policies
DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
DROP POLICY IF EXISTS "auth_select_inquiries" ON inquiries;
DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;

-- Anyone can submit inquiries (public contact form)
CREATE POLICY "anon_insert_inquiries" ON inquiries
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users (admins) can read all inquiries
CREATE POLICY "auth_select_inquiries" ON inquiries
  FOR SELECT TO authenticated USING (true);

-- Authenticated users (admins) can update inquiries
CREATE POLICY "auth_update_inquiries" ON inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users (admins) can delete inquiries
CREATE POLICY "auth_delete_inquiries" ON inquiries
  FOR DELETE TO authenticated USING (true);

-- =====================================================
-- 4. FACILITIES TABLE (if exists)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'facilities') THEN
    ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "anon_select_facilities" ON facilities;
    DROP POLICY IF EXISTS "auth_all_facilities" ON facilities;

    CREATE POLICY "anon_select_facilities" ON facilities
      FOR SELECT TO anon USING (true);

    CREATE POLICY "auth_all_facilities" ON facilities
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =====================================================
-- 5. SERVICES TABLE (if exists)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') THEN
    ALTER TABLE services ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "anon_select_services" ON services;
    DROP POLICY IF EXISTS "auth_all_services" ON services;

    CREATE POLICY "anon_select_services" ON services
      FOR SELECT TO anon USING (true);

    CREATE POLICY "auth_all_services" ON services
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =====================================================
-- 6. CLAIM_REQUESTS TABLE (if exists)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'claim_requests') THEN
    ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "auth_insert_claims" ON claim_requests;
    DROP POLICY IF EXISTS "auth_select_own_claims" ON claim_requests;
    DROP POLICY IF EXISTS "admin_all_claims" ON claim_requests;

    -- Authenticated users can create claim requests
    CREATE POLICY "auth_insert_claims" ON claim_requests
      FOR INSERT TO authenticated WITH CHECK (true);

    -- Users can view their own claims
    CREATE POLICY "auth_select_own_claims" ON claim_requests
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    -- Note: Admin access should be handled via service role key
  END IF;
END $$;

-- =====================================================
-- INDEX CREATION FOR PERFORMANCE
-- =====================================================

-- Vendor submissions indexes
CREATE INDEX IF NOT EXISTS idx_vendor_submissions_status ON vendor_submissions(status);
CREATE INDEX IF NOT EXISTS idx_vendor_submissions_created_at ON vendor_submissions(created_at DESC);

-- Inquiries indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- =====================================================
-- VERIFICATION QUERY
-- Run this to verify policies are in place:
-- =====================================================
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
