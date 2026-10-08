import React, {
    useEffect,
    useState
} from "react";


const API_URL =
    "http://localhost:5001/api";


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


const AdminDashboard = () => {


    // ========================================
    // AUTH
    // ========================================

    const [token, setToken] =
        useState(
            localStorage.getItem(
                "adminToken"
            ) || ""
        );


    const [username, setUsername] =
        useState("");


    const [password, setPassword] =
        useState("");


    // ========================================
    // NEWS
    // ========================================

    const [title, setTitle] =
        useState("");


    const [category, setCategory] =
        useState("জাতীয়");


    const [content, setContent] =
        useState("");


    const [image, setImage] =
        useState(null);


    const [video, setVideo] =
        useState(null);


    // ========================================
    // PASSWORD
    // ========================================

    const [oldPassword, setOldPassword] =
        useState("");


    const [newPassword, setNewPassword] =
        useState("");


    // ========================================
    // STATS
    // ========================================

    const [stats, setStats] =
        useState(null);


    const [statsLoading, setStatsLoading] =
        useState(false);


    // ========================================
    // SUBSCRIBERS
    // ========================================

    const [subscribers, setSubscribers] =
        useState([]);


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = async (e) => {

        e.preventDefault();


        try {

            const response =
                await fetch(
                    `${API_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "লগইন ব্যর্থ হয়েছে"
                );

                return;
            }


            if (data.token) {

                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                setToken(data.token);

            } else {

                alert(
                    data.message ||
                    "লগইন ব্যর্থ হয়েছে"
                );
            }


        } catch (error) {

            console.error(error);

            alert(
                "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না"
            );
        }
    };


    // ========================================
    // LOAD STATISTICS
    // ========================================

    const loadStats = async () => {

        try {

            setStatsLoading(true);


            const response =
                await fetch(
                    `${API_URL}/stats/stats`
                );


            const data =
                await response.json();


            if (data.success) {

                setStats(data);
            }


        } catch (error) {

            console.error(
                "Stats error:",
                error
            );

        } finally {

            setStatsLoading(false);
        }
    };


    // ========================================
    // LOAD SUBSCRIBERS
    // ========================================

    const loadSubscribers = async () => {

        try {

            const response =
                await fetch(
                    `${API_URL}/stats/subscribers`
                );


            const data =
                await response.json();


            if (data.success) {

                setSubscribers(
                    data.subscribers || []
                );
            }


        } catch (error) {

            console.error(
                "Subscribers error:",
                error
            );
        }
    };


    // ========================================
    // LOAD ADMIN DATA
    // ========================================

    useEffect(() => {

        if (!token) {
            return;
        }


        loadStats();

        loadSubscribers();


        const interval =
            setInterval(() => {

                loadStats();

            }, 30000);


        return () => {

            clearInterval(interval);

        };

    }, [token]);


    // ========================================
    // POST NEWS
    // ========================================

    const handlePostNews = async (e) => {

        e.preventDefault();


        try {

            const formData =
                new FormData();


            formData.append(
                "title",
                title
            );


            formData.append(
                "category",
                category
            );


            formData.append(
                "content",
                content
            );


            if (image) {

                formData.append(
                    "image",
                    image
                );
            }


            if (video) {

                formData.append(
                    "video",
                    video
                );
            }


            const response =
                await fetch(
                    `${API_URL}/news`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },

                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "নিউজ প্রকাশ করা যায়নি"
                );

                return;
            }


            alert(
                data.message ||
                "নিউজ সফলভাবে প্রকাশ হয়েছে"
            );


            setTitle("");

            setContent("");

            setImage(null);

            setVideo(null);


        } catch (error) {

            console.error(error);

            alert(
                "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না"
            );
        }
    };


    // ========================================
    // CHANGE PASSWORD
    // ========================================

    const handleChangePassword =
        async (e) => {

            e.preventDefault();


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/change-password`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                oldPassword,
                                newPassword
                            })
                        }
                    );


                const data =
                    await response.json();


                alert(
                    data.message ||
                    "Password updated"
                );


                if (response.ok) {

                    setOldPassword("");

                    setNewPassword("");
                }


            } catch (error) {

                console.error(error);

                alert(
                    "Password update করা যায়নি"
                );
            }
        };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        localStorage.removeItem(
            "adminToken"
        );

        setToken("");

        setUsername("");

        setPassword("");
    };


    // ========================================
    // LOGIN PAGE
    // ========================================

    if (!token) {

        return (

            <div className="admin-login-page">

                <div className="admin-login-card">

                    <h2>
                        অ্যাডমিন লগইন
                    </h2>


                    <form
                        onSubmit={handleLogin}
                    >

                        <div className="form-group">

                            <label>
                                ইউজারনেম
                            </label>

                            <input
                                type="text"

                                value={username}

                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                পাসওয়ার্ড
                            </label>

                            <input
                                type="password"

                                value={password}

                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-green admin-login-btn"
                        >
                            প্রবেশ করুন
                        </button>

                    </form>

                </div>

            </div>
        );
    }


    // ========================================
    // ADMIN DASHBOARD
    // ========================================

    return (

        <div className="admin-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="admin-dashboard-header">

                <div>

                    <h1>
                        অ্যাডমিন ড্যাশবোর্ড
                    </h1>

                    <p>
                        মাতৃভূমি নিউজ ২৪
                    </p>

                </div>


                <button
                    onClick={handleLogout}
                    className="btn btn-red"
                >
                    Logout
                </button>

            </div>


            {/* =================================
                STATISTICS
            ================================= */}

            <section className="statistics-section">

                <div className="section-heading">

                    <h2>
                        📊 Website Statistics
                    </h2>


                    <button
                        type="button"
                        className="refresh-button"

                        onClick={() => {
                            loadStats();
                            loadSubscribers();
                        }}
                    >
                        🔄 Refresh
                    </button>

                </div>


                {statsLoading && (

                    <div className="stats-loading">
                        Statistics লোড হচ্ছে...
                    </div>

                )}


                <div className="stats-grid">


                    {/* TOTAL VISITS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>

                            <div className="stat-number">

                                {
                                    stats?.totalVisits ??
                                    0
                                }

                            </div>

                            <div className="stat-label">
                                মোট ভিজিট
                            </div>

                        </div>

                    </div>


                    {/* TODAY */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            📅
                        </div>

                        <div>

                            <div className="stat-number">

                                {
                                    stats?.todayVisits ??
                                    0
                                }

                            </div>

                            <div className="stat-label">
                                আজকের ভিজিট
                            </div>

                        </div>

                    </div>


                    {/* UNIQUE */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div>

                            <div className="stat-number">

                                {
                                    stats?.uniqueVisitors ??
                                    0
                                }

                            </div>

                            <div className="stat-label">
                                Unique Visitor
                            </div>

                        </div>

                    </div>


                    {/* TODAY UNIQUE */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🟢
                        </div>

                        <div>

                            <div className="stat-number">

                                {
                                    stats?.todayUniqueVisitors ??
                                    0
                                }

                            </div>

                            <div className="stat-label">
                                আজকের Unique Visitor
                            </div>

                        </div>

                    </div>


                    {/* SUBSCRIBER */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🔔
                        </div>

                        <div>

                            <div className="stat-number">

                                {
                                    stats?.subscribers ??
                                    0
                                }

                            </div>

                            <div className="stat-label">
                                মোট Subscriber
                            </div>

                        </div>

                    </div>


                </div>

            </section>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <div className="admin-content-grid">


                {/* =================================
                    POST NEWS
                ================================= */}

                <div className="admin-card">

                    <h2 className="admin-title">
                        নতুন নিউজ পোস্ট করুন
                    </h2>


                    <form
                        onSubmit={handlePostNews}
                    >


                        <div className="form-group">

                            <label>
                                শিরোনাম
                            </label>

                            <input
                                type="text"

                                value={title}

                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                ক্যাটাগরি
                            </label>

                            <select
                                value={category}

                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                {categories.map(
                                    (item) => (

                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                বিস্তারিত খবর
                            </label>

                            <textarea
                                value={content}

                                onChange={(e) =>
                                    setContent(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                ছবি আপলোড
                            </label>

                            <input
                                type="file"
                                accept="image/*"

                                onChange={(e) =>
                                    setImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                ভিডিও আপলোড
                            </label>

                            <input
                                type="file"
                                accept="video/*"

                                onChange={(e) =>
                                    setVideo(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-blue"
                        >
                            📰 নিউজ প্রকাশ করুন
                        </button>

                    </form>

                </div>


                {/* =================================
                    PASSWORD
                ================================= */}

                <div className="admin-card">

                    <h2 className="admin-title red-title">
                        🔐 নিরাপত্তা ও পাসওয়ার্ড
                    </h2>


                    <form
                        onSubmit={
                            handleChangePassword
                        }
                    >

                        <div className="form-group">

                            <label>
                                পুরাতন পাসওয়ার্ড
                            </label>

                            <input
                                type="password"

                                value={oldPassword}

                                onChange={(e) =>
                                    setOldPassword(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                নতুন পাসওয়ার্ড
                            </label>

                            <input
                                type="password"

                                value={newPassword}

                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-red"
                        >
                            পাসওয়ার্ড আপডেট করুন
                        </button>

                    </form>


                    <hr className="admin-divider" />


                    <h3>
                        Subscriber List
                    </h3>


                    <div className="subscriber-list">

                        {subscribers.length === 0 ? (

                            <p>
                                এখনো কোনো subscriber নেই।
                            </p>

                        ) : (

                            subscribers.map(
                                (subscriber) => (

                                    <div
                                        key={
                                            subscriber.id
                                        }

                                        className="subscriber-item"
                                    >

                                        <strong>
                                            {subscriber.email}
                                        </strong>

                                        <small>

                                            {new Date(
                                                subscriber.created_at
                                            ).toLocaleString(
                                                "bn-BD"
                                            )}

                                        </small>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};


export default AdminDashboard;