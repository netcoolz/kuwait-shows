"use client";

import { handlers } from "../data/handlers";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
      <div className="absolute inset-0 bg-black/85 pointer-events-none" />

      <div className="relative z-10 w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-4 md:px-10 pt-24 max-w-screen-2xl mx-auto">
        
        {/* 🌟 HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="inline-block px-5 py-1.5 rounded-full border border-[#bc9b6a44] bg-white/5 backdrop-blur-sm mb-4 shadow-[0_0_15px_rgba(188,155,106,0.1)]">
            <span className="tracking-widest text-[10px] md:text-xs font-bold text-[#bc9b6a] uppercase">
              {isAr ? "نخبة العارضين" : "Elite Handlers"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#ddc9ab] via-[#bc9b6a] to-[#8c6a3f] text-transparent bg-clip-text drop-shadow-md">
            {isAr ? "عارضين الخيل" : "Horse Handlers"}
          </h1>
          <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed">
            {isAr
              ? "اكتشف نخبة عارضي الخيل العربية من مختلف أنحاء العالم باحترافية عالية."
              : "Discover top Arabian horse handlers from around the world."}
          </p>
        </motion.div>

        {/* 🖼️ HANDLERS GRID (2 Columns - Smaller Size) */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto" // تم تحديد العرض هنا لتصغير الكروت
        >
          {handlers.map((h, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="group relative bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl overflow-hidden border border-[#bc9b6a22] hover:border-[#bc9b6a] transition-all duration-500 hover:-translate-y-1 flex flex-col shadow-xl"
            >
              {/* Image Area - Square Aspect Ratio */}
              <div className="relative w-full aspect-square overflow-hidden bg-black">
                <img 
                  src={h.image} 
                  alt={h.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-90" />
                
                {/* Flag Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                  <img src={h.flag} alt={h.country} className="w-3.5 h-3.5 rounded-sm object-cover" />
                  <span className="text-white text-[9px] font-medium tracking-wide uppercase">{h.country}</span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 relative z-10 flex flex-col items-center -mt-6 text-center">
                <h2 className="text-base md:text-xl font-bold text-white mb-0.5 truncate w-full drop-shadow-md group-hover:text-[#bc9b6a] transition-colors">
                  {h.name}
                </h2>
                <p className="text-[#bc9b6a] text-[9px] md:text-[11px] font-medium tracking-widest uppercase mb-4">
                  {isAr ? "عارض خيل" : "Horse Handler"}
                </p>

                {/* Contact Buttons */}
                <div className="flex gap-2 w-full">
                  <a
                    href={`https://wa.me/${h.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white hover:text-[#25D366] transition-all duration-300"
                  >
                    <FaWhatsapp className="text-lg" />
                  </a>
                  
                  <a
                    href={`mailto:${h.email}`}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#bc9b6a] hover:bg-[#bc9b6a]/10 text-white hover:text-[#bc9b6a] transition-all duration-300"
                  >
                    <FaEnvelope className="text-base" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🚀 JOIN US CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#bc9b6a44] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#bc9b6a] opacity-[0.05] blur-[40px] pointer-events-none" />

            <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
              {isAr ? "هل أنت عارض خيل محترف؟" : "Are you a Professional Handler?"}
            </h3>
            <p className="text-gray-400 text-sm mb-6 font-light leading-relaxed">
              {isAr
                ? "انضم إلى شبكة كويت شووز العالمية وأرسل لنا بياناتك الآن."
                : "Join the Kuwait Shows global network and send us your details now."}
            </p>

            <a
              href="https://wa.me/96597944003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-black text-sm transition-all duration-300 hover:scale-105"
              style={{ background: goldGradient }}
            >
              <FaWhatsapp className="text-lg" />
              {isAr ? "انضم إلينا" : "Join us Now"}
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  );
}