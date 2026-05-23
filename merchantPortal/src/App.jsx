import { BrowserRouter, Routes, Route, Navigate }
from "react-router-dom";

import { AuthProvider }
from "./merchant/AuthContext.jsx";

import ProtectedRoute
from "./merchant/components/ProtectedRoute.jsx";

import MerchantLayout
from "./merchant/components/MerchantLayout.jsx";

import MerchantDashboard
from "./merchant/pages/MerchantDashboard.jsx";

import MerchantLogin
from "./merchant/pages/MerchantLogin.jsx";

import MerchantListingDisplay
from "./merchant/pages/MerchantListingDisplay.jsx";

import MerchantOrders
from "./merchant/pages/MerchantOrders.jsx";

import MerchantFinances
from "./merchant/pages/MerchantFinances.jsx";

import MerchantProfile
from "./merchant/pages/MerchantProfile.jsx";

function App() {

    return (

        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/login"
                        element={<MerchantLogin />}
                    />

                    <Route
                        element={
                            <ProtectedRoute>
                                <MerchantLayout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="/"
                            element={<MerchantDashboard />}
                        />

                        <Route
                            path="/listings"
                            element={<MerchantListingDisplay />}
                        />

                        <Route
                            path="/orders"
                            element={<MerchantOrders />}
                        />

                        <Route
                            path="/finances"
                            element={<MerchantFinances />}
                        />

                        <Route
                            path="/profile"
                            element={<MerchantProfile />}
                        />

                    </Route>

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}

export default App;