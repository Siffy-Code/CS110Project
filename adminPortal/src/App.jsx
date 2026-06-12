import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./admin/AuthContext.jsx";
import ProtectedRoute from "./admin/components/ProtectedRoute.jsx";
import AdminLayout from "./admin/components/AdminLayout.jsx";

import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminUsers from "./admin/pages/AdminUsers.jsx";
import AdminMerchants from "./admin/pages/AdminMerchants.jsx";
import AdminListings from "./admin/pages/AdminListings.jsx";
import AdminListingDetail from "./admin/pages/AdminListingDetail.jsx";
import AdminCategories from "./admin/pages/AdminCategories.jsx";
import AdminLogs from "./admin/pages/AdminLogs.jsx";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<AdminLogin />} />

                    <Route
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/merchants" element={<AdminMerchants />} />
                        <Route path="/listings" element={<AdminListings />} />
                        <Route path="/listings/:id" element={<AdminListingDetail />} />
                        <Route path="/categories" element={<AdminCategories />} />
                        <Route path="/logs" element={<AdminLogs />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
