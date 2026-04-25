"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaGlobe, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiHome, FiInfo, FiMonitor, FiUserCheck, FiUsers, FiShoppingBag, FiFileText, FiShield } from "react-icons/fi";
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

      {/* 🌌 Background Overlay */}
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
            style={{ 
              backgroundImage: "url('/bg.png')", 
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
            className="fixed left-0 top-0 h-screen w-[300px] md:w-[380px] z-[70] shadow-[20px_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* 🔴 طبقة تظليل */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0 pointer-events-none"></div>

            {/* محتوى السايد بار */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* Header / Logo */}
              <div className="p-6 border-b border-[#bc9b6a33] flex justify-between items-center bg-transparent">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                  <h2 className="font-extrabold tracking-widest text-transparent bg-clip-text uppercase text-base md:text-lg" style={{ backgroundImage: goldGradient }}>
                    Kuwait Shows
                  </h2>
                </Link>
                <button 
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto py-4 custom-scrollbar px-3">
                
                {/* Language Switch */}
                <div 
                  onClick={toggleLang}
                  className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-[#bc9b6a55] cursor-pointer flex justify-between items-center transition-all"
                >
                  <div className="flex items-center gap-4">
                    <FaGlobe className="text-[#bc9b6a] text-2xl" />
                    <span className="text-white font-bold tracking-wide text-lg">{lang === "ar" ? "English" : "العربية"}</span>
                  </div>
                  <span className="text-2xl">{lang === "en" ? "🇰🇼" : "🇬🇧"}</span>
                </div>

                <nav className="flex flex-col gap-2">
                  
                  {/* --- Group 1: General --- */}
                  <div className="mb-8">
                    <span className="mx-4 px-1 pb-2 text-sm md:text-base uppercase tracking-widest text-[#bc9b6a] font-black border-b border-[#bc9b6a]/20 mb-3 block drop-shadow-md">
                      {lang === "ar" ? "الرئيسية" : "Main"}
                    </span>
                    <Link href="/" className="menu-link"><FiHome className="text-xl opacity-70" /> {lang === "ar" ? "الرئيسية" : "Home"}</Link>
                    <Link href="/about" className="menu-link"><FiInfo className="text-xl opacity-70" /> {lang === "ar" ? "تعرف علينا" : "About Us"}</Link>
                  </div>

                  {/* --- Group 2: Shows & Systems --- */}
                  <div className="mb-8">
                    <span className="mx-4 px-1 pb-2 text-sm md:text-base uppercase tracking-widest text-[#bc9b6a] font-black border-b border-[#bc9b6a]/20 mb-3 block drop-shadow-md">
                      {lang === "ar" ? "البطولات والنظام" : "Shows & System"}
                    </span>
                    <Link href="/shows" className="menu-link"><TrophyIcon className="text-xl opacity-70" /> {lang === "ar" ? "التسجيل للبطولات" : "Register to Shows"}</Link>
                    <Link href="/about-horses" className="menu-link"><FiFileText className="text-xl opacity-70" /> {lang === "ar" ? "ماهي بطولات الجمال ؟" : "What are Beauty Shows?"}</Link>
                    <Link href="/judges" className="menu-link"><FiUserCheck className="text-xl opacity-70" /> {lang === "ar" ? "منهج التحكيم" : "Judging Syllabus"}</Link>
                    <Link href="/scoring" className="menu-link"><FiMonitor className="text-xl opacity-70" /> {lang === "ar" ? "النظام الرقمي" : "Digital System"}</Link>
                  </div>

                  {/* --- Group 3: Directory --- */}
                  <div className="mb-8">
                    <span className="mx-4 px-1 pb-2 text-sm md:text-base uppercase tracking-widest text-[#bc9b6a] font-black border-b border-[#bc9b6a]/20 mb-3 block drop-shadow-md">
                      {lang === "ar" ? "الخدمات والدليل" : "Directory"}
                    </span>
                    <Link href="/handlers" className="menu-link"><FiUsers className="text-xl opacity-70" /> {lang === "ar" ? "دليل العارضين" : "Handlers Directory"}</Link>
                    <Link href="/tables" className="menu-link"><VIPTableIcon className="text-xl opacity-70" /> {lang === "ar" ? "الرعاة وطاولات VIP" : "VIP Tables & Sponsors"}</Link>
                    <Link href="/sell" className="menu-link"><FiShoppingBag className="text-xl opacity-70" /> {lang === "ar" ? "خيل للبيع" : "Horses for Sale"}</Link>
                  </div>

                  {/* --- Group 4: Legal & Contact --- */}
                  <div className="mb-4 pt-2">
                    {/* Policies Dropdown */}
                    <div>
                      <button 
                        onClick={() => setPolicyOpen(!policyOpen)}
                        className="w-full flex justify-between items-center p-4 rounded-xl text-gray-300 hover:text-[#bc9b6a] hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FiShield className="text-xl opacity-70" />
                          <span className="font-bold tracking-wide text-lg">{lang === "ar" ? "السياسات القانونية" : "Legal Policies"}</span>
                        </div>
                        {policyOpen ? <FaChevronUp className="text-[#bc9b6a] text-sm" /> : <FaChevronDown className="text-[#bc9b6a] text-sm" />}
                      </button>

                      <AnimatePresence>
                        {policyOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-10 mr-10 border-l-2 border-[#bc9b6a33] mt-2"
                          >
                            <Link href="/policies/privacy-policy" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
                            <Link href="/policies/terms-conditions" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}</Link>
                            <Link href="/policies/refund-cancelation" className="sub-menu-link" onClick={() => setOpen(false)}>{lang === "ar" ? "الاسترجاع والإلغاء" : "Refund & Cancel"}</Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </nav>
              </div>

              {/* Footer / Social */}
              <div className="p-6 border-t border-[#bc9b6a33] bg-black/40 backdrop-blur-md">
                <div className="flex justify-center gap-6">
                  <a href="https://instagram.com/q8shows" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-[#bc9b6a] hover:text-black transition-all text-2xl"><FaInstagram /></a>
                  <a href="https://facebook.com/kuwaitshows" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-[#bc9b6a] hover:text-black transition-all text-2xl"><FaFacebookF /></a>
                  <a href="https://wa.me/96597944003" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-[#25D366] hover:text-black transition-all text-2xl"><FaWhatsapp /></a>
                </div>
              </div>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .menu-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-radius: 12px;
          color: #d1d5db; /* gray-300 */
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.03em;
          transition: all 0.3s ease;
        }
        .menu-link:hover {
          background: rgba(188, 155, 106, 0.1);
          color: #bc9b6a;
          transform: translateX(${lang === 'ar' ? '-6px' : '6px'});
        }
        .sub-menu-link {
          display: block;
          padding: 12px 20px;
          color: #9ca3af; /* gray-400 */
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .sub-menu-link:hover {
          color: #bc9b6a;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(188, 155, 106, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

// Custom simple icons to avoid adding new heavy libraries
const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="1em" height="1em">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M5 11h14M9 11v4a3 3 0 006 0v-4M7 21h10M12 15v6" />
  </svg>
);

const VIPTableIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="1em" height="1em">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);