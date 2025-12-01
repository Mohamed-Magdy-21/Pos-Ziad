# Copilot Instructions for Ziad POS System

## Project Overview
Ziad POS (Point of Sale) System is a modern retail management application built with **Next.js 16** and **React 19**. It provides inventory management, transaction processing, and invoice generation with support for both web and desktop (Electron) deployment.

**Key Technologies:** Next.js, React, TypeScript, Tailwind CSS 4, Electron, localStorage

## Architecture & Core Patterns

### State Management: React Context API
- **`src/context/DataContext.tsx`** is the single source of truth for all application data
- Manages three main entities: Products, Sales, and cart state
- Uses TypeScript interfaces: `Product`, `SoldItem`, `Sale`
- Persists data to browser `localStorage` with key `"pos-data-v1"` using JSON serialization
- Hydration occurs on mount; `dataReady` flag prevents UI render before data loads
- Uses `startTransition` for non-blocking state updates during hydration

**Key Hook:** `useData()` - always used in client components to access products, sales, and CRUD operations

### Persistent Data Model
```tsx
// Core interfaces in DataContext.tsx
type Product = { id, productCode, name, price, stockQuantity };
type SoldItem = { productId, productCode, name, quantity, price };
type Sale = { id, date, subtotal, tax, totalAmount, soldItems[] };
```
- IDs are generated via `crypto.randomUUID()` (with fallback to Math.random)
- All dates stored as ISO strings (e.g., `"2025-12-01T14:30:00Z"`)
- Inventory is tracked per-product; stock is deducted during sales recording

### Navigation & Layout
- **App Router (Next.js 13+)**: File-based routing in `src/app/`
- **Global Layout:** `src/app/layout.tsx` wraps all pages with header nav, footer, and `<Providers>`
- Main Routes: `/` (dashboard), `/inventory`, `/pos`, `/invoice/[id]`
- **CSS Framework:** Tailwind CSS 4 with PostCSS; custom utilities in `src/app/globals.css`

## Developer Workflows

### Setup & Installation
```bash
npm install
```

### Local Development
```bash
# Web dev server (Next.js hot reload at http://localhost:3000)
npm run dev

# Desktop dev (Electron + Next.js dev server, concurrently)
npm run electron:dev
```

### Building & Deployment
```bash
# Web production build
npm run build
npm start

# Desktop apps (output in ./dist)
npm run electron:build:win     # Windows .exe
npm run electron:build:mac     # macOS .dmg
npm run electron:build:linux   # Linux AppImage
npm run electron:build         # All platforms
```

### Linting
```bash
npm run lint  # ESLint with Next.js config
```

### Desktop-Specific Notes
- **Electron Entry:** `electron/main.js` launches Next.js server and embeds in BrowserWindow
- Dev mode opens DevTools automatically
- Window config: 1400×900, borderless, min 1024×768
- **Preload Script:** `electron/preload.js` manages IPC (context isolation enabled)
- Port is hardcoded to 3000; ensure no conflicts

## Code Conventions & Patterns

### Component Structure
- **Server Components:** `src/app/layout.tsx`, global metadata, navigation (no `"use client"`)
- **Client Components:** All feature pages (`/pos`, `/inventory`, etc.) start with `"use client"` directive
- UI Components are **ad-hoc** (no component library); styled inline with Tailwind classes
- **Single-file pages:** Complex logic lives in one `.tsx` file per route (e.g., `pos/page.tsx` handles cart, checkout, and product search)

### State Management in Pages
```tsx
// Example: pos/page.tsx structure
const [cart, setCart] = useState<CartItem[]>([]);
const [message, setMessage] = useState<string | null>(null);
const { products, adjustStock, recordSale } = useData();

// Local state for UI; context for persistence
```
- **Local state** for temporary UI (form inputs, messages, modals)
- **Context hooks** for persistent business data (inventory, sales history)
- **useMemo** for computed values (totals, filtered lists, summaries)

### Event Handling
- Form submissions use `preventDefault()` to avoid page reloads
- Success/error messages display inline; auto-clear after user actions
- Use `useRouter().push()` for navigation after transactions (e.g., redirect to invoice view)

### Naming Conventions
- **Files:** kebab-case for directories, PascalCase for exported components, lowercase for utilities
- **Variables:** camelCase for all variables and functions
- **Constants:** UPPER_SNAKE_CASE for global constants (e.g., `TAX_RATE`, `STORAGE_KEY`)
- **Types:** PascalCase with clear suffixes (`Product`, `SoldItem`, `Sale`, `CartItem`)

