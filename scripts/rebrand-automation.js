const fs = require('fs');
const path = require('path');

// Directories to process
const INCLUDE_DIRS = ['app', 'components', 'lib', 'supabase', 'scripts', 'public'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'content', 'data_enrichment'];

// Files to exclude
const EXCLUDE_FILES = [
  'package-lock.json',
  'CONTENT_SYSTEM_PLAN.md',
  'SEO_FOUNDATIONS_PLAN.md',
  'FEATURES_COMPLETED.md',
  'rebrand-automation.js'
];

// File extensions to process
const INCLUDE_EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.sql', '.md', '.json', '.mjs'];

// Replacement mappings (order matters!)
const REPLACEMENTS = [
  // Brand names - most specific first
  { from: /TeamBuildingMY/g, to: 'Nursing Home Malaysia' },
  { from: /Team Building/g, to: 'Nursing Home' },
  { from: /team building/g, to: 'nursing home' },
  { from: /TeamBuilding/g, to: 'NursingHome' },
  { from: /team-building/g, to: 'nursing-home' },
  { from: /teambuilding/g, to: 'nursinghome' },

  // Domain replacements
  { from: /teambuildingmy\.com/g, to: 'nursinghomemalaysia.com' },
  { from: /@teambuildingmy\.com/g, to: '@nursinghomemalaysia.com' },
  { from: /epic-oss\/teambuilding/g, to: 'epic-oss/nursinghomemalaysia' },

  // Database table references - SQL specific
  { from: /ALTER TABLE companies/g, to: 'ALTER TABLE nursing_homes' },
  { from: /CREATE TABLE companies/g, to: 'CREATE TABLE nursing_homes' },
  { from: /create table companies/g, to: 'create table nursing_homes' },
  { from: /DROP TABLE companies/g, to: 'DROP TABLE nursing_homes' },
  { from: /TABLE companies /g, to: 'TABLE nursing_homes ' },
  { from: /ON companies\(/g, to: 'ON nursing_homes(' },
  { from: /ON companies /g, to: 'ON nursing_homes ' },
  { from: /FROM companies/g, to: 'FROM nursing_homes' },
  { from: /from companies/g, to: 'from nursing_homes' },

  // Database query references - TypeScript/JavaScript
  { from: /from\('companies'\)/g, to: "from('nursing_homes')" },
  { from: /from\("companies"\)/g, to: 'from("nursing_homes")' },
  { from: /\.from\('companies'\)/g, to: ".from('nursing_homes')" },
  { from: /\.from\("companies"\)/g, to: '.from("nursing_homes")' },

  // Index names
  { from: /idx_companies_/g, to: 'idx_nursing_homes_' },
  { from: /companies_pkey/g, to: 'nursing_homes_pkey' },

  // Variable and property names
  { from: /allCompanies/g, to: 'allNursingHomes' },
  { from: /company_names/g, to: 'nursing_home_names' },
  { from: /companyNames/g, to: 'nursingHomeNames' },
  { from: /companyUrls/g, to: 'nursingHomeUrls' },
  { from: /company_id/g, to: 'nursing_home_id' },
  { from: /companyId/g, to: 'nursingHomeId' },

  // Object property access patterns
  { from: /company\.activities/g, to: 'nursing_home.services' },
  { from: /\.activities/g, to: '.services' },

  // Field/column names
  { from: /'activities'/g, to: "'services'" },
  { from: /"activities"/g, to: '"services"' },
  { from: /`activities`/g, to: '`services`' },

  // Singular forms (more specific context)
  { from: /: Company/g, to: ': NursingHome' },
  { from: /<Company>/g, to: '<NursingHome>' },
  { from: /\(Company\)/g, to: '(NursingHome)' },
  { from: /Company\[\]/g, to: 'NursingHome[]' },
  { from: /Array<Company>/g, to: 'Array<NursingHome>' },
  { from: /import.*Company.*from/g, to: (match) => match.replace(/Company/g, 'NursingHome') },
  { from: /export.*Company/g, to: (match) => match.replace(/Company(?!List)/g, 'NursingHome') },

  // Interface and type names
  { from: /interface Company /g, to: 'interface NursingHome ' },
  { from: /type Company /g, to: 'type NursingHome ' },
  { from: /CompanyListProps/g, to: 'NursingHomeListProps' },
  { from: /VendorData/g, to: 'FacilityData' },
  { from: /getVendors/g, to: 'getFacilities' },

  // Vendor/Facility replacements
  { from: /vendor_id/g, to: 'facility_id' },
  { from: /vendorId/g, to: 'facilityId' },
  { from: /'vendor'/g, to: "'facility'" },
  { from: /"vendor"/g, to: '"facility"' },
  { from: /vendors/g, to: 'facilities' },
  { from: /Vendors/g, to: 'Facilities' },

  // Listing type values
  { from: /'company'/g, to: "'nursing_home'" },
  { from: /"company"/g, to: '"nursing_home"' },
  { from: /type="company"/g, to: 'type="nursing_home"' },
  { from: /type='company'/g, to: "type='nursing_home'" },

  // URL paths
  { from: /\/listings\/company\//g, to: '/listings/nursing_home/' },
  { from: /\/api\/companies/g, to: '/api/nursing_homes' },

  // HRDF removals
  { from: /,?\s*check HRDF eligibility,?/g, to: '' },
  { from: /,?\s*HRDF claimable,?/g, to: '' },
  { from: /,?\s*check HRDF,?/g, to: '' },
  { from: /hrdf_claimable[^,\n]*/g, to: '' },

  // Context-specific replacements
  { from: /corporate training/g, to: 'elderly care' },
  { from: /Corporate Training/g, to: 'Elderly Care' },
  { from: /outdoor team building/g, to: 'residential care' },
  { from: /Outdoor Team Building/g, to: 'Residential Care' },
  { from: /indoor team building/g, to: 'day care services' },
  { from: /Indoor Team Building/g, to: 'Day Care Services' },
];

let filesProcessed = 0;
let filesModified = 0;
let errors = [];

function shouldExcludePath(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);

  // Check excluded directories
  for (const dir of EXCLUDE_DIRS) {
    if (relativePath.includes(dir + path.sep) || relativePath.startsWith(dir)) {
      return true;
    }
  }

  // Check excluded files
  const fileName = path.basename(filePath);
  if (EXCLUDE_FILES.includes(fileName)) {
    return true;
  }

  // Check if file is in .env
  if (fileName.startsWith('.env')) {
    return true;
  }

  // Check if CSV file
  if (fileName.endsWith('.csv')) {
    return true;
  }

  return false;
}

function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath);
  return INCLUDE_EXTENSIONS.includes(ext);
}

