"use client";

import { useState, useEffect } from "react";

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
      image: "/horse3.jpg",
      link: "/register/",
      status: "soon",
    },
  ];

  const t = {
    en: {
      title: "Available Championships",
      btn: "Registration Closed",
      soon: "SOON",
      postponed: "POSTPONED",
    },
    ar: {
      title: "البطولات المتاحة",
      btn: "التسجيل مغلق",
      soon: "قريبا",
      postponed: "مؤجل",
    },
  };

  return (
    <main
      className={`min-h-screen bg-black text-white p-6 md:p-10 mr-0 md:mr-[190px] ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h1 className="text-1.5xl md:text-5xl font-bold mb-2 text-center bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent">
        {t[lang].title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

        {shows.map((show) => (
          <div
            key={show.id}
            onClick={() => {
              if (show.status === "soon") {
                setShowPopup(true);
              } else {
                window.location.href = show.link;
              }
            }}
            className="cursor-pointer group relative bg-zinc-900 rounded-2xl overflow-hidden 
            transition duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_#bc9b6a]"
          >

            <div className="relative w-full h-48 md:h-56 overflow-hidden">
              <img
                src={show.image}
                alt={lang === "ar" ? show.title_ar : show.title_en}
                className="w-full h-full object-contain object-center 
                group-hover:scale-100 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} px-3 py-1 text-xs rounded-full 
                ${
                  show.status === "postponed"
                    ? "bg-red-600 text-white"
                    : show.status === "soon"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-500 text-black"
                }`}
              >
                {show.status === "postponed"
                  ? t[lang].postponed
                  : show.status === "soon"
                  ? t[lang].soon
                  : ""}
              </div>
            </div>

            <div className="p-5 relative z-10">

              <h2 className="text-sm md:text-lg font-semibold mb-3 group-hover:text-[#bc9b6a] transition">
                {lang === "ar" ? show.title_ar : show.title_en}
              </h2>

              <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                <button className="bg-[#bc9b6a] text-black px-4 py-2 rounded text-sm font-medium">
                  {t[lang].btn}
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-zinc-900 rounded-2xl p-6 max-w-sm w-full text-center border border-[#bc9b6a]">

            <h2 className="text-lg font-semibold mb-4 text-[#bc9b6a]">
              {lang === "ar"
                ? "سيتم الإعلان لاحقاً عند فتح باب التسجيل"
                : "Registration will be announced soon"}
            </h2>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 bg-[#bc9b6a] text-black px-4 py-2 rounded"
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>

          </div>

        </div>
      )}
    </main>
  );
}