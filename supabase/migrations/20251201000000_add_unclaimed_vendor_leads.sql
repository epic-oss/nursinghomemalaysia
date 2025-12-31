-- Migration: Add unclaimed vendor lead distribution support
-- Date: 2025-12-01

-- ============================================
-- 1. ADD COLUMNS TO lead_notifications TABLE
-- ============================================

-- Track whether notification was sent to a claimed or unclaimed vendor
ALTER TABLE lead_notifications
ADD COLUMN IF NOT EXISTS is_claimed_vendor BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN lead_notifications.is_claimed_vendor IS 'true = claimed vendor (full lead details), false = unclaimed vendor (limited details + claim CTA)';

-- ============================================
-- 2. ADD COLUMNS TO companies TABLE
-- ============================================

-- Track when unclaimed vendor last received a lead (for rotation)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS last_lead_sent_at TIMESTAMP WITH TIME ZONE;

-- Track total leads sent to unclaimed vendor (for analytics)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS unclaimed_leads_sent INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN companies.last_lead_sent_at IS 'Last time this vendor received a lead notification (used for fair rotation of unclaimed vendors)';
COMMENT ON COLUMN companies.unclaimed_leads_sent IS 'Total number of leads sent to this vendor while unclaimed';

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for finding unclaimed vendors by location with rotation priority
CREATE INDEX IF NOT EXISTS idx_companies_unclaimed_rotation
ON companies(state, last_lead_sent_at NULLS FIRST)
WHERE user_id IS NULL;

-- Index for checking recent lead notifications to unclaimed vendors
CREATE INDEX IF NOT EXISTS idx_lead_notifications_unclaimed
ON lead_notifications(company_id, sent_at DESC)
WHERE is_claimed_vendor = false;

-- ============================================
-- 4. CREATE HELPER FUNCTION FOR ROTATION
-- ============================================

-- Function to get unclaimed vendors for a location with fair rotation
-- Returns vendors who haven't received a lead in the past 7 days
-- Prioritizes vendors who have never received a lead or received one longest ago
CREATE OR REPLACE FUNCTION get_unclaimed_vendors_for_rotation(
  p_states TEXT[],
  p_limit INTEGER DEFAULT 3,
  p_cooldown_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  contact_email TEXT,
  state TEXT,
  last_lead_sent_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.contact_email,
    c.state,
    c.last_lead_sent_at
  FROM companies c
  WHERE
    c.user_id IS NULL  -- Unclaimed vendors only
    AND c.state = ANY(p_states)  -- Match location
    AND c.contact_email IS NOT NULL  -- Must have email
    AND c.contact_email LIKE '%@%'  -- Basic email validation
    AND (
      c.last_lead_sent_at IS NULL  -- Never received a lead
      OR c.last_lead_sent_at < NOW() - (p_cooldown_days || ' days')::INTERVAL  -- Outside cooldown
    )
  ORDER BY
    c.last_lead_sent_at NULLS FIRST,  -- Prioritize those who never received
    c.unclaimed_leads_sent ASC  -- Then by total leads sent (fairness)
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. CREATE FUNCTION TO UPDATE VENDOR AFTER LEAD SENT
-- ============================================

-- Function to update vendor's last_lead_sent_at and increment counter
CREATE OR REPLACE FUNCTION update_vendor_lead_tracking(
  p_vendor_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE companies
  SET
    last_lead_sent_at = NOW(),
    unclaimed_leads_sent = COALESCE(unclaimed_leads_sent, 0) + 1
  WHERE id = p_vendor_id AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. CREATE VIEW FOR LEAD ANALYTICS
-- ============================================

CREATE OR REPLACE VIEW lead_distribution_stats AS
SELECT
  DATE_TRUNC('month', ln.sent_at) as month,
  COUNT(*) FILTER (WHERE ln.is_claimed_vendor = true) as claimed_vendor_notifications,
  COUNT(*) FILTER (WHERE ln.is_claimed_vendor = false) as unclaimed_vendor_notifications,
  COUNT(DISTINCT ln.lead_id) as total_leads,
  COUNT(DISTINCT ln.company_id) FILTER (WHERE ln.is_claimed_vendor = true) as unique_claimed_vendors,
  COUNT(DISTINCT ln.company_id) FILTER (WHERE ln.is_claimed_vendor = false) as unique_unclaimed_vendors
FROM lead_notifications ln
GROUP BY DATE_TRUNC('month', ln.sent_at)
ORDER BY month DESC;

-- Grant access to the view
GRANT SELECT ON lead_distribution_stats TO authenticated;
