# Standardized Webhook Field Names

Both API routes now send identical field names to Make.com webhooks for consistency.

## Calculator Lead API (`/api/calculator-lead`)

**Webhook Data Fields:**
- `leadId` - Generated ID (e.g., "CALC20251125001")
- `timestamp` - ISO timestamp
- `fullName` - User's full name
- `companyName` - Company name
- `email` - Email address
- `phone` - Phone number
- `participants` - Number of participants (string)
- `preferredDate` - Preferred event date
- `additionalRequirements` - Additional notes
- `duration` - Event duration
- `activityType` - Type of activity
- `location` - Event location
- `estimatedBudgetMin` - Minimum budget (string)
- `estimatedBudgetMax` - Maximum budget (string)
- `estimatedBudget` - Formatted budget range (e.g., "RM5,000 - RM10,000")
- `source` - Lead source (default: "calculator")

## Quote Request API (`/api/quote`)

**Webhook Data Fields:**
- `leadId` - Generated ID (e.g., "TB1732563840001")
- `timestamp` - ISO timestamp
- `fullName` - User's full name ✅ **Standardized**
- `companyName` - Company name ✅ **Standardized**
- `email` - Email address
- `phone` - Phone number
- `participants` - Number of participants (string)
- `preferredDate` - Formatted date or "Flexible"
- `flexibleDates` - "Yes" or "No"
- `location` - Event location
- `duration` - Duration label (e.g., "Full Day (8 hours)")
- `budget` - Budget range or "Not specified"
- `hrdfRequired` - HRDF requirement ("Yes", "No", or "Not sure / Need advice")
- `additionalRequirements` - Additional notes
- `source` - Lead source
- `status` - Lead status (default: "NEW")
- `contactedDate` - Empty string (for tracking)
- `facilitiesSentTo` - Empty string (for tracking)
- `converted` - Empty string (for tracking)
- `revenue` - Empty string (for tracking)
- `notes` - Empty string (for tracking)

## Key Changes

### Before:
- Quote API used `name` and `company`
- Inconsistent with Calculator API

### After:
- Both APIs use `fullName` and `companyName` ✅
- Consistent field naming across all webhooks
- Easier to maintain Make.com scenarios