### Styling Conventions
- **Tailwind Classes:** Always inline; no CSS modules
- **Card Pattern:** `.card-surface` utility class for consistent panel styling
- **Color Scheme:** Indigo (primary: `indigo-600`, bg: `indigo-50`), Slate (neutral), Emerald (success)
- **Responsive:** Use `sm:` and `md:` breakpoints; mobile-first design

## Critical Files & Their Responsibilities

| File | Purpose |
|------|---------|
| `src/context/DataContext.tsx` | State management: products, sales, CRUD operations, localStorage sync |
| `src/app/page.tsx` | Dashboard: displays KPIs (product count, inventory value, daily revenue) |
| `src/app/pos/page.tsx` | POS transaction: cart management, barcode/search, checkout, stock deduction |
| `src/app/inventory/page.tsx` | Product CRUD: add/edit/delete products, adjust stock, view all products |
| `src/app/invoice/[id]/page.tsx` | Invoice/receipt view: displays transaction details, printable format |
| `src/app/layout.tsx` | Global layout, navigation header, Providers wrapper |
| `electron/main.js` | Electron entry point, window creation, dev server integration |
| `tsconfig.json` | Path alias: `@/*` resolves to `src/*` |

## Integration Points & Data Flow

### Adding a Product to Cart
1. User submits product code in POS page
2. `addProductToCart()` validates stock availability
3. Cart state updates locally
4. No DB call; instant feedback

### Recording a Sale
1. User clicks "Complete Sale" in POS
2. `recordSale()` (from context) creates Sale object with timestamp and items
3. `adjustStock()` reduces product quantities
4. Both stored to localStorage
5. User redirected to invoice view to print/view

### Viewing an Invoice
1. Navigate to `/invoice/[id]`
2. Fetch sale from context using route param `id`
3. Render receipt with company branding, items, totals
4. Print button uses browser `window.print()`

## Project-Specific Conventions

### "dataReady" Pattern
- All pages check `const { dataReady } = useData()` before rendering content
- Show loading placeholder if false; prevents hydration mismatch in Next.js + localStorage
- Example: `if (!dataReady) return <div>Loading POS...</div>;`

### Message/Feedback Pattern
- Pages use local `useState` for transient messages (success, error, warning)
- Display for user feedback, auto-clear on next action
- No toast library; inline UI messages

### Product Codes as Identifiers
- Each product has a human-readable `productCode` (e.g., "ESP-1001")
- Users scan or type codes to add items to cart
- `productCode` is distinct from auto-generated `id`

### Tax Rate is Disabled
- `TAX_RATE = 0` in `pos/page.tsx`; currently no tax calculation
- Tax UI exists but disabled; can be re-enabled by changing constant and passing to `recordSale()`

## Common Development Tasks

### Adding a New Feature
1. **Route:** Create folder in `src/app/` (e.g., `/reports`) and add `page.tsx` with `"use client"`
2. **State:** If persistent, add to `DataContext.tsx` and export a hook
3. **Navigation:** Add link in `src/app/layout.tsx` header nav
4. **Styling:** Use Tailwind; reference existing pages for color/spacing patterns

### Modifying Product or Sale Schema
1. Update TypeScript types in `src/context/DataContext.tsx`
2. Update localStorage migration logic if changing existing fields
3. Update all pages reading/writing those types
4. Test data persistence across refresh

### Debugging
- **Client-side:** Use browser DevTools (F12 in Electron dev mode auto-opens)
- **localStorage:** Inspect via DevTools → Application → Local Storage
- **Data flow:** Add `console.log()` in context hooks to trace state updates
- **Electron:** Check main process logs in terminal; renderer logs in DevTools

## External Dependencies & Notes

- **Next.js 16:** App Router, server/client components, TypeScript support
- **React 19:** Latest features, `startTransition` for transitions
- **Tailwind CSS 4:** Updated PostCSS config; utility-first design
- **Electron 28:** Desktop packaging with electron-builder; Windows/macOS/Linux targets
- **No Backend:** 100% client-side; data in localStorage only (suitable for single-device retail setup)
- **No Component Library:** All UI built with Tailwind; keeps bundle small, tightly couples design to features

## Deployment Considerations

- **Web:** Deploy `.next/standalone` folder (output from `npm run build`)
- **Desktop:** Signed/notarized executables for macOS; auto-updater not yet configured
- **Data Migration:** localStorage persists locally; no cloud sync (design choice for privacy)
- **Scalability:** Current setup suitable for single-device retail; no multi-device sync

---

**Last Updated:** 2025-12-01
