# Design Guidelines: Actor's Tool Randomizer

## Design Approach

**Hybrid Approach**: Drawing inspiration from engaging tarot/oracle card applications (like Labyrinthos, Golden Thread Tarot) for the dramatic reveal experience, while maintaining the clean utility structure of productivity tools (Linear, Notion) for selection interfaces.

**Core Principle**: Create a theatrical, focused experience that balances drama with functionality - the reveal should feel ceremonial and inspiring, while the selection interface remains efficient and clear.

---

## Typography

**Primary Font**: Inter or Work Sans (Google Fonts)
- App Title/Headers: 700 weight, 2xl-4xl sizes
- Category Labels: 600 weight, lg-xl sizes
- Tool Names (Revealed): 600 weight, 3xl-5xl sizes (hero display)
- Body Text/Descriptions: 400 weight, base-lg sizes
- UI Elements: 500 weight, sm-base sizes

**Secondary Font**: Playfair Display or Cormorant Garamond (for theatrical flair)
- Use exclusively for revealed tool card titles to create dramatic emphasis
- 600-700 weight

---

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-8
- Section spacing: space-y-6 to space-y-12
- Card gaps: gap-4 to gap-6
- Button spacing: px-6 py-3 to px-8 py-4

**Container Structure**:
- Max width: max-w-4xl for main content area
- Full viewport height utilization for immersive experience
- Centered layout: mx-auto with px-4 to px-8

---

## Component Library

### Primary Button ("Draw Tool" / "Reveal")
- Large, prominent centered button
- Rounded-xl borders
- Heavy font weight (600-700)
- Generous padding (px-12 py-4 to px-16 py-5)
- Shadow-lg for depth
- Scale transform on interaction

### Category Selection System
- Custom checkbox group with visual cards
- Each category as a selectable card with rounded-lg borders
- Active state: border-2 with scale effect
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Include icon representation for each category (Heroicons)
- "Select All" toggle prominently placed

### Tool Reveal Card
- Large centered card with dramatic entrance animation
- Rounded-2xl with shadow-2xl
- Minimum height to accommodate content (min-h-96)
- Three-section layout:
  1. Category badge at top (pill-shaped, small text)
  2. Tool name (large, theatrical font, centered)
  3. Brief description or context (smaller text below)
- For Tempo/Rhythm: Display 1-10 scale value as large circular badge

### History Panel
- Compact list view on side or bottom
- Each history item as small card with rounded-lg
- Display: tool name, category, timestamp
- Fade-in animation for new additions
- Max 10 items with subtle scroll if needed
- Collapsible on mobile (drawer pattern)

### Navigation Header
- Fixed top bar with app title
- Minimal navigation: Settings/About icons (Heroicons)
- Subtle bottom border for separation

---

## Interaction Patterns & Animations

**Card Reveal Sequence**:
1. Fade out selection interface
2. Scale-in animation for card (transform: scale from 0.9 to 1)
3. Fade-in content with staggered timing
4. Duration: 600-800ms total

**Category Selection**:
- Smooth border transitions (transition-all duration-200)
- Subtle scale on hover (hover:scale-105)
- Checkmark icon fade-in when selected

**Button States**:
- Disabled state when no categories selected
- Loading state with subtle pulse animation during "draw"
- Success state after reveal

---

## Visual Hierarchy & Page Structure

### Main Interface States

**State 1: Selection View** (Initial/Default)
- Top: App title and tagline (centered)
- Middle: Category selection grid (dominant space)
- Bottom: Large "Draw Tool" button (fixed or centered)
- Side/Bottom: Collapsed history panel

**State 2: Reveal View**
- Centered: Large tool reveal card (takes 60-70% of viewport)
- Top: Small "Draw Again" button
- Bottom: "Change Categories" link/button
- Background: Subtle gradient overlay for focus

**State 3: History Expanded**
- Split view: 70% selection/reveal, 30% history
- Smooth slide-in transition

### Responsive Behavior
- Mobile (base): Single column, stacked layout, full-width cards
- Tablet (md): 2-column category grid, maintained card sizes
- Desktop (lg): 3-column category grid, side history panel option

---

## Key Components Detail

**Category Cards** (Selectable):
- Border-2 with rounded-lg
- p-6 padding
- Icon at top (h-8 w-8)
- Category name below (font-semibold text-lg)
- Tool count indicator (text-sm opacity-70)
- Checkbox positioned top-right corner

**Tempo/Rhythm Special Display**:
- Circular scale indicator (0-10)
- Large number in center (text-6xl)
- Ring progress indicator around number
- Tool name below scale

**Session History Items**:
- Horizontal layout: Icon | Tool Name | Category Badge
- Subtle dividers between items
- Hover state: slight background tint
- Click to re-display tool details

---

## Special Considerations

- **Accessibility**: All interactive elements keyboard navigable, clear focus states (ring-2 ring-offset-2), ARIA labels on all controls
- **Loading States**: Skeleton screens for initial load, pulse animation during draw
- **Empty States**: Friendly message when no categories selected with clear call-to-action
- **Error Handling**: Subtle inline messages if something fails
- **Mobile-First**: Touch-friendly targets (min 44px), gesture support for card dismissal

---

## Images

No hero images required. This is a utility application where functionality is paramount. All visual interest comes from typography, card design, and animation rather than imagery.