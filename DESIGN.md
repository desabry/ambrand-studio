---
name: Ambrand Studio
description: Bold, premium creative agency landing page — portfolio and lead generation for a branding and design studio.
colors:
  primary: "#e31937"
  primary-hover: "#c0152f"
  primary-light: "#fef0f0"
  footer-bg: "#b81d28"
  surface-50: "#f8f9fa"
  surface-100: "#f1f3f5"
  surface-200: "#e2e5e9"
  surface-500: "#8b95a0"
  surface-600: "#6b7580"
  surface-700: "#4a5560"
  surface-900: "#1a1d23"
  white: "#ffffff"
  dark-bg: "#0f0f0f"
typography:
  display:
    fontFamily: "Stara, serif"
    fontWeight: 700
    letterSpacing: "0.15em"
  heading:
    fontFamily: "Stara, serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, Roboto Flex, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, sans-serif"
    fontWeight: 600
    letterSpacing: "0.15em"
    textTransform: "uppercase"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.surface-900}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.25rem"
    fontWeight: 500
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.surface-700}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.25rem"
    border: "1px solid {colors.surface-200}"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
---

# Design System: Ambrand Studio

## 1. Overview

**Creative North Star: "The Bold Atelier"**

Ambrand Studio's visual system is a confident, premium creative atelier. The brand red is not an accent — it is a commitment, used generously as conviction rather than decoration. Surfaces are clean and spacious, letting the bold red anchors breathe. The system pairs a restrained neutral architecture with saturated red focal points, creating a rhythm of calm and emphasis.

This system explicitly rejects over-designed clutter, glassmorphism, and SaaS-template conventions. Every element earns its place. The white space is intentional, not empty.

**Key Characteristics:**
- Red as conviction, not accent — used on 30-60% of key surfaces (committed color strategy)
- Flat surfaces with interactive elevation — depth appears only on hover/focus
- Uppercase, widely tracked headings for editorial weight
- Generous vertical rhythm — sections breathe with 5rem spacing
- English-only, LTR layout with bold typographic hierarchy

## 2. Colors

A committed strategy: one saturated red carries the brand identity across surfaces, supported by a clean neutral scale.

