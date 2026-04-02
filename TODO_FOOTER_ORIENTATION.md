# Footer Orientation Change - Horizontal Layout like Navbar

**Goal:** Logo left, text center, social+credits right (navbar-style: logo-left | nav-center | buttons-right).

**Current:** Vertical stack.
**New:** Horizontal flex row.

## Plan

1. Footer.tsx: `<div className="flex items-center justify-between h-20">`
2. Logo left, text center (truncate), social right.
3. Compact for fixed bottom.

## Progress

- [x] Layout horizontal (navbar-style: logo-left | text-center | social-right)
- [x] Text responsive
- [x] Mobile test
