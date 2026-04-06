"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const gold = "#bc9b6a";
const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function AboutPage() {
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    const handle = () => {
      const updated = localStorage.getItem("lang");
      if (updated) setLang(updated);
    };

    window.addEventListener("languageChange", handle);
    return () => window.removeEventListener("languageChange", handle);
  }, []);

  if (!mounted) return null;

  const isAr = lang === "ar";

  // إعدادات الأنيميشن المشتركة
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const servicesAr = [
    "إدارة وتنظيم بطولات الخيل العربية",
    "نظام تسجيل إلكتروني للخيول",
    "تحصيل رسوم التسجيل بشكل آمن",
    "إدارة الرعاة وحجز الطاولات",
    "تنسيق مناطق VIP والساحات",
    "حلول رقمية لإدارة الفعاليات"
  ];

  const servicesEn = [
    "Management and organization of Arabian horse championships",
    "Online horse registration systems",
    "Secure registration fee collection",
    "Sponsorship and VIP table booking management",
    "Coordination of VIP areas and championship arenas",
    "Digital solutions for event operations"
  ];

  const services = isAr ? servicesAr : servicesEn;

  return (
    <main className={`min-h-screen text-white bg-[#050505] ${isAr ? "rtl text-right" : "ltr text-left"}`}>

      {/* 🎬 HERO SECTION (Cinematic Video Background) */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-[#050505]" />
        
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover z-0"
        >
          <source src="/horse.mp4" type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="relative z-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-2xl mb-6 text-transparent bg-clip-text" style={{ backgroundImage: goldGradient }}>
              {isAr ? "نحن نصنع التميز" : "We Craft Excellence"}
            </h1>
            <p className="text-lg md:text-2xl font-light text-gray-300 tracking-wider max-w-2xl mx-auto">
              {isAr ? "المنصة الرائدة في إدارة وتنظيم بطولات الخيل العربية" : "The leading platform for managing Arabian horse championships"}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100px" }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-[2px] bg-gradient-to-b from-[#bc9b6a] to-transparent mx-auto mt-12"
          />
        </div>
      </section>

      {/* 📜 CONTENT SECTION */}
      <section className="relative py-24 px-4 md:px-10 lg:ml-[90px] xl:mx-auto max-w-7xl z-20">
        
        {/* Decorative Background for Content */}
        <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none" style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />

        {/* 1. ABOUT US */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 backdrop-blur-lg border border-[#bc9b6a33] rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#bc9b6a] to-transparent" />
            
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: gold }}>
                {isAr ? "Kuwait Shows عن" : "About Kuwait Shows"}
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                {isAr ? (
                  <>Kuwait Shows هي منصة متخصصة لإدارة وتنظيم بطولات الخيل العربية في دولة الكويت.<br /><br />تم تأسيسها برؤية واضحة تهدف إلى رفع مستوى بطولات الخيل من خلال التنظيم الاحترافي، أنظمة التسجيل المتقدمة، والحلول الرقمية الموثوقة.</>
                ) : (
                  <>Kuwait Shows is a specialized platform dedicated to the management and organization of Arabian horse championships.<br /><br />Established with a clear vision to elevate the standards of Arabian horse events through professional organization, structured registration systems, and reliable digital solutions.</>
                )}
              </p>
            </div>

            <div className="flex-1 w-full relative h-[300px] rounded-2xl overflow-hidden border border-[#bc9b6a44]">
               <Image src="/service3.jpg" alt="About Kuwait Shows" fill className="object-cover" />
               <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </motion.div>

        {/* 2. FOUNDER & MISSION GRID */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* Founder */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#111] to-black border border-[#bc9b6a22] rounded-3xl p-8 md:p-10 hover:border-[#bc9b6a55] transition-colors duration-500 shadow-xl relative group">
            <div className="w-16 h-16 bg-[#bc9b6a11] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#bc9b6a] transition-colors duration-500">
               <span className="text-2xl group-hover:text-black transition-colors">👑</span>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: gold }}>{isAr ? "المؤسس" : "Our Founder"}</h2>
            <p className="text-gray-400 leading-relaxed font-light">
              {isAr ? (
                <>متخصص في مجال الخيل العربية بخبرة واسعة تشمل:<br /><br />• تنظيم بطولات الخيل العربية<br />• إدارة الفعاليات والساحات<br />• أنظمة تسجيل وتصنيف الخيول<br /><br />معتمد رسميًا لإدارة حلقات العرض وفق المعايير الدولية.</>
              ) : (
                <>A specialist in the field of Arabian horses with extensive experience in:<br /><br />• Arabian horse championships organization<br />• Event and arena management<br />• Horse registration and classification systems<br /><br />Officially accredited to manage and supervise show rings.</>
              )}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#111] to-black border border-[#bc9b6a22] rounded-3xl p-8 md:p-10 hover:border-[#bc9b6a55] transition-colors duration-500 shadow-xl relative group">
            <div className="w-16 h-16 bg-[#bc9b6a11] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#bc9b6a] transition-colors duration-500">
               <span className="text-2xl group-hover:text-black transition-colors">🎯</span>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: gold }}>{isAr ? "رسالتنا" : "Our Mission"}</h2>
            <p className="text-gray-400 leading-relaxed font-light mb-8">
              {isAr
                ? "نهدف إلى تقديم منصة احترافية وشفافة تدعم ملاك ومربي الخيل من خلال تبسيط عمليات التسجيل وتحسين تجربة البطولات."
                : "Our mission is to provide a professional, transparent, and efficient platform that supports Arabian horse owners by simplifying registration processes."}
            </p>
            <h2 className="text-2xl font-bold mb-4" style={{ color: gold }}>{isAr ? "التزامنا" : "Our Commitment"}</h2>
            <p className="text-gray-400 leading-relaxed font-light">
              {isAr
                ? "نلتزم بأعلى معايير الاحترافية والدقة في إدارة بطولات الخيل مع ضمان الأمان والموثوقية."
                : "Committed to maintaining the highest standards of professionalism and accuracy in managing Arabian horse events."}
            </p>
          </motion.div>

        </motion.div>

        {/* 3. WHAT WE DO */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold inline-block pb-4 border-b border-[#bc9b6a44]" style={{ color: gold }}>
              {isAr ? "ماذا نقدم" : "What We Do"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#bc9b6a33] p-8 rounded-2xl flex items-center justify-center text-center transition-all duration-300 hover:border-[#bc9b6a] hover:shadow-[0_10px_30px_rgba(188,155,106,0.2)] group"
              >
                <p className="text-gray-300 font-medium group-hover:text-white transition-colors">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. CONTACT (Elegant Footer Style) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="max-w-3xl mx-auto text-center bg-gradient-to-t from-black to-[#111] p-12 rounded-3xl border border-[#bc9b6a22] shadow-2xl relative overflow-hidden">
           {/* Glow Effect */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-[#bc9b6a] opacity-[0.05] blur-[50px] pointer-events-none" />

          <img src="/logo.png" alt="Kuwait Shows Logo" className="w-24 mx-auto mb-6 opacity-90" />
          
          <h2 className="text-3xl font-bold mb-2" style={{ color: gold }}>
            {isAr ? "تواصل معنا" : "Contact Us"}
          </h2>
          <p className="text-lg text-gray-400 mb-8 font-light">
            {isAr ? "التميز يبدأ بمحادثة" : "Excellence Begins With a Conversation"}
          </p>

          <div className="flex justify-center gap-6">
            <a
              href="mailto:admin@kuwaitshows.com"
              className="group flex items-center justify-center w-14 h-14 rounded-full border border-[#bc9b6a55] text-[#bc9b6a] hover:bg-[#bc9b6a] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_#bc9b6a]"
              aria-label="Email Us"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>

            <a
              href="https://wa.me/96597944003"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-14 h-14 rounded-full border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_#25D366]"
              aria-label="WhatsApp Us"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                <path d="M16.001 2.999c-7.18 0-13 5.82-13 13 0 2.295.602 4.546 1.744 6.522L3 29l6.64-1.736A12.944 12.944 0 0016 29c7.18 0 13-5.82 13-13s-5.82-13-13-13zm0 23.5a10.42 10.42 0 01-5.31-1.452l-.38-.224-3.94 1.03 1.05-3.84-.25-.394A10.416 10.416 0 015.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5zm5.79-7.79c-.316-.158-1.872-.924-2.162-1.03-.29-.106-.5-.158-.71.158-.21.316-.816 1.03-1 1.24-.184.21-.368.237-.684.079-.316-.158-1.334-.491-2.54-1.566-.94-.84-1.575-1.876-1.76-2.192-.184-.316-.02-.486.138-.644.142-.142.316-.368.474-.553.158-.184.21-.316.316-.526.106-.21.053-.395-.026-.553-.079-.158-.71-1.71-.973-2.342-.256-.616-.516-.532-.71-.542l-.605-.01c-.21 0-.553.079-.842.395-.29.316-1.105 1.08-1.105 2.632s1.132 3.05 1.29 3.263c.158.21 2.228 3.4 5.4 4.768.754.326 1.342.52 1.8.666.756.24 1.444.206 1.99.125.608-.09 1.872-.764 2.136-1.504.263-.74.263-1.374.184-1.504-.079-.132-.29-.21-.605-.368z"/>
              </svg>
            </a>
          </div>
        </motion.div>

      </section>
    </main>
  );
}