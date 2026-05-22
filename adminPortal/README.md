# CS110 Marketplace - Admin Portal

React + Vite app for the marketplace admins. Talks to the Node.js API in
`../server`.

## Setup

1. Install dependencies:

   ```bash
   cd adminPortal
   npm install
   ```

2. Make sure the backend is running on port `5050` (see `../server/README.md`):

   ```bash
   cd ../server
   npm install
   npm run seed       # creates the default admin@cs110.test / admin123
   npm run dev
   ```

3. Start the admin frontend:

   ```bash
   cd ../adminPortal
   npm run dev
   ```

   Vite serves the app at `http://localhost:5174` and proxies `/api/*` calls
   to the backend.

## Default admin account

After running `npm run seed` in `server/`:

- email: `admin@cs110.test`
- password: `admin123`

## Pages

- `/login` - admin login
- `/` - dashboard with system stats
- `/users` - list/search users; deactivate, reactivate, reset password, delete
- `/merchants` - list merchants; deactivate (cascades to their listings)
- `/listings` - all listings; deactivate / reactivate / delete
- `/categories` - manage product categories (create / rename / delete)
- `/logs` - audit log of every admin action
