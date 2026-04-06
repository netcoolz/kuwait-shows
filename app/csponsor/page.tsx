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
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

const gold = "#bc9b6a";

export default function CorporateSponsor() {
  const [lang, setLang] = useState<"ar" | "en">("en");

  useEffect(() => {
    const updateLang = () => {
      const savedLang = localStorage.getItem("lang");
      if (savedLang === "ar" || savedLang === "en") {
        setLang(savedLang);
      } else {
        setLang("en");
      }
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
      contactTitle: "لنبدأ شراكة النجاح",
      contactDesc: "تواصل مع فريقنا المخصص للرعايات والشراكات الاستراتيجية.",
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
      contactTitle: "Let's Build a Successful Partnership",
      contactDesc: "Get in touch with our dedicated sponsorship and strategic partnerships team.",
      contact: "Contact Us",
    },
  };

  const icons = [FaGem, FaHandshake, FaUsers, FaChartLine, FaBullhorn, FaGlobe];
  const mediaIcons = [FaHashtag, FaUsers, FaGem, FaTv, FaGlobe];

  // أنيميشن الظهور المتدرج
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen text-white pb-20"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay داكن لضمان قراءة النصوص */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* المحتوى الرئيسي مع تجنب تداخل القائمة الجانبية (Sidebar) */}
      <div className="relative z-10 w-full md:pr-[250px] px-4 md:px-8 pt-10">
        
        <div className="max-w-6xl mx-auto">
          
          {/* 🌟 HERO SECTION */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center overflow-hidden rounded-3xl shadow-2xl border border-[#bc9b6a33]"
          >
            <img
              src="/sponsor1.jpg"
              alt="Sponsorship"
              className="absolute w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            <div className="relative z-10 max-w-4xl px-4">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide"
                style={{ color: gold, textShadow: "0px 4px 20px rgba(188, 155, 106, 0.4)" }}
              >
                {t[lang].title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-2xl text-gray-200 font-light"
              >
                {t[lang].subtitle}
              </motion.p>
            </div>
          </motion.section>

          {/* 📜 INTRO SECTION */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="py-16 max-w-4xl mx-auto text-center"
          >
            <div className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[#bc9b6a44] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bc9b6a] to-transparent opacity-50" />
              <p className="text-gray-300 leading-relaxed text-base md:text-xl font-medium">
                {t[lang].intro}
              </p>
            </div>
          </motion.section>

          {/* 💎 BENEFITS SECTION */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="py-10"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold inline-block pb-3 border-b-2" style={{ color: gold, borderColor: gold }}>
                {t[lang].benefitsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t[lang].benefits.map((item, i) => {
                const Icon = icons[i];
                return (
                  <div
                    key={i}
                    className="group bg-[#0a0a0a]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#bc9b6a33] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(188,155,106,0.15)] hover:border-[#bc9b6a]"
                  >
                    <div className="w-14 h-14 bg-[#bc9b6a11] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#bc9b6a33] transition-colors">
                      <Icon className="text-[#bc9b6a] text-2xl" />
                    </div>
                    <p className="text-gray-200 text-lg font-medium">{item}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* 📢 MEDIA CAMPAIGN SECTION */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="py-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold inline-block pb-3 border-b-2" style={{ color: gold, borderColor: gold }}>
                {t[lang].mediaTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {t[lang].media.map((item, i) => {
                const Icon = mediaIcons[i];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-gradient-to-br from-[#111] to-[#050505] p-5 rounded-2xl border border-gray-800 hover:border-[#bc9b6a88] transition-colors"
                  >
                    <div className="p-3 bg-black/50 rounded-xl border border-gray-700">
                      <Icon className="text-[#bc9b6a] text-xl" />
                    </div>
                    <p className="text-gray-300 text-sm md:text-base font-semibold">{item}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* 📸 GALLERY SECTION */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="py-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[2, 3, 4, 5].map((num) => (
                <div key={num} className="relative overflow-hidden rounded-2xl group aspect-square">
                  <img 
                    src={`/sponsor${num}.jpg`} 
                    alt={`Sponsor Event ${num}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              ))}
            </div>
          </motion.section>

          {/* ✉️ CONTACT SECTION */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
            className="text-center py-16 mt-10 bg-gradient-to-b from-[#111] to-black rounded-3xl border border-[#bc9b6a44] shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: gold }}>
              {t[lang].contactTitle}
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto px-4">
              {t[lang].contactDesc}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-6">
              <a
                href="https://wa.me/96597944003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(90deg, #25D366, #1ebe5d)", boxShadow: "0 10px 20px rgba(37, 211, 102, 0.2)" }}
              >
                <FaWhatsapp className="text-2xl" />
                WhatsApp +965 97944003
              </a>

              <a
                href="mailto:admin@kuwaitshows.com"
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 border border-[#bc9b6a] hover:bg-[#bc9b6a11]"
              >
                <FaEnvelope className="text-xl text-[#bc9b6a]" />
                admin@kuwaitshows.com
              </a>
            </div>
          </motion.section>

        </div>
      </div>
    </main>
  );
}