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
  <video
    autoPlay
    muted
    loop
    playsInline
    disablePictureInPicture
    className="absolute w-full h-full object-cover pointer-events-none"
  >
    <source src="/horse.mp4" />
  </video>
       <div className="relative min-h-screen bg-[url('/bg.png')] bg-cover bg-center bg-fixed text-white py-20 px-4">
</div>

        <div className="relative z-10">
          <h1 className="text-6xl font-bold" style={{ color: gold }}>
            {isAr ? "من نحن" : "About Kuwait Shows"}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
     <section className="relative py-24 px-6 md:px-20 space-y-20 bg-[url('/bg.png')] bg-cover bg-center bg-fixed">



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

  <h2 className="text-3xl mb-1" style={{ color: gold }}>
    {isAr ? "تواصل معنا" : "Contact us"}
  </h2>

  {/* LOGO */}
  <div className="flex justify-center mb-1">
    <img
      src="/logo.png"
      alt="logo"
      className="w-20 md:w-24 opacity-90 hover:opacity-100 transition duration-300 mb-1"
    />
  </div>

</div>
<div className="text-center mt-4 space-y-4">

  {/* TEXT */}
  <p className="text-lg  md:text-xl font-medium text-[#bc9b6a] tracking-wide">
    {isAr
      ? "التميز يبدأ بمحادثة"
      : "Excellence Begins With a Conversation"}
  </p>

  {/* ICONS */}
  <div className="flex justify-center gap-6 mt-1">

    {/* EMAIL */}
    <a
      href="mailto:admin@kuwaitshows.com"
      className="w-12 h-12 flex items-center justify-center rounded-full border border-[#bc9b6a]
      text-[#bc9b6a] hover:bg-[#bc9b6a] hover:text-black transition duration-300
      hover:shadow-[0_0_15px_#bc9b6a]"
    >
      ✉️
    </a>

    {/* WHATSAPP */}
    <a
      href="https://wa.me/96597944003"
      target="_blank"
      className="w-12 h-12 flex items-center justify-center rounded-full border border-green-500
      text-green-500 hover:bg-green-500 hover:text-black transition duration-300
      hover:shadow-[0_0_15px_#25D366]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 fill-current"
      >
        <path d="M16.001 2.999c-7.18 0-13 5.82-13 13 0 2.295.602 4.546 1.744 6.522L3 29l6.64-1.736A12.944 12.944 0 0016 29c7.18 0 13-5.82 13-13s-5.82-13-13-13zm0 23.5a10.42 10.42 0 01-5.31-1.452l-.38-.224-3.94 1.03 1.05-3.84-.25-.394A10.416 10.416 0 015.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5zm5.79-7.79c-.316-.158-1.872-.924-2.162-1.03-.29-.106-.5-.158-.71.158-.21.316-.816 1.03-1 1.24-.184.21-.368.237-.684.079-.316-.158-1.334-.491-2.54-1.566-.94-.84-1.575-1.876-1.76-2.192-.184-.316-.02-.486.138-.644.142-.142.316-.368.474-.553.158-.184.21-.316.316-.526.106-.21.053-.395-.026-.553-.079-.158-.71-1.71-.973-2.342-.256-.616-.516-.532-.71-.542l-.605-.01c-.21 0-.553.079-.842.395-.29.316-1.105 1.08-1.105 2.632s1.132 3.05 1.29 3.263c.158.21 2.228 3.4 5.4 4.768.754.326 1.342.52 1.8.666.756.24 1.444.206 1.99.125.608-.09 1.872-.764 2.136-1.504.263-.74.263-1.374.184-1.504-.079-.132-.29-.21-.605-.368z"/>
      </svg>
    </a>

  </div>

</div>





      </section>

    </main>
  );
}