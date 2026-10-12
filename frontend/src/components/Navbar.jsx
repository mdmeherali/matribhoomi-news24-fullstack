import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ========================================
// CATEGORIES
// ========================================

const categories = [
    "জাতীয়",
    "রাজনীতি",
    "অর্থনীতি",
    "আন্তর্জাতিক",
    "খেলা",
    "বিনোদন",
    "প্রযুক্তি",
    "লাইফস্টাইল"
];


// ========================================
// NAVBAR
// ========================================

const Navbar = ({
    selectedCategory,
    setSelectedCategory
}) => {

    // ========================================
    // DATE & TIME
    // ========================================

    const [currentDateTime, setCurrentDateTime] =
        useState(new Date());


    // প্রতি ১ সেকেন্ডে সময় আপডেট হবে
    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentDateTime(new Date());

        }, 1000);


        return () => {
            clearInterval(timer);
        };

    }, []);


    // ========================================
    // BANGLA DATE
    // ========================================

    const banglaDate =
        currentDateTime.toLocaleDateString(
            "bn-BD",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Dhaka"
            }
        );


    // ========================================
    // BANGLA TIME
    // ========================================

    const banglaTime =
        currentDateTime.toLocaleTimeString(
            "bn-BD",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Asia/Dhaka"
            }
        ); 
 



    // ========================================
    // SUBSCRIBE STATES
    // ========================================

    const [showSubscribe, setShowSubscribe] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [subscribeMessage, setSubscribeMessage] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    // ========================================
    // CATEGORY
    // ========================================

    const handleCategory = (category) => {

        setSelectedCategory(category);

    };


    // ========================================
    // SUBSCRIBE
    // ========================================

    const handleSubscribe = async (e) => {

        e.preventDefault();


        if (!email.trim()) {

            setSubscribeMessage(
                "ইমেইল ঠিকানা দিন"
            );

            return;
        }


        try {

            setSubmitting(true);

            setSubscribeMessage("");


            const response = await fetch(
                "http://localhost:https://matribhoomi-news24-fullstack.onrender.com/api/stats/subscribe",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim()
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setSubscribeMessage(
                    data.message ||
                    "Subscribe করা যায়নি"
                );

                return;
            }


            setSubscribeMessage(
                "✅ সফলভাবে Subscribe করেছেন"
            );

            setEmail("");


            setTimeout(() => {

                setShowSubscribe(false);

                setSubscribeMessage("");

            }, 2000);


        } catch (error) {

            console.error(
                "Subscribe error:",
                error
            );


            setSubscribeMessage(
                "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না"
            );


        } finally {

            setSubmitting(false);

        }

    };


    // ========================================
    // RETURN
    // ========================================

    return (
        <>


            {/* =================================
                TOP BAR
            ================================= */}

            <div className="top-bar">

                <div className="site-container top-bar-inner">


                    {/* DATE */}

                    <div className="top-date">
                        📅 {banglaDate}
                    </div>


                    {/* TIME */}

                    <div className="top-time">
                        🕐 {banglaTime}
                    </div>


                    {/* TOP LINKS */}

                    <div className="top-links">

                        <span>বাংলাদেশ</span>

                        <span>জাতীয়</span>

                        <span>রাজনীতি</span>

                        <span>অর্থনীতি</span>

                        <span>আন্তর্জাতিক</span>

                        <span>খেলা</span>

                        <span>বিনোদন</span>

                        <span>প্রযুক্তি</span>

                    </div>

                </div>

            </div>



            {/* =================================
                HEADER
            ================================= */}

            <header className="header">

                <div className="site-container header-inner">


                    {/* LOGO */}

                    <Link
                        to="/"
                        className="logo-link"

                        onClick={() =>
                            handleCategory("সব")
                        }
                    >

                        <img
                            src="/logo.png"
                            alt="মাতৃভূমি নিউজ ২৪"
                            className="main-logo"
                        />

                    </Link>



                    {/* RIGHT */}

                    <div className="header-right">


                        {/* SEARCH */}

                        <div className="search-box">

                            <input
                                type="text"
                                placeholder="খবর খুঁজুন..."
                            />

                            <button type="button">
                                🔍
                            </button>

                        </div>



                        {/* SUBSCRIBE */}

                        <button
                            type="button"
                            className="subscribe-button"

                            onClick={() =>
                                setShowSubscribe(true)
                            }
                        >

                            🔔 Subscribe

                        </button>



                        {/* ADMIN */}

                        <Link
                            to="/admin"
                            className="admin-button"
                        >

                            ⚙ অ্যাডমিন

                        </Link>

                    </div>

                </div>

            </header>



            {/* =================================
                NAVIGATION
            ================================= */}

            <nav className="main-nav">

                <div className="site-container nav-inner">


                    {/* HOME ICON */}

                    <Link
                        to="/"

                        className={
                            selectedCategory === "সব"
                                ? "home-button active"
                                : "home-button"
                        }

                        onClick={() =>
                            handleCategory("সব")
                        }
                    >

                        🏠

                    </Link>



                    {/* HOME */}

                    <button
                        type="button"

                        className={
                            selectedCategory === "সব"
                                ? "nav-item active"
                                : "nav-item"
                        }

                        onClick={() =>
                            handleCategory("সব")
                        }
                    >

                        হোম

                    </button>



                    {/* CATEGORIES */}

                    {categories.map(
                        (category) => (

                            <button
                                type="button"
                                key={category}

                                className={
                                    selectedCategory ===
                                    category
                                        ? "nav-item active"
                                        : "nav-item"
                                }

                                onClick={() =>
                                    handleCategory(
                                        category
                                    )
                                }
                            >

                                {category}

                            </button>

                        )
                    )}

                </div>

            </nav>



            {/* =================================
                SUBSCRIBE MODAL
            ================================= */}

            {showSubscribe && (

                <div
                    className="subscribe-overlay"

                    onClick={() =>
                        setShowSubscribe(false)
                    }
                >

                    <div
                        className="subscribe-modal"

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* CLOSE */}

                        <button
                            type="button"
                            className="subscribe-close"

                            onClick={() =>
                                setShowSubscribe(false)
                            }
                        >

                            ×

                        </button>



                        {/* ICON */}

                        <div className="subscribe-icon">
                            🔔
                        </div>



                        <h2>
                            মাতৃভূমি নিউজ ২৪
                        </h2>



                        <p>
                            নতুন খবর সবার আগে পেতে
                            Subscribe করুন।
                        </p>



                        {/* FORM */}

                        <form
                            onSubmit={handleSubscribe}
                        >

                            <input
                                type="email"
                                placeholder="আপনার ইমেইল"

                                value={email}

                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }

                                required
                            />



                            <button
                                type="submit"
                                disabled={submitting}
                            >

                                {submitting
                                    ? "অপেক্ষা করুন..."
                                    : "Subscribe করুন"
                                }

                            </button>

                        </form>



                        {/* MESSAGE */}

                        {subscribeMessage && (

                            <div className="subscribe-message">

                                {subscribeMessage}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </>
    );
};


export default Navbar;