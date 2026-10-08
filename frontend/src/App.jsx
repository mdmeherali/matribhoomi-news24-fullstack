import React, { useState } from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";

import Navbar from "./components/Navbar.jsx";
import LiveNews from "./components/LiveNews.jsx";
import Footer from "./components/Footer.jsx";

// নতুন ৫টি পেজ
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Terms from "./pages/Terms.jsx";


function App() {

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState("সব");


    return (

        <Router>

            <div className="app">

                {/* ================= NAVBAR ================= */}
                <Navbar
                    selectedCategory={
                        selectedCategory
                    }

                    setSelectedCategory={
                        setSelectedCategory
                    }
                />


                {/* ================= MAIN CONTENT ================= */}

                <Routes>

                    {/* Home */}
                    <Route
                        path="/"
                        element={
                            <Home
                                selectedCategory={
                                    selectedCategory
                                }
                            />
                        }
                    />


                    {/* Admin Dashboard */}
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard />
                        }
                    />


                    {/* News Detail */}
                    <Route
                        path="/news/:id"
                        element={
                            <NewsDetail />
                        }
                    />


                    {/* Privacy Policy */}
                    <Route
                        path="/privacy-policy"
                        element={
                            <PrivacyPolicy />
                        }
                    />


                    {/* About Us */}
                    <Route
                        path="/about-us"
                        element={
                            <AboutUs />
                        }
                    />


                    {/* Contact Us */}
                    <Route
                        path="/contact-us"
                        element={
                            <ContactUs />
                        }
                    />


                    {/* Disclaimer */}
                    <Route
                        path="/disclaimer"
                        element={
                            <Disclaimer />
                        }
                    />


                    {/* Terms & Conditions */}
                    <Route
                        path="/terms"
                        element={
                            <Terms />
                        }
                    />

                </Routes>


                {/* ================= LIVE NEWS ================= */}
                <LiveNews />


                {/* ================= FOOTER ================= */}
                <Footer />

            </div>

        </Router>
    );
}


export default App;