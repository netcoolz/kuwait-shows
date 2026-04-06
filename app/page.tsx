"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaGlobe, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Image from "next/image";

const gold = "#bc9b6a";
const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [lang, setLang] = useState<"ar" | "en">("en");
  const [activeService, setActiveService] = useState<string | null>(null);

  // تحديث اللغة
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

  // 🌟 الكود السحري للتمرير التلقائي عند القدوم من صفحة أخرى
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, []);

  // تشغيل السلايدر تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // إبطاء السلايدر قليلاً ليعطي إحساساً بالفخامة
    return () => clearInterval(interval);
  }, []);

  const slides = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];

  const services = [
    { ar: "نظام التسجيل", en: "Registration System", img: "/service1.jpg" },
    { ar: "حجز الطاولات والرعايات", en: "Tables & Sponsors", img: "/service2.jpg" },
    { ar: "تنظيم البطولة", en: "Event Management", img: "/service3.jpg" },
    { ar: "الكؤوس والدروع", en: "Awards & Trophies", img: "/service4.jpg" },
    { ar: "التنسيق الحكومي", en: "Government Coordination", img: "/service5.jpg" },
    { ar: "الأمن والخدمات المسانده", en: "Security & Support", img: "/service6.jpg" },
    { ar: "الإعلام والتسويق", en: "Media & Marketing", img: "/service7.jpg" },
  ];

  const servicesDetails = {
    "Registration System": {
      title: "Registration System",
      desc: "Digital Registration & Scoring Solutions\n\nWe provide a complete digital system for managing Horse Championship registrations with high accuracy and professionalism, including:\n• Full registration and fee collection system\n• Secure online payment processing\n• Verification and approval of participant and horse data\n• Registration status management (Pending, Approved, Rejected)\n• Integrated scoring and judging system\n• Detailed reports for results and classifications",
      descAr: "حلول التسجيل والتقييم الرقمية\n\nنقدم نظامًا رقميًا متكاملًا لإدارة تسجيل بطولات الخيل بدقة واحترافية عالية، ويشمل\n• نظام كامل للتسجيل وتحصيل الرسوم\n• معالجة آمنة للدفع الإلكتروني\n• التحقق من بيانات المشاركين والخيل\n• إدارة حالات التسجيل (قيد الانتظار، مقبول، مرفوض)\n• نظام متكامل للتقييم والتحكيم\n• تقارير تفصيلية للنتائج"
    },
    "Tables & Sponsors": {
      title: "Tables & Sponsors",
      desc: "VIP Tables & Sponsorship Management\n\nWe offer a comprehensive system to manage VIP tables and sponsorship packages:\n• Online booking system for VIP and public tables\n• Management of sponsorship packages\n• Secure fee collection\n• VIP access control\n• Seating and venue planning",
      descAr: "إدارة حجز الطاولات والرعايات\n\nنقدم نظامًا شاملًا لإدارة الطاولات والرعايات\n• نظام حجز إلكتروني\n• إدارة باقات الرعاية\n• تحصيل آمن للرسوم\n• التحكم في دخول VIP\n• تنظيم الجلسات وتخطيط الموقع"
    },
    "Event Management": {
      title: "Event Management",
      desc: "Full Championship Management\n\nWe provide full organization services:\n• Planning and operations management\n• VIP & public seating\n• Hospitality & décor\n• Arena setup\n• European tents & horse boxes\n• Full supervision",
      descAr: "إدارة متكاملة للبطولة\n\nنقدم خدمات تنظيم شاملة\n• التخطيط والإدارة\n• ترتيب الجلوس\n• الضيافة والديكور\n• تجهيز ساحة العرض\n• تركيب الخيام والبوكسات\n• إشراف كامل"
    },
    "Awards & Trophies": {
      title: "Awards & Trophies",
      desc: "Awards & Prize Management\n\nWe handle all awards:\n• Organizing categories\n• Award ceremonies\n• Final rankings\n• Trophy arrangements\n• Prize distribution",
      descAr: "إدارة الجوائز والتكريم\n\nنتولى جميع جوانب الجوائز\n• تنظيم الفئات\n• حفلات التتويج\n• قوائم الفائزين\n• تجهيز الكؤوس\n• توزيع الجوائز"
    },
    "Government Coordination": {
      title: "Government Coordination",
      desc: "Official & Government Liaison\n\nWe manage all coordination:\n• Security, ambulance, fire services\n• Media & TV coordination\n• Official communication\n• Hotels & flights",
      descAr: "التنسيق الرسمي والحكومي\n\nنقوم بإدارة التنسيق:\n• الجهات الأمنية والإسعاف\n• الإعلام والتلفزيون\n• المراسلات الرسمية\n• الفنادق والطيران"
    },
    "Security & Support": {
      title: "Security & Support",
      desc: "Safety & Operational Support\n\nWe provide:\n• Professional security\n• Cleaning teams\n• Hostesses\n• Crowd control systems",
      descAr: "الأمن والخدمات المساندة\n\nنقدم\n• خدمات أمن احترافية\n• فرق تنظيف\n• طاقم استقبال\n• إدارة الحشود"
    },
    "Media & Marketing": {
      title: "Media & Marketing",
      desc: "Media Production & Promotion\n\nWe deliver:\n• LED screens\n• Sound systems & DJ\n• Photography & video\n• Media coverage\n• Official catalog design",
      descAr: "الخدمات الإعلامية والتسويقية\n\nنقدم:\n• شاشات عرض\n• أنظمة صوت\n• تصوير احترافي\n• تغطية إعلامية\n• تصميم الكتالوج"
    }
  };

  const t = {
    en: {
      updates: "Latest Updates",
      services: "Our Services",
      subtitle: "Horse Championship Management\nFrom planning to podium, we manage it all",
      ctaTitle: "Excellence Begins With a Conversation",
      ctaDesc: "Connect with Kuwait Shows to discuss partnerships, official coordination, and tailored championship execution strategies.",
      contact: "Contact Us",
      luxTitle: "Luxury Horse Marketplace",
    },
    ar: {
      updates: "آخر التحديثات",
      services: "خدماتنا",
      subtitle: "إدارة احترافية لبطولات الخيل\nمن المنصة إلى التتويج نحن نديرها",
      ctaTitle: "التميز يبدأ بمحادثة",
      ctaDesc: "تواصل معنا لمناقشة الشراكات والتنسيق الرسمي واستراتيجيات تنفيذ البطولة المصممة خصيصاً",
      contact: "تواصل معنا",
      luxTitle: "سوق الخيل",
    },
  };

  // إعدادات حركة الظهور
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen text-white pb-10"
    >
      {/* 🌌 Fixed Background Layer */}
      <div className="fixed inset-0 -z-20 bg-[#050505]" />
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />

      {/* 🌍 Language Switcher */}
      <motion.button
        onClick={toggleLang}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-[#bc9b6a44] bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(188,155,106,0.15)] hover:border-[#bc9b6a] transition-colors"
      >
        <FaGlobe className="text-[#bc9b6a] text-lg" />
        <span className="font-semibold tracking-wider text-sm">
          {lang === "en" ? "العربية" : "English"}
        </span>
      </motion.button>

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Arabian Horse"
            fill
            priority
            className="object-cover object-top opacity-60 scale-105 animate-[slowZoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 max-w-4xl mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase inline-block text-transparent bg-clip-text" style={{ backgroundImage: goldGradient }}>
              Kuwait Shows
            </h1>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-[#bc9b6a] mx-auto mb-8 rounded-full shadow-[0_0_15px_#bc9b6a]"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-3"
          >
            <p className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
              {t[lang].subtitle.split("\n")[0]}
            </p>
            <p className="text-lg md:text-xl font-light text-[#ddc9ab] tracking-wider drop-shadow-md">
              {t[lang].subtitle.split("\n")[1]}
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.a
          href="#explore"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-[#bc9b6a] hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#bc9b6a] to-transparent animate-pulse" />
        </motion.a>
      </section>

      {/* -------------------- MARKETPLACE BANNER -------------------- */}
      <section id="explore" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 xl:mx-auto">
          <Link href="/sell" className="block group">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="relative rounded-3xl overflow-hidden border border-[#bc9b6a44] shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-[#bc9b6a] group-hover:shadow-[0_0_40px_rgba(188,155,106,0.2)] transition-all duration-700 bg-black/50"
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-10 md:p-16 text-center md:text-start z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: gold }}>{t[lang].luxTitle}</h2>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto md:mx-0">
                    {lang === "ar" ? "اكتشف منصتنا الحصرية لبيع وشراء أرقى سلالات الخيل." : "Discover our exclusive platform for buying and selling the finest Horses."}
                  </p>
                  <span className="inline-block px-8 py-3 rounded-full bg-transparent border border-[#bc9b6a] text-[#bc9b6a] font-semibold tracking-wider group-hover:bg-[#bc9b6a] group-hover:text-black transition-colors duration-300">
                    {lang === "ar" ? "تصفح الخيل" : "Explore Horses"}
                  </span>
                </div>
                <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px]">
                  {/* استخدمنا الصورة الفاخرة للبانر */}
                  <Image src="/lux.jpg" alt="Luxury Horses" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* -------------------- UPDATES SLIDER -------------------- */}
      <section className="py-16 bg-[#0a0a0a]/50 border-y border-[#bc9b6a22]">
        <div className="max-w-5xl mx-auto px-4 xl:mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-12" style={{ color: gold }}>
            {t[lang].updates}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide}
                src={slides[slide]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* أزرار التحكم المخفية تظهر عند المرور */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => setSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))} className="p-3 rounded-full bg-black/50 text-white hover:bg-[#bc9b6a] transition backdrop-blur-sm">
                <FaChevronLeft />
              </button>
              <button onClick={() => setSlide((prev) => (prev + 1) % slides.length)} className="p-3 rounded-full bg-black/50 text-white hover:bg-[#bc9b6a] transition backdrop-blur-sm">
                <FaChevronRight />
              </button>
            </div>

            {/* نقاط السلايدر */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-8 bg-[#bc9b6a]" : "w-2 bg-white/50"}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------- SERVICES GRID -------------------- */}
      <section id="services" className="py-24">
        <div className="max-w-6xl mx-auto px-4 xl:mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold inline-block pb-4 border-b border-[#bc9b6a44]" style={{ color: gold }}>
              {t[lang].services}
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                onClick={() => setActiveService(item.en)}
                className="group relative h-[250px] rounded-2xl overflow-hidden cursor-pointer border border-[#bc9b6a33] hover:border-[#bc9b6a] transition-colors duration-500"
              >
                <Image src={item.img} alt={item.en} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/80 transition-colors" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-8 h-1 bg-[#bc9b6a] mb-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-bold text-white group-hover:text-[#bc9b6a] transition-colors">
                    {lang === "en" ? item.en : item.ar}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -------------------- SERVICE MODAL -------------------- */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#bc9b6a] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(188,155,106,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveService(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#bc9b6a] hover:text-black transition backdrop-blur-sm border border-white/10">
                ✕
              </button>

              <div className="relative h-[250px] w-full">
                <Image src={services.find(s => s.en === activeService)?.img || ""} alt="Service" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
              </div>

              <div className="p-8 md:p-10 -mt-10 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: gold }}>
                  {activeService && servicesDetails[activeService as keyof typeof servicesDetails]?.title}
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                  {activeService && (lang === "en" ? servicesDetails[activeService as keyof typeof servicesDetails]?.desc : servicesDetails[activeService as keyof typeof servicesDetails]?.descAr)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- FOOTER & CONTACT -------------------- */}
      <section id="contact" className="py-20 relative bg-[#050505] border-t border-[#bc9b6a22]">
        <div className="max-w-4xl mx-auto px-4 xl:mx-auto text-center">
          <img src="/logo.png" alt="Kuwait Shows Logo" className="w-20 mx-auto mb-8 opacity-80" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: gold }}>{t[lang].ctaTitle}</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">{t[lang].ctaDesc}</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <a href="mailto:admin@kuwaitshows.com" className="group flex items-center gap-3 text-gray-300 hover:text-white transition">
              <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#bc9b6a] transition-colors"><FaEnvelope className="text-[#bc9b6a]" /></div>
              <span>admin@kuwaitshows.com</span>
            </a>
            <a href="https://wa.me/96597944003" target="_blank" className="group flex items-center gap-3 text-gray-300 hover:text-white transition">
              <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#25D366] transition-colors"><FaWhatsapp className="text-[#25D366]" /></div>
              <span dir="ltr">+965 97944003</span>
            </a>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Kuwait Shows. All Rights Reserved.</p>
            <p>Designed for Excellence</p>
          </div>
        </div>
      </section>

      {/* -------------------- GLOBAL STYLES -------------------- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}} />
    </main>
  );
}