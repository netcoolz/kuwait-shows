"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

const gold = "#bc9b6a";

export default function Sidebar() {

  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  // 🔥 جديد للموبايل
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  if (!mounted) return null;

  return (
    <>
      {/* 🔥 زر المينيو (موبايل فقط) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black border border-[#bc9b6a] px-3 py-2 rounded text-[#bc9b6a]"
      >
        ☰
      </button>

      {/* 🔥 الخلفية (موبايل) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

<aside
  className={`
    fixed right-0 top-0 h-screen w-[190px]
    bg-black border-l border-[#bc9b6a]
    flex flex-col justify-between z-50
    transition-transform duration-300

    ${open ? "translate-x-0" : "translate-x-full"}

    md:translate-x-0 md:flex
  `}
>
        {/* زر اغلاق بالموبايل */}
        <div className="md:hidden p-3 text-left">
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* LOGO */}
        <div className="p-6 text-center border-b border-[#bc9b6a]">
          <img src="/logo.png" className="w-12 h-12 mx-auto mb-3" />
          <h2 style={{ color: gold }} className="font-semibold tracking-wide">
            Kuwait Shows
          </h2>
        </div>

        {/* MENU */}
        <div className="flex flex-col text-sm">

          <div
            onClick={toggleLang}
            className="py-3 border-b border-[#bc9b6a] text-center cursor-pointer hover:bg-[#bc9b6a] hover:text-black"
          >
            🌐
          </div>

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

          {/* POLICIES DROPDOWN */}
          <div className="relative group">

            <div className="menu-item cursor-pointer">
              {lang === "ar" ? "السياسات" : "Policies"}
            </div>

            <div className="absolute right-full top-0 hidden group-hover:block bg-black border border-[#bc9b6a] w-[200px] z-50">

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
        <div className="flex justify-center gap-4 p-6 border-t border-[#bc9b6a] text-xl">

          <a href="https://instagram.com" target="_blank">
            <FaInstagram />
          </a>

          <a href="https://facebook.com" target="_blank">
            <FaFacebookF />
          </a>

          <a href="https://wa.me/96597944003" target="_blank">
            <FaWhatsapp />
          </a>

        </div>

      </aside>
    </>
  );
}