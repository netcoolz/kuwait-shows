"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Dna, Palette, TrendingUp, Users, Info, HeartPulse, Award, Download, ShieldAlert, Baby, Globe, Star 
} from "lucide-react";

// 🔥 مكون ذكي لعداد الأرقام (يبدأ من 0 ويتصاعد للرقم المطلوب)
const AnimatedNumber = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // مدة الحركة (1.5 ثانية)
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // تأثير الانسيابية (Ease Out)
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));
      
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(value);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{count}</>;
};

export default function GeneticsAnalyticsDashboard() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("lang") as "ar" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  // --- دالة الطباعة السلسة للـ PDF ---
  const handlePrint = () => {
    window.print();
  };

  // --- القاموس اللغوي ---
  const t = useMemo(() => ({
    en: {
      badge: "Kuwait Shows Analytics • Final Report",
      title: "Genetic & Health\nMapping",
      desc: "Comprehensive analysis linking age demographics, genetic dominance, and precise health indicators for 135 registered horses.",
      totHorses: "Total Horses",
      totHorsesSub: "100% Database Completion",
      famDiversity: "Strains Diversity",
      famDiversitySub: "13 Main Bloodlines",
      prodBase: "Production Base",
      prodBaseSub: "41.13% have offspring",
      fullSib: "Sibling Groups",
      fullSibSub: "24.82% Genetic Fixation",
      ageTitle: "Age Demographics",
      ageDesc: "The horses are experiencing a period of youth and peak production. The last two years witnessed a massive production boom.",
      healthTitle: "Medical Overview",
      healthNoteTitle: "Statistical Note:",
      healthNoteDesc: "All percentages below are calculated from the total number of horses (135).",
      diseaseTraceTitle: "Genetic Disease Tracing",
      diseaseTraceDesc: "Analysis linking specific health conditions to producing sires and dams.",
      strainsTitle: "Strains Distribution (Arsan)",
      famTitle: "Family Bloodlines",
      ansataTitle: "Ansata Bloodline Dominance:",
      ansataDesc: "Analysis shows strong direct descent from pure Ansata lines.",
      colorTitle: "Colors Distribution",
      sibTableTitle: "Sibling Groups Table",
      sibTableDesc: "Horses grouped by identical Sire and Dam to show genetic fixation.",
      exportBtn: "Export Report (PDF)",
      thSire: "Sire",
      thDam: "Dam",
      thOffspring: "Full Siblings",
      siresTitle: "Sires Production",
      damsTitle: "Dams Production",
      countLabel: "Count:",
      footerIdea: "Idea & Preparation",
      footerDev: "Programming & Development",
      thSireName: "Sire Name",
      thDamName: "Dam Name",
      thCount: "Count"
    },
    ar: {
      badge: "تحليلات مركز الجواد العربي • التقرير النهائي",
      title: "النظام الذكي \nلخيل مركز الجواد العربي",
      desc: "تقرير استراتيجي يربط بين التركيبة العمرية والسيادة الجينية والمؤشرات الصحية لـ 135 جواداً مسجلاً بناءً على القائمة النهائية.",
      totHorses: "إجمالي الخيل",
      totHorsesSub: "100% نسبة الاكتمال",
      famDiversity: "تنوع العوائل",
      famDiversitySub: "13 سلالة وعائلة",
      prodBase: "الافراس المنتجه",
      prodBaseSub: "41.1% الخيل المنتجة",
      fullSib: "مجموعات الأشقاء",
      fullSibSub: "24.8% تثبيت جيني",
      ageTitle: "التركيبة العمرية",
      ageDesc: "الخيل تعيش فترة شباب وذروة إنتاجية. السنتين الأخيرتين شهدتا طفرة هائلة تضمن استمرارية قوية للمنافسة.",
      healthTitle: "الواقع الطبي الدقيق",
      healthNoteTitle: "تنويه إحصائي:",
      healthNoteDesc: "جميع النسب محسوبة من إجمالي الخيل (135 جواداً) لتعكس الواقع الحقيقي.",
      diseaseTraceTitle: "تتبع الامراض",
      diseaseTraceDesc: "تحليل يربط الحالات الصحية الدقيقة بالآباء والأمهات المنتجة.",
      strainsTitle: "توزيع الأرسان",
      famTitle: "توزيع العوائل والسلالات",
      ansataTitle: "السيادة الجينية للعوائل:",
      ansataDesc: "التحليل يُظهر انحداراً مباشراً وقوياً لنسبة كبيرة من القطيع من خطوط أنساتا ولطيفة.",
      colorTitle: "توزيع الألوان السائدة",
      sibTableTitle: "مجموعات الإخوة الأشقاء",
      sibTableDesc: "عرض الخيل في مجموعات حسب (نفس الأب والأم) لمراجعة التثبيت الجيني.",
      exportBtn: "تصدير التقرير (PDF)",
      thSire: "الأب (Sire)",
      thDam: "الأم (Dam)",
      thOffspring: "الأبناء الأشقاء",
      siresTitle: "إنتاج الفحول",
      damsTitle: "إنتاج الأفراس",
      countLabel: "العدد:",
      footerIdea: "الفكرة والإعداد",
      footerDev: "البرمجة والتصميم",
      thSireName: "اسم الفحل",
      thDamName: "اسم الفرس",
      thCount: "العدد"
    }
  }), []);

  // --- الإحصائيات والأرقام ---
  const totalHorses = 135;
  const familiesCount = 13; 
  
  const ageDemographics = [
    { labelAr: "من 0 لـ 4 سنوات", labelEn: "0 - 4 yrs", count: 64, percent: 47.4, color: "bg-green-500" },
    { labelAr: "من 5 لـ 9 سنوات", labelEn: "5 - 9 yrs", count: 32, percent: 23.7, color: "bg-blue-400" },
    { labelAr: "من 10 لـ 15 سنة", labelEn: "10 - 15 yrs", count: 20, percent: 14.8, color: "bg-blue-600" },
    { labelAr: "أكبر من 15 سنة", labelEn: "> 15 yrs", count: 19, percent: 14.1, color: "bg-[#bc9b6a]" },
  ];

  const colors = [
    { nameAr: "أزرق ", nameEn: "Grey", count: 128, percent: 93.62 },
    { nameAr: "أشقر", nameEn: "Chestnut", count: 4, percent: 3.55 },
    { nameAr: "أحمر", nameEn: "Bay", count: 3, percent: 2.84 },
    { nameAr: "أسود", nameEn: "Black", count: 0, percent: 0 },
  ];

  const diseases = [
    { nameAr: "أورام ميلانوما (Melanomas)", nameEn: "Melanomas", count: 19, percent: 14.07, severity: "high" },
    { nameAr: "فقدان التصبغ (Pigmentation loss)", nameEn: "Pigmentation loss", count: 8, percent: 5.93, severity: "medium" },
    { nameAr: "الحمرة (Laminitis)", nameEn: "Laminitis", count: 6, percent: 4.44, severity: "high" },
    { nameAr: "مشاكل خصوبة (Fertility problems)", nameEn: "Fertility problems", count: 3, percent: 2.22, severity: "medium" },
    { nameAr: "انتفاخ الأكياس الهوائية (Guttural pouch)", nameEn: "Guttural pouch tympany", count: 2, percent: 1.48, severity: "low" },
    { nameAr: "صرع (Epilepsy)", nameEn: "Epilepsy", count: 2, percent: 1.48, severity: "high" },
    { nameAr: "ورم المبيض (Ovarian tumor)", nameEn: "Ovarian tumor", count: 2, percent: 1.48, severity: "high" },
  ];

  const geneticTracing = [
    { diseaseAr: "الصرع (Epilepsy)", diseaseEn: "Epilepsy", sourceAr: "ملاحظ في إنتاج: (Ajmal Ashhal) و (Ezz Al Rashediah).", sourceEn: "Observed in offspring of: (Ajmal Ashhal) & (Ezz Al Rashediah).", casesAr: "العدد: 2", casesEn: "2 cases" },
    { diseaseAr: "الحمرة (Laminitis)", diseaseEn: "Laminitis", sourceAr: "متكرر في خطوط: (Naseem Al Rashediah) و (Ansata Osiron).", sourceEn: "Recurring in lines: (Naseem Al Rashediah) & (Ansata Osiron).", casesAr: "العدد: 6", casesEn: "6 cases" },
    { diseaseAr: "أورام المبيض", diseaseEn: "Ovarian tumor", sourceAr: "لوحظت في إنتاج: (Ansata Sheikh Halim).", sourceEn: "Observed in offspring of: (Ansata Sheikh Halim).", casesAr: "العدد: 2", casesEn: "2 cases" },
    { diseaseAr: "الأكياس الهوائية", diseaseEn: "Guttural pouch", sourceAr: "لوحظت في إنتاج: (Ajmal Al Kout) للأمهار الصغيرة.", sourceEn: "Observed in offspring of: (Ajmal Al Kout) for young foals.", casesAr: "العدد: 2", casesEn: "2 cases" },
    { diseaseAr: "الميلانوما", diseaseEn: "Melanomas", sourceAr: "مرتبطة جينياً باللون الرمادي، تتركز في الخيل المؤسسة الأكبر سناً.\n\nالخيل المصابة بالكامل:\n(عنود الكويت، مدينة الكويت، مها الكويت، ماجدة الكويت، مروان الكويت، مي الكويت، ميساء الكويت، أنساتا شيخ حليم، سلسبيل الكويت، شمس الكويت، شريفة الكويت، بنت وفاء الكويت، وفية الكويت، وهج الكويت، لانا الكويت، ليلى الكويت، لمى الكويت، لطفية الكويت، سلمى الكويت).", sourceEn: "Genetically linked to the grey color, concentrated in older foundation horses.\n\nAffected Horses:\n(Anoud Elkuwait, Madinah Elkuwait, Maha Elkuwait, Majdah Elkuwait, Marwan Elkuwait, May Elkuwait, Maysa Elkuwait, Ansata Sheikh Halim, Salsabeel Elkuwait, Shams Elkuwait, Sherifa Elkuwait, Bint Wafaa Elkuwait, Wafeyah Elkuwait, Wahaj Elkuwait, Lana Elkuwait, Layla Elkuwait, Luma Elkuwait, Lutfia Elkuwait, Salma Elkuwait).", casesAr: "العدد: 19", casesEn: "19 cases" },
  ];

  const strainsData = [
    { name: "Dahman Shahwan", count: 55, percent: 40.7, color: "bg-blue-500" },
    { name: "Koheilan Rodan", count: 29, percent: 21.4, color: "bg-purple-500" },
    { name: "Saqlawi Jidran", count: 18, percent: 13.3, color: "bg-green-500" },
    { name: "Obeyan Om Jreis", count: 17, percent: 12.6, color: "bg-[#bc9b6a]" },
    { name: "Hadban Enzahi", count: 16, percent: 11.8, color: "bg-red-500" },
  ];

  const familiesData = [
    { name: "Ansata Meryta", count: 30, percent: 22.2 },
    { name: "Latiefa", count: 25, percent: 18.5 },
    { name: "Ansata White Nile", count: 18, percent: 13.3 },
    { name: "Alimaar Abbeyyah", count: 17, percent: 12.6 },
    { name: "Ansata Sherrara", count: 13, percent: 9.6 },
    { name: "Authentic Nabeelah", count: 8, percent: 5.9 },
    { name: "Ghazala Al Rayyan", count: 6, percent: 4.4 },
    { name: "Bilqis EV", count: 5, percent: 3.7 },
    { name: "Haifaa Al Waab", count: 3, percent: 2.2 },
    { name: "El Thay Maniha", count: 3, percent: 2.2 },
    { name: "NK Lubna", count: 3, percent: 2.2 },
    { name: "Loubna Al Waab", count: 2, percent: 1.5 },
    { name: "Rababa Al Rayyan", count: 2, percent: 1.5 },
  ];

  const siblingGroups = [
    { sire: "Marwan Elkuwait", dam: "Arwa Elkuwait", offspring: ["Anoud Elkuwait", "Arzaag Elkuwait", "Aryam Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Amal Elkuwait", offspring: ["Asmahan Elkuwait", "Azzah Elkuwait", "Amal colt (Unnamed)"] },
    { sire: "Ajmal Al Kout", dam: "Amal Elkuwait", offspring: ["Amthal Elkuwait", "Arwa Elkuwait"] },
    { sire: "Naseem Al Rashediah", dam: "Maramie Elkuwait", offspring: ["Mahinoor Elkuwait", "Moudi Elkuwait"] },
    { sire: "Naseem Al Rashediah", dam: "May Elkuwait", offspring: ["Marayem Elkuwait", "Mozah Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Sherifa Elkuwait", offspring: ["Shammah Elkuwait", "Shafi Elkuwait"] },
    { sire: "Waseem Elkuwait", dam: "Wafeyah Elkuwait", offspring: ["Wajd Elkuwait", "Waly Elkuwait", "Wafeyah colt (Unnamed)"] },
    { sire: "Naseem Al Rashediah", dam: "Wa’ad Elkuwait", offspring: ["Wasmah Elkuwait", "Washmah Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Wanisa Elkuwait", offspring: ["Wa'ad Elkuwait", "Wahaj Elkuwait"] },
    { sire: "Ansata Sheikh Halim", dam: "Bint Wafaa Elkuwait", offspring: ["Watfa Elkuwait", "Warah Elkuwait"] },
    { sire: "Ansata Sheikh Halim", dam: "Authentic Nabeelah", offspring: ["Nawal Elkuwait", "Najat Elkuwait"] },
    { sire: "Ansata Sheikh Halim", dam: "Ghalia Elkuwait", offspring: ["Ghaneema Elkuwait", "Ghaiham Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Bilqis EV", offspring: ["Bibi Elkuwait", "Badriah Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Loubna Al Waab", offspring: ["Qamar Elkuwait", "Qatara Elkuwait"] },
    { sire: "Waseem Elkuwait", dam: "Lutfia Elkuwait", offspring: ["Lora Elkuwait", "Lamasat Elkuwait"] },
    { sire: "Marwan Elkuwait", dam: "Lana Elkuwait", offspring: ["Lahour Elkuwait", "Lana filly (Unnamed)"] },
  ];

  const siresProduction = [
    { name: "Marwan Elkuwait", offspringCount: 22, offspring: "Anoud, Aryam, Arzaag, Asmahan, Azzah, Amal colt, Shafi, Shammah, Wahaj, Wa'ad, Nabila, Nadrah, Qamar, Qatara, Taym, Lahour, Lana filly, Bibi, Badriah, Lusail, Luna, Liblibah" },
    { name: "Naseem Al Rashediah", offspringCount: 11, offspring: "Ayda, Mafatin, Mahinoor, Marayem, Moudi, Mozah, Shadad, Washmah, Wasmah, Wisal, Laaboobah" },
    { name: "Ansata Sheikh Halim", offspringCount: 11, offspring: "Al Angaa, Areej, Manal filly, Watfa, Warah, Najat, Nawal, Nairah, Ghaneema, Ghaiham, Latifa" },
    { name: "Waseem Elkuwait", offspringCount: 10, offspring: "Aisha, Shamekh, Hessah, Waly, Wajd, Wafeyah colt, Lora, Lamasat, Luma, Revan" },
    { name: "Ajmal Ashhal", offspringCount: 10, offspring: "Maramie, Mariyam, Maysa, Soaad, Wahash, Basma, Larien, Lutfia, Losan, Lulu" },
    { name: "Ajmal Al Kout", offspringCount: 6, offspring: "Amthal, Arwa, Salsabeel, Sherifa, Najla, Ghalia" },
    { name: "TM Rihan", offspringCount: 6, offspring: "Muhja, Waleedah, Rajwah, Laddad, Laman, Haneen" },
    { name: "Ezz Al Rashediah", offspringCount: 5, offspring: "Mas, Wataniyah, Wadea, Linda, Larien filly" },
    { name: "Ajmal Talal", offspringCount: 5, offspring: "Mamdooh, Moayed, Sultan, Labah, Louz" },
  ];

  const damsProduction = [
    { name: "May Elkuwait", offspringCount: 6, offspring: "Majdah, Marayem, Mashael, Mohalabiah, Morooj, Mozah" },
    { name: "Amal Elkuwait", offspringCount: 5, offspring: "Amthal, Arwa, Asmahan, Azzah, Amal colt" },
    { name: "Mesk Elkuwait", offspringCount: 5, offspring: "Madinah, Malika, Maramie, Marwan, May" },
    { name: "Wafeyah Elkuwait", offspringCount: 4, offspring: "Wajd, Waly, Wafeyah colt, Wed" },
    { name: "Authentic Nabeelah", offspringCount: 4, offspring: "Nadrah, Najat, Najla, Nawal" },
    { name: "Bint Wafaa Elkuwait", offspringCount: 4, offspring: "Wafeyah, Waleedah, Warah, Watfa" },
    { name: "Arwa Elkuwait", offspringCount: 3, offspring: "Anoud, Aryam, Arzaag" },
    { name: "Abla Elkuwait", offspringCount: 3, offspring: "Aisha, Al Angaa, Amal" },
    { name: "Amthal Elkuwait", offspringCount: 3, offspring: "Alhan, Areej, Amthal colt" },
    { name: "Wa'ad Elkuwait", offspringCount: 3, offspring: "Wadea, Washmah, Wasmah" },
    { name: "Wanisa Elkuwait", offspringCount: 3, offspring: "Wahaj, Wahash, Wa'ad" },
    { name: "Lana Elkuwait", offspringCount: 3, offspring: "Lahour, Latifa, Lana filly" },
    { name: "Lutfia Elkuwait", offspringCount: 3, offspring: "Labah, Lora, Lamasat" },
    { name: "Salma Elkuwait", offspringCount: 3, offspring: "Laddad, Luma, Lutfia" },
    { name: "Bilqis EV", offspringCount: 3, offspring: "Badriah, Basma, Bibi" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050B18] text-white font-sans selection:bg-[#bc9b6a] selection:text-[#050B18] pb-10 overflow-hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none no-print">
        <div className={`absolute top-[-10%] ${lang === 'ar' ? 'right-[-10%]' : 'left-[-10%]'} w-[60vw] h-[60vw] bg-[#bc9b6a] blur-[200px] rounded-full mix-blend-screen`} />
        <div className={`absolute bottom-[-10%] ${lang === 'ar' ? 'left-[-10%]' : 'right-[-10%]'} w-[50vw] h-[50vw] bg-blue-900 blur-[200px] rounded-full mix-blend-screen`} />
      </div>

      {/* LANGUAGE SWITCHER */}
      <button onClick={() => {
        const newLang = lang === "en" ? "ar" : "en";
        localStorage.setItem("lang", newLang);
        setLang(newLang);
        window.dispatchEvent(new Event("languageChange"));
      }} className="fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#bc9b6a] hover:text-[#bc9b6a] transition-all duration-500 no-print">
        <Globe className="text-xl text-[#bc9b6a]" />
        <span className="font-bold text-xs uppercase tracking-widest">{lang === "en" ? "العربية" : "English"}</span>
      </button>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-24 text-start bg-[#050B18]">
        
        {/* Header - Animated */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-10"
        >
          <div>
            <span className="text-[#bc9b6a] text-sm font-black uppercase tracking-[0.3em] block mb-4">{t[lang].badge}</span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 whitespace-pre-line">
              {t[lang].title}
            </h1>
          </div>
          <div className="text-gray-400 max-w-xl font-medium leading-[1.8] text-start md:text-end">
            {t[lang].desc}
          </div>
        </motion.div>

        {/* TOP KPI CARDS - Animated */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { id: 1, icon: BarChart3, title: t[lang].totHorses, val: totalHorses, sub: t[lang].totHorsesSub, color: "text-green-400", bg: "bg-green-400/10" },
            { id: 2, icon: Dna, title: t[lang].famDiversity, val: familiesCount, sub: t[lang].famDiversitySub, color: "text-[#bc9b6a]", bg: "bg-[#bc9b6a]/10" },
            { id: 3, icon: Baby, title: t[lang].prodBase, val: 58, sub: t[lang].prodBaseSub, color: "text-blue-400", bg: "bg-blue-400/10" },
            { id: 4, icon: Users, title: t[lang].fullSib, val: siblingGroups.length, sub: t[lang].fullSibSub, color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((card, i) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-black/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group"
            >
              <div className={`absolute -top-10 text-9xl text-white/[0.03] transition-colors group-hover:text-white/5 ${lang === 'ar' ? '-right-10' : '-left-10'}`}><card.icon /></div>
              <div className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-widest">{card.title}</div>
              <div className="text-6xl font-black text-white">
                 <AnimatedNumber value={card.val as number} />
              </div>
              <div className={`mt-4 text-xs font-bold ${card.color} ${card.bg} px-3 py-1.5 rounded-full inline-block`}>{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* --- الأرسان بقسم مخصص ومستقل --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 mb-10 backdrop-blur-xl"
        >
           <div className="flex items-center gap-4 mb-10">
              <Award className="text-[#bc9b6a] w-8 h-8" />
              <h2 className="text-3xl font-black">{t[lang].strainsTitle}</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {strainsData.map((st, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/30 border border-white/5 p-6 rounded-3xl"
                >
                   <span className="block text-gray-400 text-sm font-bold mb-3 uppercase tracking-widest">{st.name}</span>
                   <div className="flex items-end justify-between mb-4">
                      <span className="text-4xl font-black text-white">
                        <AnimatedNumber value={st.percent} />%
                      </span>
                      <span className="text-lg font-black text-black bg-[#bc9b6a] px-3 py-1 rounded-lg">
                        <AnimatedNumber value={st.count} />
                      </span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{width: 0}} 
                        whileInView={{width: `${st.percent}%`}} 
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${st.color}`} 
                        style={{ width: `${st.percent}%` }}
                      />
                   </div>
                </motion.div>
              ))}
           </div>
        </motion.div>

        {/* TWO-COLUMN LAYOUT: DEMOGRAPHICS & HEALTH */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
          
          {/* AGE DEMOGRAPHICS */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-[#0A1A3A]/60 to-black/40 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp className="text-blue-400 w-8 h-8" />
              <h2 className="text-3xl font-black">{t[lang].ageTitle}</h2>
            </div>
            <p className="text-gray-300 font-medium leading-[1.8] mb-8">{t[lang].ageDesc}</p>
            
            <div className="space-y-6">
              {ageDemographics.map((age, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h4 className="font-bold text-xl text-white">{lang === "ar" ? age.labelAr : age.labelEn}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black text-white">
                        <AnimatedNumber value={age.percent} />%
                      </span>
                      <span className="text-lg font-black text-black bg-white px-3 py-1 rounded-lg">
                        <AnimatedNumber value={age.count} />
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: `${age.percent}%` }} 
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${age.color} rounded-full`}
                      style={{ width: `${age.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HEALTH OVERVIEW */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-red-950/40 to-black/40 border border-red-900/30 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-transparent to-transparent opacity-50" />
            
            <div className="flex items-center gap-4 mb-8">
              <HeartPulse className="text-red-400 w-8 h-8" />
              <h2 className="text-3xl font-black">{t[lang].healthTitle}</h2>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-8 flex gap-4 items-start">
              <Info className="text-red-400 w-6 h-6 shrink-0 mt-1" />
              <p className="text-red-100 text-sm font-medium leading-[1.8]">
                <strong className="text-white">{t[lang].healthNoteTitle}</strong> {t[lang].healthNoteDesc}
              </p>
            </div>

            <div className="space-y-5">
              {diseases.map((disease, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 h-14 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between px-4 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: `${(disease.count / 25) * 100}%` }} 
                      viewport={{ once: true }}
                      transition={{ duration: 1.5 }}
                      className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 h-full opacity-20 ${disease.severity === 'high' ? 'bg-red-500' : disease.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}
                      style={{ width: `${(disease.count / 25) * 100}%` }}
                    />
                    <span className="font-bold relative z-10 text-base">{lang === "ar" ? disease.nameAr : disease.nameEn}</span>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-red-400 font-black text-xl">{disease.percent}%</span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-lg font-black text-lg">{disease.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- DEEP GENETIC DISEASE TRACING --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-black/60 border border-red-900/50 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl mb-10 relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="text-red-500 w-10 h-10" />
                  <div>
                      <h2 className="text-3xl font-black text-white">{t[lang].diseaseTraceTitle}</h2>
                      <p className="text-gray-400 font-medium mt-1">{t[lang].diseaseTraceDesc}</p>
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {geneticTracing.map((trace, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-red-950/20 border border-red-900/30 p-6 rounded-2xl"
                    >
                        <div className="flex justify-between items-start mb-3">
                           <h3 className="text-xl font-bold text-red-400">{lang === "ar" ? trace.diseaseAr : trace.diseaseEn}</h3>
                           <span className="text-sm font-black text-white bg-red-600 px-3 py-1 rounded-lg">{lang === "ar" ? trace.casesAr : trace.casesEn}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-[2] font-medium whitespace-pre-line">{lang === "ar" ? trace.sourceAr : trace.sourceEn}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>

        {/* THIRD ROW: FAMILIES & COLORS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          
          {/* Families Grid (العوائل) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl relative"
          >
            <div className="flex items-center gap-4 mb-10">
              <Dna className="text-[#bc9b6a] w-8 h-8" />
              <h2 className="text-3xl font-black">{t[lang].famTitle}</h2>
            </div>

            <div className="bg-[#bc9b6a]/10 border border-[#bc9b6a]/20 p-5 rounded-2xl mb-8 flex gap-4 items-center">
              <Award className="text-[#bc9b6a] w-8 h-8 shrink-0" />
              <p className="text-gray-300 text-sm font-medium leading-[1.8]">
                 <strong className="text-white">{t[lang].ansataTitle}</strong> {t[lang].ansataDesc}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {familiesData.map((fam, i) => (
                <div key={i} className="border-b border-white/10 pb-3 flex justify-between items-center p-2 rounded-lg">
                  <div>
                    <span className="font-bold text-lg text-white block mb-1">{fam.name}</span>
                    <span className="text-sm font-black text-black bg-white/80 px-2 py-0.5 rounded inline-block">{t[lang].countLabel} <AnimatedNumber value={fam.count} /></span>
                  </div>
                  <span className="text-2xl font-black text-[#bc9b6a]"><AnimatedNumber value={fam.percent} />%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Color Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-8">
              <Palette className="text-[#bc9b6a] w-8 h-8" />
              <h2 className="text-3xl font-black">{t[lang].colorTitle}</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8">
              {colors.map((color, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="font-bold text-lg text-white">{lang === "ar" ? color.nameAr : color.nameEn}</span>
                    <div className="flex items-center gap-3">
                       <span className="font-black text-2xl text-white"><AnimatedNumber value={color.percent} />%</span>
                       <span className="font-black text-lg bg-[#bc9b6a] text-black px-3 py-1 rounded-lg"><AnimatedNumber value={color.count} /></span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: `${color.percent}%` }} 
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full rounded-full bg-[#bc9b6a]`}
                      style={{ width: `${color.percent}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- SIBLING GROUPS (جروبات الأشقاء) --- */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Users className="text-[#bc9b6a] w-8 h-8" />
                <h2 className="text-3xl font-black">{t[lang].sibTableTitle}</h2>
              </div>
              <p className="text-gray-400 font-medium">
                {t[lang].sibTableDesc}
              </p>
            </div>
            
            <button onClick={handlePrint} className="no-print bg-[#bc9b6a]/10 hover:bg-[#bc9b6a] text-[#bc9b6a] hover:text-[#050B18] border border-[#bc9b6a]/50 px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2">
              <Download className="w-5 h-5" />
              {t[lang].exportBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siblingGroups.map((group, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-[#050B18]/80 border border-[#bc9b6a]/30 rounded-[2.5rem] p-8 relative overflow-hidden group"
              >
                <div className="mb-6 space-y-4 relative z-10">
                  <div className="bg-[#bc9b6a]/10 w-fit px-3 py-1 rounded-lg text-[10px] font-black text-[#bc9b6a] uppercase">
                    Group {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t[lang].thSire}</span>
                    <h3 className="text-xl font-black text-blue-300">{group.sire}</h3>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t[lang].thDam}</span>
                    <h3 className="text-xl font-black text-pink-300">{group.dam}</h3>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 relative z-10">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">{t[lang].thOffspring}</span>
                  <div className="flex flex-wrap gap-2">
                    {group.offspring.map((horse, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-bold text-white">
                        {horse}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`absolute -bottom-10 ${lang === 'ar' ? '-left-10' : '-right-10'} w-32 h-32 bg-[#bc9b6a]/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#bc9b6a]/20 transition-all`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- DAMS & SIRES PRODUCTION TABLES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          
          {/* SIRES PRODUCTION TABLE */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#050B18]/80 border border-blue-900/30 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none no-print`} />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <Award className="text-blue-400 w-8 h-8" />
              <h2 className="text-2xl font-black">{t[lang].siresTitle}</h2>
            </div>
            
            <div className="overflow-x-auto relative z-10 pr-2">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="border-b-2 border-blue-900/50 text-blue-300">
                    <th className="py-3 px-3 font-black">{t[lang].thSireName}</th>
                    <th className="py-3 px-3 font-black text-center w-20">{t[lang].thCount}</th>
                    <th className="py-3 px-3 font-black">{t[lang].thOffspring}</th>
                  </tr>
                </thead>
                <tbody>
                  {siresProduction.map((sire, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-4 px-3 font-bold text-white whitespace-nowrap">{sire.name}</td>
                      <td className="py-4 px-3 text-center">
                        <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-lg font-black">{sire.offspringCount}</span>
                      </td>
                      <td className="py-4 px-3 text-gray-400 text-sm leading-relaxed">{sire.offspring}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* DAMS PRODUCTION TABLE */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#050B18]/80 border border-pink-900/30 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full pointer-events-none no-print`} />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <Baby className="text-pink-400 w-8 h-8" />
              <h2 className="text-2xl font-black">{t[lang].damsTitle}</h2>
            </div>
            
            <div className="overflow-x-auto relative z-10 pr-2">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="border-b-2 border-pink-900/50 text-pink-300">
                    <th className="py-3 px-3 font-black">{t[lang].thDamName}</th>
                    <th className="py-3 px-3 font-black text-center w-20">{t[lang].thCount}</th>
                    <th className="py-3 px-3 font-black">{t[lang].thOffspring}</th>
                  </tr>
                </thead>
                <tbody>
                  {damsProduction.map((dam, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-4 px-3 font-bold text-white whitespace-nowrap">{dam.name}</td>
                      <td className="py-4 px-3 text-center">
                        <span className="bg-pink-900/50 text-pink-200 px-3 py-1 rounded-lg font-black">{dam.offspringCount}</span>
                      </td>
                      <td className="py-4 px-3 text-gray-400 text-sm leading-relaxed">{dam.offspring}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>

        {/* 🔥 الفوتر المحدث والاحترافي جداً */}
        <footer className="mt-20 pt-10 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 bg-[#050B18]">
           
           <div className="flex items-center gap-4 bg-white/5 px-8 py-5 rounded-2xl border border-white/5 shadow-lg w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 rounded-full bg-[#bc9b6a]/20 flex items-center justify-center">
                 <Star className="text-[#bc9b6a] w-7 h-7" />
              </div>
              <div>
                 <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t[lang].footerIdea}</span>
                 <span className="block text-2xl font-black text-white">ناصر الغيث</span>
              </div>
           </div>

           <div className="flex items-center gap-4 bg-white/5 px-8 py-5 rounded-2xl border border-white/5 shadow-lg w-full md:w-auto justify-center md:justify-end">
              <div className="text-center md:text-end">
                 <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t[lang].footerDev}</span>
                 <span className="block text-2xl font-black text-white">أحمد الصالح</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <Globe className="text-blue-400 w-7 h-7" />
              </div>
           </div>

        </footer>

      </div>

      {/* 🔥 أكواد الـ CSS الذكية لحماية الطباعة وتثبيت الحركات */}
      <style jsx global>{`
        @media print {
          html, body {
            background-color: #050B18 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            /* إلغاء الحركات في الطباعة لتجنب اختفاء العناصر */
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(188, 155, 106, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(188, 155, 106, 0.6);
        }
      `}</style>
    </div>
  );
}