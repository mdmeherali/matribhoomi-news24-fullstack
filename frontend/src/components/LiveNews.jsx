import React from "react";

const LiveNews = () => {

  // ==========================================
  // মাতৃভূমি উন্নয়ন কল্যাণ সংস্থার YouTube Channel
  // ==========================================
  const CHANNEL_URL =
    "https://www.youtube.com/@%E0%A6%AE%E0%A6%BE%E0%A6%A4%E0%A7%83%E0%A6%AD%E0%A7%82%E0%A6%AE%E0%A6%BF%E0%A6%89%E0%A6%A8%E0%A7%8D%E0%A6%A8%E0%A6%AF%E0%A6%BC%E0%A6%A8%E0%A6%95%E0%A6%B2%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A3%E0%A6%B8%E0%A6%82%E0%A6%B8%E0%A7%8D%E0%A6%A5%E0%A6%BE";

  /*
   * এখানে যখন নির্দিষ্ট YouTube Live ভিডিও থাকবে,
   * তখন নিচের LIVE_VIDEO_ID-তে Video ID বসাবেন।
   *
   * উদাহরণ:
   * https://www.youtube.com/watch?v=AbCd1234567
   *
   * তাহলে:
   * const LIVE_VIDEO_ID = "AbCd1234567";
   *
   * এখন কোনো নির্দিষ্ট Live Video না থাকায় null রাখা হয়েছে।
   */

  const LIVE_VIDEO_ID = null;

  // ==========================================
  // Live Video থাকলে Embed URL তৈরি হবে
  // ==========================================
  const LIVE_EMBED_URL = LIVE_VIDEO_ID
    ? `https://www.youtube.com/embed/${LIVE_VIDEO_ID}?autoplay=1`
    : null;

  return (
    <section
      id="live"
      className="bg-gray-950 text-white py-10 mt-8"
    >

      <div className="max-w-7xl mx-auto px-4">

        {/* ======================================
            Header
        ====================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

          <div>

            <div className="flex items-center gap-3">

              {/* Live Indicator */}
              <span className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></span>

              <h2 className="text-2xl md:text-3xl font-extrabold">
                LIVE NEWS
              </h2>

              <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
                LIVE
              </span>

            </div>

            <p className="text-gray-400 mt-2">
              মাতৃভূমি নিউজ ২৪-এর সর্বশেষ লাইভ সংবাদ
            </p>

          </div>


          {/* ======================================
              YouTube Channel Button
          ====================================== */}

          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition duration-300"
          >
            🔴 JOIN LIVE
          </a>

        </div>


        {/* ======================================
            LIVE PLAYER
        ====================================== */}

        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">

          {LIVE_EMBED_URL ? (

            /* ==================================
               যখন Live Video থাকবে
            ================================== */

            <div className="aspect-video">

              <iframe
                className="w-full h-full"
                src={LIVE_EMBED_URL}
                title="মাতৃভূমি নিউজ ২৪ Live"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>

            </div>

          ) : (

            /* ==================================
               যখন Live Video নেই
            ================================== */

            <div className="aspect-video flex items-center justify-center">

              <div className="text-center px-4">

                {/* Play Icon */}
                <div className="w-24 h-24 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-6">

                  <span className="text-5xl">
                    ▶
                  </span>

                </div>


                {/* Title */}
                <h3 className="text-xl md:text-3xl font-bold mb-3">

                  মাতৃভূমি নিউজ ২৪ — LIVE

                </h3>


                {/* Description */}
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">

                  বর্তমানে কোনো লাইভ সম্প্রচার চলছে না।
                  লাইভ সংবাদ শুরু হলে এখানে সরাসরি সম্প্রচার দেখা যাবে।

                </p>


                {/* YouTube Button */}
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 px-7 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition duration-300"
                >
                  ▶ WATCH ON YOUTUBE
                </a>

              </div>

            </div>

          )}

        </div>


        {/* ======================================
            Bottom Information
        ====================================== */}

        <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">

          <p>
            📺 YouTube: মাতৃভূমি উন্নয়ন কল্যাণ সংস্থা
          </p>

          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 transition"
          >
            আমাদের YouTube Channel →
          </a>

        </div>

      </div>

    </section>
  );
};

export default LiveNews;