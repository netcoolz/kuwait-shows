"use client";

import { useEffect, useState } from "react";

const gold = "#bc9b6a";

export default function AboutPage() {

  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    const handle = () => {
      const updated = localStorage.getItem("lang");
      if (updated) setLang(updated);
    };

    window.addEventListener("languageChange", handle);
    return () => window.removeEventListener("languageChange", handle);
  }, []);

  const isAr = lang === "ar";

  return (
    <main className={`bg-black text-white ${isAr ? "rtl text-right" : ""}`}>

      {/* 🎬 HERO */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <video autoPlay muted loop className="absolute w-full h-full object-cover">
          <source src="/horse.mp4" />
        </video>

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10">
          <h1 className="text-6xl font-bold" style={{ color: gold }}>
            {isAr ? "من نحن" : "About Kuwait Shows"}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24 px-6 md:px-20 space-y-20">

        {/* ABOUT */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-6" style={{ color: gold }}>
            {isAr ? "حول المنصة" : "About Us"}
          </h2>

          <p className="text-gray-300 leading-8">
            {isAr ? (
              <>
                Kuwait Shows هي منصة متخصصة لإدارة وتنظيم بطولات الخيل العربية في دولة الكويت.
                <br /><br />
                تم تأسيس Kuwait Shows برؤية واضحة تهدف إلى رفع مستوى بطولات الخيل العربية من خلال التنظيم الاحترافي، أنظمة التسجيل المتقدمة، والحلول الرقمية الموثوقة.
              </>
            ) : (
              <>
                Kuwait Shows is a specialized platform dedicated to the management and organization of Arabian horse championships and related events in the State of Kuwait.
                <br /><br />
                Founded and managed Kuwait Shows was established with a clear vision to elevate the standards of Arabian horse events through professional organization, structured registration systems, and reliable digital solutions.
              </>
            )}
          </p>
        </div>

        {/* FOUNDER */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-6" style={{ color: gold }}>
            {isAr ? "المؤسس" : "Our Founder"}
          </h2>

          <p className="text-gray-300 leading-8">
            {isAr ? (
              <>
                متخصص في مجال الخيل العربية بخبرة واسعة تشمل:
                <br /><br />
                • تنظيم بطولات الخيل العربية  
                • إدارة الفعاليات والساحات  
                • أنظمة تسجيل وتصنيف الخيول  
                <br /><br />
                معتمد رسميًا لإدارة حلقات العرض وفق المعايير الدولية.
              </>
            ) : (
              <>
                A specialist in the field of Arabian horses with extensive experience in:
                <br /><br />
                • Arabian horse championships organization  
                • Event and arena management  
                • Horse registration and classification systems  
                <br /><br />
                Officially accredited to manage and supervise show rings in accordance with international Arabian horse championship standards.
              </>
            )}
          </p>
        </div>

        {/* WHAT WE DO */}
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl mb-10" style={{ color: gold }}>
            {isAr ? "ماذا نقدم" : "What We Do"}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {(isAr ? [
              "إدارة وتنظيم بطولات الخيل العربية",
              "نظام تسجيل إلكتروني للخيول",
              "تحصيل رسوم التسجيل بشكل آمن",
              "إدارة الرعاة وحجز الطاولات",
              "تنسيق مناطق VIP والساحات",
              "حلول رقمية لإدارة الفعاليات"
            ] : [
              "Management and organization of Arabian horse championships",
              "Online horse registration systems",
              "Secure registration fee collection",
              "Sponsorship and VIP table booking management",
              "Coordination of VIP areas and championship arenas",
              "Digital solutions for event operations"
            ]).map((item, i) => (
              <div
                key={i}
                className="border border-[#bc9b6a] p-6 rounded-lg hover:bg-[#bc9b6a] hover:text-black transition"
              >
                {item}
              </div>
            ))}

          </div>
        </div>

        {/* MISSION */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-6" style={{ color: gold }}>
            {isAr ? "رسالتنا" : "Our Mission"}
          </h2>

          <p className="text-gray-300 leading-8">
            {isAr
              ? "نهدف إلى تقديم منصة احترافية وشفافة تدعم ملاك ومربي الخيل من خلال تبسيط عمليات التسجيل وتحسين تجربة البطولات."
              : "Our mission is to provide a professional, transparent, and efficient platform that supports Arabian horse owners, breeders, and event organizers by simplifying registration processes and enhancing the overall championship experience."}
          </p>
        </div>

        {/* COMMITMENT */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-6" style={{ color: gold }}>
            {isAr ? "التزامنا" : "Our Commitment"}
          </h2>

          <p className="text-gray-300 leading-8">
            {isAr
              ? "نلتزم بأعلى معايير الاحترافية والدقة في إدارة بطولات الخيل مع ضمان الأمان والموثوقية في التعامل."
              : "We are committed to maintaining the highest standards of professionalism, integrity, and accuracy in managing Arabian horse events, while ensuring secure transactions and reliable communication with all participants."}
          </p>
        </div>

        {/* CONTACT */}
        <div className="text-center">
          <h2 className="text-3xl mb-6" style={{ color: gold }}>
            {isAr ? "تواصل معنا" : "Contact"}
          </h2>

          <p className="text-gray-300">
            admin@kuwaitshows.com
          </p>
        </div>

      </section>

    </main>
  );
}