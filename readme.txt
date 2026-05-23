CS110 Marketplace - group project
=================================

Folders
-------
  merchantPortal/   Merchant-side React app (Job A/B teammate).
  adminPortal/      Admin React app (Job C - Nathan).
  server/           Node.js + Express + MongoDB API (Job C - Nathan).
  Links/            Shared Drive link.

Job C (Database / Admin) - what's in here
-----------------------------------------
  server/
    Node.js + Express + Mongoose backend.
    - models/      User, Merchant, Listing, Category, Order, AdminLog.
    - routes/auth.js     login / register / me (JWT + bcrypt).
    - routes/admin.js    admin debug endpoints (admin role required):
                           - deactivate / reactivate / reset-password / delete users
                           - deactivate merchants (cascades to their listings)
                           - deactivate / reactivate / delete service listings
                           - create / edit / delete product categories
                           - audit log of every admin action
                           - dashboard stats
    - routes/public.js   read-only listings + categories for the other portals.
    - scripts/seed.js    seed sample admin / merchants / users / listings.
    - .env.example       template (PORT, MONGO_URI, JWT_SECRET).

  adminPortal/
    React + Vite admin frontend that calls /api/admin/*.
    Pages: Login, Dashboard, Users, Merchants, Listings, Categories, Logs.

How to run (local, quick-start)
------------------
  1. cd server && npm install && cp .env.example .env
     (start MongoDB locally, then:)
     npm run seed     # creates admin@cs110.test / admin123
     npm run dev      # http://localhost:5050

  2. cd adminPortal && npm install && npm run dev
     # http://localhost:5174   (proxies /api to the backend)
==================================================
EXPANDED DETAILS AND INSTRUCTIONS (*NOT* THE TLDR)
==================================================
# CS110 Marketplace Project

## Project Description

This project is a distributed marketplace platform designed to connect customers with merchants offering computing and data-processing services. The application simulates a modern service marketplace where merchants can create and manage listings, customers can browse and purchase services, and administrators can moderate the platform and manage users.

The system was developed using a full-stack architecture with React for the frontend, Express/Node.js for the backend, and MongoDB for database storage.

The project contains three primary portals:

* Admin Portal
* Merchant Portal
* Customer Portal

---

# Technologies Used

## Frontend

* React
* React Router DOM
* Vite
* CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

## Database

* MongoDB
* Mongoose

---

# Features Currently Working

## Admin Portal

Working Features:

* Admin login/authentication
* Protected admin routes
* Merchant management
* Listing moderation
* Category management
* Dashboard navigation
* MongoDB integration
* JWT-based authorization
* Audit/admin logging system

## Merchant Portal

Working Features:

* Merchant authentication system
* Protected merchant routes
* Merchant dashboard
* Merchant profile editing
* Listing management
* Listing editing/deletion
* Category integration
* Backend API integration
* MongoDB-connected merchant data

## Customer Portal

Working Features:

* Customer frontend layouts/pages
* Browse services UI
* Cart UI
* Merchant profile UI
* Customer dashboard
* Favorites page
* Orders page
* Messaging UI
* Login/Register UI

Customer portal backend integration is partially complete and currently still uses placeholder/mock data for several pages.

---

# How To Run The Project

## 1. Install Dependencies

### Backend

Open terminal:

```bash
cd server
npm install
```

### Frontend Portals

Each portal has its own frontend.

Example:

```bash
cd merchantPortal
npm install
```

Repeat for:

* adminPortal
* customerPortal

---

# 2. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5050

MONGO_URI=mongodb://127.0.0.1:27017/cs110_marketplace

JWT_SECRET=replace-me-with-a-long-random-string

JWT_EXPIRES_IN=7d
```

---

# 3. Seed The Database

Inside the `server` directory:

```bash
npm run seed
```

This creates sample:

* admins
* merchants
* listings
* categories
* orders

---

# 4. Start Backend Server

Inside `server`:

```bash
npm run dev
```

or:

```bash
node server.js
```

Backend runs on:

```txt
http://localhost:5050
```

---

# 5. Start Frontend

Example for Merchant Portal:

```bash
cd merchantPortal
npm run dev
```

Repeat similarly for:

* adminPortal
* customerPortal

Frontend typically runs on:

```txt
http://localhost:5173
```

---

# Demo Accounts

## Admin

Email:

```txt
admin@cs110.test
```

Password:

```txt
admin123
```

## Merchant

Email:

```txt
maria@shop.test
```

Password:

```txt
merchant123
```

---placeholder/mock data and require additional backend integration in future development.
