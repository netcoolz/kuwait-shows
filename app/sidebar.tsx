"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const gold = "#D4AF37";
const brandGold = "#CDAF81"; // ✅ لونك

export default function Sidebar() {

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [lang, setLang] = useState("ar");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [policyOpen, setPolicyOpen] = useState(false);

 useEffect(() => {
  const saved = localStorage.getItem("lang");
  if (saved) {
    setLang(saved);
  } else {
    localStorage.setItem("lang", "ar");
  }
}, []);

useEffect(() => {
  const handleLangChange = () => {
    const newLang = localStorage.getItem("lang");
    if (newLang) {
      setLang(newLang);
    }
  };

  window.addEventListener("languageChange", handleLangChange);

  return () => {
    window.removeEventListener("languageChange", handleLangChange);
  };
}, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  return (
    <>
      {/* زر المينيو */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:hidden fixed top-4 left-4 z-50
                   border px-4 py-3 rounded-xl
                   bg-black/40 backdrop-blur-sm
                   flex items-center justify-center
                   transition-all duration-300"
        style={{ 
          borderColor: brandGold,
          boxShadow: `0 0 12px ${brandGold}`
        }}
      >
        <motion.span
          key={open ? "close" : "menu"}
          className="text-xl"
          style={{ color: brandGold }}
        >
          {open ? "✕" : "☰"}
        </motion.span>
      </motion.button>

      {/* الخلفية */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed right-0 top-0 h-screen
          border-l border-[#D4AF37]/30
          flex flex-col justify-between z-50
          transition-all duration-300

          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:flex
          ${!isHome && !hovered ? "md:w-[90px]" : "md:w-[290px]"}
        `}
        style={{
          backgroundImage: `
            linear-gradient(rgba(10,7,5,0.75), rgba(10,7,5,0.85)),
            url('/gold-texture.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply"
        }}
      >

        <div className="md:hidden p-3 text-left">
          <button 
            onClick={() => setOpen(false)}
            style={{ color: brandGold }}
          >
            ✕
          </button>
        </div>

        {/* LOGO */}
      <div className="py-0 px-0 md:p-4 text-center border-b border-[#D4AF37]/30">
          <img src="/logo.png" className="w-12 h-12 mx-auto mb-0" />
         <h2
  className="font-semibold tracking-wide bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent"
  style={{
    textShadow: "0 1px 10px rgba(0,0,0,0.8)",
  }}
>
  Kuwait Shows
</h2>
        </div>

        {/* MENU */}
        {/* MENU + SCROLL */}
<div className="flex-1 overflow-y-auto">
  <div className="flex flex-col text-base text-[#ffffff]">

          <motion.div
            onClick={toggleLang}
            className="py-3 border-b border-[#D4AF37]/30 text-center cursor-pointer
                       flex justify-center items-center
                       hover:bg-[#CDAF81]/10"
          >
            <div className="flex items-center gap-6">
              <FaGlobe size={20} style={{ color: brandGold }} />
              <span>{lang === "en" ? "🇰🇼" : "🇬🇧"}</span>
            </div>
          </motion.div>

          <Link href="/" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link href="/shows" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "التسجيل" : "Register"}
          </Link>

          <Link href="/tables" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "الرعاة والطاولات" : "Tables & Sponsors"}
          </Link>

          <Link href="/#services" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "الخدمات" : "Services"}
          </Link>

          <Link href="/sell" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "خيل للبيع" : "Horses for Sale"}
          </Link>


          <Link href="/handlers" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "مدربين الخيل" : "Horse Trainers"}
          </Link>

          <Link href="/about" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "تعرف علينا" : "About us"}
          </Link>

          {/* POLICIES */}
          <div>
            <div
              className="menu-item cursor-pointer flex justify-between items-center"
              onClick={() => setPolicyOpen(prev => !prev)}
            >
              {lang === "ar" ? "السياسات" : "Policies"}

              {/* سهم */}
              <span style={{ color: brandGold }}>
                {policyOpen ? "▾" : "▸"}
              </span>
            </div>

            {/* تحت مباشرة */}
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${policyOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <Link 
                href="/policies/privacy-policy" 
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  setPolicyOpen(false);
                }}
              >
                {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>

              <Link 
                href="/policies/terms-conditions" 
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  setPolicyOpen(false);
                }}
              >
                {lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>

              <Link 
                href="/policies/refund-cancelation" 
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  setPolicyOpen(false);
                }}
              >
                {lang === "ar" ? "الاسترجاع والإلغاء" : "Refund & cancellation"}
              </Link>
            </div>
          </div>

          <Link href="/#contact" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "تواصل معنا" : "Contact"}
          </Link>


</div>
        </div>

        {/* SOCIAL */}
        <div className="flex justify-center gap-2 p-3 border-t border-[#D4AF37]/30 text-xl">
          <a href="https://instagram.com/q8shows" target="_blank" style={{ color: brandGold }}>
            <FaInstagram />
          </a>

          <a href="https://facebook.com/kuwaitshows" target="_blank" style={{ color: brandGold }}>
            <FaFacebookF />
          </a>

          <a href="https://wa.me/96597944003" target="_blank" style={{ color: brandGold }}>
            <FaWhatsapp />
          </a>
        </div>

      </aside>

      {/* CSS */}
      <style jsx global>{`
        .menu-item {
          padding: 16px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          transition: 0.3s;
        }

        .menu-item:hover {
          background: linear-gradient(
            90deg,
            rgba(205,175,129,0.15),
            transparent
          );
          color: #CDAF81;
        }

        .dropdown-item {
          display: block;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          background: rgba(0,0,0,0.2);
        }

        .dropdown-item:hover {
          background: rgba(205,175,129,0.15);
          color: #CDAF81;
        }
      `}</style>

    </>
  );
}