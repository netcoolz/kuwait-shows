"use client";

import { useState, useEffect } from "react";
import { CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";

// --- قاموس اللغات (نسخة التسويق الذكي - بدون الجدول) ---
const translations = {
  ar: {
    dir: "rtl",
    hero: {
      badge: "تقنيات عالمية حصرية تُستخدم لأول مرة",
      title: "أول نظام عربي متكامل<br/>لإدارة بطولات جمال الخيل",
      subtitle: "نظام حصري يتميز بخوارزميات ذكية تُستخدم لأول مرة في العالم. من المنصة إلى التتويج.. كويت شوز يدير بطولتك كاملة باحترافية مطلقة.",
      quote: "العدالة ليست مجرد التزام، بل هي الأساس الذي تُبنى عليه ثقة الملاك وسمعة البطولات."
    },
    sections: [
      {
        id: "ecaho",
        icon: "⚖️",
        title: "1. توافق تام وحسابات دقيقة",
        desc: "نمتلك نواة حسابية خاصة ومطورة بدقة متناهية لضمان التطابق الحرفي مع اللوائح العالمية الصارمة لبطولات الخيل.",
        points: [
          { t: "معايير التقييم:", d: "تغطية برمجية كاملة للمعايير المعتمدة لضمان دقة لا متناهية في رصد درجات الحكام." },
          { t: "مرونة الاستبعاد:", d: "نظامنا مجهز بخوارزميات صامتة تتعامل مع قواعد استبعاد الدرجات المعقدة بشكل لحظي وآلي." }
        ]
      },
      {
        id: "draw",
        icon: "🎲",
        title: "2. تقنية التخصيص العشوائي الذكي",
        desc: "ابتكرنا آلية حصرية تضمن النزاهة المطلقة وتضع جميع المشاركين على مسافة واحدة من العدالة.",
        points: [
          { t: "درع النزاهة:", d: "آلية رقمية تمنع أي احتمالية للتدخل البشري في توزيع لجان التحكيم على الفئات." },
          { t: "شفافية العرض:", d: "استعراض رقمي حي أمام الجمهور يعكس مدى قوة وحيادية المنظومة التنظيمية." }
        ]
      },
      {
        id: "tiebreak",
        icon: "🥇",
        title: "3. خوارزمية الحسم السريع",
        desc: "التعادل في النهائيات أمر وارد، لذا طورنا (Smart Tie-Breaker) لحسم النتائج في أجزاء من الثانية.",
        points: [
          { t: "تحليل متعدد الطبقات:", d: "يقوم النظام بتحليل مسارات التصويت السابقة للخيول المتعادلة لحسم النتيجة دون أي تأخير زمني." },
          { t: "دقة القرار:", d: "يتم استخراج بطل الفئة بناءً على تسلسل منطقي محكم وموثق لا يقبل الخطأ." }
        ]
      },
      {
        id: "transparency",
        icon: "📺",
        title: "4. إخراج سينمائي ومزامنة حية",
        desc: "نظام إخراج يربط بين الميدان، الكنترول، والجمهور في دائرة رقمية واحدة متزامنة.",
        points: [
          { t: "تفاعل الجمهور:", d: "مؤشرات حية تضع الجمهور في قلب الحدث وتخلق حماساً منقطع النظير في المدرجات." },
          { t: "منصة الكنترول:", d: "غرفة عمليات متكاملة تمنح مدير الميدان سيطرة مطلقة على مجريات البطولة بضغطة زر." }
        ]
      },
      {
        id: "versatility",
        icon: "🌍",
        title: "5. مرونة فائقة وإدارة شاملة",
        desc: "نحن لا نقدم مجرد شاشات، بل ندير الحدث برمجياً من الألف إلى الياء بمرونة لا مثيل لها.",
        points: [
          { t: "تحكيم كافة السلالات:", d: "لدينا القدرة الكاملة والمرونة لتخصيص النظام لتحكيم أي نوع من بطولات الخيل حول العالم." },
          { t: "إدارة متكاملة:", d: "من لحظة تسجيل الخيل في المنصة وحتى لحظة التتويج.. كويت شوز يتكفل بالمنظومة كاملة." },
          { t: "دعم فني ميداني:", d: "فريق تقني متواجد لحظة بلحظة في قلب الحدث لضمان سير البطولة واستقرار البث." }
        ]
      }
    ],
    security: {
      title: "🛡️ بروتوكولات الحماية المتطورة",
      desc: "يعمل النظام وفق بنية تحتية أمنية معقدة تضمن عدم ضياع البيانات أو التلاعب بها تحت أي ظرف:",
      items: [
        { t: "تشفير البيانات اللحظي:", d: "الدرجات المعتمدة تدخل في مسار مشفر بالكامل يمنع أي صلاحية لتعديلها لاحقاً." },
        { t: "الاستقرار في أسوأ الظروف:", d: "تقنيات متقدمة تضمن استمرار عمل أجهزة الحكام حتى في حال الانقطاع المفاجئ لشبكات الاتصال في الميدان." },
        { t: "الاستقلالية التامة:", d: "بيئة معزولة بالكامل لكل حكم تضمن استقلالية قراره وسريته التامة." }
      ]
    },
    cta: {
      title: "احجز موعدك معنا الآن",
      desc: "ندعوكم للتواصل معنا لاستعراض إمكانيات نظامنا المتطور عن قرب، ومناقشة سبل الارتقاء ببطولتكم القادمة بأعلى معايير الاحترافية.",
      btn: "تواصل معنا"
    },
    footer: "© 2026 KUWAIT SHOWS. جميع الحقوق محفوظة."
  },
  en: {
    dir: "ltr",
    hero: {
      badge: "World's First Exclusive Technologies",
      title: "The First Arab System<br/>For Horse Show Management",
      subtitle: "An exclusive system featuring smart algorithms used for the first time globally. From the platform to the crowning, Kuwait Shows manages your event with absolute professionalism.",
      quote: "Fairness is not just a commitment; it is the foundation upon which owners' trust and the shows' reputation are built."
    },
    sections: [
      {
        id: "ecaho",
        icon: "⚖️",
        title: "1. Precision & Compliance",
        desc: "We possess a highly developed computational core ensuring strict compliance with global horse show regulations.",
        points: [
          { t: "Evaluation Criteria:", d: "Comprehensive software coverage for standard criteria to ensure infinite accuracy in recording scores." },
          { t: "Exclusion Flexibility:", d: "Equipped with silent algorithms that handle complex score-dropping rules instantly and automatically." }
        ]
      },
      {
        id: "draw",
        icon: "🎲",
        title: "2. Smart Randomization Tech",
        desc: "An exclusive mechanism that guarantees absolute integrity and puts all participants on equal footing.",
        points: [
          { t: "Shield of Integrity:", d: "A digital mechanism that completely eliminates human intervention in assigning judging panels." },
          { t: "Visual Transparency:", d: "A live digital display for the audience that reflects the strength and neutrality of the organizational system." }
        ]
      },
      {
        id: "tiebreak",
        icon: "🥇",
        title: "3. Rapid Resolution Algorithm",
        desc: "Ties in finals are common. We developed a Smart Tie-Breaker to resolve results in fractions of a second.",
        points: [
          { t: "Multi-layer Analysis:", d: "The system analyzes historical voting paths of tied horses to determine the winner instantly." },
          { t: "Decisive Accuracy:", d: "The champion is extracted based on a solid, documented logical sequence with zero margin for error." }
        ]
      },
      {
        id: "transparency",
        icon: "📺",
        title: "4. Cinematic Live Sync",
        desc: "A broadcasting system that links the arena, control room, and audience in one synchronized digital loop.",
        points: [
          { t: "Audience Engagement:", d: "Live indicators put the audience in the heart of the action, creating unmatched excitement." },
          { t: "Command Center:", d: "An integrated operations room giving the ringmaster absolute control over the event with a single click." }
        ]
      },
      {
        id: "versatility",
        icon: "🌍",
        title: "5. Ultimate Versatility",
        desc: "We don't just provide screens; we manage the event digitally from A to Z.",
        points: [
          { t: "Judging All Breeds:", d: "Full capability to customize the system to judge ANY type of horse show worldwide." },
          { t: "End-to-End Management:", d: "From registration to the crowning moment.. Kuwait Shows handles the entire ecosystem." },
          { t: "On-Site Support:", d: "A dedicated technical team present on-site to ensure the show runs flawlessly." }
        ]
      }
    ],
    security: {
      title: "🛡️ Advanced Security Protocols",
      desc: "Operating on a complex security infrastructure to ensure data is never lost or manipulated:",
      items: [
        { t: "Real-time Encryption:", d: "Approved scores enter a fully encrypted path, preventing any subsequent modification privileges." },
        { t: "Worst-case Stability:", d: "Advanced tech ensuring judges' devices continue to function even if arena networks drop." },
        { t: "Total Independence:", d: "A fully isolated environment for each judge to guarantee the independence of their decisions." }
      ]
    },
    cta: {
      title: "Book Your Appointment",
      desc: "We invite you to contact us for a closer look at our advanced system's capabilities, and to discuss how we can elevate your upcoming event.",
      btn: "Contact Us"
    },
    footer: "© 2026 KUWAIT SHOWS. ALL RIGHTS RESERVED."
  }
};

export default function DigitalScoringSystemPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved as "en" | "ar");

    const updateLang = () => {
      const l = (localStorage.getItem("lang") || "en") as "en" | "ar";
      setLang(l);
    };

    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  if (!mounted) return null;

  const t = translations[lang];

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center text-white font-sans" 
      style={{ backgroundImage: "url('/bg.png')" }}
      dir={t.dir}
    >
      <div className="min-h-screen bg-black/85 px-4 py-8 md:px-12 md:py-16 backdrop-blur-[4px] flex flex-col">
        
        <div className="max-w-7xl mx-auto flex-grow w-full">

          {/* ----- Hero Section ----- */}
          <div className="relative rounded-[2.5rem] overflow-hidden mb-16 h-[60vh] min-h-[600px] flex items-center justify-center border border-[#bc9b6a]/50 shadow-[0_0_60px_rgba(188,155,106,0.15)]">
            <img 
              src="/about4.png" 
              alt="Kuwait Shows Digital Scoring System" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
            
            <div className="relative z-10 text-center px-6 max-w-5xl mt-16 space-y-6">
              <div className="inline-block px-8 py-2.5 rounded-full border border-[#bc9b6a] bg-[#050B18]/80 text-xs md:text-sm text-[#bc9b6a] font-bold tracking-[0.2em] uppercase shadow-inner">
                {t.hero.badge}
              </div>
              
              {/* 🔥 تم التعديل هنا: زيادة المسافة بين الأسطر (leading-[1.8]) وتخفيف سماكة الخط ليكون مقروءاً وأنيقاً */}
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#bc9b6a] leading-[1.8] md:leading-[1.8] drop-shadow-2xl py-2" 
                dangerouslySetInnerHTML={{ __html: t.hero.title }} 
              />
              
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto drop-shadow-lg mt-4">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto mb-24 space-y-6 bg-gradient-to-br from-[#1a1a1a] to-[#050B18] p-10 rounded-3xl backdrop-blur-xl border border-[#bc9b6a]/20 shadow-2xl">
            <p className="text-xl md:text-3xl text-[#bc9b6a] leading-[1.8] font-medium italic">
              "{t.hero.quote}"
            </p>
          </div>

          {/* ----- Dynamic Scoring Features Sections ----- */}
          <div className="space-y-16 mb-24">
            {t.sections.map((section, idx) => (
              <div 
                key={section.id} 
                className={`flex flex-col lg:flex-row gap-12 items-stretch ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Text Content */}
                <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-[#bc9b6a]/30 p-10 md:p-14 rounded-[2.5rem] shadow-xl hover:border-[#bc9b6a]/70 hover:shadow-[0_0_40px_rgba(188,155,106,0.15)] transition-all duration-500 relative overflow-hidden group">
                  <div className={`absolute -bottom-40 w-80 h-80 bg-[#bc9b6a] rounded-full blur-[140px] opacity-10 group-hover:opacity-20 transition-opacity ${lang === 'ar' ? '-right-40' : '-left-40'}`}></div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#bc9b6a] mb-6 flex items-center gap-4 relative z-10 leading-[1.6]">
                    <span className="text-5xl drop-shadow-[0_0_15px_rgba(188,155,106,0.5)]">{section.icon}</span> {section.title}
                  </h2>
                  <p className="text-gray-300 text-lg leading-loose relative z-10 mb-8 border-b border-[#bc9b6a]/20 pb-8">
                    {section.desc}
                  </p>
                  
                  <ul className="space-y-6 relative z-10">
                    {section.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0 mt-2.5"></div>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                          <strong className="text-white block sm:inline sm:mx-2">{pt.t}</strong> 
                          {pt.d}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative Visual Box */}
                <div className="hidden lg:flex w-1/3 relative rounded-[2.5rem] overflow-hidden border border-[#bc9b6a]/20 shadow-2xl items-center justify-center bg-gradient-to-br from-[#bc9b6a]/10 to-[#050B18]">
                   <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] to-transparent opacity-80"></div>
                   <span className="text-[10rem] opacity-30 drop-shadow-[0_0_30px_rgba(188,155,106,0.4)] z-10">{section.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ----- Security & Anti-Tampering Section ----- */}
          <div className="bg-gradient-to-br from-red-950/60 via-[#050B18] to-black border border-red-800/60 py-16 px-8 md:px-16 rounded-[3rem] mb-24 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-600/50 rounded-full blur-[200px] opacity-20 pointer-events-none"></div>
            
            <div className="mb-14 relative z-10 text-center md:text-start border-b border-red-900/50 pb-8">
              <h2 className="text-3xl md:text-5xl font-extrabold text-red-400 mb-6 drop-shadow-xl leading-[1.6]">{t.security.title}</h2>
              <p className="text-gray-300 text-xl leading-relaxed max-w-4xl">{t.security.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {t.security.items.map((sec, idx) => (
                <div key={idx} className="bg-black/60 backdrop-blur-md border border-red-500/20 p-8 rounded-3xl hover:bg-red-950/40 hover:border-red-500/50 transition-all duration-300 flex items-start gap-5 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center font-bold text-2xl shrink-0 border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{sec.t}</h3>
                    <p className="text-gray-400 leading-relaxed text-base">{sec.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ----- VIP Call To Action (Minimalist & Professional) ----- */}
          <div className="relative border border-[#bc9b6a]/30 bg-black/40 backdrop-blur-xl rounded-[2rem] p-12 md:p-20 text-center shadow-[0_0_40px_rgba(188,155,106,0.05)] overflow-hidden mb-12 max-w-5xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-[#bc9b6a]/70 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-light text-[#bc9b6a] mb-6 tracking-wide drop-shadow-md">
                {t.cta.title}
              </h2>
              <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl font-light">
                {t.cta.desc}
              </p>
              
              <a 
                href="mailto:admin@kuwaitshows.com" 
                className="inline-flex items-center justify-center border border-[#bc9b6a] text-[#bc9b6a] hover:bg-[#bc9b6a] hover:text-black transition-all duration-500 font-bold text-sm md:text-base px-12 py-4 tracking-[0.2em] uppercase rounded-sm"
              >
                {t.cta.btn}
              </a>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-[#bc9b6a]/70 to-transparent"></div>
          </div>

          {/* ----- Footer ----- */}
          <footer className="mt-20 pt-8 pb-6 border-t border-[#bc9b6a]/20 flex flex-col items-center justify-center gap-4 relative z-10">
            <p className="text-[#bc9b6a]/60 text-xs md:text-sm font-light tracking-[0.2em] text-center uppercase">
              {t.footer}
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}