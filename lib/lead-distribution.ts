import { createAdminClient } from '@/lib/supabase/server'
import {
  sendLeadNotificationsToFacilities,
  sendUnclaimedVendorNotifications,
} from '@/lib/email'

interface LeadData {
  leadId: string
  name: string
  companyName: string
  email: string
  phone: string
  participants: number
  preferredDate: string
  flexibleDates: boolean
  location: string
  duration: string
  budget: string
  hrdfRequired: string
  additionalRequirements: string
  source: string
}

interface MatchedVendor {
  id: string
  name: string
  email: string
  state: string
  activities: string | null
}

interface UnclaimedVendor {
  id: string
  name: string
  email: string
  state: string
}

// Map quote form locations to database state values
const LOCATION_MAPPING: Record<string, string[]> = {
  'Kuala Lumpur': ['Kuala Lumpur', 'KL', 'Selangor'],
  'Selangor': ['Selangor', 'Kuala Lumpur', 'KL'],
  'Penang': ['Penang', 'Pulau Pinang'],
  'Johor': ['Johor', 'Johor Bahru'],
  'Perak': ['Perak'],
  'Melaka': ['Melaka', 'Malacca'],
  'Negeri Sembilan': ['Negeri Sembilan'],
  'Pahang': ['Pahang'],
  'Terengganu': ['Terengganu'],
  'Kelantan': ['Kelantan'],
  'Kedah': ['Kedah'],
  'Perlis': ['Perlis'],
  'Sabah': ['Sabah'],
  'Sarawak': ['Sarawak'],
  'Labuan': ['Labuan'],
  'Putrajaya': ['Putrajaya', 'Selangor', 'Kuala Lumpur'],
}

/**
 * Find claimed facilities that match the lead's location
 */
async function findClaimedFacilities(location: string): Promise<MatchedVendor[]> {
  console.log(`[findClaimedFacilities] Starting search for location: "${location}"`)

  const supabase = createAdminClient()

  // Get possible state matches
  const stateMatches = LOCATION_MAPPING[location] || [location]
  console.log(`[findClaimedFacilities] State matches to search: ${JSON.stringify(stateMatches)}`)

  // Query claimed facilities in matching states
  const { data: facilities, error } = await supabase
    .from('nursing_homes')
    .select('id, name, contact_email, state, activities, user_id')
    .not('user_id', 'is', null) // Only claimed facilities
    .in('state', stateMatches)

  if (error) {
    console.error('[findClaimedFacilities] Database error:', error)
    return []
  }

  console.log(`[findClaimedFacilities] Raw query returned ${facilities?.length || 0} facilities`)
  if (facilities && facilities.length > 0) {
    facilities.forEach((v, i) => {
      console.log(`[findClaimedFacilities] Vendor ${i + 1}: ${v.name} | State: ${v.state} | Email: ${v.contact_email || 'NULL'} | user_id: ${v.user_id}`)
    })
  }

  // Filter out facilities without valid emails
  const validFacilities = (facilities || []).filter(
    (v) => v.contact_email && v.contact_email.includes('@')
  )

  console.log(`[findClaimedFacilities] After email filter: ${validFacilities.length} facilities with valid emails`)

  return validFacilities.map((v) => ({
    id: v.id,
    name: v.name,
    email: v.contact_email,
    state: v.state,
    activities: v.services,
  }))
}

/**
 * Find unclaimed facilities for rotation (max 3, respecting 7-day cooldown)
 */
async function findUnclaimedFacilitiesForRotation(
  location: string,
  limit: number = 3
): Promise<UnclaimedVendor[]> {
  console.log(`[findUnclaimedFacilitiesForRotation] Starting search for location: "${location}", limit: ${limit}`)

  const supabase = createAdminClient()

  // Get possible state matches
  const stateMatches = LOCATION_MAPPING[location] || [location]
  console.log(`[findUnclaimedFacilitiesForRotation] State matches: ${JSON.stringify(stateMatches)}`)

  // Use the database function for fair rotation
  const { data: facilities, error } = await supabase.rpc('get_unclaimed_facilities_for_rotation', {
    p_states: stateMatches,
    p_limit: limit,
    p_cooldown_days: 7,
  })

  if (error) {
    console.error('[findUnclaimedFacilitiesForRotation] Database error:', error)
    // Fallback to direct query if function doesn't exist yet
    return findUnclaimedFacilitiesFallback(stateMatches, limit)
  }

  console.log(`[findUnclaimedFacilitiesForRotation] Found ${facilities?.length || 0} unclaimed facilities`)

  return (facilities || []).map((v: { id: string; name: string; contact_email: string; state: string }) => ({
    id: v.id,
    name: v.name,
    email: v.contact_email,
    state: v.state,
  }))
}

/**
 * Fallback query if database function doesn't exist
 */
