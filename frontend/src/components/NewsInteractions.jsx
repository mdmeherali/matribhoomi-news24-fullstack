import React, {
    useEffect,
    useState
} from "react";


const API_URL =
    "://matribhoomi-news24-fullstack.onrender.com/api";


const NewsInteractions = ({
    newsId,
    initialLikes = 0,
    initialDislikes = 0
}) => {

    const [likes, setLikes] =
        useState(initialLikes);

    const [dislikes, setDislikes] =
        useState(initialDislikes);

    const [userReaction, setUserReaction] =
        useState(null);

    const [comments, setComments] =
        useState([]);

    const [username, setUsername] =
        useState("");

    const [commentText, setCommentText] =
        useState("");

    const [reacting, setReacting] =
        useState(false);

    const [posting, setPosting] =
        useState(false);

    const [formMessage, setFormMessage] =
        useState("");

    const [formError, setFormError] =
        useState(false);

    const [shareMessage, setShareMessage] =
        useState("");


    // ========================================
    // আগের রিঅ্যাকশন localStorage থেকে ফেরানো
    // ========================================

    useEffect(() => {

        const saved = localStorage.getItem(
            `reaction-${newsId}`
        );

        if (
            saved === "like" ||
            saved === "dislike"
        ) {
            setUserReaction(saved);
        }

    }, [newsId]);


    // ========================================
    // কমেন্ট লোড
    // ========================================

    useEffect(() => {

        const loadComments = async () => {

            try {

                const response =
                    await fetch(
                        `${API_URL}/comments/${newsId}`
                    );

                if (response.ok) {

                    const data =
                        await response.json();

                    if (Array.isArray(data)) {
                        setComments(data);
                    }
                }

            } catch (err) {

                console.error(
                    "Comment load error:",
                    err
                );
            }
        };


        loadComments();

    }, [newsId]);


    // ========================================
    // LIKE / DISLIKE TOGGLE
    // ========================================

    const handleReact = async (type) => {

        if (reacting) return;

        setReacting(true);

        try {

            const response =
                await fetch(
                    `${API_URL}/react`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            news_id: newsId,
                            type
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                setLikes(data.likes);

                setDislikes(data.dislikes);

                setUserReaction(
                    data.userReaction
                );


                const storageKey =
                    `reaction-${newsId}`;


                if (data.userReaction) {

                    localStorage.setItem(
                        storageKey,
                        data.userReaction
                    );

                } else {

                    localStorage.removeItem(
                        storageKey
                    );
                }
            }


        } catch (err) {

            console.error(
                "Reaction error:",
                err
            );

        } finally {

            setReacting(false);
        }
    };


    // ========================================
    // COMMENT POST
    // ========================================

    const handleCommentSubmit = async (e) => {

        e.preventDefault();

        if (posting) return;

        setFormMessage("");

        setFormError(false);

        setPosting(true);

        try {

            const response =
                await fetch(
                    `${API_URL}/comments`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            news_id: newsId,

                            username:
                                username.trim(),

                            comment_text:
                                commentText.trim()
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                setComments(
                    data.comments || []
                );

                setCommentText("");

                setFormMessage(
                    "কমেন্ট পোস্ট হয়েছে!"
                );

            } else {

                setFormError(true);

                setFormMessage(
                    data.message ||
                        "কমেন্ট পোস্ট ব্যর্থ হয়েছে"
                );
            }


        } catch (err) {

            console.error(
                "Comment post error:",
                err
            );

            setFormError(true);

            setFormMessage(
                "সার্ভারে যুক্ত হওয়া যায়নি"
            );

        } finally {

            setPosting(false);
        }
    };


    // ========================================
    // SHARE
    // ========================================

    const shareUrl =
        window.location.href;


    const handleNativeShare = async () => {

        if (navigator.share) {

            try {

                await navigator.share({

                    title: document.title,

                    url: shareUrl
                });

                return;

            } catch (err) {

                if (
                    err &&
                    err.name === "AbortError"
                ) {
                    return;
                }
            }
        }


        // ফলব্যাক: লিংক কপি
        try {

            await navigator.clipboard
                .writeText(shareUrl);

            setShareMessage(
                "লিংক কপি হয়েছে!"
            );

            setTimeout(() => {

                setShareMessage("");

            }, 3000);


        } catch (err) {

            console.error(
                "Copy failed:",
                err
            );
        }
    };


    const handleFacebookShare = () => {

        window.open(

            "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(shareUrl),

            "_blank",

            "width=650,height=550"
        );
    };


    // ========================================
    // DATE FORMAT (বাংলা)
    // ========================================

    const formatDate = (value) => {

        try {

            return new Date(value)
                .toLocaleString(
                    "bn-BD",
                    {
                        dateStyle: "medium",
                        timeStyle: "short"
                    }
                );

        } catch {

            return value;
        }
    };


    return (

        <div className="interactions">


            {/* ================= REACTION BAR ================= */}

            <div className="interaction-bar">


                <button
                    type="button"
                    className={
                        "react-btn" +
                        (userReaction === "like"
                            ? " liked"
                            : "")
                    }
                    onClick={() =>
                        handleReact("like")
                    }
                    disabled={reacting}
                >
                    👍 like
                    <span>{likes}</span>
                </button>


                <button
                    type="button"
                    className={
                        "react-btn" +
                        (userReaction === "dislike"
                            ? " disliked"
                            : "")
                    }
                    onClick={() =>
                        handleReact("dislike")
                    }
                    disabled={reacting}
                >
                    👎 dislikes
                    <span>{dislikes}</span>
                </button>


                <button
                    type="button"
                    className="share-btn"
                    onClick={handleFacebookShare}
                >
                    📘 Facebook-Share
                </button>


                <button
                    type="button"
                    className="share-btn"
                    onClick={handleNativeShare}
                >
                    🔗 copy link
                </button>


                {shareMessage && (

                    <span className="interaction-msg">

                        {shareMessage}

                    </span>

                )}

            </div>


            {/* ================= COMMENTS ================= */}

            <section className="comment-section">


                <h3 className="comment-heading">

                    মন্তব্য ({comments.length})

                </h3>


                <form
                    className="comment-form"
                    onSubmit={handleCommentSubmit}
                >


                    <input
                        type="text"
                        placeholder="আপনার নাম"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        maxLength={50}
                        required
                    />


                   <textarea
                        placeholder="আপনার মন্তব্য লিখুন..."
                        value={commentText}
                        onChange={(e) =>
                            setCommentText(
                                e.target.value
                            )
                        }
                        maxLength={500}
                        required
                    /> 


                    <button
                        type="submit"
                        className="comment-submit"
                        disabled={posting}
                    >

                        {
                            posting
                                ? "পোস্ট হচ্ছে..."
                                : "মন্তব্য পোস্ট করুন"
                        }

                    </button>


                    {formMessage && (

                        <p
                            className={
                                "comment-form-msg" +
                                (formError
                                    ? " error"
                                    : " success")
                            }
                        >

                            {formMessage}

                        </p>

                    )}


                </form>


                <div className="comment-list">


                    {comments.length === 0 ? (

                        <p className="comment-empty">

                            এখনো কোনো মন্তব্য নেই।
                            প্রথম মন্তব্য করুন!

                        </p>

                    ) : (

                        comments.map(
                            (comment) => (

                                <article
                                    key={comment.id}
                                    className="comment-item"
                                >


                                    <header>


                                        <strong>

                                            {
                                                comment.username
                                            }

                                        </strong>


                                        <time>

                                            {
                                                formatDate(
                                                    comment.created_at
                                                )
                                            }

                                        </time>


                                    </header>


                                    <p>

                                        {
                                            comment.comment_text
                                        }

                                    </p>


                                </article>

                            )
                        )

                    )}


                </div>


            </section>


        </div>

    );
};


export default NewsInteractions;
