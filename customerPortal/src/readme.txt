Customer Portal — CS110 Project

Pages:
  /              → CustomerDashboard  (requires login)
  /browse        → CustomerBrowse     (live listings from API)
  /browse/listing/:id    → CustomerListingDetail
  /browse/merchant/:id   → CustomerMerchantProfile
  /orders        → CustomerOrders
  /messages      → CustomerMessageBoard
  /messages/:id  → CustomerMessageDetails
  /favorites     → CustomerFavorites
  /cart          → CustomerCart       (local state only, no backend needed)
  /login         → CustomerLogin
  /register      → CustomerRegister

Infrastructure added:
  src/customer/api.js           — fetch wrapper + all API calls
  src/customer/AuthContext.jsx  — login / register / logout / session restore
  src/customer/components/
    ProtectedRoute.jsx          — redirects to /login if not authenticated
    CustomerLayout.jsx          — sidebar nav (mirrors MerchantLayout)