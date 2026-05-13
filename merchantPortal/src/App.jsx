import { BrowserRouter, Routes, Route }
from "react-router-dom";

import MerchantDashboard
from "./merchant/pages/MerchantDashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<MerchantDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;