async function findUnclaimedFacilitiesFallback(
  stateMatches: string[],
  limit: number
): Promise<UnclaimedVendor[]> {
  console.log('[findUnclaimedFacilitiesFallback] Using fallback query')

  const supabase = createAdminClient()

  // Calculate 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: facilities, error } = await supabase
    .from('nursing_homes')
    .select('id, name, contact_email, state, last_lead_sent_at, unclaimed_leads_sent')
    .is('user_id', null) // Only unclaimed facilities
    .in('state', stateMatches)
    .not('contact_email', 'is', null)
    .or(`last_lead_sent_at.is.null,last_lead_sent_at.lt.${sevenDaysAgo.toISOString()}`)
    .order('last_lead_sent_at', { ascending: true, nullsFirst: true })
    .order('unclaimed_leads_sent', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('[findUnclaimedFacilitiesFallback] Database error:', error)
    return []
  }

  // Filter for valid emails
  const validFacilities = (facilities || []).filter(
    (v) => v.contact_email && v.contact_email.includes('@')
  )

  console.log(`[findUnclaimedFacilitiesFallback] Found ${validFacilities.length} facilities`)

  return validFacilities.map((v) => ({
    id: v.id,
    name: v.name,
    email: v.contact_email,
    state: v.state,
  }))
}

/**
 * Update vendor tracking after sending lead notification
 */
async function updateVendorLeadTracking(facilityId: string): Promise<void> {
  const supabase = createAdminClient()

  // Try using the database function first
  const { error: rpcError } = await supabase.rpc('update_vendor_lead_tracking', {
    p_facility_id: facilityId,
  })

  if (rpcError) {
    // Fallback to direct update
    const { error } = await supabase
      .from('nursing_homes')
      .update({
        last_lead_sent_at: new Date().toISOString(),
        unclaimed_leads_sent: supabase.rpc('increment_unclaimed_leads', { row_id: facilityId }),
      })
      .eq('id', facilityId)
      .is('user_id', null)

    if (error) {
      // Simple fallback without increment
      await supabase
        .from('nursing_homes')
        .update({ last_lead_sent_at: new Date().toISOString() })
        .eq('id', facilityId)
        .is('user_id', null)
    }
  }
}

/**
 * Save lead to database
 */
async function saveLead(lead: LeadData): Promise<string | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('leads')
    .insert({
      lead_id: lead.leadId,
      name: lead.name,
      company_name: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      participants: lead.participants,
      preferred_date: lead.preferredDate,
      flexible_dates: lead.flexibleDates,
      location: lead.location,
      duration: lead.duration,
      budget: lead.budget,
      hrdf_required: lead.hrdfRequired,
      additional_requirements: lead.additionalRequirements,
      source: lead.source,
      status: 'new',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error saving lead:', error)
    return null
  }

  return data?.id || null
}

interface VendorForLogging {
  id: string
  name: string
  email: string
}

/**
 * Log which facilities received the lead notification
 */
async function logLeadNotifications(
  leadDbId: string,
  notifications: { vendor: VendorForLogging; result: { success: boolean; messageId?: string; error?: string }; isClaimed: boolean }[]
): Promise<void> {
  const supabase = createAdminClient()

  const records = notifications.map((n) => ({
    lead_id: leadDbId,
    nursing_home_id: n.vendor.id,
    email_sent_to: n.vendor.email,
    email_status: n.result.success ? 'sent' : 'failed',
    resend_message_id: n.result.messageId || null,
    is_claimed_vendor: n.isClaimed,
  }))

  const { error } = await supabase.from('lead_notifications').insert(records)

  if (error) {
    console.error('Error logging lead notifications:', error)
  }
}

/**
 * Get count of leads in this location this month (for email footer)
 */
async function getMonthlyLeadCount(location: string): Promise<number> {
  const supabase = createAdminClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const stateMatches = LOCATION_MAPPING[location] || [location]

  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .in('location', stateMatches)
    .gte('created_at', startOfMonth.toISOString())

  if (error) {
    console.error('Error getting monthly lead count:', error)
    return 0
  }

  return count || 0
}

/**
 * Main function: Process a new lead and distribute to matching facilities
 */
