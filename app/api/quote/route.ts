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

    if (!body.company || body.company.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your company name' },
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

    if (!body.participants || body.participants < 10 || body.participants > 500) {
      return NextResponse.json(
        { success: false, error: 'Participants must be between 10 and 500' },
        { status: 400 }
      )
    }

    // Date is only required if not flexible
    if (!body.flexibleDates && !body.date) {
      return NextResponse.json(
        { success: false, error: 'Please select a date or check flexible dates' },
        { status: 400 }
      )
    }

    if (!body.location) {
      return NextResponse.json(
        { success: false, error: 'Please select a location' },
        { status: 400 }
      )
    }

    if (!body.duration) {
      return NextResponse.json(
        { success: false, error: 'Please select a duration' },
        { status: 400 }
      )
    }

    if (!body.hrdf) {
      return NextResponse.json(
        { success: false, error: 'Please select HRDF option' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      company: sanitizeInput(body.company),
      email: sanitizeInput(body.email),
      phone: sanitizeInput(body.phone),
      participants: parseInt(body.participants),
      date: body.date,
      flexibleDates: !!body.flexibleDates,
      location: sanitizeInput(body.location),
      duration: sanitizeInput(body.duration),
      budget: body.budget ? sanitizeInput(body.budget) : 'Not specified',
      hrdf: sanitizeInput(body.hrdf),
      additionalRequirements: body.additionalRequirements ? sanitizeInput(body.additionalRequirements) : 'None',
      source: sanitizeInput(body.source || 'unknown'),
    }

    // Generate Lead ID
    const leadId = `TB${Date.now()}`

    // Format date for display
    const formattedDate = sanitizedData.flexibleDates
      ? 'Flexible'
      : sanitizedData.date
      ? new Date(sanitizedData.date).toLocaleDateString('en-MY', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Not specified'

    // Format duration for display
    const durationMap: Record<string, string> = {
      'half-day': 'Half Day (4-5 hours)',
      'full-day': 'Full Day (8 hours)',
      '2d1n': '2D1N (Overnight)',
      '3d2n': '3D2N (2 nights)',
      'not-sure': 'Not Sure',
    }

    const durationLabel = durationMap[sanitizedData.duration] || sanitizedData.duration

    // Format HRDF for display
    const hrdfMap: Record<string, string> = {
      yes: 'Yes',
      no: 'No',
      'not-sure': 'Not sure / Need advice',
    }

    const hrdfLabel = hrdfMap[sanitizedData.hrdf] || sanitizedData.hrdf

    // Prepare data for Make.com webhook - standardized field names
    const webhookData = {
      leadId: leadId,
      timestamp: new Date().toISOString(),
      fullName: sanitizedData.name,
      companyName: sanitizedData.company,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      participants: sanitizedData.participants.toString(),
      preferredDate: formattedDate,
      flexibleDates: sanitizedData.flexibleDates ? 'Yes' : 'No',
      location: sanitizedData.location,
      duration: durationLabel,
      budget: sanitizedData.budget,
      hrdfRequired: hrdfLabel,
      additionalRequirements: sanitizedData.additionalRequirements,
      source: sanitizedData.source,
      status: 'NEW',
      contactedDate: '',
      vendorsSentTo: '',
      converted: '',
      revenue: '',
      notes: '',
    }

    console.log('📤 Processing lead:', JSON.stringify(webhookData, null, 2))

    // Process lead: save to database and distribute to matching vendors
    const distributionResult = await processAndDistributeLead({
      leadId: leadId,
      name: sanitizedData.name,
      companyName: sanitizedData.company,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      participants: sanitizedData.participants,
      preferredDate: formattedDate,
      flexibleDates: sanitizedData.flexibleDates,
      location: sanitizedData.location,
      duration: durationLabel,
      budget: sanitizedData.budget,
      hrdfRequired: hrdfLabel,
      additionalRequirements: sanitizedData.additionalRequirements,
      source: sanitizedData.source,
    })

    const totalVendorsNotified = distributionResult.claimedVendorsNotified + distributionResult.unclaimedVendorsNotified
    console.log(`✅ Lead processed. Vendors notified: ${totalVendorsNotified} (${distributionResult.claimedVendorsNotified} claimed, ${distributionResult.unclaimedVendorsNotified} unclaimed)`)
    if (distributionResult.vendorNames.length > 0) {
      console.log(`   Notified: ${distributionResult.vendorNames.join(', ')}`)
    }
    if (distributionResult.errors.length > 0) {
      console.warn(`   Errors: ${distributionResult.errors.join('; ')}`)
    }

    // Also send to Make.com webhook if configured (for backwards compatibility)
    const webhookUrl = process.env.MAKE_QUOTE_WEBHOOK_URL

    if (webhookUrl) {
      try {
        console.log('Sending to Make.com webhook...')
        // Add vendor notification info to webhook data
        const webhookDataWithVendors = {
          ...webhookData,
          vendorsSentTo: distributionResult.vendorNames.join(', ') || 'None (no vendors in area)',
          vendorsNotifiedCount: totalVendorsNotified.toString(),
          claimedVendorsNotified: distributionResult.claimedVendorsNotified.toString(),
          unclaimedVendorsNotified: distributionResult.unclaimedVendorsNotified.toString(),
        }

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(webhookDataWithVendors),
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
      vendorsNotified: totalVendorsNotified,
      claimedVendorsNotified: distributionResult.claimedVendorsNotified,
      unclaimedVendorsNotified: distributionResult.unclaimedVendorsNotified,
    })
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request. Please try again or email us at hello@teambuildingmy.com',
      },
      { status: 500 }
    )
  }
}
