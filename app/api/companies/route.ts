import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get('state')
  const offset = parseInt(searchParams.get('offset') || '0')
  const limit = parseInt(searchParams.get('limit') || '12')

  if (!state) {
    return NextResponse.json({ error: 'State parameter is required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error} = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('state', state)
    .order('is_premium', { ascending: false })
    .order('is_featured', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
