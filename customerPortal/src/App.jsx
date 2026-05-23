import { BrowserRouter, Routes, Route }
from "react-router-dom";

import CustomerDashboard
from "./customer/pages/customerDashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<CustomerDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
