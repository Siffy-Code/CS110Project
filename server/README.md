# CS110 Marketplace - Backend (Job C: Database / Admin)

Node.js + Express + MongoDB API that powers the admin portal and provides
data for the merchant and customer portals.

## Stack

- Node.js / Express
- MongoDB via Mongoose
- JWT auth (admin / merchant / customer roles)
- bcryptjs for password hashing

## Project layout

```
server/
  server.js               # entry point
  config/db.js            # MongoDB connection
  middleware/auth.js      # JWT + role guards
  models/                 # Mongoose schemas
  routes/
    auth.js               # POST /api/auth/login, /register
    admin.js              # all admin debug endpoints
    public.js             # read-only endpoints used by other portals
  scripts/seed.js         # seed sample data
```

## Setup

1. Install dependencies:

   ```bash
   cd server
   npm install
   ```

2. Make sure MongoDB is running locally (or use a MongoDB Atlas URI).

3. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

4. Seed the database with sample admin / merchants / users / listings:

   ```bash
   npm run seed
   ```

   This creates a default admin account:
   - email: `admin@cs110.test`
   - password: `admin123`

5. Start the API:

   ```bash
   npm run dev      # auto-reload with nodemon
   # or
   npm start
   ```

   The server listens on `http://localhost:5050` by default.

## Admin endpoints (require role=admin)

All admin routes are mounted under `/api/admin` and require an
`Authorization: Bearer <token>` header from a user with role `admin`.

| Method | Path                                  | Purpose                                          |
| ------ | ------------------------------------- | ------------------------------------------------ |
| GET    | `/api/admin/users`                    | List all customer/merchant/admin user accounts.  |
| GET    | `/api/admin/users/:id`                | Get one user.                                    |
| PATCH  | `/api/admin/users/:id/deactivate`     | Deactivate (soft-disable) a user account.        |
| PATCH  | `/api/admin/users/:id/reactivate`     | Re-enable a user account.                        |
| POST   | `/api/admin/users/:id/reset-password` | Force-reset a user's password.                   |
| DELETE | `/api/admin/users/:id`                | Hard-delete a user (debug).                      |
| GET    | `/api/admin/merchants`                | List all merchants.                              |
| PATCH  | `/api/admin/merchants/:id/deactivate` | Deactivate a merchant (also hides its listings). |
| GET    | `/api/admin/listings`                 | List all listings (filter by merchant/active).   |
| POST   | `/api/admin/listings`                 | Create a listing on any merchant's behalf.       |
| PATCH  | `/api/admin/listings/:id/deactivate`  | Deactivate a listing.                            |
| PATCH  | `/api/admin/listings/:id/reactivate`  | Re-enable a listing.                             |
| GET    | `/api/admin/categories`               | List product categories.                         |
| POST   | `/api/admin/categories`               | Create a new category.                           |
| PATCH  | `/api/admin/categories/:id`           | Rename / edit a category.                        |
| DELETE | `/api/admin/categories/:id`           | Remove a category.                               |
| GET    | `/api/admin/logs`                     | View the most recent admin actions.              |
| GET    | `/api/admin/stats`                    | Aggregate counts for the admin dashboard.        |

## Auth endpoints

| Method | Path                  | Purpose                              |
| ------ | --------------------- | ------------------------------------ |
| POST   | `/api/auth/register`  | Create a new customer/merchant user. |
| POST   | `/api/auth/login`     | Returns a JWT and the user object.   |
| GET    | `/api/auth/me`        | Returns the current logged-in user.  |

## Merchant endpoints (require role=merchant)

These let a merchant manage *their own* listings. The merchant portal calls
these; they always operate on the merchant tied to the logged-in user.

| Method | Path                            | Purpose                                  |
| ------ | ------------------------------- | ---------------------------------------- |
| GET    | `/api/merchant/me`              | Get the merchant profile for this user.  |
| GET    | `/api/merchant/listings`        | List the merchant's own listings.        |
| POST   | `/api/merchant/listings`        | Create a new listing.                    |
| PATCH  | `/api/merchant/listings/:id`    | Edit a listing the merchant owns.        |
| DELETE | `/api/merchant/listings/:id`    | Delete a listing the merchant owns.      |

A merchant **can't** edit or un-hide a listing that an admin deactivated; the
admin has to reactivate it first.
