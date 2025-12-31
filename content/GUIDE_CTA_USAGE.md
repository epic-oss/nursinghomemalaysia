# Guide CTA System

This document explains how to add call-to-action (CTA) sections to new guide articles.

## Quick Start

There are two ways to add CTAs to guide articles:

### Option 1: Markdown Blockquote (Recommended)

Use the emoji-prefixed blockquote format. The system auto-detects these patterns and styles them as CTAs.

**Quote CTA (blue)** - Use 📋 emoji:

```markdown
> **📋 Get Your Custom Quote**
>
> Planning team building? Get personalized quotes from verified providers.
>
> **[Get Free Quotes →](/calculator)**
```

**Calculator CTA (green)** - Use 💰 emoji:

```markdown
> **💰 Calculate Your Budget**
>
> Use our free calculator to estimate costs for your team size and preferences.
>
> **[Try the Calculator →](/calculator)**
```

### Option 2: React Components (Advanced)

For more customization, use the React components directly in MDX:

```mdx
<GuideCTA
  variant="quote"
  headline="Ready to Plan Your Event?"
  description="Get quotes from verified team building providers."
  buttonText="Get Quotes"
  href="/calculator"
/>

<QuoteCTA context="Penang" />

<CalculatorCTA context="Cameron Highlands" />
```

## Placement Guidelines

- Add **maximum 2 inline CTAs** per article
- Place first CTA at approximately **30%** through the article
- Place second CTA at approximately **60%** through the article
- Keep the existing end-of-article CTA linking to `/listings`

## CTA Variants

| Variant | Emoji | Color | Best For |
|---------|-------|-------|----------|
| Quote | 📋 | Blue | Getting quotes, contacting providers |
| Calculator | 💰 | Green | Budget planning, cost estimation |

## Customizing for Location

For location-specific guides, customize the description:

```markdown
> **📋 Get Your Custom Quote**
>
> Planning Penang team building? Get personalized quotes from verified providers.
>
> **[Get Free Quotes →](/calculator)**
```

## Component Props

### GuideCTA

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'quote' \| 'calculator'` | `'quote'` | Visual style |
| `headline` | `string` | Based on variant | Main heading |
| `description` | `string` | Based on variant | Supporting text |
| `buttonText` | `string` | Based on variant | Button label |
| `href` | `string` | `/calculator` | Link destination |
| `context` | `string` | - | Location/context for auto-text |

### QuoteCTA / CalculatorCTA

Pre-configured variants. Accept all props except `variant`.

```mdx
<QuoteCTA context="Johor" />
<!-- Renders: "Planning Johor Team Building?" -->

<CalculatorCTA />
<!-- Uses default calculator messaging -->
```

## Examples

### Standard Guide Article

```markdown
## Popular Venues

Content about venues...

> **📋 Get Your Custom Quote**
>
> Looking for venue options? Get personalized quotes from verified providers.
>
> **[Get Free Quotes →](/calculator)**

## Pricing Guide

Content about pricing...

> **💰 Calculate Your Budget**
>
> Use our free calculator to estimate costs for your team size and preferences.
>
> **[Try the Calculator →](/calculator)**

## Conclusion

Final content...

[Browse Team Building Companies →](/listings)
```

### Location-Specific Guide

```markdown
## Best Venues in Langkawi

Content...

> **📋 Get Your Custom Quote**
>
> Planning Langkawi team building? Get personalized quotes from verified providers.
>
> **[Get Free Quotes →](/calculator)**
```

## File Locations

- Component: `components/blog/GuideCTA.tsx`
- MDX styling: `components/MDXContent.tsx`
- This guide: `content/GUIDE_CTA_USAGE.md`