export async function processAndDistributeLead(lead: LeadData): Promise<{
  success: boolean
  leadId: string | null
  claimedFacilitiesNotified: number
  unclaimedFacilitiesNotified: number
  vendorNames: string[]
  errors: string[]
}> {
  console.log(`[processAndDistributeLead] ========== STARTING LEAD DISTRIBUTION ==========`)
  console.log(`[processAndDistributeLead] Lead ID: ${lead.leadId}`)
  console.log(`[processAndDistributeLead] Location: ${lead.location}`)
  console.log(`[processAndDistributeLead] Company: ${lead.companyName}`)
  console.log(`[processAndDistributeLead] RESEND_API_KEY configured: ${!!process.env.RESEND_API_KEY}`)

  const errors: string[] = []
  const vendorNames: string[] = []
  let claimedFacilitiesNotified = 0
  let unclaimedFacilitiesNotified = 0

  // 1. Save lead to database
  console.log(`[Lead ${lead.leadId}] Saving to database...`)
  const leadDbId = await saveLead(lead)

  if (!leadDbId) {
    errors.push('Failed to save lead to database')
    // Continue anyway - we still want to notify facilities
  }

  // 2. Find claimed facilities (existing flow)
  console.log(`[Lead ${lead.leadId}] Finding claimed facilities in ${lead.location}...`)
  const claimedFacilities = await findClaimedFacilities(lead.location)
  console.log(`[Lead ${lead.leadId}] Found ${claimedFacilities.length} claimed facilities`)

  // 3. Find unclaimed facilities for rotation (new flow)
  console.log(`[Lead ${lead.leadId}] Finding unclaimed facilities for rotation...`)
  const unclaimedFacilities = await findUnclaimedFacilitiesForRotation(lead.location, 3)
  console.log(`[Lead ${lead.leadId}] Found ${unclaimedFacilities.length} unclaimed facilities for rotation`)

  // 4. Get monthly lead count for email footer
  const monthlyLeadCount = await getMonthlyLeadCount(lead.location)
  console.log(`[Lead ${lead.leadId}] Monthly leads in ${lead.location}: ${monthlyLeadCount}`)

  const allNotificationResults: { vendor: VendorForLogging; result: { success: boolean; messageId?: string; error?: string }; isClaimed: boolean }[] = []

  // 5. Send notifications to claimed facilities (full lead details)
  if (claimedFacilities.length > 0) {
    console.log(`[Lead ${lead.leadId}] Sending notifications to ${claimedFacilities.length} claimed facilities...`)

    const claimedResults = await sendLeadNotificationsToFacilities(
      {
        leadId: lead.leadId,
        name: lead.name,
        companyName: lead.companyName,
        email: lead.email,
        phone: lead.phone,
        participants: lead.participants,
        preferredDate: lead.preferredDate,
        location: lead.location,
        duration: lead.duration,
        budget: lead.budget,
        hrdfRequired: lead.hrdfRequired,
        additionalRequirements: lead.additionalRequirements,
      },
      claimedFacilities.map((v) => ({ id: v.id, name: v.name, email: v.email }))
    )

    claimedResults.forEach((r) => {
      allNotificationResults.push({ ...r, isClaimed: true })
      if (r.result.success) {
        vendorNames.push(r.vendor.name)
        claimedFacilitiesNotified++
        console.log(`[Lead ${lead.leadId}] Notified claimed vendor: ${r.vendor.name} (${r.vendor.email})`)
      } else {
        errors.push(`Failed to notify claimed vendor ${r.vendor.name}: ${r.result.error}`)
      }
    })
  }

  // 6. Send notifications to unclaimed facilities (limited details + claim CTA)
  if (unclaimedFacilities.length > 0) {
    console.log(`[Lead ${lead.leadId}] Sending notifications to ${unclaimedFacilities.length} unclaimed facilities...`)

    const unclaimedResults = await sendUnclaimedVendorNotifications(
      {
        leadId: lead.leadId,
        companyName: lead.companyName,
        participants: lead.participants,
        preferredDate: lead.preferredDate,
        location: lead.location,
        duration: lead.duration,
      },
      unclaimedFacilities.map((v) => ({ id: v.id, name: v.name, email: v.email })),
      monthlyLeadCount
    )

    for (const r of unclaimedResults) {
      allNotificationResults.push({ ...r, isClaimed: false })
      if (r.result.success) {
        vendorNames.push(`${r.vendor.name} (unclaimed)`)
        unclaimedFacilitiesNotified++
        // Update vendor tracking for rotation
        await updateVendorLeadTracking(r.vendor.id)
        console.log(`[Lead ${lead.leadId}] Notified unclaimed vendor: ${r.vendor.name} (${r.vendor.email})`)
      } else {
        errors.push(`Failed to notify unclaimed vendor ${r.vendor.name}: ${r.result.error}`)
      }
    }
  }

  // 7. Log all notifications to database
  if (leadDbId && allNotificationResults.length > 0) {
    await logLeadNotifications(leadDbId, allNotificationResults)
  }

  const totalNotified = claimedFacilitiesNotified + unclaimedFacilitiesNotified
  console.log(`[Lead ${lead.leadId}] Distribution complete. ${totalNotified} facilities notified (${claimedFacilitiesNotified} claimed, ${unclaimedFacilitiesNotified} unclaimed).`)

  return {
    success: true,
    leadId: leadDbId,
    claimedFacilitiesNotified,
    unclaimedFacilitiesNotified,
    vendorNames,
    errors,
  }
}
