const BASE_URL = "http://localhost:5001/api";

// ১. পেজ লোড চেক
const token = localStorage.getItem("adminToken");

if (token) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";
}


// ২. লগইন প্রসেস
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        alert("Username এবং Password দিন!");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("adminToken", data.token);

            alert("লগইন সফল হয়েছে!");

            location.reload();
        } else {
            alert(data.message || "Username অথবা Password ভুল!");
        }

    } catch (err) {
        console.error("Login Error:", err);
        alert("সার্ভারের সাথে সংযোগ করা যাচ্ছে না!");
    }
});


// ৩. নিউজ ও মিডিয়া আপলোড
document.getElementById("news-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "title",
        document.getElementById("title").value
    );

    formData.append(
        "category",
        document.getElementById("category").value
    );

    formData.append(
        "content",
        document.getElementById("content").value
    );

    const imageFile = document.getElementById("image").files[0];

    if (imageFile) {
        formData.append("image", imageFile);
    }

    const videoFile = document.getElementById("video").files[0];

    if (videoFile) {
        formData.append("video", videoFile);
    }

    try {
        const response = await fetch(`${BASE_URL}/news`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ খবরটি সফলভাবে আপলোড ও প্রকাশিত হয়েছে!");

            document.getElementById("news-form").reset();
        } else {
            alert("ভুল: " + (data.message || "আপলোড ব্যর্থ হয়েছে"));
        }

    } catch (err) {
        console.error("Upload Error:", err);
        alert("আপলোড করতে সমস্যা হয়েছে!");
    }
});


// ৪. লগআউট
document.getElementById("logout-btn").addEventListener("click", () => {

    localStorage.removeItem("adminToken");

    location.reload();
});


// ৫. অ্যাডমিন পাসওয়ার্ড পরিবর্তন
document.getElementById("change-password-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const oldPassword =
        document.getElementById("old-password").value;

    const newPassword =
        document.getElementById("new-password").value;

    const adminToken =
        localStorage.getItem("adminToken");

    if (!adminToken) {

        alert("আপনার সেশন শেষ হয়ে গেছে! দয়া করে আবার লগইন করুন।");

        location.reload();

        return;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/auth/change-password`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`
                },

                body: JSON.stringify({
                    oldPassword,
                    newPassword
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(
                "✅ পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! আবার লগইন করুন।"
            );

            localStorage.removeItem("adminToken");

            location.reload();

        } else {

            alert(
                "ভুল: " +
                (data.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি")
            );
        }

    } catch (err) {

        console.error("Change Password Error:", err);

        alert("সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে!");
    }
});