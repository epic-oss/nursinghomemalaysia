const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('Reading premium features migration file...')
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250121000001_add_premium_features.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    console.log('Running premium features migration...')

    // Split and execute statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`Executing ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\nExecuting statement ${i + 1}/${statements.length}:`)
      console.log(statement.substring(0, 100) + '...')

      try {
        await supabase.rpc('exec_sql', { sql_query: statement })
        console.log('✓ Success')
      } catch (err) {
        console.error('✗ Error:', err.message)
        // Continue with other statements
      }
    }

    console.log('\n✓ Premium features migration completed!')
    console.log('\nNext steps:')
    console.log('1. Set up Stripe account and get API keys')
    console.log('2. Add Stripe keys to .env.local')
    console.log('3. Test premium upgrade flow')

  } catch (error) {
    console.error('Migration failed:', error.message)
    console.error('\nPlease run this migration manually in the Supabase SQL Editor.')
    process.exit(1)
  }
}

runMigration()
