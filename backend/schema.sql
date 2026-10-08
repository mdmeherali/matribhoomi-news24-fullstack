-- ============================================================
-- মাতৃভূমি নিউজ ২৪ — Comments & Reactions টেবিল
-- (server.js চালু হলে অটো তৈরি হয়, এটা রেফারেন্স হিসেবে)
-- ============================================================

USE matribhoomi_news;


-- ------------------------------------------------------------
-- কমেন্টস
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS comments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    news_id INT NOT NULL,

    username VARCHAR(50) NOT NULL,

    comment_text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_comments_news (news_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ------------------------------------------------------------
-- লাইক / ডিসলাইক
-- একই IP একাধিকবার ভোট দিতে পারবে না
-- (PRIMARY KEY news_id + ip)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS reactions (

    news_id INT NOT NULL,

    ip VARCHAR(64) NOT NULL,

    reaction ENUM('like', 'dislike') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (news_id, ip)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
