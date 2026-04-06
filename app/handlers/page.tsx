"use client";

import { handlers } from "../data/handlers";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion"; // 🔥 أضفنا Variants هنا
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function HandlersPage() {
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateLang = () => {
      const saved = localStorage.getItem("lang");
      if (saved) setLang(saved);
    };

    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  if (!mounted) return null;

  const isAr = lang === "ar";

  // 🔥 أخبرنا TypeScript أن هذه المتغيرات من نوع Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="relative min-h-screen text-white pb-24"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🌌 Background Overlay */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-4 md:px-10 pt-24 max-w-screen-2xl mx-auto">
        
        {/* 🌟 HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-block px-6 py-2 rounded-full border border-[#bc9b6a44] bg-white/5 backdrop-blur-sm mb-4 shadow-[0_0_15px_rgba(188,155,106,0.1)]">
            <span className="tracking-widest text-xs font-bold text-[#bc9b6a] uppercase">
              {isAr ? "نخبة العارضين" : "Elite Handlers"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#ddc9ab] via-[#bc9b6a] to-[#8c6a3f] text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {isAr ? "عارضين الخيل" : "Horse Handlers"}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
            {isAr
              ? "اكتشف نخبة عارضي الخيل العربية من مختلف أنحاء العالم. تجمع كويت شووز أفضل الخبرات في تقديم وعرض الخيل باحترافية عالية في البطولات الدولية."
              : "Discover top Arabian horse handlers from around the world. Kuwait Shows brings together experienced professionals in horse presentation and championships."}
          </p>
        </motion.div>

        {/* 🖼️ HANDLERS GRID (الحجم الفاخر الكبير) */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {handlers.map((h, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="group relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-[#bc9b6a22] hover:border-[#bc9b6a] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(188,155,106,0.2)] flex flex-col"
            >
              {/* Image Area */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-black">
                <img 
                  src={h.image} 
                  alt={h.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent opacity-90" />
                
                {/* Flag & Country Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                  <img src={h.flag} alt={h.country} className="w-5 h-5 rounded-sm object-cover" />
                  <span className="text-white text-xs font-medium tracking-wide">{h.country}</span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-6 relative z-10 flex flex-col items-center -mt-16 text-center">
                <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md group-hover:text-[#bc9b6a] transition-colors">{h.name}</h2>
                <p className="text-[#bc9b6a] text-sm font-medium tracking-widest uppercase mb-6">
                  {isAr ? "عارض خيل محترف" : "Professional Handler"}
                </p>

                {/* Contact Buttons */}
                <div className="flex gap-4 w-full">
                  <a
                    href={`https://wa.me/${h.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white hover:text-[#25D366] transition-all duration-300"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="text-xl" />
                  </a>
                  
                  <a
                    href={`mailto:${h.email}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#bc9b6a] hover:bg-[#bc9b6a]/10 text-white hover:text-[#bc9b6a] transition-all duration-300"
                    aria-label="Email"
                  >
                    <FaEnvelope className="text-lg" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🚀 JOIN US CTA (Call to Action) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#bc9b6a44] rounded-3xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-[#bc9b6a] opacity-[0.05] blur-[50px] pointer-events-none" />

            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              {isAr ? "هل أنت عارض خيل محترف؟" : "Are you a Professional Handler?"}
            </h3>
            <p className="text-gray-400 text-lg mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? "انضم إلى شبكة كويت شووز العالمية واعرض مهاراتك لملاك الخيل والمهتمين بالبطولات. أرسل لنا بياناتك الآن."
                : "Join the Kuwait Shows global network and showcase your skills to horse owners and championship enthusiasts. Send us your details now."}
            </p>

            <a
              href="https://wa.me/96597944003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-black transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(188,155,106,0.3)] hover:shadow-[0_0_30px_rgba(188,155,106,0.5)]"
              style={{ background: goldGradient }}
            >
              <FaWhatsapp className="text-xl" />
              {isAr ? "تواصل معنا للانضمام" : "Contact us to Join"}
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  );
}