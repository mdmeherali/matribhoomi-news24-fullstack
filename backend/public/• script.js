const API_URL = "http://localhost:5000/api/news";

async function loadNews(category = "") {
    const container = document.getElementById("news-container");
    container.innerHTML = "<p class='loading'>খবর লোড হচ্ছে...</p>";

    try {
        const response = await fetch(API_URL);
        const allNews = await response.json();

        // ক্যাটাগরি অনুযায়ী ফিল্টারিং
        const filteredNews = category 
            ? allNews.filter(item => item.category === category)
            : allNews;

        container.innerHTML = "";

        if (filteredNews.length === 0) {
            container.innerHTML = "<p>এই ক্যাটাগরিতে বর্তমানে কোনো খবর নেই।</p>";
            return;
        }

        filteredNews.forEach(news => {
            const card = document.createElement("div");
            card.className = "news-card";

            card.innerHTML = `
                ${news.image_url ? `<img src="http://localhost:5001/${news.image_url}" alt="Image">` : ''}
                ${news.video_url ? `<video controls src="http://localhost:5001/${news.video_url}"></video>` : ''}
                <div class="news-content">
                    <span class="badge">${news.category}</span>
                    <h2>${news.title}</h2>
                    <p>${news.content}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = "<p>সার্ভার থেকে নিউজ লোড করতে সমস্যা হয়েছে।</p>";
        console.error(error);
    }
}

// বাটন ক্লিক ইভেন্ট
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        
        const selectedCategory = e.target.getAttribute("data-category");
        loadNews(selectedCategory);
    });
});

// পেজ লোডে প্রথম রান
window.onload = () => loadNews();
