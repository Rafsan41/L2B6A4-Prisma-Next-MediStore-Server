# MediStore Backend

**"Your Trusted Online Medicine Shop"**

A RESTful API backend for MediStore — a full-stack OTC (over-the-counter) medicine e-commerce platform. Built with Express, TypeScript, Prisma ORM, and better-auth.

---

## Live Links

- **Backend Live**: https://medistores.vercel.app
- **Backend Repo**: https://github.com/Rafsan41/L2B6A4-Prisma-Next-MediStore-Server

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medistores.com | admin123456 |
| Seller | rafsundipto116@gmail.com | rafsan1234 |
| Customer | zayan@gmail.com | zayan1234 |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Express 5** | HTTP server & routing |
| **TypeScript 6** | Type safety |
| **Prisma 7** | ORM & database migrations |
| **PostgreSQL** | Relational database (Neon DB) |
| **better-auth 1.5** | Authentication (email/password + Google OAuth) |
| **Nodemailer** | Email verification |
| **CORS** | Cross-origin requests |
| **Vercel** | Serverless deployment |

---

## Project Structure

```
src/
├── lib/
│   ├── auth.ts                # better-auth config (email, Google OAuth, email verification)
│   ├── authMiddleware.ts      # requireAuth() middleware + UserRole enum
│   └── prisma.ts              # Prisma client instance
├── middlewares/
│   ├── globalErrorHandler.ts  # Centralized error handling middleware
│   └── notFound.ts            # 404 handler for unknown routes
├── modules/
│   ├── admin/                 # Admin panel (users, medicines, orders, categories, stats)
│   ├── category/              # Category CRUD
│   ├── medicine/              # Public medicine listing & detail
│   ├── order/                 # Customer order management
│   ├── review/                # Medicine reviews
│   ├── seller/                # Seller medicine, order & dashboard management
│   ├── sellerReview/          # Seller reviews with reply support
│   └── user/                  # Customer profile & dashboard
├── routes/
│   └── index.ts               # Central route aggregator
├── scripts/
│   └── seedAdmin.ts           # Seed admin user script
├── app.ts                     # Express app setup & middleware registration
└── server.ts                  # Server entry point
```

Each module strictly follows **MVC pattern**:
- `*.service.ts` — Prisma/business logic only
- `*.controller.ts` — Request/response handling (uses `next(error)` for centralized error handling)
- `*.router.ts` — Route definitions + auth middleware

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Rafsan41/L2B6A4-Prisma-Next-MediStore-Server.git
cd L2B6A4-Prisma-Next-MediStore-Server
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# App
PORT=5000
APP_URL="http://localhost:3000"

# Email (Gmail SMTP)
APP_USER_EMAIL="your-email@gmail.com"
APP_USER_PASS="your-app-password"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# better-auth
BETTER_AUTH_SECRET="your-secret-key"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed admin user
npm run seed:admin
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Roles & Permissions

| Role | Description |
|------|-------------|
| **CUSTOMER** | Browse medicines, place/cancel orders, leave reviews, manage profile, view dashboard stats |
| **SELLER** | Add/edit/remove medicines, manage orders, view dashboard & customer stats |
| **ADMIN** | Full platform oversight — manage users, medicines, orders, categories, view statistics |

---

## API Reference

Base URL: `https://medistores.vercel.app/api`

---

### Authentication
> Handled by **better-auth** at `/api/auth/*`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register new user |
| POST | `/api/auth/sign-in/email` | Login user |
| GET | `/api/auth/get-session` | Get current session |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

> Email verification is required before login.

---

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/medicines` | Get all medicines (with filters) |
| GET | `/api/medicines/:id` | Get medicine detail + reviews |
| GET | `/api/medicines/:id/reviews` | Get reviews for a medicine |
| GET | `/api/seller-reviews/:sellerId` | Get reviews for a seller |

**Medicine query filters:**
```
?search=paracetamol
&category=pain-relief        (slug or id)
&manufacturer=Square Pharma
&minPrice=5
&maxPrice=100
&page=1
&limit=10
```

---

### Customer Routes
> Requires login as **CUSTOMER**

#### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get my profile |
| PATCH | `/api/profile` | Update profile (name, image, phones) |

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | Get my orders |
| GET | `/api/orders/:id` | Get order details |
| PATCH | `/api/orders/:id/cancel` | Cancel order (PLACED status only) |

**Place order body:**
```json
{
  "items": [
    { "medicineId": "uuid", "quantity": 2 }
  ],
  "shippingAddress": "123 Main Street",
  "shippingCity": "Dhaka",
  "shippingPostalCode": "1200",
  "paymentMethod": "CASH_ON_DELIVERY",
  "notes": "Optional note"
}
```

#### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medicines/:id/reviews` | Leave a medicine review (one per medicine) |
| POST | `/api/seller-reviews` | Leave a seller review (with reply support) |

