"use client";

import { useState, useEffect } from "react";

// --- قاموس اللغات (Dictionary) ---
const translations = {
  ar: {
    dir: "rtl",
    badge: "اكتشف الأصالة العربية",
    title: "بطولات جمال<br/>الخيل العربية الأصيلة",
    subtitle: "فعاليات رسمية عريقة تقام لعرض وتقييم أعرق سلالات الخيل، تجسيداً للأصالة، القوة، والجمال الموروث.",
    quote: "\"هي أقرب إلى عرض فني حي، حيث يقف الجواد أمام الجمهور والحكّام ليُظهر أبهى صفاته الجمالية الموروثة عبر أجيال طويلة.\"",
    
    essenceTitle: "الجوهر والأصالة",
    essenceDesc: "يتميز الخيل العربي بتاريخ عريق يرتبط بالجزيرة العربية، واكتسب شهرته العالمية من صفات فريدة محفوظة بعناية عبر مئات السنين:",
    head: "الرأس:", headDesc: "صغير ومميز بتقعر خفيف.",
    eyes: "العيون:", eyesDesc: "واسعة ومعبرة تدل على الذكاء.",
    neck: "الرقبة:", neckDesc: "مقوسة بأناقة وكبرياء.",
    tail: "الذيل:", tailDesc: "مرتفع بفخر أثناء الحركة.",
    
    historyTitle: "📜 لمحة تاريخية والأهداف",
    historyDesc: "تعود جذورها لاهتمام العرب بتوثيق سلالات خيلهم كرمز للقوة والنسب الأصيل. تحولت هذه الاهتمامات لفعاليات عالمية منظمة تهدف إلى <strong>الحفاظ على نقاء السلالة</strong>، تنظيم سوق الفروسية باحترافية، وتوفير منصة تنافسية لدعم الملاك والمربين لعرض إنتاجهم للعالم.",
    
    typesTitle: "🏆 أنواع وتصنيفات البطولات الدولية",
    typesDesc: "تختلف البطولات من حيث قوة المنافسة ومستوى المشاركة، لكنها جميعاً تهدف إلى إبراز جمال الخيل، بدءاً من المنافسات المحلية وحتى أكبر الجولات العالمية الكبرى.",
    
    levelTitle: "مستويات العروض",
    levelA: "A Show:", levelADesc: "أعلى مستوى بمشاركة نخبة الخيل عالمياً.",
    levelB: "B Show:", levelBDesc: "مستوى قوي بمنافسة إقليمية أو دولية.",
    levelC: "C Show:", levelCDesc: "الانطلاقة المثالية للخيل الناشئة.",
    
    titleShowsTitle: "بطولات الألقاب",
    titleShowsDesc: "تشمل فئات كبرى مثل A Title و B Title. الفوز بها يرفع من قيمة الخيل بشكل كبير، حيث يتم تتويج الأبطال رسمياً بالألقاب.",
    
    geoTitle: "النطاق الجغرافي",
    geoNat: "محلية (National):", geoNatDesc: "تقام داخل الدولة لدعم الإنتاج.",
    geoInt: "دولية (International):", geoIntDesc: "مفتوحة لمشاركين من مختلف الدول.",
    
    toursTitle: "الجولات الكبرى",
    toursDesc: "أعلى مستوى من التنظيم والمنافسة، وتضم نخبة الخيل:",
    tour1: "جولة الأبطال العالمية (GCAT)",
    tour2: "بطولة العالم (World Championship)",
    
    scoreTitle: "✨ معايير التقييم (Scorecard)",
    scoreDesc: "يتم تقييم كل جواد من قبل لجنة تحكيم دولية خبيرة وفق نظام نقاط دقيق وشامل يركز على المعايير الخمسة الأساسية لضمان النزاهة التامة:",
    score1Title: "النوع (Type):", score1Desc: "مدى تمثيل الجواد للسمات العربية الأصيلة (الكاريزما والهوية).",
    score2Title: "الرأس والعنق (Head & Neck):", score2Desc: "دقة الملامح، تقعر الوجه، وسعة العينين، وتقوس العنق.",
    score3Title: "الجسم والظهر (Body & Topline):", score3Desc: "تناسق البنية العضلية، قوة الظهر، واستقامة الخط العلوي.",
    score4Title: "القوائم (Legs):", score4Desc: "استقامة الأرجل، صحة المفاصل، وقوة الحوافر.",
    score5Title: "الحركة (Movement):", score5Desc: "خفة الحركة، اندفاع الجواد، وارتفاع الخطوات الاستعراضية.",
    
    arenaTitle: "🎭 العرض داخل الحلبة",
    arenaStep1: "1. التصفيات (Classes):",
    arenaStep1Desc: "تتنافس الخيل في البداية حسب فئات عمرية (كلاسات). يتم تقييمها من قبل حكام دوليين رسميين معتمدين من منظمة (ECAHO)، ويُمنح الجواد فوزاً في الكلاس بناءً على مجموع النقاط المحققة.",
    arenaStep2: "2. البطولة النهائية (Championship):",
    arenaStep2Desc: "يتأهل المتصدرون من كل فئة للمنافسة النهائية، حيث يتم اختيار الأبطال رسمياً وتتويجهم بالألقاب الكبرى:",
    gold: "🥇 البطل الذهبي",
    silver: "🥈 البطل الفضي",
    bronze: "🥉 البطل البرونزي",
    
    orgTitle: "بطولات تخضع لإشراف عالمي",
    orgDesc: "نلتزم بأعلى معايير النزاهة والقوانين الدولية المعتمدة",
    waho: "المنظمة العالمية<br/>للخيل العربية",
    ecaho: "الهيئة الأوروبية<br/>لمسابقات الخيل",
    aho: "منظمة الجواد<br/>العربي",
    
    footerTitle: "💙 دورنا في Kuwait Shows",
    footerDesc: "نؤمن بأن الخيل العربية تستحق منصة تليق بعظمتها. نحن هنا لنكون الجسر الذي يربط بين التراث والتقنية، من خلال التنظيم الرقمي الشامل، عرض النتائج الحية، وتوفير تجربة حجز راقية تليق بضيوفنا.",
    footerHighlight: "الواجهة الرقمية الأولى لعالم بطولات الخيل."
  },
  en: {
    dir: "ltr",
    badge: "Discover Arabian Authenticity",
    title: "Purebred Arabian<br/>Horse Championships",
    subtitle: "Prestigious official events held to showcase and evaluate the most ancient horse breeds, embodying pure lineage, strength, and inherited beauty.",
    quote: "\"It is akin to a live art exhibition, where the horse stands before the audience and judges to display its finest aesthetic traits inherited over generations.\"",
    
    essenceTitle: "Essence & Authenticity",
    essenceDesc: "The Arabian horse boasts a rich history tied to the Arabian Peninsula, gaining global fame through unique traits carefully preserved over centuries:",
    head: "Head:", headDesc: "Small and distinct with a slightly concave profile (dish).",
    eyes: "Eyes:", eyesDesc: "Large and expressive, denoting intelligence.",
    neck: "Neck:", neckDesc: "Elegantly arched with pride.",
    tail: "Tail:", tailDesc: "Carried high with pride during movement.",
    
    historyTitle: "📜 Historical Glimpse & Goals",
    historyDesc: "Its roots trace back to the Arab interest in documenting their horses' bloodlines as a symbol of strength and noble lineage. These interests evolved into organized global events aiming to <strong>preserve the breed's purity</strong>, professionally regulate the equestrian market, and provide a competitive platform for owners and breeders to showcase their production to the world.",
    
    typesTitle: "🏆 International Show Categories",
    typesDesc: "Championships vary in competition strength and participation level, yet all aim to highlight equine beauty, ranging from local competitions to the grandest global tours.",
    
    levelTitle: "Show Levels",
    levelA: "A Show:", levelADesc: "The highest level featuring elite horses globally.",
    levelB: "B Show:", levelBDesc: "A strong level with regional or international competition.",
    levelC: "C Show:", levelCDesc: "The perfect starting point for young horses.",
    
    titleShowsTitle: "Title Shows",
    titleShowsDesc: "Includes major categories like A Title and B Title. Winning these significantly raises a horse's value, as champions are officially crowned.",
    
    geoTitle: "Geographical Scope",
    geoNat: "National:", geoNatDesc: "Held within the country to support local production.",
    geoInt: "International:", geoIntDesc: "Open to participants from various countries.",
    
    toursTitle: "Major Tours",
    toursDesc: "The highest level of organization and competition, featuring elite horses:",
    tour1: "Global Champions Arabians Tour (GCAT)",
    tour2: "The Triple Crown",
    
    scoreTitle: "✨ Evaluation Criteria (Scorecard)",
    scoreDesc: "Each horse is evaluated by a panel of expert international judges using a precise point system focusing on five essential criteria to ensure total fairness:",
    score1Title: "Type:", score1Desc: "How well the horse represents authentic Arabian traits (Charisma and Identity).",
    score2Title: "Head & Neck:", score2Desc: "Precision of features, facial dish, large eyes, and neck arch.",
    score3Title: "Body & Topline:", score3Desc: "Muscular symmetry, strong back, and a straight topline.",
    score4Title: "Legs:", score4Desc: "Straightness of legs, healthy joints, and strong hooves.",
    score5Title: "Movement:", score5Desc: "Lightness of movement, impulsion, and elevated show trot.",
    
    arenaTitle: "🎭 Inside the Show Arena",
    arenaStep1: "1. Qualification (Classes):",
    arenaStep1Desc: "Horses initially compete by age groups (Classes). They are evaluated by official international judges accredited by (ECAHO). Winners in each class are determined based on their total points.",
    arenaStep2: "2. The Finale (Championship):",
    arenaStep2Desc: "The top winners from each class qualify for the final championship round, where judges select the ultimate champions for:",
    gold: "🥇 Gold Champion",
    silver: "🥈 Silver Champion",
    bronze: "🥉 Bronze Champion",
    
    orgTitle: "Globally Supervised Championships",
    orgDesc: "We adhere to the highest standards of integrity and approved international laws",
    waho: "World Arabian<br/>Horse Organization",
    ecaho: "European Conference of<br/>Arab Horse Organizations",
    aho: "Arabian Horse<br/>Organization",
    
    footerTitle: "💙 Our Role at Kuwait Shows",
    footerDesc: "We believe Arabian horses deserve a platform worthy of their greatness. We are here to bridge heritage and technology through comprehensive digital organization, live results, and a premium booking experience for our guests.",
    footerHighlight: "The Premier Digital Interface for the Arabian Horse World."
  }
};

