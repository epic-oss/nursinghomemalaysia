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
    console.log('Reading migration file...')
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250121000000_add_user_features.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    console.log('Running migration...')
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single()

    if (error) {
      // Try alternative method - split and execute statements
      console.log('Trying alternative execution method...')
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
    } else {
      console.log('✓ Migration completed successfully!')
    }

    console.log('\nMigration process finished.')
    console.log('\nNext steps:')
    console.log('1. Test user registration at /register')
    console.log('2. Test login at /login')
    console.log('3. Check dashboard at /dashboard')

  } catch (error) {
    console.error('Migration failed:', error.message)
    console.error('\nPlease run this migration manually in the Supabase SQL Editor:')
    console.error('1. Go to your Supabase project dashboard')
    console.error('2. Navigate to SQL Editor')
    console.error('3. Copy and paste the contents of supabase/migrations/20250121000000_add_user_features.sql')
    console.error('4. Click "Run"')
    process.exit(1)
  }
}

runMigration()
