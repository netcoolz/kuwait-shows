"use client";

import { useState, useEffect } from "react";

export default function ShowsPage() {

  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    const updateLang = () => {
      const l = localStorage.getItem("lang") || "en";
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
      link: "/register/alkout",
      status: "postponed",
    },
    {
      id: 2,
      title_en: "Kuwait 11th International Show",
      title_ar: "بطولة الكويت الدولية 11",
      image: "/horse2.jpg",
      link: "/register/11thintshow",
      status: "postponed",
    },
    {
      id: 3,
      title_en: "Breeder Cup",
      title_ar: "كأس المربين للخيل العربية",
      image: "/horse3.jpg",
      link: "/register/breedercup",
      status: "open",
    },
    {
      id: 4,
      title_en: "Breeder Cup SE",
      title_ar: "كأس المربين للخيل المصرية ",
      image: "/horse3.jpg",
      link: "/register/breedercupse",
      status: "open",
    },
  ];

  const t = {
    en: {
      title: "Available Championships",
      btn: "Register Now",
      open: "OPEN",
      postponed: "POSTPONED",
    },
    ar: {
      title: "البطولات المتاحة",
      btn: "سجل الآن",
      open: "مفتوح",
      postponed: "مؤجل",
    },
  };

  return (
    <main
      className={`min-h-screen bg-black text-white p-6 md:p-10 mr-0 md:mr-[190px] ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-12 text-center">
        {t[lang].title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

        {shows.map((show) => (
          <a
            key={show.id}
            href={show.link}
            className="group relative bg-zinc-900 rounded-2xl overflow-hidden 
            transition duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_#bc9b6a]"
          >

            {/* IMAGE */}
            <div className="relative w-full h-48 md:h-56 overflow-hidden">
              <img
                src={show.image}
                className="w-full h-full object-contain object-center 
                group-hover:scale-100 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* STATUS */}
              <div className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} px-3 py-1 text-xs rounded-full 
                ${show.status === "postponed" 
                  ? "bg-red-600 text-white" 
                  : "bg-green-500 text-black"}`}>
                {show.status === "postponed" ? t[lang].postponed : t[lang].open}
              </div>
            </div>

            {/* CONTENT */}
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

          </a>
        ))}

      </div>
    </main>
  );
}