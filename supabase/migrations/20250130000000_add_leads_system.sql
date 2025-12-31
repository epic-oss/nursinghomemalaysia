-- Create leads table to store quote requests
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT UNIQUE NOT NULL, -- e.g., "TB1706789012345"

  -- Contact info
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Event details
  participants INTEGER NOT NULL,
  preferred_date TEXT, -- Can be actual date or "Flexible"
  flexible_dates BOOLEAN DEFAULT false,
  location TEXT NOT NULL, -- State/location
  duration TEXT NOT NULL,
  budget TEXT,
  hrdf_required TEXT,
  additional_requirements TEXT,

  -- Tracking
  source TEXT DEFAULT 'quote-form',
  status TEXT DEFAULT 'new', -- new, contacted, converted, closed

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_notifications table to track which vendors received which leads
CREATE TABLE IF NOT EXISTS lead_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

  -- Notification details
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_sent_to TEXT NOT NULL, -- Vendor's email at time of sending
  email_status TEXT DEFAULT 'sent', -- sent, delivered, opened, bounced, failed
  resend_message_id TEXT, -- Resend's message ID for tracking

  -- Tracking
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(lead_id, company_id) -- One notification per lead per company
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_location ON leads(location);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_notifications_lead_id ON lead_notifications(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notifications_company_id ON lead_notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_lead_notifications_sent_at ON lead_notifications(sent_at DESC);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads (admin only)
CREATE POLICY "Admins can do everything with leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS policies for lead_notifications
-- Vendors can see notifications sent to them
CREATE POLICY "Vendors can view their own lead notifications"
  ON lead_notifications FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Admins/system can insert notifications
CREATE POLICY "System can insert lead notifications"
  ON lead_notifications FOR INSERT
  WITH CHECK (true);

-- Add trigger for updated_at on leads
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();
