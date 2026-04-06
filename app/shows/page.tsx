"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gold = "#bc9b6a";

export default function ShowsPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved as "en" | "ar");

    const updateLang = () => {
      const l = (localStorage.getItem("lang") || "en") as "en" | "ar";
      setLang(l);
    };

    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  if (!mounted) return null;

  const shows = [
    {
      id: 1,
      title_en: "Alkout Arabian Horse Show",
      title_ar: "بطولة الكوت للخيل العربية",
      image: "/horse1.jpg",
      link: "/register/",
      status: "soon",
    },
    {
      id: 2,
      title_en: "Kuwait 11th International Show",
      title_ar: "بطولة الكويت الدولية 11",
      image: "/horse2.jpg",
      link: "/register/",
      status: "soon",
    },
    {
      id: 3,
      title_en: "Breeder Cup",
      title_ar: "كأس المربين للخيل العربية",
      image: "/horse3.jpg",
      link: "/register/",
      status: "soon",
    },
    {
      id: 4,
      title_en: "Breeder Cup SE",
      title_ar: "كأس المربين للخيل المصرية ",
      image: "/horse3.jpg", // يمكنك تغيير هذه الصورة لاحقاً إذا أردت
      link: "/register/",
      status: "soon",
    },
  ];

  const t = {
    en: {
      title: "Available Championships",
      subtitle: "Explore and register for the most prestigious Arabian horse shows.",
      btn: "Registration Closed",
      soon: "SOON",
      postponed: "POSTPONED",
      popupText: "Registration will be announced soon",
      closeBtn: "Close",
    },
    ar: {
      title: "البطولات المتاحة",
      subtitle: "اكتشف وسجل في أرقى بطولات الخيل العربية.",
      btn: "التسجيل مغلق",
      soon: "قريباً",
      postponed: "مؤجل",
      popupText: "سيتم الإعلان لاحقاً عند فتح باب التسجيل",
      closeBtn: "إغلاق",
    },
  };

  // إعدادات الأنيميشن للكروت (Stagger Effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white relative pb-20"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      {/* المحتوى الرئيسي (تجنب القائمة الجانبية) */}
      <div className="relative z-10 w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-4 md:px-10 pt-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-wide bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(188,155,106,0.3)]">
            {t[lang].title}
          </h1>
          <p className="text-gray-300 text-sm md:text-lg font-light tracking-wider">
            {t[lang].subtitle}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {shows.map((show) => (
            <motion.div
              key={show.id}
              variants={itemVariants}
              onClick={() => {
                if (show.status === "soon") {
                  setShowPopup(true);
                } else {
                  window.location.href = show.link;
                }
              }}
              className="cursor-pointer group relative bg-[#111]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-[#bc9b6a33] transition-all duration-500 hover:-translate-y-2 hover:border-[#bc9b6a] hover:shadow-[0_15px_40px_-10px_rgba(188,155,106,0.4)] flex flex-col h-[350px] md:h-[400px]"
            >
              {/* Image Container */}
              <div className="relative w-full h-3/5 overflow-hidden">
                <img
                  src={show.image}
                  alt={lang === "ar" ? show.title_ar : show.title_en}
                  className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Gradient Fade to connect image with content */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className={`absolute top-4 ${lang === "ar" ? "right-4" : "left-4"} px-4 py-1.5 text-xs font-bold tracking-wider rounded-full uppercase shadow-lg backdrop-blur-md border border-white/10
                  ${show.status === "postponed" ? "bg-red-600/90 text-white" : 
                    show.status === "soon" ? "bg-yellow-500/90 text-black" : 
                    "bg-green-500/90 text-black"}`}
                >
                  {show.status === "postponed" ? t[lang].postponed : 
                   show.status === "soon" ? t[lang].soon : ""}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-10">
                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#bc9b6a] transition-colors duration-300">
                  {lang === "ar" ? show.title_ar : show.title_en}
                </h2>

                {/* Action Button (Appears on Hover for Desktops, always visible on mobile) */}
                <div className="mt-4 md:opacity-0 md:-translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                  <button className="w-full bg-gradient-to-r from-[#bc9b6a] to-[#8c6a3f] text-white py-3 rounded-xl font-semibold shadow-[0_0_15px_#bc9b6a44] transition-all hover:brightness-110">
                    {t[lang].btn}
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pop-up Notification */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#111] rounded-3xl p-8 max-w-sm w-full text-center border border-[#bc9b6a] shadow-[0_0_50px_rgba(188,155,106,0.2)] relative overflow-hidden"
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bc9b6a] to-transparent" />
              
              <div className="w-16 h-16 mx-auto mb-6 bg-[#bc9b6a11] rounded-full flex items-center justify-center border border-[#bc9b6a33]">
                 <span className="text-2xl">⏳</span>
              </div>

              <h2 className="text-xl font-bold mb-6 text-white leading-relaxed">
                {t[lang].popupText}
              </h2>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-[#bc9b6a] hover:bg-[#a68656] text-black font-bold py-3 rounded-xl transition-colors duration-300"
              >
                {t[lang].closeBtn}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}