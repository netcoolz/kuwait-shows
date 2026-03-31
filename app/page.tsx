"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";



const gold = "#bc9b6a";

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [lang, setLang] = useState("en");
const toggleLang = () => {
  const newLang = lang === "en" ? "ar" : "en";
  localStorage.setItem("lang", newLang);
  setLang(newLang);

  window.dispatchEvent(new Event("languageChange"));
};

const [isInteracting, setIsInteracting] = useState(false);
useEffect(() => {
  if (isInteracting) return;

  const interval = setInterval(() => {
    setSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(interval);
}, [isInteracting]);
  const [activeService, setActiveService] = useState(null);

  const slides = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];

useEffect(() => {
  const interval = setInterval(() => {
    setSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang) setLang(savedLang);

  const handleLangChange = () => {
    const newLang = localStorage.getItem("lang");
    if (newLang) setLang(newLang);
  };

  window.addEventListener("languageChange", handleLangChange);

  return () => {
    window.removeEventListener("languageChange", handleLangChange);
  };
}, []);
  const services = [
    ["نظام التسجيل", "Registration System", "/service1.jpg"],
    ["حجز الطاولات والرعايات", "Tables & Sponsors", "/service2.jpg"],
    ["تنظيم البطولة", "Event Management", "/service3.jpg"],
    ["الكؤوس والدروع", "Awards & Trophies", "/service4.jpg"],
    ["التنسيق الحكومي", "Government Coordination", "/service5.jpg"],
    ["الأمن والخدمات المسانده", "Security & Support", "/service6.jpg"],
    ["الإعلام والتسويق", "Media & Marketing", "/service7.jpg"],
  ];

 const servicesDetails = {

  "Registration System": {
    title: "Registration System",
    desc: `Digital Registration & Scoring Solutions

We provide a complete digital system for managing Arabian Horse Championship registrations with high accuracy and professionalism, including:
• Full registration and fee collection system
• Secure online payment processing
• Verification and approval of participant and horse data
• Registration status management (Pending, Approved, Rejected)
• Integrated scoring and judging system
• Detailed reports for results and classifications`,
    descAr: `حلول التسجيل والتقييم الرقمية

نقدم نظامًا رقميًا متكاملًا لإدارة تسجيل بطولات الخيل العربية بدقة واحترافية عالية، ويشمل
• نظام كامل للتسجيل وتحصيل الرسوم
• معالجة آمنة للدفع الإلكتروني
• التحقق من بيانات المشاركين والخيل
• إدارة حالات التسجيل (قيد الانتظار، مقبول، مرفوض)
• نظام متكامل للتقييم والتحكيم
• تقارير تفصيلية للنتائج`
  },

  "Tables & Sponsors": {
    title: "Tables & Sponsors",
    desc: `VIP Tables & Sponsorship Management

We offer a comprehensive system to manage VIP tables and sponsorship packages:
• Online booking system for VIP and public tables
• Management of sponsorship packages
• Secure fee collection
• VIP access control
• Seating and venue planning`,
    descAr: `إدارة حجز الطاولات والرعايات

نقدم نظامًا شاملًا لإدارة الطاولات والرعايات
• نظام حجز إلكتروني
• إدارة باقات الرعاية
• تحصيل آمن للرسوم
• التحكم في دخول VIP
• تنظيم الجلسات وتخطيط الموقع`
  },

  "Event Management": {
    title: "Event Management",
    desc: `Full Championship Management

We provide full organization services:
• Planning and operations management
• VIP & public seating
• Hospitality & décor
• Arena setup
• European tents & horse boxes
• Full supervision`,
    descAr: `إدارة متكاملة للبطولة

نقدم خدمات تنظيم شاملة
• التخطيط والإدارة
• ترتيب الجلوس
• الضيافة والديكور
• تجهيز ساحة العرض
• تركيب الخيام والبوكسات
• إشراف كامل`
  },

  "Awards & Trophies": {
    title: "Awards & Trophies",
    desc: `Awards & Prize Management

We handle all awards:
• Organizing categories
• Award ceremonies
• Final rankings
• Trophy arrangements
• Prize distribution`,
    descAr: `إدارة الجوائز والتكريم

نتولى جميع جوانب الجوائز
• تنظيم الفئات
• حفلات التتويج
• قوائم الفائزين
• تجهيز الكؤوس
• توزيع الجوائز`
  },

  "Government Coordination": {
    title: "Government Coordination",
    desc: `Official & Government Liaison

We manage all coordination:
• Security, ambulance, fire services
• Media & TV coordination
• Official communication
• Hotels & flights`,
    descAr: `التنسيق الرسمي والحكومي

نقوم بإدارة التنسيق:
• الجهات الأمنية والإسعاف
• الإعلام والتلفزيون
• المراسلات الرسمية
• الفنادق والطيران`
  },

  "Security & Support": {
    title: "Security & Support",
    desc: `Safety & Operational Support

We provide:
• Professional security
• Cleaning teams
• Hostesses
• Crowd control systems`,
    descAr: `الأمن والخدمات المساندة

نقدم
• خدمات أمن احترافية
• فرق تنظيف
• طاقم استقبال
• إدارة الحشود`
  },

  "Media & Marketing": {
    title: "Media & Marketing",
    desc: `Media Production & Promotion

We deliver:
• LED screens
• Sound systems & DJ
• Photography & video
• Media coverage
• Official catalog design`,
    descAr: `الخدمات الإعلامية والتسويقية

نقدم:
• شاشات عرض
• أنظمة صوت
• تصوير احترافي
• تغطية إعلامية
• تصميم الكتالوج`
  }

};
  const t = {
    en: {
      menu: ["Home","Register","Tables & Sponsors","Services","Handlers","Policies","Contact"],
      updates: "Latest Updates",
      services: "Our Services",
      subtitle: `Arabian Horse Championship Management
From planning to podium, we manage it all`,
      ctaTitle: "Excellence Begins With a Conversation",
      ctaDesc:
        "Connect with Kuwait Shows to discuss partnerships, official coordination, and tailored championship execution strategies.",
      contact: "Contact Us",
    },
    ar: {
      menu: ["الرئيسية","التسجيل","الطاولات والرعايات","خدماتنا","العارضين","السياسات","تواصل معنا"],
      updates: "آخر التحديثات",
      services: "خدماتنا",
   subtitle: `إدارة احترافية لبطولات الخيل العربية
من المنصة إلى التتويج نحن نديرها`,
      ctaTitle: "التميز يبدأ بمحادثة",
      ctaDesc:
        "تواصل مع كويت شووز لمناقشة الشراكات والتنسيق الرسمي واستراتيجيات تنفيذ البطولة المصممة خصيصاً",
      contact: "تواصل معنا",
    },
  };

  return (
<motion.main
 key={lang}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="text-white flex"
>


<div
  className="fixed inset-0 -z-10"
  style={{
    backgroundImage: "url('/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
/>

{/* overlay */}
<div className="fixed inset-0 -z-10 bg-black/50" />

<motion.div
  onClick={toggleLang}
  whileTap={{ scale: 0.92 }}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="fixed top-4 right-4 z-50"
>

  <div
    className="border border-[#bc9b6a] rounded-xl px-3 py-2
               bg-black/40 backdrop-blur-sm cursor-pointer
               flex items-center gap-2
               transition-all duration-300
               hover:bg-[#bc9b6a]/20"
    style={{
      boxShadow: "0 0 10px #bc9b6a"
    }}
  >

    {/* 🌍 الأيقونة مع Glow */}
    <FaGlobe
      size={20}
      className="text-[#bc9b6a]"
      style={{
        filter: "drop-shadow(0 0 6px #bc9b6a)"
      }}
    />

    {/* 🇰🇼 / 🇬🇧 */}
    <motion.span
      key={lang}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-lg"
      style={{
        filter: "drop-shadow(0 0 4px #bc9b6a)"
      }}
    >
      {lang === "en" ? "🇰🇼" : "🇬🇧"}
    </motion.span>

  </div>

</motion.div>

<div className="w-full">


<section className="relative h-[90vh] md:h-screen flex items-center justify-center">
<img src="/hero.png" className="absolute w-full h-full object-cover" />
<div className="absolute inset-0 bg-black/40">

<img
  src="hero.jpg"
  className="absolute w-full h-full object-cover object-[50%_30%] scale-[1.05] will-change-transform"
/>

<motion.div
  initial={{ x: 0 }}
  animate={{ x: "-100%" }}
  transition={{ duration: 1.4, ease: "easeInOut" }}
  className="absolute inset-0 bg-black z-20"
/>


</div>

<div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4">

  {/* العنوان */}
<motion.h1
  className="text-5xl md:text-6xl font-extrabold tracking-wide"
  style={{
    color: "#bc9b6a",
    textShadow: `
      0 0 2px rgba(192,161,114,0.8),
      0 0 10px rgba(192,161,114,0.7),
      0 0 00px rgba(192,161,114,0.6),
      0 0 60px rgba(192,161,114,0.4),
      0 2px 10px rgba(0,0,0,0.9)
    `
  }}
>
    Kuwait Shows
  </motion.h1>

  {/* خط ذهبي تحت العنوان */}
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: "120px" }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="h-[4px] bg-[#bc9b6a] my-4"
  />

  {/* النص */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.6 }}
    className="text-center max-w-xl"

  >
    <p className="text-lg font-bold opacity-100">
      {t[lang].subtitle.split("\n")[0]}
    </p>

   <p 
  className="mt-2 text-lg md:text-xl font-semibold tracking-wide"
  style={{
    color: "#ddc9ab",
    textShadow: "0 2px 15px rgba(0,0,0,0.9)"
  }}
>
      {t[lang].subtitle.split("\n")[1]}
    </p>
  </motion.div>

</div>

<a href="#slider" className="absolute bottom-10 text-3xl animate-bounce">↓</a>
</section>





<section id="slider" className="py-16 text-center">
<div className="flex justify-center px-4 md:pr-[190px]">
<div className="w-full max-w-[900px] text-center">
<h2 className="mb-6 text-2xl" style={{ color: gold }}>
{t[lang].updates}
</h2>
</div>
</div>

<div className="flex justify-center px-4 md:pr-[190px]">
<div className="w-full max-w-[700px] relative">

<AnimatePresence mode="wait">
  <motion.img
    key={slide}
    src={slides[slide]}
    className="w-full h-full object-cover rounded-2xl"

    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}

    transition={{
      duration: 0.8,
      ease: "easeInOut",
    }}
  />
</AnimatePresence>
{/* سهم يسار */}
<button
  onClick={() =>
    setSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }
  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded-full text-white"
>
  ←
</button>

{/* سهم يمين */}
<button
  onClick={() =>
    setSlide((prev) => (prev + 1) % slides.length)
  }
  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded-full text-white"
>
  →
</button>

<div className="flex justify-center mt-4 gap-2">
{slides.map((_, i) => (
<div
key={i}
onClick={() => setSlide(i)}
className={`w-2 h-2 rounded-full cursor-pointer ${
i === slide ? "bg-[#bc9b6a]" : "bg-gray-500"
}`}
/>
))}
</div>
</div>
</div>
</section>

<section id="services" className="py-20">
<div className="flex justify-center px-4 md:pr-[190px]">
<div className="w-full max-w-[900px] text-center">

<h2 className="text-3xl mb-10" style={{ color: gold }}>
{t[lang].services}
</h2>

<div className="grid grid-cols-2 gap-6">
{services.map((item, i) => (
<motion.div
key={i}
onClick={() => setActiveService(item[1])}
whileHover={{ scale: 1.05 }}
className="border border-[#bc9b6a] rounded-2xl overflow-hidden cursor-pointer"
>
<img src={item[2]} className="w-full h-32 object-cover" />
<div className="p-3">
<h3>{lang === "en" ? item[1] : item[0]}</h3>
</div>
</motion.div>
))}
</div>

</div>
</div>
</section>

<AnimatePresence>
{activeService && (
<motion.div
  onClick={() => setActiveService(null)}
  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>

<motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.8, opacity: 0 }}
transition={{ duration: 0.3 }}
className="bg-black border border-[#bc9b6a] max-w-xl w-full rounded-2xl overflow-hidden relative"
>

<button
onClick={() => setActiveService(null)}
className="absolute top-3 right-4 text-xl z-10"
>
×
</button>

<img
src={services.find(s => s[1] === activeService)?.[2]}
className="w-full max-h-[300px] object-contain bg-black"
/>

<div className="p-6">

<h2 className="text-2xl mb-4 text-[#bc9b6a]">
{servicesDetails[activeService]?.title}
</h2>

<p className="text-gray-300 whitespace-pre-line leading-relaxed">
{lang === "en"
? servicesDetails[activeService]?.desc
: servicesDetails[activeService]?.descAr}
</p>

</div>

</motion.div>
</motion.div>
)}
</AnimatePresence>

<section id="contact" className="py-10 text-center max-w-3xl mx-auto px-4">
<h2 style={{ color: gold }}>{t[lang].ctaTitle}</h2>
<p className="mb-6">{t[lang].ctaDesc}</p>

<div className="flex flex-col items-center gap-3 mt-4">

  {/* Email */}
  <a
    href="mailto:admin@kuwaitshows.com"
    className="flex items-center gap-2 text-gray-300 hover:text-[#bc9b6a] transition"
  >
    <FaEnvelope />
    <span>admin@kuwaitshows.com</span>
  </a>

  {/* WhatsApp */}
  <a
    href="https://wa.me/96597944003"
    target="_blank"
    className="flex items-center gap-2 text-gray-300 hover:text-[#bc9b6a] transition"
  >
    <FaWhatsapp />
    <span>+965 97944003</span>
  </a>

  {/* Location */}
  <div className="flex items-center gap-2 text-gray-300">
    <span>📍</span>
    <span>Kuwait 🇰🇼</span>
  </div>


<div className="flex flex-col items-center mt-6">
  <img 
    src="/logo.png" 
    alt="Kuwait Shows"
    className="w-14 mb-2 object-contain"
  />

  <p className="text-xs bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent">
    Kuwait Shows
  </p>
</div>


</div>
</section>

<footer className="py-6 text-center border-t border-gray-800" style={{ color: gold }}>
© Kuwait Shows All Right Reserved
</footer>

</div>
</motion.main>
  );
}