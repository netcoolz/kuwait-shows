"use client";

import { handlers } from "../data/handlers";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const gold = "#bc9b6a";

export default function HandlersPage() {
  const [lang, setLang] = useState("en");

useEffect(() => {
  const updateLang = () => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  };

  updateLang(); // أول تحميل

  window.addEventListener("languageChange", updateLang);

  return () => {
    window.removeEventListener("languageChange", updateLang);
  };
}, []);

  return (
    <div className="bg-black text-white min-h-screen py-20 px-4">

      {/* العنوان */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl text-center mb-4"
        style={{ color: gold }}
      >
        Handlers
      </motion.h1>

      {/* الوصف */}
      <p className="text-center max-w-2xl mx-auto text-gray-300 mb-8">
        {lang === "en"
          ? "Discover top Arabian horse handlers from around the world. Kuwait Shows brings together experienced professionals in horse presentation, training, and championships."
          : "اكتشف نخبة مقدمي الخيل العربية من مختلف أنحاء العالم. تجمع كويت شووز أفضل الخبرات في عرض الخيل والتدريب والبطولات."}
      </p>

      {/* خط ذهبي */}
      <div className="w-24 h-[2px] bg-[#bc9b6a] mx-auto mb-12"></div>

      {/* الكروت */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">

        {handlers.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05 }}
            className="border border-[#bc9b6a] rounded-2xl overflow-hidden text-center"
          >

            {/* الصورة */}
            <div className="relative">
              <img src={h.image} className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* المعلومات */}
            <div className="p-4 space-y-2">

              <h2 className="text-lg font-semibold">
                {h.name}
              </h2>

              <div className="flex items-center justify-center gap-2 text-sm">
                <img src={h.flag} className="w-5 h-5 rounded-sm" />
                <span className="text-gray-300">{h.country}</span>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2 pt-3">

                <a
                  href={`https://wa.me/${h.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="flex-1 text-center border border-[#bc9b6a] py-2 rounded-lg text-sm hover:bg-[#bc9b6a] hover:text-black transition"
                >
                  WhatsApp
                </a>

                <a
                  href={`mailto:${h.email}`}
                  className="flex-1 text-center border border-[#bc9b6a] py-2 rounded-lg text-sm hover:bg-[#bc9b6a] hover:text-black transition"
                >
                  Email
                </a>

              </div>

            </div>

          </motion.div>
        ))}

      </div>

      {/* خط ذهبي */}
      <div className="w-24 h-[2px] bg-[#bc9b6a] mx-auto my-16"></div>

      {/* CTA */}
      <div className="text-center max-w-xl mx-auto space-y-6">

        <p className="text-gray-300">
          {lang === "en"
            ? "Are you an Horse Handler and want to be featured on our website? Send us now your details."
            : "هل أنت مقدم خيل وترغب في الظهور على موقعنا؟ أرسل لنا بياناتك الآن."}
        </p>

        <a
          href="https://wa.me/96597944003"
          target="_blank"
          className="inline-block border border-[#bc9b6a] px-6 py-3 rounded-lg hover:bg-[#bc9b6a] hover:text-black transition"
        >
          {lang === "en" ? "Join us Now" : "انضم إلينا الآن"}
        </a>

      </div>

    </div>
  );
}