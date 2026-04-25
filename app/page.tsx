"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaGlobe, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import Image from "next/image";

const gold = "#bc9b6a";

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("en");
  const [mounted, setMounted] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [popupService, setPopupService] = useState<any>(null);

  const services = [
    { id: 1, titleAr: "التسجيل والتحكيم", titleEn: "Registration & Scoring", img: "/service1.jpg", descEn: "Full digital registration and automated scoring system tailored for ECAHO standards.", descAr: "نظام رقمي متكامل للتسجيل والتحكيم الآلي مصمم وفق أحدث معايير الإيكاهو بدقة متناهية." },
    { id: 2, titleAr: "الطاولات والرعايات", titleEn: "VIP Tables", img: "/service2.jpg", descEn: "Exclusive management of VIP tables, ticketing, and premium sponsorship placements.", descAr: "إدارة حصرية وفارهة لحجوزات طاولات كبار الشخصيات وباقات الرعاية المتميزة." },
    { id: 3, titleAr: "تنظيم البطولة", titleEn: "Event Management", img: "/service3.jpg", descEn: "End-to-end arena setup, from stabling to the final crowning podium.", descAr: "تجهيز متكامل للميدان، بدءاً من الإسطبلات الأوروبية وحتى منصة التتويج النهائية." },
    { id: 4, titleAr: "الكؤوس والدروع", titleEn: "Awards & Trophies", img: "/service4.jpg", descEn: "Premium bespoke trophies, garlands, and award ceremony coordination.", descAr: "تصميم وتجهيز كؤوس وأكاليل فاخرة وتنسيق كامل لمراسم التتويج الملكية." },
    { id: 5, titleAr: "الأمن والإعلام", titleEn: "Security & Media", img: "/service6.jpg", descEn: "Crowd control, LED broadcasting, and comprehensive media coverage.", descAr: "إدارة الحشود، بث مباشر عبر شاشات عملاقة، وتغطية إعلامية سينمائية للحدث." }
  ];

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("lang") as "ar" | "en";
    if (savedLang) setLang(savedLang);
    const handleLangChange = () => {
      const newLang = localStorage.getItem("lang") as "ar" | "en";
      if (newLang) setLang(newLang);
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const t = useMemo(() => ({
    en: {
        heroSub: "The Elite Standard", heroTitle: "FROM THE ARENA\nTO THE PODIUM", heroDesc: "Mastering the art of Arabian Horse Championships through cutting-edge technology and flawless execution.",
        marquee: "REGISTRATION OPEN FOR 2026 SEASON  •  NEW DIGITAL SCORING SYSTEM LIVE  •  BOOK YOUR VIP TABLE NOW  •  ",
        aboutTitle: "The Marketplace", aboutDesc: "Where legacy meets opportunity. Discover world-class Arabian horses.",
        guideTitle: "Show Guide", guideDesc: "The ultimate reference for ECAHO standards and beauty shows.",
        servicesTitle: "OUR ECOSYSTEM",
        ctaTitle: "LET'S BUILD YOUR NEXT EVENT", btn: "Contact Us", explore: "Discover"
    },
    ar: {
        heroSub: "المعيار النخبوي للبطولات", heroTitle: "من المنصة\nلتتويج", heroDesc: "نصنع الفخامة في إدارة بطولات الخيل العربية من خلال أحدث التقنيات الرقمية والتنفيذ الخالي من العيوب.",
        marquee: "باب التسجيل مفتوح لموسم 2026  •  تم إطلاق نظام التحكيم الرقمي الجديد كلياً  •  احجز طاولتك الخاصة الآن  •  ",
        aboutTitle: "سوق الخيل الفاخر", aboutDesc: "حيث تلتقي العراقة بالفرص. استكشف واقتنِ نخبة الخيل العربية الأصيلة.",
        guideTitle: "دليل البطولات", guideDesc: "المرجع الشامل والدقيق لمعايير الإيكاهو وبطولات جمال الخيل.",
        servicesTitle: "منظومتنا المتكاملة",
        ctaTitle: "لنبني بطولتك القادمة", btn: "تواصل معنا للبدء", explore: "اكتشف الآن"
    }
  }), []);

  if (!mounted) return null;

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="relative min-h-screen text-[#f4f4f4] selection:bg-[#bc9b6a] selection:text-[#050B18]">
      
      {/* 🌌 ORIGINAL FIXED BACKGROUND */}
      <div className="fixed inset-0 z-[-20] w-full h-full pointer-events-none" style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
      <div className="fixed inset-0 z-[-10] bg-gradient-to-b from-[#050B18]/90 via-[#050B18]/70 to-[#050B18]/95 pointer-events-none" />

      {/* LANGUAGE SWITCHER */}
      <button onClick={() => {
        const newLang = lang === "en" ? "ar" : "en";
        localStorage.setItem("lang", newLang);
        setLang(newLang);
        window.dispatchEvent(new Event("languageChange"));
      }} className="fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#bc9b6a] hover:text-[#bc9b6a] transition-all duration-500">
        <FaGlobe className="text-xl" />
        <span className={`font-bold text-xs uppercase ${lang === 'en' ? 'tracking-widest' : ''}`}>{lang === "en" ? "العربية" : "English"}</span>
      </button>

      {/* 1. THE AWARD-WINNING HERO */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden pt-10">
        
        {/* Massive Background Text moving slowly */}
        <motion.div 
            animate={{ x: ["-5%", "5%"] }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear", repeatType: "reverse" }}
            className="absolute top-1/4 w-full text-center z-0 pointer-events-none opacity-[0.03]"
        >
            <h1 className="text-[20vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">
                KUWAIT SHOWS
            </h1>
        </motion.div>

        {/* Foreground Arch Image */}
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-[90%] max-w-[400px] h-[50vh] md:h-[55vh] mt-10 rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#bc9b6a]/30 shadow-[0_0_50px_rgba(188,155,106,0.1)]">
            <Image src="/hero.jpg" alt="Hero" fill priority className="object-cover scale-110 animate-[slowZoom_20s_infinite_alternate]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* Editorial Text Overlapping the Image */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-20 text-center -mt-16 md:-mt-24 px-4">
            <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-[#bc9b6a] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-[1.2]">
                {t[lang].heroTitle}
            </h2>
            <div className="flex flex-col items-center gap-4 mt-6">
                <span className={`px-5 py-2 border border-[#bc9b6a]/50 text-[#bc9b6a] text-xs font-bold rounded-full bg-[#050B18]/50 backdrop-blur-md ${lang === 'en' ? 'uppercase tracking-[0.3em]' : ''}`}>
                    {t[lang].heroSub}
                </span>
                <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl leading-[1.8] drop-shadow-md">
                    {t[lang].heroDesc}
                </p>
            </div>
        </motion.div>
      </section>

      {/* 2. THE INFINITE MARQUEE */}
      <div className="w-full bg-[#bc9b6a] py-5 overflow-hidden flex items-center shadow-2xl relative z-30">
        <motion.div 
            animate={{ x: lang === 'en' ? ["0%", "-50%"] : ["-50%", "0%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className={`flex whitespace-nowrap text-[#050B18] font-black text-sm md:text-base ${lang === 'en' ? 'uppercase tracking-[0.2em]' : ''}`}
        >
            <span>{t[lang].marquee}&nbsp;&nbsp;&nbsp;{t[lang].marquee}&nbsp;&nbsp;&nbsp;{t[lang].marquee}</span>
        </motion.div>
      </div>

      {/* 3. THE INTERACTIVE ACCORDION (الخدمات) */}
      <section id="services" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-[#bc9b6a] leading-[1.4]">
                  {t[lang].servicesTitle}
              </h2>
              <div className="w-20 h-1 bg-[#bc9b6a] mt-6 opacity-50" />
          </motion.div>

          {/* Desktop Accordion */}
          <div className="hidden md:flex w-full h-[60vh] min-h-[500px] gap-4">
              {services.map((item) => (
                  <div 
                      key={item.id}
                      onMouseEnter={() => setActiveService(item.id)}
                      onMouseLeave={() => setActiveService(null)}
                      onClick={() => setPopupService(item)}
                      className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex border border-white/10 bg-[#050B18] group ${activeService === item.id ? 'flex-[4] shadow-[0_0_40px_rgba(188,155,106,0.2)] border-[#bc9b6a]/50' : activeService === null ? 'flex-1' : 'flex-[0.5] opacity-50 grayscale'}`}
                  >
                      <Image src={item.img} alt={item.titleEn} fill className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/40 to-transparent" />
                      
                      {/* Vertical Title (When Collapsed) */}
                      <div className={`absolute inset-0 flex items-end p-8 transition-opacity duration-500 ${activeService === item.id ? 'opacity-0' : 'opacity-100'}`}>
                          <h3 className={`text-xl font-bold text-white whitespace-nowrap origin-bottom-left -rotate-90 translate-y-20 translate-x-4 ${lang === 'en' ? 'uppercase tracking-widest' : ''}`}>
                              {lang === "en" ? item.titleEn : item.titleAr}
                          </h3>
                      </div>

                      {/* Full Content (When Expanded) */}
                      <div className={`absolute bottom-0 left-0 w-full p-10 transition-all duration-700 ${activeService === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                          <h3 className="text-3xl lg:text-4xl font-black text-[#bc9b6a] mb-4 leading-[1.6]">
                              {lang === "en" ? item.titleEn : item.titleAr}
                          </h3>
                          <p className="text-gray-300 font-medium text-lg max-w-lg leading-[1.8] line-clamp-2">
                              {lang === "ar" ? item.descAr : item.descEn}
                          </p>
                          <span className={`mt-6 inline-flex items-center gap-3 text-white font-bold text-sm border-b border-[#bc9b6a] pb-1 hover:text-[#bc9b6a] transition-colors ${lang === 'en' ? 'tracking-widest uppercase' : ''}`}>
                              {t[lang].explore} {lang === "ar" ? <FaArrowLeft /> : <FaArrowRight />}
                          </span>
                      </div>
                  </div>
              ))}
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden flex-col gap-6">
               {services.map((item) => (
                  <motion.div 
                      key={item.id}
                      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
                      onClick={() => setPopupService(item)}
                      className="relative h-[250px] rounded-3xl overflow-hidden border border-white/10"
                  >
                      <Image src={item.img} alt={item.titleEn} fill className="object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-2xl font-black text-[#bc9b6a] mb-2 leading-[1.6]">{lang === "en" ? item.titleEn : item.titleAr}</h3>
                          <p className="text-gray-300 text-sm font-medium line-clamp-2 leading-[1.8]">{lang === "ar" ? item.descAr : item.descEn}</p>
                      </div>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* 4. SPLIT EDITORIAL CARDS (صورة كاملة بدون قص الأطراف) */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Link href="/sell" className="group">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col gap-6 h-full">
                  {/* إزالة aspect ratio ليأخذ الصورة كاملة وبطبيعتها */}
                  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:border-[#bc9b6a]/50 transition-colors duration-500">
                      <Image src="/lux.jpg" alt="Lux" fill className="object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </div>
                  <div className="px-2">
                      <h2 className="text-3xl md:text-4xl font-black mb-4 text-white group-hover:text-[#bc9b6a] transition-colors leading-[1.6]">{t[lang].aboutTitle}</h2>
                      <p className="text-gray-400 font-medium text-lg leading-[1.8]">{t[lang].aboutDesc}</p>
                  </div>
              </motion.div>
          </Link>

          <Link href="/about-horses" className="group lg:mt-32">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col gap-6 h-full">
                  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:border-[#bc9b6a]/50 transition-colors duration-500">
                      <Image src="/about2.png" alt="Guide" fill className="object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </div>
                  <div className="px-2">
                      <h2 className="text-3xl md:text-4xl font-black mb-4 text-white group-hover:text-[#bc9b6a] transition-colors leading-[1.6]">{t[lang].guideTitle}</h2>
                      <p className="text-gray-400 font-medium text-lg leading-[1.8]">{t[lang].guideDesc}</p>
                  </div>
              </motion.div>
          </Link>
      </section>

      {/* POPUP MODAL FOR SERVICES */}
      <AnimatePresence>
        {popupService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050B18]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-[#050B18] border border-[#bc9b6a]/30 rounded-[2.5rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl">
               <button onClick={() => setPopupService(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white text-2xl p-2"><FaTimes /></button>
               <span className={`text-[#bc9b6a] text-xs font-bold block mb-4 ${lang === 'en' ? 'uppercase tracking-[0.3em]' : ''}`}>Kuwait Shows Core</span>
               <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-[1.6]">
                   {lang === "ar" ? popupService.titleAr : popupService.titleEn}
               </h2>
               <div className="w-full h-[1px] bg-white/10 mb-8" />
               <p className="text-gray-300 text-lg md:text-xl leading-[1.8] font-medium">
                   {lang === "ar" ? popupService.descAr : popupService.descEn}
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MINIMALIST LUXURY CTA & FOOTER */}
      <footer id="contact" className="pt-32 pb-12 relative max-w-5xl mx-auto px-6 text-center mt-20 border-t border-[#bc9b6a]/20">
        
        <h2 className="text-5xl md:text-7xl font-black mb-16 text-white leading-[1.4] drop-shadow-lg">{t[lang].ctaTitle}</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-32">
            <a href="mailto:admin@kuwaitshows.com" className="w-full md:w-auto flex justify-center items-center gap-4 py-5 px-12 rounded-full bg-[#bc9b6a] text-[#050B18] font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(188,155,106,0.3)]">
                <FaEnvelope className="text-xl" /> <span className={lang === 'en' ? 'uppercase tracking-widest' : ''}>{t[lang].btn}</span>
            </a>
            <a href="https://wa.me/96597944003" dir="ltr" className="w-full md:w-auto flex justify-center items-center gap-4 py-5 px-12 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10">
                <FaWhatsapp className="text-[#25D366] text-xl" /> +965 97944003
            </a>
        </div>
        
        <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto mb-6 opacity-30 hover:opacity-100 transition-opacity duration-500" />
        <div className="text-[10px] text-gray-500 font-black tracking-[0.5em] uppercase">
            © {new Date().getFullYear()} KUWAIT SHOWS.
        </div>
      </footer>

      {/* GLOBAL KEYFRAMES */}
      <style jsx global>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #050B18;
        }
        ::-webkit-scrollbar-thumb {
          background: #bc9b6a;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}