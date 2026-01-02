import { Resend } from 'resend'

// Lazy-initialize Resend client
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

// Email sender configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nursing Home MY <leads@nursinghomemy.com>'
const BASE_URL = 'https://nursinghomemy.com'

interface LeadData {
  leadId: string
  name: string
  companyName: string
  email: string
  phone: string
  participants: number
  preferredDate: string
  location: string
  duration: string
  budget: string
  hrdfRequired: string
  additionalRequirements: string
}

interface UnclaimedLeadData {
  leadId: string
  companyName: string
  participants: number
  preferredDate: string
  location: string
  duration: string
}

interface FacilityData {
  id: string
  name: string
  email: string
}

/**
 * Generate HTML email template for claimed vendor lead notification (full details)
 */
function generateVendorEmailHtml(lead: LeadData, vendor: FacilityData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead from Nursing Home MY</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background-color: #18181b; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                New Lead Alert
              </h1>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 14px;">
                A potential client is looking for nursing home services in ${lead.location}
              </p>
            </td>
          </tr>

          <!-- Lead Info -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px;">
                Hi ${vendor.name},
              </p>
              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px;">
                Great news! A new inquiry has come in that matches your service area. Here are the details:
              </p>

              <!-- Lead Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Person</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px; font-weight: 600;">${lead.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Company</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px; font-weight: 600;">${lead.companyName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">
                            <a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">
                            <a href="tel:${lead.phone}" style="color: #2563eb; text-decoration: none;">${lead.phone}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Group Size</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.participants} participants</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Date</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.preferredDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.location}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Duration</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.duration}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Budget</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.budget || 'Not specified'}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">HRDF Required</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.hrdfRequired}</p>
                        </td>
                      </tr>
                      ${lead.additionalRequirements && lead.additionalRequirements !== 'None' ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Additional Requirements</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 14px; line-height: 1.5;">${lead.additionalRequirements}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 32px 0;" align="center">
                    <a href="mailto:${lead.email}?subject=Team%20Building%20Quote%20for%20${encodeURIComponent(lead.companyName)}&body=Hi%20${encodeURIComponent(lead.name)},%0A%0AThank%20you%20for%20your%20inquiry%20about%20team%20building%20services.%20I%20would%20be%20happy%20to%20discuss%20your%20requirements.%0A%0A"
                       style="display: inline-block; padding: 16px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Reply to Client
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                <strong>Tips for a successful response:</strong>
              </p>
              <ul style="margin: 8px 0 0; padding-left: 20px; color: #71717a; font-size: 14px; line-height: 1.8;">
                <li>Respond within 24 hours for the best chance of conversion</li>
                <li>Include your portfolio or past event photos</li>
                <li>Provide a preliminary quote if possible</li>
                <li>Offer a discovery call to understand their needs better</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0 0 8px; color: #71717a; font-size: 12px;">
                Lead ID: ${lead.leadId}
              </p>
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                This lead was sent to you because your listing is claimed and active in ${lead.location}.
              </p>
              <p style="margin: 16px 0 0; color: #a1a1aa; font-size: 11px;">
                Nursing Home MY | <a href="https://nursinghomemy.com" style="color: #a1a1aa;">nursinghomemy.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Generate plain text email for claimed vendor lead notification
 */
function generateVendorEmailText(lead: LeadData, vendor: FacilityData): string {
  return `
NEW LEAD ALERT - Nursing Home MY
================================

Hi ${vendor.name},

Great news! A new inquiry has come in that matches your service area.

LEAD DETAILS
------------
Contact Person: ${lead.name}
Company: ${lead.companyName}
Email: ${lead.email}
Phone: ${lead.phone}

Group Size: ${lead.participants} participants
Preferred Date: ${lead.preferredDate}
Location: ${lead.location}
Duration: ${lead.duration}
Budget: ${lead.budget || 'Not specified'}
HRDF Required: ${lead.hrdfRequired}
${lead.additionalRequirements && lead.additionalRequirements !== 'None' ? `Additional Requirements: ${lead.additionalRequirements}` : ''}

REPLY TO CLIENT
---------------
Email: ${lead.email}
Phone: ${lead.phone}

Tips for a successful response:
- Respond within 24 hours for the best chance of conversion
- Include your portfolio or past event photos
- Provide a preliminary quote if possible
- Offer a discovery call to understand their needs better

---
Lead ID: ${lead.leadId}
This lead was sent to you because your listing is claimed and active in ${lead.location}.

Nursing Home MY | nursinghomemy.com
`
}

/**
 * Generate HTML email template for unclaimed vendor (limited details + claim CTA)
 */
function generateUnclaimedVendorEmailHtml(
  lead: UnclaimedLeadData,
  vendor: FacilityData,
  monthlyLeadCount: number
): string {
  const claimUrl = `${BASE_URL}/claim?vendor=${vendor.id}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Nursing Home Lead in ${lead.location} - Claim Your Listing</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background-color: #2563eb; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                New Lead in ${lead.location}
              </h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">
                Claim your listing to unlock full contact details
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px;">
                Hi ${vendor.name},
              </p>
              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px;">
                You received this lead because <strong>your company is listed on Nursing Home Malaysia.com</strong>.
                A potential client is looking for nursing home services in your area!
              </p>

              <!-- Lead Preview Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #18181b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Lead Preview
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Company</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px; font-weight: 600;">${lead.companyName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.location}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Group Size</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.participants} participants</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Date</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.preferredDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Duration</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px;">${lead.duration}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Locked Info -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; background-color: #fef3c7; border-radius: 6px; border: 1px solid #fcd34d;">
                      <tr>
                        <td style="padding: 12px 16px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px;">
                            🔒 <strong>Contact details hidden</strong> — Claim your listing to unlock name, email, phone, and budget
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 32px 0;" align="center">
                    <a href="${claimUrl}"
                       style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Claim Your Listing Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Benefits -->
              <p style="margin: 0 0 12px; color: #18181b; font-size: 16px; font-weight: 600;">
                Why claim your listing?
              </p>
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #3f3f46; font-size: 14px; line-height: 1.8;">
                <li><strong>FREE</strong> — No cost to claim your business listing</li>
                <li><strong>Get full lead details</strong> — Name, email, phone, budget, requirements</li>
                <li><strong>Receive more leads</strong> — Claimed facilities get priority for lead distribution</li>
                <li><strong>Update your profile</strong> — Add photos, description, and highlight your services</li>
              </ul>

              <p style="margin: 0; padding: 16px; background-color: #f0fdf4; border-radius: 6px; color: #166534; font-size: 14px; border: 1px solid #bbf7d0;">
                ⏱️ <strong>Act fast!</strong> This lead is also being sent to other facilities in ${lead.location}.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0 0 8px; color: #71717a; font-size: 12px;">
                This is 1 of ${monthlyLeadCount} lead${monthlyLeadCount !== 1 ? 's' : ''} this month in your area. Don't miss out.
              </p>
              <p style="margin: 0 0 8px; color: #71717a; font-size: 12px;">
                You received this email because your company is listed on Nursing Home Malaysia.com in ${lead.location}.
              </p>
              <p style="margin: 16px 0 0; color: #a1a1aa; font-size: 11px;">
                Nursing Home MY | <a href="https://nursinghomemy.com" style="color: #a1a1aa;">nursinghomemy.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Generate plain text email for unclaimed vendor
 */
function generateUnclaimedVendorEmailText(
  lead: UnclaimedLeadData,
  vendor: FacilityData,
  monthlyLeadCount: number
): string {
  const claimUrl = `${BASE_URL}/claim?vendor=${vendor.id}`

  return `
NEW TEAM BUILDING LEAD IN ${lead.location.toUpperCase()}
==========================================

Hi ${vendor.name},

You received this lead because your company is listed on Nursing Home Malaysia.com.
A potential client is looking for nursing home services in your area!

LEAD PREVIEW
------------
Company: ${lead.companyName}
Location: ${lead.location}
Group Size: ${lead.participants} participants
Preferred Date: ${lead.preferredDate}
Duration: ${lead.duration}

🔒 CONTACT DETAILS HIDDEN
Claim your listing to unlock name, email, phone, and budget.

CLAIM YOUR FREE LISTING
-----------------------
${claimUrl}

WHY CLAIM YOUR LISTING?
- FREE — No cost to claim your business listing
- Get full lead details — Name, email, phone, budget, requirements
- Receive more leads — Claimed facilities get priority
- Update your profile — Add photos, description, services

⏱️ ACT FAST! This lead is also being sent to other facilities in ${lead.location}.

---
This is 1 of ${monthlyLeadCount} lead${monthlyLeadCount !== 1 ? 's' : ''} this month in your area. Don't miss out.

Nursing Home MY | nursinghomemy.com
`
}

/**
 * Send lead notification email to a claimed vendor
 */
export async function sendLeadNotificationEmail(
  lead: LeadData,
  vendor: FacilityData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[sendLeadNotificationEmail] Attempting to send email to ${vendor.name} (${vendor.email})`)
  console.log(`[sendLeadNotificationEmail] RESEND_API_KEY exists: ${!!process.env.RESEND_API_KEY}`)
  console.log(`[sendLeadNotificationEmail] FROM_EMAIL: ${FROM_EMAIL}`)

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[sendLeadNotificationEmail] RESEND_API_KEY is not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()
    console.log(`[sendLeadNotificationEmail] Resend client initialized, sending email...`)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: vendor.email,
      subject: `New Lead: ${lead.companyName} looking for nursing home in ${lead.location}`,
      html: generateVendorEmailHtml(lead, vendor),
      text: generateVendorEmailText(lead, vendor),
      tags: [
        { name: 'type', value: 'lead_notification' },
        { name: 'lead_id', value: lead.leadId },
        { name: 'facility_id', value: vendor.id },
        { name: 'location', value: lead.location },
        { name: 'vendor_claimed', value: 'true' },
      ],
    })

    if (error) {
      console.error('[sendLeadNotificationEmail] Resend API error:', JSON.stringify(error))
      return { success: false, error: error.message }
    }

    console.log(`[sendLeadNotificationEmail] Email sent successfully! Message ID: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('[sendLeadNotificationEmail] Exception caught:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send lead notification email to an unclaimed vendor (limited details)
 */
export async function sendUnclaimedVendorNotificationEmail(
  lead: UnclaimedLeadData,
  vendor: FacilityData,
  monthlyLeadCount: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[sendUnclaimedVendorNotificationEmail] Attempting to send email to ${vendor.name} (${vendor.email})`)

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[sendUnclaimedVendorNotificationEmail] RESEND_API_KEY is not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: vendor.email,
      subject: `New Nursing Home Lead in ${lead.location} - Claim Your Listing`,
      html: generateUnclaimedVendorEmailHtml(lead, vendor, monthlyLeadCount),
      text: generateUnclaimedVendorEmailText(lead, vendor, monthlyLeadCount),
      tags: [
        { name: 'type', value: 'lead_notification_unclaimed' },
        { name: 'lead_id', value: lead.leadId },
        { name: 'facility_id', value: vendor.id },
        { name: 'location', value: lead.location },
        { name: 'vendor_claimed', value: 'false' },
      ],
    })

    if (error) {
      console.error('[sendUnclaimedVendorNotificationEmail] Resend API error:', JSON.stringify(error))
      return { success: false, error: error.message }
    }

    console.log(`[sendUnclaimedVendorNotificationEmail] Email sent successfully! Message ID: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('[sendUnclaimedVendorNotificationEmail] Exception caught:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send batch lead notifications to multiple claimed facilities
 */
export async function sendLeadNotificationsToFacilities(
  lead: LeadData,
  facilities: FacilityData[]
): Promise<{ vendor: FacilityData; result: { success: boolean; messageId?: string; error?: string } }[]> {
  const results = await Promise.all(
    facilities.map(async (vendor) => {
      const result = await sendLeadNotificationEmail(lead, vendor)
      return { vendor, result }
    })
  )

  return results
}

/**
 * Send batch lead notifications to multiple unclaimed facilities
 */
export async function sendUnclaimedVendorNotifications(
  lead: UnclaimedLeadData,
  facilities: FacilityData[],
  monthlyLeadCount: number
): Promise<{ vendor: FacilityData; result: { success: boolean; messageId?: string; error?: string } }[]> {
  const results = await Promise.all(
    facilities.map(async (vendor) => {
      const result = await sendUnclaimedVendorNotificationEmail(lead, vendor, monthlyLeadCount)
      return { vendor, result }
    })
  )

  return results
}