### Primary
- **Signature Red** (#e31937 / oklch(55% 0.22 25)): The brand anchor. Used for backgrounds, accents, and focal elements on the landing page. Appears on hero highlights, section dividers, and the full-width footer.
- **Deep Red** (#b81d28 / oklch(45% 0.18 25)): Footer background and surfaces requiring a darker, more grounded red presence.
- **Red Hover** (#c0152f): Interactive red states.

### Primary Light
- **Blush Tint** (#fef0f0): Subtle red-tinted background for light sections that need proximity to the brand without full saturation.

### Neutral
- **Paper** (#f8f9fa — surface-50): Default page background. Near-white with a cool cast.
- **Card Surface** (#ffffff / white): Cards, content containers, elevated surfaces.
- **Divider** (#e2e5e9 — surface-200): Borders, dividers, subtle separators.
- **Muted Text** (#8b95a0 / #6b7580 — surface-500/600): Secondary and placeholder text.
- **Body Text** (#4a5560 — surface-700): Primary body copy.
- **Headline** (#1a1d23 — surface-900): Headings and emphasized text. Near-black.

## 3. Typography

**Display Font:** Stara (serif, with fallback)
**Body Font:** Inter / Roboto Flex (sans-serif)
**Label Font:** Inter (sans-serif, uppercase, tracked)

**Character:** An editorial-weight serif for display roles paired with a clean, readable sans-serif for body copy. The contrast is deliberate: the serif commands attention, the sans gets out of the way.

### Hierarchy
- **Display** (700, clamp(1.5rem, 5vw, 3rem), 1.1, 0.15em tracking): Hero headlines and brand lockups. Uppercase. Reserved for maximum emphasis.
- **Headline** (600, 1.25-1.5rem, 1.3): Section headings. Clean serif weight without uppercase forcing.
- **Title** (600, 0.875-1rem, 1.4): Subheadings, column titles. May be uppercase with tracking in brand-adjacent contexts.
- **Body** (400, 0.875rem, 1.6): Paragraphs, descriptions. Max line length 65-75ch.
- **Label** (600, 0.75rem, 1.2, 0.15em tracking, uppercase): Navigation, buttons, form labels, metadata. The most compressed step — high information density.

## 4. Elevation

Flat by default, lifted on interaction. Surfaces at rest have no shadow — depth is communicated through tonal contrast (white card on paper background). Shadows appear only as a response to user state: hover, focus, or active.

### Shadow Vocabulary
- **Interactive Lift** (`0 4px 12px rgba(0,0,0,0.1)`): Applied on hover for cards, buttons, and clickable surfaces. Subtle enough to feel physical without dominating.
- **Modal Depth** (`0 10px 30px rgba(0,0,0,0.15)`): Reserved for modals, dropdowns, and elevated overlays.

## 5. Components

### Buttons
- **Shape:** Slightly rounded (8px radius). Solid or border treatment.
- **Primary:** Near-black background (#1a1d23), white text, 0.5rem 1.25rem padding, uppercase tracking on CTAs. Hover: subtle lift (2px translateY, shadow) or lighter background.
- **Secondary:** White background, surface-700 text, 1px surface-200 border. Hover: surface-50 background.
- **Footer variant:** Red background context — white/10 background button, white text, hover reverses to white bg with red text.

### Cards
- **Shape:** Rounded (12px radius). White background, no border at rest (or very subtle surface-200 border).
- **Internal Padding:** 1.5rem.
- **Hover:** Gentle translateY(-2px) with interactive-lift shadow.
- **Footer cards:** Not used. Footer uses direct text layout without card containers.

### Inputs / Fields
- **Style:** Slightly rounded (8px). Subtle border (white/15 on dark bg, surface-200 on light bg). Semi-transparent background on dark surfaces (bg-black/20).
- **Focus:** Border brightens to white/60 on dark surfaces. Transition duration 300ms.
- **Footer inputs:** Dark bg overlay (bg-black/20) with white text and white/40 placeholder.

### Social Icon Links
- **Shape:** Circular (40px × 40px, rounded-full). 1px white/20 border.
- **Default:** White/60 icon color, transparent background.
- **Hover:** White/10 background fill, white icon.

### Pill Capsules (footer newsletter / badges)
- **Shape:** Fully rounded (rounded-full). Used sparingly.
- **Subscribe:** Near-black pill nested inside the capsule edge.
- **Badges (retired):** Previously used indigo/emerald filled pills — removed.

### Navigation Links (footer)
- **Style:** Clean text links, white/60 default, white on hover. 300ms transition. Animated dot indicator on hover (left-aligned, expands from 0 to full).

### Scroll-to-Top
- **Shape:** Circular (32px × 32px, rounded-full). 1px white/15 border.
- **Default:** White/40 icon.
- **Hover:** White/50 border, white icon, 5% white bg fill.

## 6. Do's and Don'ts

### Do:
- **Do** use the brand red (#e31937 / #b81d28) as a committed surface color, not just a decorative accent.
- **Do** keep surfaces flat at rest — let tonal contrast create depth.
- **Do** use uppercase tracking for headings and labels where emphasis is needed.
- **Do** use generous spacing (5rem section gaps, 1.5rem+ internal padding) — the layout should breathe.
- **Do** use white/opacity tokens on dark backgrounds instead of gray (`text-white/60`, `border-white/20`, `bg-black/20`).
- **Do** provide hover feedback on every interactive element — scale, shadow, or color shift.

### Don't:
- **Don't** introduce glassmorphism, gradient text, or blur effects as decoration.
- **Don't** use pure black (#000) or pure white (#fff) — tint neutrals subtly.
- **Don't** clutter the footer with phone numbers or excessive links — keep it to brand, navigation, and contact.
- **Don't** use side-stripe borders (border-left > 1px as accent).
- **Don't** use bounce or elastic easing — stick to ease-out-expo for motion.
- **Don't** wrap everything in a card container — let some sections breathe freely.
- **Don't** animate layout properties (width, height, top, left) — use transforms and opacity.