function processFile(filePath) {
  try {
    filesProcessed++;

    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;

    // Apply all replacements
    for (const replacement of REPLACEMENTS) {
      const before = newContent;
      if (typeof replacement.to === 'function') {
        newContent = newContent.replace(replacement.from, replacement.to);
      } else {
        newContent = newContent.replace(replacement.from, replacement.to);
      }
      if (newContent !== before) {
        hasChanges = true;
      }
    }

    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      filesModified++;
      console.log(`✓ Modified: ${path.relative(process.cwd(), filePath)}`);
    }

  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (shouldExcludePath(filePath)) {
      continue;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (stat.isFile() && shouldIncludeFile(filePath)) {
      processFile(filePath);
    }
  }
}

// Main execution
console.log('Starting comprehensive rebranding...\n');

// Process included directories
for (const dir of INCLUDE_DIRS) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\nProcessing directory: ${dir}/`);
    walkDirectory(dirPath);
  }
}

// Process root documentation files
const rootFiles = [
  'README.md',
  'DEPLOYMENT_CHECKLIST.md',
  'SECURITY_FIX_SUMMARY.md',
  'SETUP_SLUGS.md',
  'SLUG_IMPLEMENTATION_SUMMARY.md',
  'STRIPE_SETUP_GUIDE.md',
  'STRIPE_INTEGRATION_STATUS.md',
  'TESTING_GUIDE.md',
  'WEBHOOK_FIELDS.md',
  'WEBHOOK_SETUP_INSTRUCTIONS.md',
  'FIX_CLAIM_PERMISSION.sql',
  'RUNTHIS_IN_SUPABASE.sql',
  'RUNTHIS_IN_SUPABASE_SAFE.sql',
];

console.log('\nProcessing root documentation files...');
for (const file of rootFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath) && !shouldExcludePath(filePath)) {
    processFile(filePath);
  }
}

// Process config files
const configFiles = ['next.config.ts', 'tsconfig.json', 'eslint.config.mjs', 'postcss.config.mjs'];
console.log('\nProcessing config files...');
for (const file of configFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('REBRANDING COMPLETE');
console.log('='.repeat(60));
console.log(`Files processed: ${filesProcessed}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nErrors encountered:');
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}

console.log('\n✓ Rebranding automation completed successfully!');
