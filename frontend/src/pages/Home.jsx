import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


const API_URL =
    "http://localhost:https://matribhoomi-news24-fullstack.onrender.com/api";


const Home = ({
    selectedCategory
}) => {

    const navigate = useNavigate();

    const [newsList, setNewsList] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // VISITOR TRACKING
    // ========================================

    useEffect(() => {

        const trackVisitor = async () => {

            try {

                await fetch(
                    `${API_URL}/stats/visit`,
                    {
                        method: "POST"
                    }
                );

            } catch (error) {

                console.error(
                    "Visitor tracking error:",
                    error
                );
            }
        };


        trackVisitor();

    }, []);


    // ========================================
    // LOAD NEWS
    // ========================================

    useEffect(() => {

        const loadNews = async () => {

            try {

                setLoading(true);

                setError("");


                let url =
                    `${API_URL}/news`;


                if (
                    selectedCategory &&
                    selectedCategory !== "সব"
                ) {

                    url =
                        `${API_URL}/news?category=` +
                        encodeURIComponent(
                            selectedCategory
                        );
                }


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "নিউজ লোড করা যায়নি"
                    );
                }


                const data =
                    await response.json();


                if (Array.isArray(data)) {

                    setNewsList(data);

                } else if (
                    Array.isArray(data.news)
                ) {

                    setNewsList(data.news);

                } else {

                    setNewsList([]);
                }


            } catch (err) {

                console.error(
                    "News loading error:",
                    err
                );

                setError(
                    "নিউজ লোড করতে সমস্যা হয়েছে।"
                );

                setNewsList([]);

            } finally {

                setLoading(false);
            }
        };


        loadNews();

    }, [selectedCategory]);


    return (

        <main className="news-page">

            <div className="site-container">


                {/* TITLE */}

                <div className="page-title">

                    <h1>

                        {selectedCategory === "সব"
                            ? "সর্বশেষ খবর"
                            : selectedCategory
                        }

                    </h1>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="loading-box">

                        সর্বশেষ খবর লোড হচ্ছে...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="error-box">

                        {error}

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    newsList.length === 0 && (

                        <div className="empty-box">

                            এই ক্যাটাগরিতে কোনো নিউজ
                            পাওয়া যায়নি।

                        </div>
                    )}


                {/* NEWS */}

                {!loading &&
                    !error &&
                    newsList.length > 0 && (

                        <div className="news-grid">

                            {newsList.map(
                                (news) => (

                                    <article
                                        key={news.id}
                                        className="news-card"
                                        onClick={() =>
                                            navigate(
                                                `/news/${news.id}`
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >


                                        {/* IMAGE */}

                                        {news.image_url && (

                                            <img
                                                src={
                                                    `http://localhost:https://matribhoomi-news24-fullstack.onrender.com${news.image_url}`
                                                }

                                                alt={
                                                    news.title
                                                }

                                                className="news-image"
                                            />

                                        )}


                                        <div className="news-content">


                                            {/* CATEGORY */}

                                            {news.category && (

                                                <span className="news-category">

                                                    {
                                                        news.category
                                                    }

                                                </span>

                                            )}


                                            {/* TITLE */}

                                            <h2 className="news-title">

                                                {
                                                    news.title
                                                }

                                            </h2>


                                            {/* CONTENT */}

                                            <p className="news-description">

                                                {
                                                    news.content
                                                }

                                            </p>


                                            {/* VIDEO */}

                                            {news.video_url && (

                                                <video
                                                    controls
                                                    className="news-video"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >

                                                    <source
                                                        src={
                                                            `http://localhost:https://matribhoomi-news24-fullstack.onrender.com${news.video_url}`
                                                        }

                                                        type="video/mp4"
                                                    />

                                                    আপনার ব্রাউজার
                                                    ভিডিও সাপোর্ট
                                                    করে না।

                                                </video>

                                            )}

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </div>

        </main>
    );
};


export default Home;