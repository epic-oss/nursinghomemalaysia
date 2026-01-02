import { createClient } from '@/lib/supabase/server'

// Admin email whitelist
const ADMIN_EMAILS = [
  'jayooi5115@gmail.com',
  'hello@nursinghomemy.com',
]

// Admin user ID whitelist
const ADMIN_USER_IDS = [
  '1c96a858-04b9-4a1b-b8b8-31674135a01f',
]

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Check by user ID first
  if (ADMIN_USER_IDS.includes(user.id)) {
    return true
  }

  // Fall back to email check
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true
  }

  return false
}

export async function requireAdmin() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required')
  }

  return adminStatus
}
