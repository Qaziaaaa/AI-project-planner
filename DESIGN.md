# Design System — AI Project Planner

## Direction
Refined Editorial / Architecture Magazine. Warm, sophisticated, typography-driven. Inspired by high-end print publications.

## Fonts
- **Headings**: Playfair Display — elegant serif with distinctive italic. Used for all section titles, page headings, decorative numbers.
- **Body**: DM Sans — clean geometric sans. Used for all body copy, inputs, buttons.
- **Code/Mono**: JetBrains Mono — technical monospace. Used for code blocks, paths, data types, tags.

## Color Palette (Light Theme)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.97 0.008 75)` | Warm cream page background |
| `--foreground` | `oklch(0.15 0.015 35)` | Warm charcoal body text |
| `--card` | `oklch(0.99 0.004 75)` | Near-white card surface |
| `--primary` | `oklch(0.5 0.12 30)` | Terracotta accent — buttons, links, highlights |
| `--muted` | `oklch(0.93 0.008 75)` | Warm light gray for subtle backgrounds |
| `--muted-foreground` | `oklch(0.55 0.01 35)` | Warm medium gray for secondary text |
| `--border` | `oklch(0.88 0.006 75)` | Subtle warm border |
| `--accent` | `oklch(0.8 0.05 65)` | Warm gold for decorative accents |
| `--ring` | `oklch(0.5 0.12 30)` | Terracotta focus ring |

## Spacing & Layout
- **Max content width**: `max-w-4xl` (896px) — tight, readable column
- **Card radius**: `rounded-2xl` (1rem) — soft but not pill-like
- **Section spacing**: `gap-5` between cards, `px-6 py-5` inside
- **Header**: `h-16`, thin bottom border, translucent background

## Component Design

### Cards (`section-card`)
- `rounded-2xl border border-border/20 bg-card/60 shadow-sm`
- Hover state: `hover:border-border/35`
- Edit state: `border-primary/25 shadow-primary/5`

### Editable Sections
- Header row with icon (in `bg-primary/8` rounded container), title, and Edit button
- Toggle between view mode (clean content) and edit mode (form inputs)
- Save (green) / Cancel buttons appear in edit mode

### Inputs & Textareas
- `rounded-xl` or `rounded-2xl`, subtle border, transparent/translucent backgrounds
- Label tags use `font-mono tracking-wider uppercase text-[10px]` for editorial feel

### Badges
- `rounded-full` with subtle background tint and border
- Semantic colors: red (high), sky (medium), zinc (low) for priorities
- Semantic colors: red (high), yellow (medium), green (low) for severity

### Generate Button
- Primary color, `rounded-xl`, includes Zap icon
- Positioned bottom-right of textarea (floating), with `⌘↵` shortcut hint

### Phase Timeline
- Decorative numbered circles using `decorative-number` utility
- Vertical connector line between phases using gradient

### Empty State
- Centered layout with icon in soft container
- Italic heading (`text-3xl font-heading italic`)
- Subtle "Powered by" footer with monospace tracking

## Key UI Details
- **Header accent line**: `h-px` gradient from primary to transparent at the very top
- **Animations**: `fade-in-up` for content reveals, `fade-in` for elements, `slide-in-right` for interactions
- **Button text**: XS buttons use `text-xs`, small/medium use `text-sm` — compact but readable
- **Code blocks**: Dark background (`#0a0a0f`) with zinc text for contrast regardless of theme
