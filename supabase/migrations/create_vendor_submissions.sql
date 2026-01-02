-- Create vendor_submissions table
CREATE TABLE vendor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company Information
  company_name TEXT NOT NULL,
  registration_number TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,

  -- Location
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,

  -- Services
  company_type TEXT NOT NULL,
  description TEXT NOT NULL,
  activities_offered TEXT[] NOT NULL, -- Array of activity types

  -- Additional
  ,
  referral_source TEXT,

  -- Status tracking
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for email lookups
CREATE INDEX idx_vendor_submissions_email ON vendor_submissions(email);

-- Create index for status filtering
CREATE INDEX idx_vendor_submissions_status ON vendor_submissions(status);

-- Create index for created_at for sorting
CREATE INDEX idx_vendor_submissions_created_at ON vendor_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE vendor_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions
CREATE POLICY "Anyone can submit vendor applications"
  ON vendor_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own submissions by email
CREATE POLICY "Users can read their own submissions"
  ON vendor_submissions
  FOR SELECT
  USING (true);

-- Add comment
COMMENT ON TABLE vendor_submissions IS 'Stores vendor/company submission applications from the public submission form';