**Medicine review body:**
```json
{
  "rating": 5,
  "comment": "Great medicine!",
  "orderId": "uuid"
}
```

**Seller review body:**
```json
{
  "sellerId": "uuid",
  "rating": 4,
  "comment": "Fast delivery!",
  "parentId": "uuid (optional, for replies)"
}
```

#### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customer/dashboard-stats` | Get customer dashboard statistics |
| GET | `/api/customer/seller-stats` | Get stats about sellers customer bought from |

---

### Seller Routes
> Requires login as **SELLER**

#### Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seller/medicines` | Add a medicine |
| PUT | `/api/seller/medicines/:id` | Update own medicine |
| DELETE | `/api/seller/medicines/:id` | Remove medicine (soft delete) |

**Add medicine body:**
```json
{
  "name": "Paracetamol 500mg",
  "slug": "paracetamol-500mg",
  "description": "Pain relief and fever reducer",
  "price": 5.99,
  "stock": 100,
  "manufacturer": "Square Pharma",
  "categoryId": "uuid",
  "dosage": "500mg",
  "form": "Tablet",
  "prescriptionRequired": false
}
```

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seller/orders` | Get incoming orders |
| PATCH | `/api/seller/orders/:id` | Update order status |

**Order status flow:**
```
PLACED -> PROCESSING -> SHIPPED -> DELIVERED
PLACED -> CANCELLED
```

**Update status body:**
```json
{ "status": "PROCESSING" }
```

#### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seller/dashboard-stats` | Get seller dashboard statistics |
| GET | `/api/seller/customer-stats` | Get stats about seller's customers |

---

### Admin Routes
> Requires login as **ADMIN**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status (ACTIVE, BANNED, SUSPENDED) |
| GET | `/api/admin/medicines` | Get all medicines (incl. inactive) |
| GET | `/api/admin/orders` | Get all orders |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| GET | `/api/admin/statistics` | Get admin dashboard statistics |

**Update user status body:**
```json
{ "status": "BANNED" }
```

---

## Database Schema

| Model | Key Fields |
|-------|-----------|
| **User** | id, name, email, role, status, phones |
| **Category** | id, name, slug, description, image |
| **Medicine** | id, name, slug, price, stock, sellerId, categoryId, isActive |
| **Order** | id, orderNumber, status, total, shippingAddress, customerId |
| **OrderItem** | orderId, medicineId, quantity, unitPrice, subtotal |
| **SellerOrder** | orderId, sellerId, status |
| **Review** | id, rating, comment, customerId, medicineId, orderId |
| **SellerReview** | id, rating, comment, customerId, sellerId, parentId |

---

## Error Handling

All errors are handled centrally through `globalErrorHandler` middleware using `next(error)` pattern. No individual controller manages its own error responses.

**Success response:**
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

**Error response:**
```json
{
  "success": false,
  "message": "...",
  "error": "..."
}
```

| HTTP Code | Meaning | Error Type |
|-----------|---------|------------|
| 200 | OK | — |
| 201 | Created | — |
| 400 | Bad request | `PrismaClientValidationError`, JSON SyntaxError, invalid input |
| 401 | Unauthorized | Not logged in / email not verified |
| 403 | Forbidden | Wrong role / ownership violation |
| 404 | Not found | `PrismaClientKnownRequestError` (P2025), resource not found, inactive |
| 409 | Conflict | `PrismaClientKnownRequestError` (P2002), status transition, insufficient stock |
| 500 | Internal server error | `PrismaClientUnknownRequestError`, unexpected errors |
| 503 | Service unavailable | `PrismaClientInitializationError` (DB connection failed) |

---

## Author

**Rafsan Jani Dipta**
