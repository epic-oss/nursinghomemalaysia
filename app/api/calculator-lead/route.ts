import { NextRequest, NextResponse } from 'next/server'
import { processAndDistributeLead } from '@/lib/lead-distribution'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('📥 Received calculator lead data:', JSON.stringify(body, null, 2))

    const {
      name,
      email,
      phone,
      company,
      preferred_date,
      requirements,
      participants,
      duration,
      activity_type,
      location,
      estimated_budget_min,
      estimated_budget_max,
      source,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !company) {
      console.error('❌ Missing required fields:', { name, email, phone, company })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email:', email)
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate lead ID
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    const leadId = `CALC${timestamp}${random}`

    // Prepare data for Make.com webhook
    const webhookData = {
      leadId,
      timestamp: new Date().toISOString(),
      fullName: name,
      email,
      phone,
      companyName: company,
      preferredDate: preferred_date || '',
      additionalRequirements: requirements || '',
      participants: String(participants || ''),
      duration: duration || '',
      activityType: activity_type || '',
      location: location || '',
      estimatedBudgetMin: String(estimated_budget_min || ''),
      estimatedBudgetMax: String(estimated_budget_max || ''),
      estimatedBudget: estimated_budget_min && estimated_budget_max
        ? `RM${estimated_budget_min.toLocaleString()} - RM${estimated_budget_max.toLocaleString()}`
        : '',
      source: source || 'calculator',
    }

    console.log('📤 Processing lead:', JSON.stringify(webhookData, null, 2))

    // Format duration for display (if needed)
    const durationMap: Record<string, string> = {
      'half-day': 'Half Day (4-5 hours)',
      'full-day': 'Full Day (8 hours)',
      '2d1n': '2D1N (Overnight)',
      '3d2n': '3D2N (2 nights)',
      'not-sure': 'Not Sure',
    }
    const durationLabel = durationMap[duration] || duration || 'Not specified'

    // Process lead: save to database and distribute to matching facilities
    const distributionResult = await processAndDistributeLead({
      leadId: leadId,
      name: name,
      companyName: company,
      email: email,
      phone: phone,
      participants: parseInt(participants) || 0,
      preferredDate: preferred_date || 'Not specified',
      flexibleDates: false,
      location: location || 'Not specified',
      duration: durationLabel,
      budget: estimated_budget_min && estimated_budget_max
        ? `RM${estimated_budget_min.toLocaleString()} - RM${estimated_budget_max.toLocaleString()}`
        : 'Not specified',
      hrdfRequired: 'Not specified',
      additionalRequirements: requirements || 'None',
      source: source || 'calculator',
    })

    const totalFacilitiesNotified = distributionResult.claimedFacilitiesNotified + distributionResult.unclaimedFacilitiesNotified
    console.log(`✅ Lead processed. Facilities notified: ${totalFacilitiesNotified} (${distributionResult.claimedFacilitiesNotified} claimed, ${distributionResult.unclaimedFacilitiesNotified} unclaimed)`)
    if (distributionResult.vendorNames.length > 0) {
      console.log(`   Notified: ${distributionResult.vendorNames.join(', ')}`)
    }
    if (distributionResult.errors.length > 0) {
      console.warn(`   Errors: ${distributionResult.errors.join('; ')}`)
    }

    // Also send to Make.com webhook if configured (for backwards compatibility)
    try {
      const webhookUrl = process.env.MAKE_WEBHOOK_URL

      if (!webhookUrl) {
        console.error('❌ MAKE_WEBHOOK_URL environment variable is not set')
        throw new Error('Webhook URL not configured')
      }

      console.log('Attempting to send to Make.com...')

      // Add vendor notification info to webhook data
      const webhookDataWithFacilities = {
        ...webhookData,
        facilitiesSentTo: distributionResult.vendorNames.join(', ') || 'None (no facilities in area)',
        facilitiesNotifiedCount: totalFacilitiesNotified.toString(),
        claimedFacilitiesNotified: distributionResult.claimedFacilitiesNotified.toString(),
        unclaimedFacilitiesNotified: distributionResult.unclaimedFacilitiesNotified.toString(),
      }

      const webhookResponse = await fetch(
        webhookUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(webhookDataWithFacilities),
        }
      )

      console.log('Make.com response:', webhookResponse.status)
      console.log('✅ Webhook response status:', webhookResponse.status)

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text()
        console.error('❌ Webhook failed with status:', webhookResponse.status)
        console.error('❌ Webhook error response:', errorText)
      } else {
        const responseText = await webhookResponse.text()
        console.log('✅ Webhook success response:', responseText)
      }
    } catch (webhookError) {
      console.error('❌ Error sending to webhook:', webhookError)
      // Don't fail the request if webhook fails
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      leadId,
      facilitiesNotified: totalFacilitiesNotified,
      claimedFacilitiesNotified: distributionResult.claimedFacilitiesNotified,
      unclaimedFacilitiesNotified: distributionResult.unclaimedFacilitiesNotified,
    })
  } catch (error) {
    console.error('Error processing calculator lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
