'use server'

import { createClient } from '@/lib/supabase/server'
import { Inquiry } from '@/lib/types'

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/3wypv1bft6s6b67yeoeno98328a7e1m5'

async function sendWebhook(payload: Record<string, unknown>) {
  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    // Log but don't fail the main operation if webhook fails
    console.error('Webhook error:', error)
  }
}

export async function submitInquiry(inquiry: Inquiry) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from('inquiries').insert({
      listing_type: inquiry.listing_type,
      listing_id: inquiry.listing_id,
      listing_name: inquiry.listing_name,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || null,
      company_name: inquiry.company_name || null,
      message: inquiry.message,
      preferred_date: inquiry.preferred_date || null,
      group_size: inquiry.group_size || null,
      status: 'new',
    }).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to submit inquiry' }
    }

    // Send webhook to Make.com
    await sendWebhook({
      source: 'NursingHomeMY_lead',
      timestamp: data?.created_at || new Date().toISOString(),
      facility_name: inquiry.listing_name,
      contact_name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || '',
      message: inquiry.message,
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function submitVendorApplication(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract activities from form data
    const activities = formData.getAll('services') as string[]

    if (activities.length === 0) {
      return { success: false, error: 'Please select at least one activity type' }
    }

    const submission = {
      company_name: formData.get('companyName') as string,
      registration_number: formData.get('registrationNumber') as string || null,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string || null,
      address: formData.get('address') as string,
      state: formData.get('state') as string,
      city: formData.get('city') as string,
      company_type: formData.get('companyType') as string,
      description: formData.get('description') as string,
      activities_offered: activities,
      referral_source: formData.get('referralSource') as string || null,
      status: 'pending'
    }

    const { data, error } = await supabase.from('vendor_submissions').insert(submission).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to submit application. Please try again.' }
    }

    // Send webhook to Make.com
    await sendWebhook({
      source: 'NursingHomeMY_submission',
      timestamp: data?.created_at || new Date().toISOString(),
      company_name: submission.company_name,
      email: submission.email,
      phone: submission.phone,
      state: submission.state,
      referral_source: submission.referral_source || '',
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting vendor application:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
