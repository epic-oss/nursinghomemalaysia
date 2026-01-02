const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  try {
    // Check companies table
    console.log('1️⃣ Checking companies table...')
    const { data: companies, error: companiesError, count } = await supabase
      .from('nursing_homes')
      .select('*', { count: 'exact' })
      .limit(5)

    if (companiesError) {
      console.error('❌ Error querying companies:', companiesError.message)
      console.error('Details:', companiesError)
      return
    }

    console.log(`✅ Companies table exists`)
    console.log(`📊 Total companies in database: ${count || 0}`)

    if (companies && companies.length > 0) {
      console.log(`\n📋 First ${companies.length} companies:`)
      companies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.state})`)
        console.log(`      - Slug: ${company.slug || 'MISSING'}`)
        console.log(`      - Featured: ${company.featured}`)
        console.log(`      - Premium: ${company.is_premium || false}`)
      })
    } else {
      console.log('⚠️  No companies found in database!')
    }

    // Check for missing slugs
    console.log('\n2️⃣ Checking for companies without slugs...')
    const { data: noSlug, error: slugError } = await supabase
      .from('nursing_homes')
      .select('id, name, slug')
      .is('slug', null)
      .limit(10)

    if (slugError) {
      console.error('❌ Error checking slugs:', slugError.message)
    } else if (noSlug && noSlug.length > 0) {
      console.log(`⚠️  Found ${noSlug.length} companies without slugs:`)
      noSlug.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (ID: ${company.id})`)
      })
      console.log('\n💡 You need to run the slug migration!')
    } else {
      console.log('✅ All companies have slugs')
    }

    // Check table schema
    console.log('\n3️⃣ Checking if required columns exist...')
    const { data: sample, error: sampleError } = await supabase
      .from('nursing_homes')
      .select('id, name, slug, featured, is_featured, is_premium, user_id')
      .limit(1)
      .single()

    if (sampleError) {
      console.error('❌ Error checking schema:', sampleError.message)
      if (sampleError.message.includes('column')) {
        console.log('\n⚠️  Missing columns detected!')
        console.log('You need to run the database migrations.')
      }
    } else {
      console.log('✅ Schema looks good')
      console.log('   - slug:', sample.slug !== undefined ? '✓' : '✗')
      console.log('   - featured:', sample.featured !== undefined ? '✓' : '✗')
      console.log('   - is_featured:', sample.is_featured !== undefined ? '✓' : '✗')
      console.log('   - is_premium:', sample.is_premium !== undefined ? '✓' : '✗')
      console.log('   - user_id:', sample.user_id !== undefined ? '✓' : '✗')
    }

    // Test the exact query used by the app
    console.log('\n4️⃣ Testing production query (same as homepage)...')
    const { data: testQuery, error: testError } = await supabase
      .from('nursing_homes')
      .select('*')
      .order('is_premium', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10)

    if (testError) {
      console.error('❌ Production query failed:', testError.message)
      console.error('This is why your site shows "No companies found"')
      console.error('\nPossible issues:')
      console.error('1. Missing columns (is_premium, is_featured)')
      console.error('2. RLS policies blocking access')
      console.error('3. Database migrations not run')
    } else {
      console.log(`✅ Production query works! Found ${testQuery?.length || 0} companies`)
      if (testQuery && testQuery.length > 0) {
        console.log('\n📋 Sample companies from production query:')
        testQuery.slice(0, 3).forEach((company, index) => {
          console.log(`   ${index + 1}. ${company.name}`)
        })
      }
    }

    // Check RLS policies
    console.log('\n5️⃣ Checking Row Level Security (RLS) policies...')
    console.log('Testing public access (no auth)...')

    const publicSupabase = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data: publicData, error: publicError } = await publicSupabase
      .from('nursing_homes')
      .select('*')
      .limit(5)

    if (publicError) {
      console.error('❌ Public access blocked:', publicError.message)
      console.error('⚠️  This is the problem! RLS is blocking public access.')
      console.error('\nTo fix: Run this SQL in Supabase SQL Editor:')
      console.error(`
CREATE POLICY "Anyone can view companies"
  ON nursing_homes FOR SELECT
  TO public
  USING (true);
      `)
    } else {
      console.log(`✅ Public access works! Found ${publicData?.length || 0} companies`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('SUMMARY')
    console.log('='.repeat(60))

    if (count === 0) {
      console.log('❌ ISSUE: No companies in database')
      console.log('   → You need to import your companies')
    } else if (publicError) {
      console.log('❌ ISSUE: RLS is blocking public access')
      console.log('   → Run the RLS policy SQL above')
    } else if (testError) {
      console.log('❌ ISSUE: Missing database columns')
      console.log('   → Run database migrations')
    } else {
      console.log('✅ Everything looks good!')
      console.log(`   Database has ${count} companies`)
      console.log('   Public access works')
      console.log('   If site still shows no companies, try:')
      console.log('   1. Hard refresh (Ctrl+Shift+R)')
      console.log('   2. Check Vercel deployment logs')
      console.log('   3. Verify environment variables in Vercel')
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message)
    console.error(error)
  }
}

checkDatabase()
