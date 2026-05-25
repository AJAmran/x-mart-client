# 🛒 X-Mart — E-Commerce Frontend

A full-featured **e-commerce web application** for fresh groceries, premium kitchenware, and daily essentials. Built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**, featuring both a customer-facing storefront and an admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript 5.6 (strict) |
| **UI Library** | React 18.3 |
| **Components** | NextUI 2 + HeroUI 2 |
| **Styling** | Tailwind CSS 3.4 + tailwind-variants |
| **State Mgmt** | TanStack React Query 5 (server) + React Context (auth) |
| **Forms** | react-hook-form + Zod |
| **HTTP Client** | Axios (with JWT interceptors) |
| **Auth** | JWT (refresh flow), Cookies, Next.js Middleware |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Carousel** | Embla Carousel + Autoplay |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **Export** | xlsx (Excel), jsPDF (PDF) |
| **Theming** | next-themes (dark/light mode) |
| **Linting** | ESLint + Prettier |

---

## Features

### 🛍️ Customer Storefront
- **Product Browsing** — Grid view with category/price filters, search, sort, pagination
- **Product Details** — Images, pricing, discounts, stock info
- **Shopping Cart** — localStorage + backend sync for logged-in users
- **Wishlist** — Save items, move to cart
- **Checkout** — Shipping info form, COD or Online payment via SSLCommerz
- **Order Tracking** — History, status timeline, cancellation
- **User Auth** — Register, login, JWT refresh, change password
- **Profile** — View & manage account
- **Outlet Locator** — Browse branches with geolocation
- **Static Pages** — About, Contact, Blog, FAQ, Shipping, Returns, Careers, Help
- **Hero Carousel** — Embla autoplay carousel
- **Dark/Light Mode** — Persistent theme toggle

### 📊 Admin Dashboard
- **Dashboard Home** — KPI cards, revenue/order charts, recent orders
- **Order Management** — Filter, update status with notes
- **Product Management** — CRUD, inventory, discounts (percentage/fixed)
- **Inventory Management** — Per-branch stock tracking
- **User Management** — CRUD, role (Admin/User), status (Active/Blocked)
- **Sales Analytics** — Overview, reports, insights with charts
- **Data Export** — Export to Excel (.xlsx) and PDF

### 🔧 Technical
- Middleware-based route protection (role-based)
- Axios interceptors for auto token refresh
- React Query stale-while-revalidate caching (5min stale time)
- Error boundaries, loading skeletons, 404 page
- SEO: per-page metadata, Open Graph, sitemap, robots.txt
- Fully responsive (mobile-first)

---

## Pages & Routes

### Public (with Navbar + Footer)
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/shop` | Product catalog with filters |
| `/product/[id]` | Product details |
| `/checkout` | Checkout & payment |
| `/orders` | My orders |
| `/orders/[id]` | Order detail |
| `/wishlist` | Saved items |
| `/profile` | User profile |
| `/track-order` | Track by order ID |
| `/outlets` | Store locator |
| `/deals` | Discounts & offers |
| `/about` | About us |
| `/contact` | Contact form |
| `/blog` | Blog/Articles |
| `/help` | Help center |
| `/faq` | FAQ |
| `/shipping` | Shipping policy |
| `/returns` | Returns policy |
| `/careers` | Careers |
| `/payment/success` | Payment success |
| `/payment/fail` | Payment failure |
| `/payment/cancel` | Payment cancelled |

### Auth (no Navbar/Footer)
| Route | Description |
|-------|-------------|
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/auth/change-password` | Change password |

### Dashboard (admin, with Sidebar)
| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with KPIs & charts |
| `/dashboard/order-management` | Manage orders |
| `/dashboard/product-management` | Products list |
| `/dashboard/product-management/add-product` | Add product |
| `/dashboard/product-management/product-list` | Product table |
| `/dashboard/inventory-management` | Stock management |
| `/dashboard/user-management` | User CRUD |
| `/dashboard/sales-analytics` | Sales overview |
| `/dashboard/sales-analytics/reports` | Detailed reports |
| `/dashboard/sales-analytics/insights` | Data insights |
| `/dashboard/settings` | Dashboard settings |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_API` | ✅ | Backend API base URL (e.g. `http://localhost:5000/api/v1`) |

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── (withRoute)/        # Public pages with Navbar/Footer
│   ├── auth/               # Login, Register, Change password
│   └── dashboard/          # Admin dashboard pages
├── assets/                 # Static images & icons
├── components/             # Reusable React components
│   ├── UI/                 # Generic UI components
│   ├── navbar/             # Navigation components
│   ├── cart/               # Cart-related components
│   ├── shop/               # Shop/product components
│   ├── Order/              # Order-related components
│   ├── product/            # Product management components
│   ├── user/               # User management components
│   └── ...                 # Feature-specific components
├── config/                 # Site config, env config, fonts
├── constants/              # Constants & enums
├── context/                # React contexts (user auth)
├── data/                   # Mock data & category definitions
├── hooks/                  # Custom React hooks
├── interface/              # TypeScript interfaces
├── lib/                    # Axios instance, providers, query client
├── middleware.ts           # Next.js middleware (route protection)
├── services/               # Server actions (API calls)
├── styles/                 # Global CSS
├── types/                  # TypeScript type definitions
├── utils/                  # Helpers
└── validations/            # Zod validation schemas
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (see [x-mart-backend](https://github.com/your-org/x-mart-backend))

### Installation

```bash
git clone <repo-url>
cd x-mart-client
npm install
```

Create `.env.local` (see [Environment Variables](#environment-variables)).

### Development

```bash
npm run dev    # Next.js with Turbopack
```

### Build & Production

```bash
npm run build  # Production build
npm start      # Start production server
```

### Lint

```bash
npm run lint
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint with auto-fix |

---

## Payment Flow

```
Checkout → Create Order → Init Payment → SSLCommerz Gateway
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                      Success              Fail                Cancel
                          │                   │                   │
                    Payment SUCCESS      Payment FAILED      Payment CANCELLED
                    Stock deducted       Order deleted       Order deleted
                    Redirect to          Redirect to         Redirect to
                    /payment/success     /payment/fail       /payment/cancel
```

---
