import { NextRequest, NextResponse } from 'next/server'
import { processAndDistributeLead } from '@/lib/lead-distribution'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)

  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 }) // 1 hour
    return true
  }

  if (limit.count >= 3) {
    return false // Exceeded limit
  }

  limit.count++
  return true
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    console.log('📥 Received quote request data:', JSON.stringify(body, null, 2))

    // Check honeypot
    if (body.honeypot) {
      // Silent rejection for bots
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Validate required fields
    if (!body.name || body.name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name' },
        { status: 400 }
      )
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!validatePhone(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Malaysian phone number' },
        { status: 400 }
      )
    }

    if (!body.patientAge || body.patientAge < 1 || body.patientAge > 120) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid patient age' },
        { status: 400 }
      )
    }

    if (!body.relationship) {
      return NextResponse.json(
        { success: false, error: 'Please select your relationship to patient' },
        { status: 400 }
      )
    }

    if (!body.careLevel) {
      return NextResponse.json(
        { success: false, error: 'Please select care level needed' },
        { status: 400 }
      )
    }

    if (!body.stayType) {
      return NextResponse.json(
        { success: false, error: 'Please select type of stay' },
        { status: 400 }
      )
    }

    if (!body.mobilityLevel) {
      return NextResponse.json(
        { success: false, error: 'Please select mobility level' },
        { status: 400 }
      )
    }

    if (!body.location) {
      return NextResponse.json(
        { success: false, error: 'Please select a location' },
        { status: 400 }
      )
    }

    if (!body.timeline) {
      return NextResponse.json(
        { success: false, error: 'Please select a timeline' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      phone: sanitizeInput(body.phone),
      patientAge: parseInt(body.patientAge),
      relationship: sanitizeInput(body.relationship),
      careLevel: sanitizeInput(body.careLevel),
      stayType: sanitizeInput(body.stayType),
      mobilityLevel: sanitizeInput(body.mobilityLevel),
      specialRequirements: Array.isArray(body.specialRequirements)
        ? body.specialRequirements.map((req: string) => sanitizeInput(req))
        : [],
      location: sanitizeInput(body.location),
      budget: body.budget ? sanitizeInput(body.budget) : 'Not specified',
      timeline: sanitizeInput(body.timeline),
      additionalRequirements: body.additionalRequirements ? sanitizeInput(body.additionalRequirements) : 'None',
      source: sanitizeInput(body.source || 'unknown'),
    }

    // Generate Lead ID
    const leadId = `NH${Date.now()}`

    // Format special requirements for display
    const specialReqsDisplay = sanitizedData.specialRequirements.length > 0
      ? sanitizedData.specialRequirements.join(', ')
      : 'None'

    // Prepare data for Make.com webhook - standardized field names
    const webhookData = {
      leadId: leadId,
      timestamp: new Date().toISOString(),
      fullName: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      patientAge: sanitizedData.patientAge.toString(),
      relationship: sanitizedData.relationship,
      careLevel: sanitizedData.careLevel,
      stayType: sanitizedData.stayType,
      mobilityLevel: sanitizedData.mobilityLevel,
      specialRequirements: specialReqsDisplay,
      location: sanitizedData.location,
      budget: sanitizedData.budget,
      timeline: sanitizedData.timeline,
      additionalRequirements: sanitizedData.additionalRequirements,
      source: sanitizedData.source,
      status: 'NEW',
      contactedDate: '',
      facilitiesSentTo: '',
      converted: '',
      revenue: '',
      notes: '',
    }

    console.log('📤 Processing lead:', JSON.stringify(webhookData, null, 2))

    // Process lead: save to database and distribute to matching nursing homes
    const distributionResult = await processAndDistributeLead({
      leadId: leadId,
      name: sanitizedData.name,
      companyName: 'N/A', // Not applicable for nursing home leads
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      participants: sanitizedData.patientAge, // Reuse participants field for age
      preferredDate: sanitizedData.timeline,
      flexibleDates: true, // Not applicable for nursing homes
      location: sanitizedData.location,
      duration: sanitizedData.stayType,
      budget: sanitizedData.budget,
      hrdfRequired: 'N/A', // Not applicable for nursing homes
      additionalRequirements: `Care Level: ${sanitizedData.careLevel}, Mobility: ${sanitizedData.mobilityLevel}, Relationship: ${sanitizedData.relationship}, Special Requirements: ${specialReqsDisplay}, Additional: ${sanitizedData.additionalRequirements}`,
      source: sanitizedData.source,
    })

    const totalFacilitiesNotified = distributionResult.claimedFacilitiesNotified + distributionResult.unclaimedFacilitiesNotified
    console.log(`✅ Lead processed. Nursing homes notified: ${totalFacilitiesNotified} (${distributionResult.claimedFacilitiesNotified} claimed, ${distributionResult.unclaimedFacilitiesNotified} unclaimed)`)
    if (distributionResult.vendorNames.length > 0) {
      console.log(`   Notified: ${distributionResult.vendorNames.join(', ')}`)
    }
    if (distributionResult.errors.length > 0) {
      console.warn(`   Errors: ${distributionResult.errors.join('; ')}`)
    }

    // Also send to Make.com webhook if configured (for backwards compatibility)
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.MAKE_QUOTE_WEBHOOK_URL

    console.log('Make.com webhook URL configured:', !!webhookUrl)

    if (webhookUrl) {
      try {
        console.log('Sending to Make.com webhook...')
        // Add vendor notification info to webhook data
        const webhookDataWithFacilities = {
          ...webhookData,
          facilitiesSentTo: distributionResult.vendorNames.join(', ') || 'None (no facilities in area)',
          facilitiesNotifiedCount: totalFacilitiesNotified.toString(),
          claimedFacilitiesNotified: distributionResult.claimedFacilitiesNotified.toString(),
          unclaimedFacilitiesNotified: distributionResult.unclaimedFacilitiesNotified.toString(),
        }

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(webhookDataWithFacilities),
        })

        if (!webhookResponse.ok) {
          console.error('❌ Webhook failed:', webhookResponse.status)
        } else {
          console.log('✅ Webhook success')
        }
      } catch (webhookError) {
        // Don't fail the request if webhook fails
        console.error('Webhook error (non-fatal):', webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      leadId,
      facilitiesNotified: totalFacilitiesNotified,
      claimedFacilitiesNotified: distributionResult.claimedFacilitiesNotified,
      unclaimedFacilitiesNotified: distributionResult.unclaimedFacilitiesNotified,
    })
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request. Please try again or email us at hello@nursinghomemy.com',
      },
      { status: 500 }
    )
  }
}
