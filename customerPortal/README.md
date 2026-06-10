# CS110 Marketplace - Customer Portal

React + Vite app for marketplace customers. Talks to the Node.js API in
`../server`.

## Setup

1. Install dependencies:

   ```bash
   cd customerPortal
   npm install
   ```

2. Make sure the backend is running on port `5000` (see `../server/README.md`):

   ```bash
   cd ../server
   npm install
   npm run seed
   npm run dev
   ```

3. Start the customer frontend:

   ```bash
   cd ../customerPortal
   npm run dev
   ```

   Vite serves the app at `http://localhost:5174` and proxies `/api/*` calls
   to the backend.

## Pages

- `/login` — customer login
- `/register` — create a new customer account
- `/` — dashboard with links to all sections
- `/browse` — search and filter active marketplace listings by category
- `/browse/listing/:id` — listing detail view
- `/browse/merchant/:id` — merchant public profile with listings and review form
- `/orders` — purchase history and order status
- `/messages` — inbox of conversations with merchants and support
- `/messages/:id` — read and reply to a conversation thread
- `/favorites` — saved merchants for quick access
- `/cart` — review items and checkout (payment alert only, per project spec)
