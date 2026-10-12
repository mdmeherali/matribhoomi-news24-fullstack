import React, {
    useEffect,
    useState
} from "react";

import {
    useParams,
    Link
} from "react-router-dom";

import NewsInteractions
    from "../components/NewsInteractions.jsx";


const API_URL =
    "http://localhost:https://matribhoomi-news24-fullstack.onrender.com/api";

const SERVER_URL =
    "http://localhost:https://matribhoomi-news24-fullstack.onrender.com";


const NewsDetail = () => {

    const { id } = useParams();

    const [news, setNews] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD SINGLE NEWS
    // ========================================

    useEffect(() => {

        const loadNews = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(
                        `${API_URL}/news/${id}`
                    );


                if (response.status === 404) {

                    setError(
                        "খবরটি পাওয়া যায়নি।"
                    );

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        "News load failed"
                    );
                }


                const data =
                    await response.json();

                setNews(data);


            } catch (err) {

                console.error(
                    "News detail error:",
                    err
                );

                setError(

                    "খবরটি লোড করা যায়নি। " +
                    "সার্ভার চালু আছে কিনা দেখুন।"
                );

            } finally {

                setLoading(false);
            }
        };


        loadNews();

        window.scrollTo(0, 0);

    }, [id]);


    // ========================================
    // DATE FORMAT (বাংলা)
    // ========================================

    const formatDate = (value) => {

        try {

            return new Date(value)
                .toLocaleString(
                    "bn-BD",
                    {
                        dateStyle: "long",
                        timeStyle: "short"
                    }
                );

        } catch {

            return value;
        }
    };


    return (

        <main className="news-page">

            <div className="site-container">


                <Link
                    to="/"
                    className="back-link"
                >

                    ← প্রচ্ছদে ফিরে যান

                </Link>


                {/* LOADING */}

                {loading && (

                    <div className="loading-box">

                        খবর লোড হচ্ছে...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="error-box">

                        {error}

                    </div>

                )}


                {/* NEWS DETAIL */}

                {!loading && news && (

                    <article className="detail-card">


                        {/* IMAGE */}

                        {news.image_url && (

                            <img

                                src={
                                    `${SERVER_URL}${news.image_url}`
                                }

                                alt={
                                    news.title
                                }

                                className="detail-image"

                            />

                        )}


                        <div className="detail-body">


                            {/* CATEGORY */}

                            {news.category && (

                                <span className="news-category">

                                    {
                                        news.category
                                    }

                                </span>

                            )}


                            {/* TITLE */}

                            <h1 className="detail-title">

                                {
                                    news.title
                                }

                            </h1>


                            {/* DATE */}

                            <div className="detail-meta">

                                প্রকাশিত:{" "}

                                {
                                    formatDate(
                                        news.created_at
                                    )
                                }

                            </div>


                            {/* CONTENT */}

                            <div className="detail-content">

                                {
                                    news.content
                                }

                            </div>


                            {/* VIDEO */}

                            {news.video_url && (

                                <video
                                    controls
                                    className="detail-video"
                                >

                                    <source

                                        src={
                                            `${SERVER_URL}${news.video_url}`
                                        }

                                        type="video/mp4"

                                    />

                                    আপনার ব্রাউজার
                                    ভিডিও সাপোর্ট
                                    করে না।

                                </video>

                            )}


                            {/* =========================
                                LIKE / DISLIKE / SHARE /
                                COMMENTS
                            ========================= */}

                            <NewsInteractions

                                newsId={
                                    news.id
                                }

                                initialLikes={
                                    news.likes
                                }

                                initialDislikes={
                                    news.dislikes
                                }

                            />


                        </div>


                    </article>

                )}


            </div>

        </main>

    );
};


export default NewsDetail;
