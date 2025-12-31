-- Add user ownership and featured listing features to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until DATE,
ADD COLUMN IF NOT EXISTS featured_images TEXT[];

-- Create index for user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);

-- Create index for featured listings
CREATE INDEX IF NOT EXISTS idx_companies_featured ON companies(is_featured, featured_until);

-- Create claim_requests table
CREATE TABLE IF NOT EXISTS claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_at_company TEXT NOT NULL,
  verification_phone TEXT NOT NULL,
  proof_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Create index for claim requests
CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_company_id ON claim_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests(status);

-- Enable RLS on claim_requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- Policies for claim_requests
-- Users can view their own claim requests
CREATE POLICY "Users can view their own claim requests"
  ON claim_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create claim requests
CREATE POLICY "Users can create claim requests"
  ON claim_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for companies table to allow owners to manage their listings
-- Users can view all companies (public access)
CREATE POLICY IF NOT EXISTS "Anyone can view companies"
  ON companies FOR SELECT
  TO public
  USING (true);

-- Users can update their own companies
CREATE POLICY IF NOT EXISTS "Users can update their own companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert companies (when they submit a new listing)
CREATE POLICY IF NOT EXISTS "Authenticated users can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
