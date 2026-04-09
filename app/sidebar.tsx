"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaGlobe, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const brandGold = "#bc9b6a";
const goldGradient = "linear-gradient(135deg, #ddc9ab 0%, #bc9b6a 50%, #8c6a3f 100%)";

export default function Sidebar() {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) {
      setLang(saved);
    }

    const handleLangChange = () => {
      const newLang = localStorage.getItem("lang");
      if (newLang) setLang(newLang);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  useEffect(() => {
    setOpen(false);
    setPolicyOpen(false);
  }, [pathname]);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  if (!mounted) return null;

  return (
    <>
      {/* 🌟 Floating Menu Button (Always Visible) */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#bc9b6a44] shadow-[0_0_15px_rgba(188,155,106,0.2)] hover:border-[#bc9b6a] hover:shadow-[0_0_20px_rgba(188,155,106,0.5)] transition-all duration-300"
      >
        <div className="flex flex-col gap-1.5 items-center justify-center w-6">
          <span className="w-full h-0.5 bg-[#bc9b6a] rounded-full" />
          <span className="w-4/5 h-0.5 bg-[#bc9b6a] rounded-full" />
          <span className="w-full h-0.5 bg-[#bc9b6a] rounded-full" />
        </div>
      </motion.button>

      {/* 🌌 Background Overlay للصفحة بالكامل عند فتح المنيو */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* 📜 The Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            /* 🔴 هنا استدعينا صورتك bg.png لتكون هي خلفية السايد بار بالكامل */
            style={{ 
              backgroundImage: "url('/bg.png')", 
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
            className="fixed left-0 top-0 h-screen w-[280px] md:w-[350px] z-[70] shadow-[20px_0_50px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* 🔴 طبقة تظليل خفيفة جداً (40% فقط) عشان تبان صورتك واضحة، وبنفس الوقت نقدر نقرأ النص */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0 pointer-events-none"></div>

            {/* محتوى السايد بار */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* Header / Logo - شفاف لتبان الخلفية */}
              <div className="p-6 border-b border-[#bc9b6a33] flex justify-between items-center bg-transparent">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <h2 className="font-bold tracking-wide text-transparent bg-clip-text" style={{ backgroundImage: goldGradient }}>
                    Kuwait Shows
                  </h2>
                </Link>
                <button 
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                
                {/* Language Switch */}
                <div 
                  onClick={toggleLang}
                  className="mx-4 mb-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:border-[#bc9b6a55] hover:bg-white/20 cursor-pointer flex justify-between items-center transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-[#bc9b6a] text-xl" />
                    <span className="text-white font-medium">{lang === "ar" ? "اللغة" : "Language"}</span>
                  </div>
                  <span className="text-xl">{lang === "en" ? "🇰🇼" : "🇬🇧"}</span>
                </div>

                <nav className="flex flex-col px-2">
                  <Link href="/" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الرئيسية" : "Home"}</Link>
                  
                  {/* 🔴 الزر الجديد تمت إضافته هنا */}
                  <Link href="/about-horses" className="menu-link" onClick={() => setOpen(false)}>
                    {lang === "ar" ? "ماهي بطولات الجمال ؟" : "What are Beauty Shows?"}
                  </Link>

                  <Link href="/shows" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "التسجيل للبطولات" : "Registerto Shows"}</Link>
                  <Link href="/tables" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الرعاة والطاولات" : "Tables & Sponsors"}</Link>
                  
                  <a 
                    href="/#services" 
                    className="menu-link" 
                    onClick={(e) => {
                      setOpen(false);
                      if (pathname === "/") {
                        e.preventDefault();
                        document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {lang === "ar" ? "الخدمات" : "Services"}
                  </a>

                  <Link href="/sell" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "خيل للبيع" : "Horses for Sale"}</Link>
                  <Link href="/handlers" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "العارضين" : "Handlers"}</Link>
                  <Link href="/about" className="menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "تعرف علينا" : "About us"}</Link>

                  {/* Policies Dropdown */}
                  <div className="px-2 mt-2">
                    <button 
                      onClick={() => setPolicyOpen(!policyOpen)}
                      className="w-full flex justify-between items-center p-4 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="font-medium tracking-wide">{lang === "ar" ? "السياسات" : "Policies"}</span>
                      {policyOpen ? <FaChevronUp className="text-[#bc9b6a] text-xs" /> : <FaChevronDown className="text-[#bc9b6a] text-xs" />}
                    </button>

                    <AnimatePresence>
                      {policyOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 border-l border-[#bc9b6a33] mt-1"
                        >
                          <Link href="/policies/privacy-policy" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
                          <Link href="/policies/terms-conditions" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}</Link>
                          <Link href="/policies/refund-cancelation" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الاسترجاع والإلغاء" : "Refund & Cancellation"}</Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <a 
                    href="/#contact" 
                    className="menu-link mt-2" 
                    onClick={(e) => {
                      setOpen(false);
                      if (pathname === "/") {
                        e.preventDefault();
                        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {lang === "ar" ? "تواصل معنا" : "Contact"}
                  </a>
                </nav>
              </div>

              {/* Footer / Social - شفاف لتبان الخلفية */}
              <div className="p-6 border-t border-[#bc9b6a33] bg-transparent">
                <div className="flex justify-center gap-6">
                  <a href="https://instagram.com/q8shows" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#bc9b6a] hover:scale-110 transition-all text-2xl"><FaInstagram /></a>
                  <a href="https://facebook.com/kuwaitshows" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#bc9b6a] hover:scale-110 transition-all text-2xl"><FaFacebookF /></a>
                  <a href="https://wa.me/96597944003" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#25D366] hover:scale-110 transition-all text-2xl"><FaWhatsapp /></a>
                </div>
              </div>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .menu-link {
          display: block;
          padding: 16px 20px;
          margin: 4px 8px;
          border-radius: 12px;
          color: #e5e7eb; /* gray-200 */
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }
        .menu-link:hover {
          background: rgba(188, 155, 106, 0.2);
          color: #bc9b6a;
          transform: translateX(5px);
        }
        .sub-menu-link {
          display: block;
          padding: 12px 20px;
          color: #d1d5db; /* gray-300 */
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .sub-menu-link:hover {
          color: #bc9b6a;
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(188, 155, 106, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}