export default function AboutHorsesPage() {
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
      className="min-h-screen bg-cover bg-fixed bg-center text-white" 
      style={{ backgroundImage: "url('/bg.png')" }}
      dir={t.dir}
    >
      <div className="min-h-screen bg-black/70 px-4 py-8 md:px-12 md:py-16 backdrop-blur-[1px] flex flex-col">
        
        <div className="max-w-7xl mx-auto flex-grow">

          {/* البانر العلوي */}
          <div className="relative rounded-3xl overflow-hidden mb-16 h-[50vh] min-h-[500px] flex items-center justify-center border border-[#bc9b6a]/40 shadow-[0_0_50px_rgba(188,155,106,0.25)]">
            <img 
              src="/about2.png" 
              alt="صورة الهيدر الفخمة about2" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
            
            <div className="relative z-10 text-center px-6 max-w-5xl mt-16 space-y-6">
              <div className="inline-block px-5 py-2 rounded-full border border-[#bc9b6a]/70 bg-black/50 text-sm text-[#bc9b6a] font-medium tracking-wide shadow-inner">
                {t.badge}
              </div>
              <h1 
                className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#bc9b6a] leading-tight drop-shadow-xl" 
                dangerouslySetInnerHTML={{ __html: t.title }} 
              />
              <p className="text-xl md:text-2xl text-gray-100 font-light leading-loose drop-shadow-2xl max-w-4xl mx-auto">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* مقولة العرض الحي */}
          <div className="text-center max-w-5xl mx-auto mb-20 space-y-8 bg-black/50 p-10 rounded-3xl backdrop-blur-lg border border-white/5 shadow-inner">
            <p className="text-2xl md:text-3xl lg:text-4xl text-[#bc9b6a] leading-loose font-medium italic drop-shadow-[0_0_15px_rgba(188,155,106,0.35)]">
              {t.quote}
            </p>
            <div className="w-32 h-1.5 bg-[#bc9b6a] mx-auto rounded-full shadow-[0_0_15px_#bc9b6a]"></div>
          </div>

          {/* قسم الخيل الأصيل والتاريخ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-stretch">
            <div className="lg:col-span-2 space-y-12">
              
              <div className="bg-black/60 backdrop-blur-2xl border border-[#bc9b6a]/30 p-12 rounded-3xl shadow-2xl hover:border-[#bc9b6a]/60 hover:shadow-[0_0_40px_rgba(188,155,106,0.15)] transition-all duration-500">
                <h2 className="text-3xl font-bold text-[#bc9b6a] mb-8 flex items-center gap-4">
                  <span className="text-5xl">🧬</span> {t.essenceTitle}
                </h2>
                <p className="text-gray-200 text-lg leading-loose mb-8">
                  {t.essenceDesc}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-gray-100 text-lg leading-relaxed">
                  <li className="flex items-center gap-3.5"><div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0"></div><strong className="text-white mx-1">{t.head}</strong> {t.headDesc}</li>
                  <li className="flex items-center gap-3.5"><div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0"></div><strong className="text-white mx-1">{t.eyes}</strong> {t.eyesDesc}</li>
                  <li className="flex items-center gap-3.5"><div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0"></div><strong className="text-white mx-1">{t.neck}</strong> {t.neckDesc}</li>
                  <li className="flex items-center gap-3.5"><div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0"></div><strong className="text-white mx-1">{t.tail}</strong> {t.tailDesc}</li>
                </ul>
              </div>

              <div className="bg-black/60 backdrop-blur-2xl border border-[#bc9b6a]/30 p-12 rounded-3xl shadow-2xl hover:border-[#bc9b6a]/60 hover:shadow-[0_0_40px_rgba(188,155,106,0.15)] transition-all duration-500 relative overflow-hidden">
                <div className={`absolute -bottom-32 w-80 h-80 bg-[#bc9b6a] rounded-full blur-[130px] opacity-15 ${lang === 'ar' ? '-right-32' : '-left-32'}`}></div>
                <h2 className="text-3xl font-bold text-[#bc9b6a] mb-8 flex items-center gap-4 relative z-10">
                  <span className="text-5xl">📜</span> {t.historyTitle}
                </h2>
                <p className="text-gray-200 text-lg leading-loose relative z-10" dangerouslySetInnerHTML={{ __html: t.historyDesc }} />
              </div>

            </div>

            <div className="hidden lg:block relative rounded-3xl overflow-hidden border border-[#bc9b6a]/30 h-full min-h-[600px] shadow-2xl group flex-shrink-0">
              <img 
                src="/about1.jpg" 
                alt="تفاصيل جمال الجواد العربي about1جانبية" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* قسم أنواع وتصنيفات البطولات */}
          <div className="bg-black/40 backdrop-blur-xl border border-[#bc9b6a]/40 py-20 px-6 rounded-[2rem] mb-20 shadow-2xl relative overflow-hidden">
            <div className={`absolute -top-40 w-96 h-96 bg-[#bc9b6a] rounded-full blur-[150px] opacity-10 ${lang === 'ar' ? '-left-40' : '-right-40'}`}></div>
            <div className="text-center mb-16 space-y-5 relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-xl">{t.typesTitle}</h2>
              <p className="text-gray-200 max-w-3xl mx-auto text-xl leading-relaxed">
                {t.typesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 relative z-10">
              
              <div className="bg-black/70 border border-[#bc9b6a]/30 p-10 rounded-2xl hover:-translate-y-3 hover:border-[#bc9b6a] hover:shadow-[0_0_40px_rgba(188,155,106,0.2)] transition-all duration-300 group shadow-lg">
                <div className="w-16 h-16 rounded-full bg-[#bc9b6a] text-black text-3xl flex items-center justify-center font-bold mb-7 group-hover:scale-110 transition-transform shadow-xl">1</div>
                <h3 className="text-2xl font-bold text-[#bc9b6a] mb-5">{t.levelTitle}</h3>
                <ul className="space-y-4 text-gray-300 text-base leading-relaxed">
                  <li><strong className="text-white text-lg block">{t.levelA}</strong> {t.levelADesc}</li>
                  <li><strong className="text-white text-lg block">{t.levelB}</strong> {t.levelBDesc}</li>
                  <li><strong className="text-white text-lg block">{t.levelC}</strong> {t.levelCDesc}</li>
                </ul>
              </div>

              <div className="bg-black/70 border border-[#bc9b6a]/30 p-10 rounded-2xl hover:-translate-y-3 hover:border-[#bc9b6a] hover:shadow-[0_0_40px_rgba(188,155,106,0.2)] transition-all duration-300 group shadow-lg flex flex-col justify-start">
                <div className="w-16 h-16 rounded-full bg-[#bc9b6a] text-black text-3xl flex items-center justify-center font-bold mb-7 group-hover:scale-110 transition-transform shadow-xl shrink-0">2</div>
                <h3 className="text-2xl font-bold text-[#bc9b6a] mb-5">{t.titleShowsTitle}</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  {t.titleShowsDesc}
                </p>
              </div>

              <div className="bg-black/70 border border-[#bc9b6a]/30 p-10 rounded-2xl hover:-translate-y-3 hover:border-[#bc9b6a] hover:shadow-[0_0_40px_rgba(188,155,106,0.2)] transition-all duration-300 group shadow-lg">
                <div className="w-16 h-16 rounded-full bg-[#bc9b6a] text-black text-3xl flex items-center justify-center font-bold mb-7 group-hover:scale-110 transition-transform shadow-xl">3</div>
                <h3 className="text-2xl font-bold text-[#bc9b6a] mb-5">{t.geoTitle}</h3>
                <ul className="space-y-4 text-gray-300 text-base leading-relaxed">
                  <li><strong className="text-white text-lg block">{t.geoNat}</strong> {t.geoNatDesc}</li>
                  <li><strong className="text-white text-lg block">{t.geoInt}</strong> {t.geoIntDesc}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#bc9b6a]/30 to-black/70 border border-[#bc9b6a]/60 p-10 rounded-2xl hover:-translate-y-3 hover:border-[#bc9b6a] hover:shadow-[0_0_50px_rgba(188,155,106,0.4)] transition-all duration-300 relative overflow-hidden group shadow-lg h-full flex flex-col items-center">
                <div className="absolute inset-0 bg-black/50 opacity-10 blur-md pointer-events-none"></div>
                <div className="w-16 h-16 rounded-full bg-[#bc9b6a] text-black text-3xl flex items-center justify-center font-bold mb-7 group-hover:scale-110 transition-transform shadow-xl relative z-10 shrink-0">4</div>
                <h3 className="text-2xl font-bold text-[#bc9b6a] mb-5 relative z-10">{t.toursTitle}</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-5 relative z-10 text-center">
                  {t.toursDesc}
                </p>
                <ul className={`space-y-3 font-bold text-white text-base relative z-10 leading-relaxed w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] mt-2 shrink-0"></div>
                    <span>{t.tour1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] mt-2 shrink-0"></div>
                    <span>{t.tour2}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* قسم التقييم وتجربة العرض */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-stretch">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-md">{t.scoreTitle}</h2>
              <p className="text-gray-200 mb-8 text-lg leading-loose bg-black/40 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                {t.scoreDesc}
              </p>
              <div className="space-y-5">
                {[
                  { title: t.score1Title, desc: t.score1Desc },
                  { title: t.score2Title, desc: t.score2Desc },
                  { title: t.score3Title, desc: t.score3Desc },
                  { title: t.score4Title, desc: t.score4Desc },
                  { title: t.score5Title, desc: t.score5Desc }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-6 bg-black/60 backdrop-blur-xl p-5 rounded-xl border border-white/10 hover:border-[#bc9b6a]/30 transition-all shadow-md">
                    <div className="w-14 h-14 rounded-full bg-[#bc9b6a] text-black flex items-center justify-center font-bold text-2xl shrink-0 shadow-[0_0_20px_rgba(188,155,106,0.3)]">
                      {index + 1}
                    </div>
                    <p className="text-gray-200 text-base md:text-lg"><strong className="text-white text-lg mx-1">{item.title}</strong> {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#bc9b6a]/20 via-black/70 to-black backdrop-blur-3xl border border-[#bc9b6a]/40 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden shadow-2xl h-full flex flex-col border-t-[#bc9b6a]/60">
              <div className={`absolute -top-30 w-96 h-96 bg-[#bc9b6a] rounded-full blur-[130px] opacity-20 pointer-events-none ${lang === 'ar' ? '-right-30' : '-left-30'}`}></div>
              <h2 className="text-3xl font-bold text-[#bc9b6a] mb-8 relative z-10 flex items-center gap-3">{t.arenaTitle}</h2>
              
              <div className="space-y-8 relative z-10">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <h3 className="text-[#bc9b6a] font-bold text-xl mb-3">{t.arenaStep1}</h3>
                  <p className="text-gray-200 leading-relaxed">
                    {t.arenaStep1Desc}
                  </p>
                </div>

                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <h3 className="text-[#bc9b6a] font-bold text-xl mb-3">{t.arenaStep2}</h3>
                  <p className="text-gray-200 leading-relaxed mb-6">
                    {t.arenaStep2Desc}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <span className="flex-1 text-center py-3 bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-bold rounded-xl shadow-lg ring-1 ring-white/20">{t.gold}</span>
                    <span className="flex-1 text-center py-3 bg-gradient-to-r from-[#E0E0E0] to-[#A9A9A9] text-black font-bold rounded-xl shadow-lg ring-1 ring-white/20">{t.silver}</span>
                    <span className="flex-1 text-center py-3 bg-gradient-to-r from-[#CD7F32] to-[#8B4513] text-white font-bold rounded-xl shadow-lg ring-1 ring-white/20">{t.bronze}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* قسم المنظمات المعتمدة */}
          <div className="border-t border-white/20 pt-20 mb-20 bg-black/40 backdrop-blur-sm rounded-[3rem] px-10 py-16 shadow-inner border-b border-[#bc9b6a]/30">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-3 drop-shadow-xl">{t.orgTitle}</h2>
            <p className="text-center text-gray-300 mb-16 text-xl">{t.orgDesc}</p>
            
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-90 hover:opacity-100 transition-opacity duration-500 max-w-5xl mx-auto">
              
              <a href="http://www.waho.org" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-5 group cursor-pointer">
                <div className="w-28 h-28 rounded-full border-2 border-[#bc9b6a] bg-black/50 flex items-center justify-center text-[#bc9b6a] font-bold text-3xl tracking-wider group-hover:bg-[#bc9b6a] group-hover:text-black group-hover:shadow-[0_0_30px_#bc9b6a] transition-all duration-300 shadow-xl">WAHO</div>
                <span className="text-lg text-gray-300 font-medium text-center group-hover:text-white transition-colors" dangerouslySetInnerHTML={{ __html: t.waho }} />
              </a>

              <a href="https://www.ecaho.org" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-5 group cursor-pointer">
                <div className="w-28 h-28 rounded-full border-2 border-[#bc9b6a] bg-black/50 flex items-center justify-center text-[#bc9b6a] font-bold text-2xl tracking-wider group-hover:bg-[#bc9b6a] group-hover:text-black group-hover:shadow-[0_0_30px_#bc9b6a] transition-all duration-300 shadow-xl">ECAHO</div>
                <span className="text-lg text-gray-300 font-medium text-center group-hover:text-white transition-colors" dangerouslySetInnerHTML={{ __html: t.ecaho }} />
              </a>

              <a href="https://www.ahosite.org" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-5 group cursor-pointer">
                <div className="w-28 h-28 rounded-full border-2 border-[#bc9b6a] bg-black/50 flex items-center justify-center text-[#bc9b6a] font-bold text-3xl tracking-wider group-hover:bg-[#bc9b6a] group-hover:text-black group-hover:shadow-[0_0_30px_#bc9b6a] transition-all duration-300 shadow-xl">AHO</div>
                <span className="text-lg text-gray-300 font-medium text-center group-hover:text-white transition-colors" dangerouslySetInnerHTML={{ __html: t.aho }} />
              </a>

            </div>
          </div>

          {/* الخاتمة */}
          <div className="text-center bg-black/70 backdrop-blur-xl border border-[#bc9b6a]/30 py-20 px-10 rounded-[2.5rem] mb-12 relative overflow-hidden shadow-2xl shadow-black/80">
            <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-fixed opacity-15 mix-blend-color-dodge pointer-events-none"></div>
            <div className={`absolute top-0 w-96 h-96 bg-[#bc9b6a] rounded-full blur-[150px] opacity-20 pointer-events-none ${lang === 'ar' ? 'right-0' : 'left-0'}`}></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 relative z-10 drop-shadow-xl">{t.footerTitle}</h2>
            <p className="text-2xl md:text-3xl text-gray-100 max-w-4xl mx-auto leading-loose mb-10 relative z-10 font-light">
              {t.footerDesc}
            </p>
            <p className="text-3xl md:text-4xl text-[#bc9b6a] font-extrabold relative z-10 drop-shadow-[0_0_20px_rgba(188,155,106,0.7)]">
              {t.footerHighlight}
            </p>
          </div>

          {/* ---------------- الفوتر ---------------- */}
          <footer className="mt-8 pt-8 pb-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 px-4 relative z-10">
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/q8shows" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bc9b6a] hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://facebook.com/kuwaitshows" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bc9b6a] hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://wa.me/96597944003" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bc9b6a] hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.638-1.653-1.935-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-400 text-sm font-light tracking-widest text-center md:text-right uppercase">
              © 2026 KUWAIT SHOWS. ALL RIGHTS RESERVED.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}