"use client";

import { useEffect, useState } from "react";
import {
  FaGem,
  FaHandshake,
  FaBullhorn,
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaTv,
  FaHashtag,
} from "react-icons/fa";

export default function CorporateSponsor() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };

    updateLang();
    window.addEventListener("langChange", updateLang);
    return () => window.removeEventListener("langChange", updateLang);
  }, []);

  const t = {
    ar: {
      title: "الرعاية الرسمية",
      subtitle: "فرصة استراتيجية استثنائية للشركات",
      intro:
        "بطولات جمال الخيل العربية ليست مجرد حدث... بل منصة تجمع بين الفخامة، الأصالة، والتأثير العالمي، مما يمنح الشركات فرصة ذهبية لتعزيز حضورها وبناء علاقات استراتيجية مع نخبة من رجال الأعمال والمستثمرين وملاك الخيل من مختلف أنحاء العالم.",

      benefitsTitle: "مزايا الرعاية",
      benefits: [
        "تعزيز حضور العلامة التجارية في حدث عالمي راق",
        "الارتباط بقيم الأصالة والفخامة والتميز",
        "الوصول إلى شريحة نوعية من العملاء",
        "فرص شبكة علاقات عالية المستوى",
        "تحقيق مبيعات مباشرة وشراكات استراتيجية",
        "ظهور إعلامي محلي ودولي واسع",
      ],

      mediaTitle: "الحملة الإعلامية",
      media: [
        "التسويق الرقمي ووسائل التواصل الاجتماعي",
        "التعاون مع المؤثرين وصناع المحتوى",
        "دعوات إلكترونية رسمية",
        "تغطية تلفزيونية مباشرة",
        "تغطية إعلامية محلية ودولية",
      ],

      contact: "تواصل معنا",
    },

    en: {
      title: "Corporate Sponsorship",
      subtitle: "A Strategic Opportunity for Elite Brands",
      intro:
        "Arabian horse championships are more than events — they are global platforms that blend luxury, heritage, and influence, offering companies a powerful opportunity to elevate their brand presence and connect with high-value audiences worldwide.",

      benefitsTitle: "Sponsorship Benefits",
      benefits: [
        "Premium brand visibility in a prestigious event",
        "Association with luxury, heritage, and excellence",
        "Access to high-value audience",
        "Elite networking opportunities",
        "Direct sales & partnerships",
        "International media exposure",
      ],

      mediaTitle: "Media Campaign",
      media: [
        "Digital marketing & social media",
        "Influencers & content creators",
        "Official invitations",
        "Live TV coverage",
        "Global media exposure",
      ],

      contact: "Contact Us",
    },
  };

  const icons = [FaGem, FaHandshake, FaUsers, FaChartLine, FaBullhorn, FaGlobe];
  const mediaIcons = [FaHashtag, FaUsers, FaGem, FaTv, FaGlobe];

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-black text-white min-h-screen"
    >
      {/* FIX SIDEBAR ISSUE */}
     <div className="w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-4 md:px-10">

        {/* HERO */}
        <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden rounded-xl">
          <img
            src="/sponsor1.jpg"
            className="absolute w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#bc9b6a]">
              {t[lang].title}
            </h1>
            <p className="text-gray-300">{t[lang].subtitle}</p>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-10 max-w-4xl mx-auto text-center">
          <p className="text-gray-300 leading-8 text-sm md:text-lg">
            {t[lang].intro}
          </p>
        </section>

        {/* BENEFITS */}
        <section className="py-10">
          <h2 className="text-xl md:text-2xl text-center text-[#bc9b6a] mb-8 font-bold">
            {t[lang].benefitsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t[lang].benefits.map((item, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={i}
                  className="bg-[#111] p-5 rounded-xl border border-[#bc9b6a33] hover:border-[#bc9b6a] transition"
                >
                  <Icon className="text-[#bc9b6a] text-2xl mb-3" />
                  <p className="text-gray-300 text-sm">{item}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* MEDIA */}
        <section className="py-10">
          <h2 className="text-xl md:text-2xl text-center text-[#bc9b6a] mb-8 font-bold">
            {t[lang].mediaTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t[lang].media.map((item, i) => {
              const Icon = mediaIcons[i];
              return (
                <div
                  key={i}
                  className="bg-[#0c0c0c] p-5 rounded-xl border border-[#bc9b6a22]"
                >
                  <Icon className="text-[#bc9b6a] text-xl mb-3" />
                  <p className="text-gray-300 text-sm">{item}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* GALLERY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10">
          <img src="/sponsor2.jpg" className="rounded-xl w-full" />
          <img src="/sponsor3.jpg" className="rounded-xl w-full" />
          <img src="/sponsor4.jpg" className="rounded-xl w-full" />
          <img src="/sponsor5.jpg" className="rounded-xl w-full" />
        </section>

        {/* CONTACT */}
        <section className="text-center py-12">
          <h2 className="text-xl md:text-2xl text-[#bc9b6a] mb-6 font-bold">
            {t[lang].contact}
          </h2>

          <div className="max-w-md mx-auto space-y-4">
            <a
              href="https://wa.me/96597944003"
              className="block bg-green-600 hover:bg-green-700 py-3 rounded-xl"
            >
              WhatsApp +965 97944003
            </a>

            <a
              href="mailto:admin@kuwaitshows.com"
              className="block bg-gray-800 hover:bg-gray-700 py-3 rounded-xl"
            >
              admin@kuwaitshows.com
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}