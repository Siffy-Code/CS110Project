import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./customer/AuthContext.jsx";
import { CartProvider } from "./customer/CartContext.jsx";
import ProtectedRoute from "./customer/components/ProtectedRoute.jsx";
import CustomerLayout from "./customer/components/CustomerLayout.jsx";

import CustomerDashboard from "./customer/pages/customerDashboard";
import CustomerLogin from "./customer/pages/customerLogin";
import CustomerRegister from "./customer/pages/customerRegister";
import CustomerBrowse from "./customer/pages/customerBrowse";
import CustomerOrders from "./customer/pages/customerOrders";
import CustomerMessageBoard from "./customer/pages/customerMessageBoard";
import CustomerMessageDetails from "./customer/pages/customerMessageDetails";
import CustomerFavorites from "./customer/pages/customerFavorites";
import CustomerCart from "./customer/pages/customerCart";
import CustomerMerchantProfile from "./customer/pages/customerMerchantProfile";
import CustomerListingDetail from "./customer/pages/customerListingDetail";

function App() {

    return (

        <AuthProvider>
            <CartProvider>

                <BrowserRouter>

                    <Routes>

                        <Route path="/login" element={<CustomerLogin />} />
                        <Route path="/register" element={<CustomerRegister />} />

                        <Route
                            element={
                                <ProtectedRoute>
                                    <CustomerLayout />
                                </ProtectedRoute>
                            }
                        >

                            <Route path="/" element={<CustomerDashboard />} />
                            <Route path="/browse" element={<CustomerBrowse />} />
                            <Route path="/browse/listing/:id" element={<CustomerListingDetail />} />
                            <Route path="/browse/merchant/:id" element={<CustomerMerchantProfile />} />
                            <Route path="/orders" element={<CustomerOrders />} />
                            <Route path="/messages" element={<CustomerMessageBoard />} />
                            <Route path="/messages/:id" element={<CustomerMessageDetails />} />
                            <Route path="/favorites" element={<CustomerFavorites />} />
                            <Route path="/cart" element={<CustomerCart />} />

                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>

                </BrowserRouter>

            </CartProvider>
        </AuthProvider>
    );
}

export default App;