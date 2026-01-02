-- Add premium subscription features to companies table
ALTER TABLE nursing_homes
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP WITH TIME ZONE;

-- Create index for premium listings
CREATE INDEX IF NOT EXISTS idx_nursing_homes_premium ON nursing_homes(is_premium);

-- Update existing is_featured to work with premium
-- Premium companies are automatically featured
CREATE OR REPLACE FUNCTION sync_premium_to_featured()
RETURNS TRIGGER AS $$
BEGIN
  -- If company becomes premium, automatically set featured
  IF NEW.is_premium = true AND OLD.is_premium = false THEN
    NEW.is_featured := true;
    -- Set featured_until to 30 days from now if not already set
    IF NEW.featured_until IS NULL THEN
      NEW.featured_until := CURRENT_DATE + INTERVAL '30 days';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync premium status to featured
DROP TRIGGER IF EXISTS trigger_sync_premium_to_featured ON companies;
CREATE TRIGGER trigger_sync_premium_to_featured
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION sync_premium_to_featured();
