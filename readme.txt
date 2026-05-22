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

How to run (local)
------------------
  1. cd server && npm install && cp .env.example .env
     (start MongoDB locally, then:)
     npm run seed     # creates admin@cs110.test / admin123
     npm run dev      # http://localhost:5050

  2. cd adminPortal && npm install && npm run dev
     # http://localhost:5174   (proxies /api to the backend)
