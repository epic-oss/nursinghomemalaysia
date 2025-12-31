import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  // Get user metadata including full name and company
  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || '',
    companyName: user.user_metadata?.company_name || '',
    createdAt: user.created_at,
  }
}
