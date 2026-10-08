import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-white mt-12">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold">
              মাতৃভূমি
              <span className="text-red-500"> নিউজ ২৪</span>
            </h2>

            <p className="text-gray-300 mt-4 leading-7">
              সত্যের সন্ধানে, মানুষের পাশে।
              দেশের সর্বশেষ সংবাদ ও গুরুত্বপূর্ণ
              খবর পাঠকের কাছে পৌঁছে দেওয়াই আমাদের লক্ষ্য।
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-green-700 pb-2">
              গুরুত্বপূর্ণ লিংক
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="/" className="hover:text-white">
                  প্রচ্ছদ
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white">
                  সর্বশেষ সংবাদ
                </a>
              </li>

              <li>
                <a href="#live" className="hover:text-white">
                  🔴 Live News
                </a>
              </li>

              <li>
                <a href="/admin" className="hover:text-white">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-green-700 pb-2">
              বিভাগ
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>জাতীয়</li>
              <li>রাজনীতি</li>
              <li>অর্থনীতি</li>
              <li>আন্তর্জাতিক</li>
              <li>খেলা</li>
              <li>বিনোদন</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-green-700 pb-2">
              যোগাযোগ
            </h3>

            <div className="space-y-3 text-gray-300">
              <p>📍 বাংলাদেশ</p>
              <p>📞 +880 1734138429</p>
              <p>✉️ infonews24.com</p>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold"
              >
                f
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold"
              >
                ▶
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold"
              >
                ◎
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-green-800">
        <div className="max-w-7xl mx-auto px-4 py-5 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} মাতৃভূমি নিউজ ২৪ — সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>

    </footer>
  );
};

export default Footer;