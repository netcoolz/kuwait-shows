"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaGlobe, FaChevronRight, FaChevronLeft, FaInfoCircle, FaTimes } from "react-icons/fa";
import Image from "next/image";

const gold = "#bc9b6a";
const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lang, setLang] = useState<"ar" | "en">("en");
  const [mounted, setMounted] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  const slides = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];

  const services = [
    ["نظام التسجيل", "Registration System", "/service1.jpg"],
    ["حجز الطاولات والرعايات", "Tables & Sponsors", "/service2.jpg"],
    ["تنظيم البطولة", "Event Management", "/service3.jpg"],
    ["الكؤوس والدروع", "Awards & Trophies", "/service4.jpg"],
    ["التنسيق الحكومي", "Government Coordination", "/service5.jpg"],
    ["الأمن والخدمات المسانده", "Security & Support", "/service6.jpg"],
    ["الإعلام والتسويق", "Media & Marketing", "/service7.jpg"],
  ];

  const servicesDetails: Record<string, any> = {
    "Registration System": {
      titleEn: "Registration System", titleAr: "نظام التسجيل",
      desc: `Digital Registration & Scoring Solutions\n\n• Full registration and fee collection system\n• Secure online payment processing\n• Integrated scoring and judging system`,
      descAr: `حلول التسجيل والتقييم الرقمية\n\n• نظام كامل للتسجيل وتحصيل الرسوم\n• معالجة آمنة للدفع الإلكتروني\n• نظام متكامل للتقييم والتحكيم`
    },
    "Tables & Sponsors": {
      titleEn: "Tables & Sponsors", titleAr: "حجز الطاولات والرعايات",
      desc: `VIP Tables & Sponsorship Management\n\n• Online booking system\n• Management of sponsorship packages\n• Secure fee collection`,
      descAr: `إدارة حجز الطاولات والرعايات\n\n• نظام حجز إلكتروني للطاولات\n• إدارة باقات الرعاية\n• تحصيل آمن للرسوم`
    },
    "Event Management": {
      titleEn: "Event Management", titleAr: "تنظيم البطولة",
      desc: `Full Championship Management\n\n• Arena setup\n• European tents & horse boxes\n• Full supervision`,
      descAr: `إدارة متكاملة للبطولة\n\n• تجهيز ساحة العرض\n• تركيب الخيام الأوروبية والبوكسات\n• إشراف كامل على الفعالية`
    },
    "Awards & Trophies": {
      titleEn: "Awards & Trophies", titleAr: "الكؤوس والدروع",
      desc: `Awards & Prize Management\n\n• Organizing categories\n• Award ceremonies\n• Trophy arrangements`,
      descAr: `إدارة الجوائز والتكريم\n\n• تنظيم الفئات\n• حفلات التتويج\n• تجهيز وتنسيق الكؤوس`
    },
    "Government Coordination": {
      titleEn: "Government Coordination", titleAr: "التنسيق الحكومي",
      desc: `Official & Government Liaison\n\n• Security, ambulance, fire services\n• Official communication`,
      descAr: `التنسيق الرسمي والحكومي\n\n• الجهات الأمنية والإسعاف والإطفاء\n• المراسلات الرسمية`
    },
    "Security & Support": {
      titleEn: "Security & Support", titleAr: "الأمن والخدمات المسانده",
      desc: `Safety & Operational Support\n\n• Professional security\n• Crowd control systems`,
      descAr: `الأمن والخدمات المساندة\n\n• خدمات أمن احترافية\n• أنظمة إدارة الحشود`
    },
    "Media & Marketing": {
      titleEn: "Media & Marketing", titleAr: "الإعلام والتسويق",
      desc: `Media Production & Promotion\n\n• LED screens\n• Photography & video\n• Media coverage`,
      descAr: `الخدمات الإعلامية والتسويقية\n\n• شاشات LED عملاقة\n• تصوير فوتوغرافي وفيديو\n• تغطية إعلامية شاملة`
    }
  };

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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1, transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } } },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 0 })
  };

  const t = {
    en: {
        updates: "Latest Updates", services: "Our Services", subtitle: "Horse Championship Management\nFrom planning to podium, we manage it all",
        luxTitle: "Luxury Horse Marketplace", aboutTitle: "What are Beauty Shows?", aboutDesc: "Discover the world of purebred Arabian horse championships.",
        ctaTitle: "Excellence Begins With a Conversation", ctaDesc: "Connect with Kuwait Shows to discuss championship strategies.",
        explore: "Explore", learnMore: "Learn More", close: "Close"
    },
    ar: {
        updates: "آخر التحديثات", services: "خدماتنا", subtitle: "إدارة احترافية لبطولات الخيل\nمن التخطيط إلى التتويج نحن نديرها",
        luxTitle: "سوق الخيل", aboutTitle: "ماهي بطولات الجمال ؟", aboutDesc: "اكتشف عالم بطولات جمال الخيل العربية الأصيلة.",
        ctaTitle: "التميز يبدأ بمحادثة", ctaDesc: "تواصل معنا لمناقشة استراتيجيات تنفيذ البطولة.",
        explore: "اكتشف", learnMore: "اقرأ المزيد", close: "إغلاق"
    }
  };

  if (!mounted) return null;

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="relative min-h-screen text-white pb-10 overflow-x-hidden">
      <div className="fixed inset-0 -z-20 w-full h-full" style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
      <div className="fixed inset-0 -z-10 bg-black/50 pointer-events-none" />

      <motion.button onClick={() => {
        const newLang = lang === "en" ? "ar" : "en";
        localStorage.setItem("lang", newLang);
        setLang(newLang);
        window.dispatchEvent(new Event("languageChange"));
      }} whileHover={{ scale: 1.05 }} className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-[#bc9b6a44] bg-black/60 backdrop-blur-md shadow-lg">
        <FaGlobe className="text-[#bc9b6a]" />
        <span className="font-semibold text-sm">{lang === "en" ? "العربية" : "English"}</span>
      </motion.button>

      {/* HERO SECTION WITH SCROLL DOWN */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero.jpg" alt="Hero" fill priority className="object-cover opacity-70 scale-105 animate-[slowZoom_20s_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter uppercase inline-block text-transparent bg-clip-text" style={{ backgroundImage: goldGradient }}>Kuwait Shows</h1>
            <div className="h-1 bg-[#bc9b6a] w-20 md:w-24 mx-auto my-6 rounded-full shadow-[0_0_15px_#bc9b6a]" />
            <p className="text-lg md:text-2xl font-bold text-white tracking-wide whitespace-pre-line drop-shadow-lg">{t[lang].subtitle}</p>
          </motion.div>
        </div>
        {/* 🌟 السهم الفخم المفقود */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-10 flex flex-col items-center gap-1 text-[#bc9b6a]">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-70">Scroll Down</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#bc9b6a] to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* MARKETPLACE & ABOUT */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link href="/sell" className="group">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative h-[350px] md:h-[400px] rounded-3xl overflow-hidden border border-[#bc9b6a44] bg-black/40 backdrop-blur-md shadow-2xl group-hover:border-[#bc9b6a] transition-all">
                <div className="p-10 flex flex-col h-full justify-between relative z-10">
                  <h2 className="text-3xl font-bold" style={{ color: gold }}>{t[lang].luxTitle}</h2>
                  <span className="inline-block w-fit px-8 py-3 rounded-full border border-[#bc9b6a] text-[#bc9b6a] group-hover:bg-[#bc9b6a] group-hover:text-black transition-all font-bold uppercase text-sm">{t[lang].explore}</span>
                </div>
                <Image src="/lux.jpg" alt="Lux" fill className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 z-0" />
            </motion.div>
          </Link>

          <Link href="/about-horses" className="group">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative h-[350px] md:h-[400px] rounded-3xl overflow-hidden border border-[#bc9b6a44] bg-black/40 backdrop-blur-md shadow-2xl group-hover:border-[#bc9b6a] transition-all">
                <div className="p-10 flex flex-col h-full justify-between relative z-10">
                  <h2 className="text-3xl font-bold" style={{ color: gold }}>{t[lang].aboutTitle}</h2>
                  <div className="flex items-center gap-3 text-[#bc9b6a] font-bold uppercase text-sm"><FaInfoCircle /> {t[lang].learnMore}</div>
                </div>
                <Image src="/about2.png" alt="About" fill className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 z-0" />
            </motion.div>
          </Link>
      </section>

      {/* UPDATES SLIDER */}
      <section className="py-20 bg-white/5 border-y border-[#bc9b6a22] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-12 uppercase tracking-widest" style={{ color: gold }}>{t[lang].updates}</motion.h2>
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-black/20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div key={slide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0 w-full h-full">
                <Image src={slides[slide]} alt="Slide" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => paginate(-1)} className="p-4 rounded-full bg-black/40 text-white hover:bg-[#bc9b6a] transition-all"><FaChevronLeft /></button>
              <button onClick={() => paginate(1)} className="p-4 rounded-full bg-black/40 text-white hover:bg-[#bc9b6a] transition-all"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID - 2 COLUMNS ON MOBILE */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold inline-block pb-4 border-b border-[#bc9b6a44] uppercase tracking-widest" style={{ color: gold }}>{t[lang].services}</h2>
          </motion.div>

          {/* 🌟 شبكة الخدمات: كرتين بالموبايل (grid-cols-2) */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                onClick={() => setActiveService(item[1])}
                className="group relative h-[180px] md:h-[300px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border border-[#bc9b6a22] hover:border-[#bc9b6a] transition-all shadow-2xl"
              >
                <Image src={item[2]} alt={item[1]} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                  <h3 className="text-sm md:text-xl font-bold text-white group-hover:text-[#bc9b6a] transition-colors">{lang === "en" ? item[1] : item[0]}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
      </section>

      {/* POPUP & FOOTER (نفس الكود السابق مع تأكيد عمل البوب اب) */}
      <AnimatePresence>
        {activeService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#111] border border-[#bc9b6a] rounded-[2rem] p-6 md:p-12 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[85vh]">
               <button onClick={() => setActiveService(null)} className="absolute top-6 right-6 text-gray-400 hover:text-[#bc9b6a] text-2xl"><FaTimes /></button>
               <h2 className="text-2xl md:text-3xl font-bold mb-6 pr-8" style={{ color: gold }}>{lang === "ar" ? servicesDetails[activeService].titleAr : servicesDetails[activeService].titleEn}</h2>
               <p className="text-gray-200 text-base md:text-lg leading-relaxed whitespace-pre-line font-light">{lang === "ar" ? servicesDetails[activeService].descAr : servicesDetails[activeService].desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer id="contact" className="py-24 border-t border-[#bc9b6a22] text-center bg-black/40 backdrop-blur-md relative">
        <Image src="/logo.png" alt="Logo" width={100} height={100} className="mx-auto mb-10 opacity-90" />
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 px-4 uppercase tracking-tighter" style={{ color: gold }}>{t[lang].ctaTitle}</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
            <a href="mailto:admin@kuwaitshows.com" className="flex items-center gap-4 py-4 px-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#bc9b6a] transition-all"><FaEnvelope className="text-[#bc9b6a]" /> <span className="text-sm md:text-base">admin@kuwaitshows.com</span></a>
            <a href="https://wa.me/96597944003" className="flex items-center gap-4 py-4 px-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#25D366] transition-all"><FaWhatsapp className="text-[#25D366]" /> <span className="text-sm md:text-base" dir="ltr">+965 97944003</span></a>
        </div>
        <div className="mt-24 text-[10px] text-gray-500 font-medium tracking-[0.5em] uppercase">© {new Date().getFullYear()} KUWAIT SHOWS. ALL RIGHTS RESERVED.</div>
      </footer>
    </main>
  );
}