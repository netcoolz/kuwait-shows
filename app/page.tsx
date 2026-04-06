"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaGlobe, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Image from "next/image";

const gold = "#bc9b6a";
const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lang, setLang] = useState<"ar" | "en">("en");
  const [activeService, setActiveService] = useState<string | null>(null);

  const slides = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "ar" | "en";
    if (savedLang) setLang(savedLang);
    const handleLangChange = () => {
      const newLang = localStorage.getItem("lang") as "ar" | "en";
      if (newLang) setLang(newLang);
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }
    })
  };

  const services = [
    { ar: "نظام التسجيل", en: "Registration System", img: "/service1.jpg" },
    { ar: "حجز الطاولات والرعايات", en: "Tables & Sponsors", img: "/service2.jpg" },
    { ar: "تنظيم البطولة", en: "Event Management", img: "/service3.jpg" },
    { ar: "الكؤوس والدروع", en: "Awards & Trophies", img: "/service4.jpg" },
    { ar: "التنسيق الحكومي", en: "Government Coordination", img: "/service5.jpg" },
    { ar: "الأمن والخدمات المسانده", en: "Security & Support", img: "/service6.jpg" },
    { ar: "الإعلام والتسويق", en: "Media & Marketing", img: "/service7.jpg" },
  ];

  const t = {
    en: {
        updates: "Latest Updates",
        services: "Our Services",
        subtitle: "Horse Championship Management\nFrom planning to podium, we manage it all",
        luxTitle: "Luxury Horse Marketplace",
        ctaTitle: "Excellence Begins With a Conversation",
        ctaDesc: "Connect with Kuwait Shows to discuss partnerships, official coordination, and tailored championship execution strategies.",
    },
    ar: {
        updates: "آخر التحديثات",
        services: "خدماتنا",
        subtitle: "إدارة احترافية لبطولات الخيل\nمن المنصة إلى التتويج نحن نديرها",
        luxTitle: "سوق الخيل",
        ctaTitle: "التميز يبدأ بمحادثة",
        ctaDesc: "تواصل معنا لمناقشة الشراكات والتنسيق الرسمي واستراتيجيات تنفيذ البطولة المصممة خصيصاً",
    }
  };

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="relative min-h-screen text-white pb-10 overflow-x-hidden">
      
      {/* 🖼️ GLOBAL BACKGROUND (bg.png) */}
      <div 
        className="fixed inset-0 -z-20 w-full h-full"
        style={{ 
          backgroundImage: "url('/bg.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundAttachment: "fixed" 
        }} 
      />
      <div className="fixed inset-0 -z-10 bg-black/40 pointer-events-none" />

      {/* 🌍 Language Switcher */}
      <motion.button onClick={toggleLang} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-[#bc9b6a44] bg-black/60 backdrop-blur-md shadow-lg hover:border-[#bc9b6a] transition-all">
        <FaGlobe className="text-[#bc9b6a]" />
        <span className="font-semibold text-sm">{lang === "en" ? "العربية" : "English"}</span>
      </motion.button>

      {/* -------------------- HERO SECTION (FULL SCREEN) -------------------- */}
      {/* 🔥 تم تعديل الارتفاع إلى h-screen ليملأ الشاشة بالكامل عند الدخول */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Arabian Horse"
            fill
            priority
            className="object-cover object-[75%_center] md:object-top opacity-70 scale-105 animate-[slowZoom_20s_infinite_alternate]"
          />
          {/* تدرج لوني يدمج الصورة مع الخلفية بشكل انسيابي في الأسفل */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>

        <div className="relative z-10 px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter uppercase inline-block text-transparent bg-clip-text" style={{ backgroundImage: goldGradient }}>
              Kuwait Shows
            </h1>
            <div className="h-1 bg-[#bc9b6a] w-20 md:w-24 mx-auto my-6 rounded-full shadow-[0_0_15px_#bc9b6a]" />
            <div className="space-y-2">
              <p className="text-lg md:text-2xl font-bold text-white tracking-wide drop-shadow-lg px-2">{t[lang].subtitle.split("\n")[0]}</p>
              <p className="text-sm md:text-xl font-light text-[#ddc9ab] tracking-widest uppercase">{t[lang].subtitle.split("\n")[1]}</p>
            </div>
          </motion.div>
        </div>

        {/* سهم مؤشر للنزول */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-10 flex flex-col items-center gap-1 text-[#bc9b6a]">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-70">Scroll Down</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#bc9b6a] to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* -------------------- باقي المحتوى يظهر عند النزول -------------------- */}
      
      {/* MARKETPLACE BANNER */}
      <section id="explore" className="py-24 max-w-6xl mx-auto px-4">
          <Link href="/sell" className="block group">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="relative rounded-3xl overflow-hidden border border-[#bc9b6a44] bg-black/40 backdrop-blur-md shadow-2xl group-hover:border-[#bc9b6a] transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-16 flex-1 text-center md:text-start">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: gold }}>{t[lang].luxTitle}</h2>
                  <p className="text-gray-200 mb-8 max-w-sm mx-auto md:mx-0">{lang === "ar" ? "اكتشف منصتنا الحصرية لبيع وشراء أرقى سلالات الخيل العربية." : "Explore our exclusive platform for premium horse trading."}</p>
                  <span className="px-8 py-3 rounded-full border border-[#bc9b6a] text-[#bc9b6a] group-hover:bg-[#bc9b6a] group-hover:text-black transition-all font-bold">Explore</span>
                </div>
                <div className="relative w-full md:w-1/2 h-64 md:h-[400px]">
                  <Image src="/lux.jpg" alt="Lux" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </Link>
      </section>

      {/* UPDATES SLIDER */}
      <section className="py-20 bg-white/5 backdrop-blur-sm border-y border-[#bc9b6a22] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-12" style={{ color: gold }}>
            {t[lang].updates}
          </motion.h2>

          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)] border border-white/10 group bg-black/20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={slide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <Image src={slides[slide]} alt="Update" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => paginate(-1)} className="p-4 rounded-full bg-black/40 text-white hover:bg-[#bc9b6a] transition-all backdrop-blur-md border border-white/10"><FaChevronLeft /></button>
              <button onClick={() => paginate(1)} className="p-4 rounded-full bg-black/40 text-white hover:bg-[#bc9b6a] transition-all backdrop-blur-md border border-white/10"><FaChevronRight /></button>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-10 bg-[#bc9b6a]" : "w-3 bg-white/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-24 max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold inline-block pb-4 border-b border-[#bc9b6a44]" style={{ color: gold }}>{t[lang].services}</h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative h-[250px] rounded-2xl overflow-hidden cursor-pointer border border-[#bc9b6a22] hover:border-[#bc9b6a] transition-all duration-500 shadow-xl"
              >
                <Image src={item.img} alt={item.en} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#bc9b6a] transition-colors">{lang === "en" ? item.en : item.ar}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
      </section>

      {/* FOOTER */}
      <section className="py-20 border-t border-[#bc9b6a22] text-center bg-black/20 backdrop-blur-sm">
        <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto mb-8 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 px-4" style={{ color: gold }}>{t[lang].ctaTitle}</h2>
        <p className="text-gray-300 mb-10 max-w-lg mx-auto px-6 font-light">{t[lang].ctaDesc}</p>
        <div className="flex flex-wrap justify-center gap-6 px-4">
            <a href="mailto:admin@kuwaitshows.com" className="flex items-center gap-3 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#bc9b6a] transition-all">
                <FaEnvelope className="text-[#bc9b6a]" /> <span className="text-sm">admin@kuwaitshows.com</span>
            </a>
            <a href="https://wa.me/96597944003" className="flex items-center gap-3 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#25D366] transition-all">
                <FaWhatsapp className="text-[#25D366]" /> <span className="text-sm" dir="ltr">+965 97944003</span>
            </a>
        </div>
        <div className="mt-20 text-xs text-gray-500 font-light tracking-widest uppercase">© {new Date().getFullYear()} Kuwait Shows. All Rights Reserved.</div>
      </section>

      <style jsx global>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
}