# JIET Marketplace — Fashion & Lifestyle (MERN Monorepo)

Full-stack multi-vendor e-commerce marketplace built for the JIET MERN Internship final capstone task.

**Stack:** MongoDB · Express.js · React (Vite) · Node.js · JWT Auth · TailwindCSS

## Monorepo Structure

```
jiet-marketplace/
├── apps/
│   ├── api/         # Express + MongoDB backend
│   ├── web/         # Customer-facing website (React + Vite)
│   └── admin/       # Admin + Vendor dashboard (React + Vite)
├── packages/
│   └── shared/      # Shared types, constants, validators
├── scripts/
│   └── seed.js      # Seed script (30 products, 5 categories, 3 vendors, 10 customers, 15 orders)
├── docs/            # API docs, ERD, screenshots
└── package.json     # Workspace root
```

## Quick Start

### 1. Prerequisites
- Node.js 20+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URL
- npm 10+ (workspaces)

### 2. Install
```bash
npm install
```

### 3. Environment
Copy `.env.example` to `apps/api/.env` and fill in values:
```bash
cp apps/api/.env.example apps/api/.env
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Run everything (in three terminals)
```bash
npm run dev:api      # http://localhost:5000
npm run dev:web      # http://localhost:5173  (customer site)
npm run dev:admin    # http://localhost:5174  (admin/vendor dashboard)
```

## Demo Credentials (after seeding)

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Admin     | admin@jietmart.com       | Admin@123   |
| Vendor 1  | vendor1@jietmart.com     | Vendor@123  |
| Vendor 2  | vendor2@jietmart.com     | Vendor@123  |
| Vendor 3  | vendor3@jietmart.com     | Vendor@123  |
| Customer  | customer1@jietmart.com   | Customer@123|

## Features

### Customer Website (`apps/web`)
- Home page with dynamic hero banners, categories, trending products
- Product listing with search, filters (price, category, vendor, rating), sort, pagination
- Product detail with gallery, variants, reviews, Q&A, related products
- Cart & Checkout with coupon, address, COD + demo online payment
- User account: profile, addresses, wishlist, orders, invoices, returns, reviews
- Vendor storefronts (public store pages)

### Vendor Dashboard (`apps/admin` — vendor role)
- Onboarding, store profile
- Product CRUD with variants, images, stock, offers
- Vendor-scoped order management with status updates
- Product enquiries + bulk quote replies
- Sales, low-stock alerts, performance metrics

### Super Admin Dashboard (`apps/admin` — admin role)
- Dashboard with sales, orders, vendors, customers, revenue chart
- Users & Vendors management (approvals, KYC, roles)
- Product & Category management
- Order management with fulfillment tracking
- CMS builder: homepage sections, banners, FAQs, policies, pages
- Website settings (logo, contact, tax, shipping, commission, maintenance mode)
- Coupons, marketing, newsletter
- Reports (CSV export)
- Activity logs

## API Routes (base: `/api`)

```
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /categories               PUT /categories/:id      (admin)
GET    /products                 POST /products           (vendor/admin)
GET    /products/:id             PUT /products/:id        (owner/admin)
GET    /vendors                  GET /vendors/:id
POST   /vendors/apply            PUT /vendors/:id/approve (admin)

GET    /cart                     POST /cart/add           DELETE /cart/:itemId
POST   /orders                   GET /orders/mine         GET /orders/:id
PUT    /orders/:id/status        (vendor/admin)

POST   /enquiries                GET /enquiries/mine
PUT    /enquiries/:id/reply      (vendor/admin)

POST   /reviews                  GET /reviews/product/:id
GET    /cms/pages/:slug          PUT /cms/pages/:slug     (admin)
GET    /settings                 PUT /settings            (admin)

POST   /coupons/apply            CRUD /coupons            (admin)
GET    /reports/*                (admin)
GET    /notifications            (auth)
```

See `docs/postman-collection.json` for a full Postman collection.

## Database Models

- **User** — name, email, password (bcrypt), phone, role (customer/vendor/admin/staff), addresses, wishlist, status
- **Vendor** — userId, storeName, logo, banner, businessDetails, approvalStatus, rating, commission
- **Category** — name, slug, image, parent, sector, order
- **Product** — vendorId, title, slug, description, images, price, discountPrice, stock, variants, categoryId, rating, status, approvalStatus
- **Cart** — userId, items[{productId, variant, qty, priceAtAdd}]
- **Order** — userId, items[], vendorSplits[], totals, address, paymentMode, paymentStatus, orderStatus, timeline
- **Enquiry** — customerId, vendorId, productId?, subject, message, replies[], status
- **Review** — userId, productId, rating, title, body, status
- **Coupon** — code, type, value, minOrder, usageLimit, validity
- **CmsPage** — slug, title, sections[], seo
- **Setting** — singleton doc (logo, tax, shipping, commission, payment, maintenance)
- **ActivityLog** — actor, action, target, meta, timestamp
- **Notification** — recipient, type, message, read, createdAt

See `docs/erd.md` for the ERD.

## Deployment

- **API:** Render / Railway / Fly.io. Set env vars from `.env.example`. Attach MongoDB Atlas.
- **Web / Admin:** Vercel or Netlify. Set `VITE_API_URL` to the deployed API URL.

## Scripts

| Command             | What it does                              |
|---------------------|-------------------------------------------|
| `npm run dev:api`   | Start API in watch mode                    |
| `npm run dev:web`   | Start customer site                        |
| `npm run dev:admin` | Start admin/vendor dashboard               |
| `npm run seed`      | Wipe + seed the database                   |
| `npm run build`     | Build all apps                             |

## Non-Negotiables Coverage

- ✅ Database for all important data
- ✅ Reusable components + API-driven content (CMS)
- ✅ Protected routes (frontend + backend role guards)
- ✅ 30+ products, 5 categories, 3 vendors, 10 customers, 15 orders/enquiries seeded
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Env variables — no committed secrets
- ✅ README + demo credentials

## License
MIT — JIET MERN Internship educational project.
