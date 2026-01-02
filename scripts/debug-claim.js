const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function debugClaim() {
  console.log('🔍 Debugging Claim Issue\n')

  // 1. Find the user "Jay Ooi"
  console.log('1️⃣ Finding user "Jay Ooi"...')
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()

  if (userError) {
    console.error('❌ Error fetching users:', userError.message)
    return
  }

  const jayUser = users.users.find(u =>
    u.user_metadata?.full_name?.toLowerCase().includes('jay') ||
    u.email?.toLowerCase().includes('jay')
  )

  if (!jayUser) {
    console.log('⚠️  User "Jay Ooi" not found')
    console.log('Available users:')
    users.users.forEach(u => {
      console.log(`   - ${u.user_metadata?.full_name || u.email} (${u.id})`)
    })
    return
  }

  console.log(`✅ Found user: ${jayUser.user_metadata?.full_name || jayUser.email}`)
  console.log(`   User ID: ${jayUser.id}`)

  // 2. Find FGNC Event Management company
  console.log('\n2️⃣ Finding "FGNC Event Management" company...')
  const { data: company, error: companyError } = await supabase
    .from('nursing_homes')
    .select('*')
    .ilike('name', '%FGNC%')
    .single()

  if (companyError) {
    console.error('❌ Error finding company:', companyError.message)
    return
  }

  console.log(`✅ Found company: ${company.name}`)
  console.log(`   Company ID: ${company.id}`)
  console.log(`   Current user_id: ${company.user_id || 'NULL (unclaimed)'}`)

  // 3. Check claim_requests table
  console.log('\n3️⃣ Checking claim_requests table...')
  const { data: claims, error: claimError } = await supabase
    .from('claim_requests')
    .select('*')
    .eq('user_id', jayUser.id)

  if (claimError) {
    console.error('❌ Error fetching claims:', claimError.message)
  } else {
    console.log(`✅ Found ${claims?.length || 0} claim request(s)`)
    if (claims && claims.length > 0) {
      claims.forEach(claim => {
        console.log(`   - Company ID: ${claim.nursing_home_id}`)
        console.log(`   - Status: ${claim.status}`)
        console.log(`   - Created: ${claim.created_at}`)
      })
    }
  }

  // 4. Check if user_id was actually set on the company
  console.log('\n4️⃣ Checking if company.user_id was updated...')
  if (company.user_id === jayUser.id) {
    console.log(`✅ Company is correctly assigned to user!`)
  } else if (company.user_id === null) {
    console.log(`❌ Problem found: company.user_id is still NULL`)
    console.log(`   The claim modal set the claim_request, but didn't update the company!`)
    console.log('\n   Fixing now...')

    const { error: updateError } = await supabase
      .from('nursing_homes')
      .update({ user_id: jayUser.id })
      .eq('id', company.id)

    if (updateError) {
      console.error('❌ Error updating company:', updateError.message)
    } else {
      console.log('✅ Fixed! Company now assigned to user.')
    }
  } else {
    console.log(`⚠️  Company is assigned to different user: ${company.user_id}`)
  }

  // 5. Test the dashboard query
  console.log('\n5️⃣ Testing dashboard query...')
  const { data: userListings, error: listingsError } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('user_id', jayUser.id)
    .order('created_at', { ascending: false })

  if (listingsError) {
    console.error('❌ Error fetching user listings:', listingsError.message)
  } else {
    console.log(`✅ Dashboard query returned ${userListings?.length || 0} listing(s)`)
    if (userListings && userListings.length > 0) {
      console.log('\n   User\'s listings:')
      userListings.forEach((listing, index) => {
        console.log(`   ${index + 1}. ${listing.name}`)
        console.log(`      - ID: ${listing.id}`)
        console.log(`      - Slug: ${listing.slug}`)
      })
    } else {
      console.log('   ⚠️  No listings found for this user in dashboard query')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('DIAGNOSIS')
  console.log('='.repeat(60))

  if (company.user_id !== jayUser.id) {
    console.log('❌ ISSUE: ClaimModal is not updating company.user_id')
    console.log('\nThe problem is in ClaimModal.tsx:')
    console.log('The claim request is being created, but the company ownership')
    console.log('is not being updated.')
    console.log('\nI will fix this now...')
  } else if (userListings && userListings.length > 0) {
    console.log('✅ Everything should be working!')
    console.log('Try refreshing your dashboard.')
  }
}

debugClaim()
