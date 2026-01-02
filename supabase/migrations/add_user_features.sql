-- Add user ownership and featured listing columns to companies table
ALTER TABLE nursing_homes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE nursing_homes ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE nursing_homes ADD COLUMN IF NOT EXISTS featured_until DATE;
ALTER TABLE nursing_homes ADD COLUMN IF NOT EXISTS featured_images TEXT[] DEFAULT '{}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_nursing_homes_user_id ON nursing_homes(user_id);
CREATE INDEX IF NOT EXISTS idx_nursing_homes_is_featured ON nursing_homes(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_nursing_homes_featured_until ON nursing_homes(featured_until) WHERE featured_until IS NOT NULL;

-- Create claim_requests table for users claiming existing listings
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
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, nursing_home_id) -- Prevent duplicate claims from same user
);

-- Create indexes for claim_requests
CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_nursing_home_id ON claim_requests(nursing_home_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests(status);
CREATE INDEX IF NOT EXISTS idx_claim_requests_created_at ON claim_requests(created_at DESC);

-- Enable RLS on claim_requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for claim_requests
-- Users can insert their own claim requests
CREATE POLICY "Users can create claim requests"
  ON claim_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own claim requests
CREATE POLICY "Users can view own claim requests"
  ON claim_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their pending claim requests
CREATE POLICY "Users can update own pending claims"
  ON claim_requests
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Update RLS policies for companies to allow users to see and update their own listings
CREATE POLICY "Users can view their own companies"
  ON companies
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own companies"
  ON companies
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON COLUMN companies.user_id IS 'Owner of the company listing - references auth.users';
COMMENT ON COLUMN companies.is_featured IS 'Whether this is a featured/premium listing';
COMMENT ON COLUMN companies.featured_until IS 'Date until which the featured status is active';
COMMENT ON COLUMN companies.featured_images IS 'Array of additional images for featured listings';

COMMENT ON TABLE claim_requests IS 'Requests from users to claim ownership of existing company listings';
COMMENT ON COLUMN claim_requests.role_at_company IS 'User role at the company (Owner, Manager, Employee)';
COMMENT ON COLUMN claim_requests.verification_phone IS 'Phone number for verification purposes';
COMMENT ON COLUMN claim_requests.status IS 'Status of the claim request: pending, approved, or rejected';
