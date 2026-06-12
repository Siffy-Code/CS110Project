# CS110 Marketplace - Customer Portal

React + Vite app for marketplace customers. Talks to the Node.js API in
`../server`.

## Setup

Run these in order:

1. Install and start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. Seed the database (in a new terminal, while the server is running):
   ```bash
   cd server
   npm run seed
   ```

3. Install and start the customer portal:
   ```bash
   cd customerPortal
   npm install
   npm run dev
   ```

   Vite serves the app at `http://localhost:5174` and proxies `/api/*` calls
   to the backend on port `5050`.

## Pages

- `/login` — customer login
- `/register` — create a new customer account
- `/` — dashboard with links to all sections
- `/browse` — search and filter active marketplace listings by category
- `/browse/listing/:id` — listing detail view
- `/browse/merchant/:id` — merchant public profile with listings, message form, favorite button, and review form
- `/orders` — purchase history and order status
- `/messages` — inbox of conversations with merchants
- `/messages/:id` — read and reply to a conversation thread
- `/favorites` — saved merchants for quick access
- `/cart` — review items and checkout (payment disabled per project spec)

## Notes

- Payment/checkout is intentionally disabled for this project
- Reviews are UI-only and not connected to the backend
- The message system uses a shared database with the merchant portal