"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const gold = "#D4AF37";

export default function Sidebar() {

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // ✅ فقط لإصلاح الموبايل
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
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
                   border border-[#D4AF37] px-4 py-3 rounded-xl
                   bg-black/40 backdrop-blur-sm
                   flex items-center justify-center
                   hover:bg-[#D4AF37]/20 transition-all duration-300"
        style={{ boxShadow: "0 0 10px #D4AF37" }}
      >
        <motion.span
          key={open ? "close" : "menu"}
          className="text-[#D4AF37] text-xl"
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
filter: "brightness(0.9) contrast(1.05)"

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
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* LOGO */}
        <div className="p-6 text-center border-b border-[#D4AF37]/30">
          <img src="/logo.png" className="w-12 h-12 mx-auto mb-3" />
          <h2 style={{ color: gold }} className="font-semibold tracking-wide">
            Kuwait Shows
          </h2>
        </div>

        {/* MENU */}
        <div className="flex flex-col text-sm text-[#E8DCCB]">

          <motion.div
            onClick={toggleLang}
            className="py-3 border-b border-[#D4AF37]/30 text-center cursor-pointer
                       flex justify-center items-center
                       hover:bg-[#D4AF37]/10"
          >
            <div className="flex items-center gap-2">
              <FaGlobe size={22} className="text-[#D4AF37]" />
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

          <Link href="/handlers" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "عراض الخيل" : "Handlers"}
          </Link>

          <Link href="/about" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "تعرف علينا" : "About us"}
          </Link>

          {/* POLICIES */}
          <div className="relative group">
            <div
              className="menu-item cursor-pointer"
              onClick={() => setPolicyOpen(prev => !prev)}
            >
              {lang === "ar" ? "السياسات" : "Policies"}
            </div>

            <div
           className={`
  absolute right-full top-0
  bg-[#120c08] border border-[#D4AF37]/30 w-[200px] z-50

  transition-all duration-300

  opacity-0 invisible pointer-events-none

  ${policyOpen ? "opacity-100 visible pointer-events-auto" : ""}

  md:group-hover:opacity-100 
  md:group-hover:visible 
  md:group-hover:pointer-events-auto
`}
            >
              <Link href="/policies/privacy-policy" className="dropdown-item">
                {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>

              <Link href="/policies/terms-conditions" className="dropdown-item">
                {lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>

              <Link href="/policies/refund-cancelation" className="dropdown-item">
                {lang === "ar" ? "الاسترجاع والإلغاء" : "Refund & cancellation"}
              </Link>
            </div>
          </div>

          <Link href="/#contact" className="menu-item" onClick={() => setOpen(false)}>
            {lang === "ar" ? "تواصل معنا" : "Contact"}
          </Link>

        </div>

        {/* SOCIAL */}
        <div className="flex justify-center gap-2 p-6 border-t border-[#D4AF37]/30 text-xl text-[#D4AF37]">
          <a href="https://instagram.com/q8shows" target="_blank">
            <FaInstagram />
          </a>

          <a href="https://facebook.com/kuwaitshows" target="_blank">
            <FaFacebookF />
          </a>

          <a href="https://wa.me/96597944003" target="_blank">
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
            rgba(212,175,55,0.15),
            transparent
          );
          color: #D4AF37;
        }

        .dropdown-item {
          display: block;
          padding: 12px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }

        .dropdown-item:hover {
          background: rgba(212,175,55,0.15);
          color: #D4AF37;
        }
      `}</style>

    </>
  );
}