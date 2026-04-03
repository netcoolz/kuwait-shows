"use client";

import { useState, useEffect } from "react";

export default function TablesSponsorsPage() {
 
const [lang, setLang] = useState("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);

    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };

    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = {
    en: {
      title: "Tables & Sponsors",
      table: "VIP Table Booking",
      sponsor: "Corporate Sponsorship",
      booth: "Commercial Booths",
    },
    ar: {
      title: "الطاولات والرعايات",
      table: "حجز الطاولات",
      sponsor: "رعايات الشركات",
      booth: "البوثات التجارية",
    },
  };

const cards = [
  {
    id: 1,
    title: t[lang].table,
    image: "/viptable.jpg",
    link: "#",
  },
  {
    id: 2,
    title: t[lang].sponsor,
    image: "/sponsor.jpg",
    link: "/csponsor",
  },
  {
    id: 3,
    title: t[lang].booth,
    image: "/boothes.jpg",
    link: "#",
  },
];
  return (
<main className="relative min-h-screen bg-[url('/bg.png')] bg-cover bg-center bg-fixed text-white p-6 md:p-10">

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-[#bc9b6a] mb-10 text-center">
        {t[lang].title}
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {cards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            className="group relative rounded-2xl overflow-hidden border border-[#bc9b6a] bg-black hover:shadow-[0_0_30px_rgba(188,155,106,0.5)] transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative h-52 md:h-64 overflow-hidden">
              <img
                src={card.image}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
            </div>

            {/* TITLE */}
            <div className="p-5 text-center">
              <h2 className="text-lg md:text-xl font-semibold text-[#bc9b6a]">
                {card.title}
              </h2>
            </div>

          </a>
        ))}

      </div>
    </main>
  );
}