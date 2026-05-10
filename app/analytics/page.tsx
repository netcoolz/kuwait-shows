"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Dna, Palette, TrendingUp, Users, HeartPulse, Award,
  ShieldAlert, Baby, Globe, Star, Search, X, ChevronUp,
  SortAsc, SortDesc, Eye, EyeOff, ChevronDown, Layers, AlertCircle, Activity, Zap, ArrowUpDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Color  = "grey"|"chestnut"|"bay"|"black";
type Sex    = "stallion"|"mare"|"colt"|"filly";
type Strain = "Dahman Shahwan"|"Koheilan Rodan"|"Saqlawi Jidran"|"Obeyan Om Jreis"|"Hadban Enzahi";
type Family = "Ansata Meryta"|"Latiefa"|"Ansata White Nile"|"Alimaar Abbeyyah"|"Ansata Sherrara"|"Authentic Nabeelah"|"Ghazala Al Rayyan"|"Bilqis EV"|"Haifaa Al Waab"|"El Thay Maniha"|"NK Lubna"|"Loubna Al Waab"|"Rababa Al Rayyan";
type Health = "melanoma"|"laminitis"|"epilepsy"|"pigmentation_loss"|"fertility"|"guttural_pouch"|"ovarian_tumor";
interface Horse{id:string;name:string;nameAr:string;age:number;color:Color;sex:Sex;sire:string;dam:string;strain:Strain;family:Family;health:Health[];}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T={
  en:{
    badge:"Arabian Horse Center • Strategic Intelligence Report",
    title:"AHC Horses\nStatics",
    desc:"Strategic analysis linking age demographics, genetic lineage, and precise health indicators for all registered horses.",
    totHorses:"Total Horses",totSub:"100% Complete",strains:"Bloodline Strains",strainSub:"Distinct Arsan",
    prod:"Productive Mares",prodSub:"of total herd",sib:"Sibling Groups",sibSub:"Genetic Fixation",
    secStrains:"Strains Distribution",secFam:"Families & Colors",secAge:"Age Demographics",
    secHealth:"Medical Overview",secDisease:"Genetic Disease Tracing",
    secSib:"Sibling Groups",secProd:"Production Rankings",
    healthNote:"All percentages are calculated from the total herd.",
    ansata:"Ansata Bloodline Dominance:",ansataDesc:"Strong descent from Ansata & Latiefa lines.",
    colorTitle:"Coat Colors",
    search:"Search…",noResults:"No results.",sortBy:"Sort",showing:"Showing",of:"of",groups:"groups",
    navOverview:"Overview",navGenetics:"Genetics",navHealth:"Health & Age",
    navDisease:"Diseases",navSiblings:"Siblings",navProd:"Production",
    diseaseDesc:"Linking health conditions to producing sires and dams.",
    sibDesc:"Grouped by Sire × Dam for genetic fixation analysis.",
    siresTitle:"Sires Production Ranking",damsTitle:"Dams Production Ranking",
    collapse:"Collapse",expand:"Details",offspring:"offspring",
    footerIdea:"Concept & Data",footerDev:"Design & Engineering",
    colGrey:"Grey",colChestnut:"Chestnut",colBay:"Bay",colBlack:"Black",
    hMelanoma:"Melanomas",hLaminitis:"Laminitis",hEpilepsy:"Epilepsy",
    hPig:"Pigment Loss",hFertility:"Fertility Issues",hGuttural:"Guttural Pouch",hOvarian:"Ovarian Tumor",
    critical:"Critical",high:"High",medium:"Medium",
    ageGroup:["1 Year","2 Years","3 Years","4–6 Years","7–10 Years","11–13 Years","14–17 Years","18+ Years"],
    causalTitle:"Causal Analysis:",thSire:"Sire",thDam:"Dam",thOffspring:"Offspring",
  },
  ar:{
    badge:"مركز الجواد العربي • تقرير خيل ٢٠٢٦",
    title:"العمري\nوالصحي",
    desc:"تحليل استراتيجي يربط بين التركيبة العمرية والجينية والمؤشرات الصحية لجميع الخيل المسجلة.",
    totHorses:"إجمالي الخيل",totSub:"100% مكتملة",strains:"أرسان الدم",strainSub:"رسن متميز",
    prod:"أفراس منتجة",prodSub:"من القطيع",sib:"مجموعات أشقاء",sibSub:"تثبيت جيني",
    secStrains:"توزيع الأرسان",secFam:"العوائل والألوان",secAge:"التركيبة العمرية",
    secHealth:"الواقع الطبي",secDisease:"تتبع الأمراض الجينية",
    secSib:"مجموعات الأشقاء",secProd:"ترتيب الإنتاج",
    healthNote:"جميع النسب محسوبة من إجمالي الخيل.",
    ansata:"السيادة الجينية للعوائل:",ansataDesc:"يظهر انحدار قوي من خطوط أنساتا ولطيفة.",
    colorTitle:"توزيع الألوان",
    search:"ابحث…",noResults:"لا توجد نتائج.",sortBy:"ترتيب",showing:"يعرض",of:"من",groups:"مجموعات",
    navOverview:"نظرة عامة",navGenetics:"الجينات",navHealth:"الصحة والأعمار",
    navDisease:"الأمراض",navSiblings:"الأشقاء",navProd:"الإنتاج",
    diseaseDesc:"ربط الحالات الصحية بالفحول والأفراس المنتجة.",
    sibDesc:"مجمّعة حسب نفس الأب والأم لمراجعة التثبيت الجيني.",
    siresTitle:"ترتيب إنتاج الفحول",damsTitle:"ترتيب إنتاج الأفراس",
    collapse:"طيّ",expand:"التفاصيل",offspring:"مُنتَج",
    footerIdea:"الفكرة والبيانات",footerDev:"التصميم والبرمجة",
    colGrey:"أزرق (رمادي)",colChestnut:"أشقر",colBay:"أحمر",colBlack:"أسود",
    hMelanoma:"ميلانوما",hLaminitis:"حمرة الحافر",hEpilepsy:"صرع",
    hPig:"فقدان التصبغ",hFertility:"مشاكل خصوبة",hGuttural:"الأكياس الهوائية",hOvarian:"ورم المبيض",
    critical:"حرج",high:"مرتفع",medium:"متوسط",
    ageGroup:["سنة واحدة","سنتان","3 سنوات","4–6 سنوات","7–10 سنوات","11–13 سنة","14–17 سنة","18+ سنة"],
    causalTitle:"التحليل السببي:",thSire:"الأب",thDam:"الأم",thOffspring:"الأبناء",
  },
} as const;

const STRAINS:Strain[]  = ["Dahman Shahwan","Koheilan Rodan","Saqlawi Jidran","Obeyan Om Jreis","Hadban Enzahi"];
const FAMILIES:Family[] = ["Ansata Meryta","Latiefa","Ansata White Nile","Alimaar Abbeyyah","Ansata Sherrara","Authentic Nabeelah","Ghazala Al Rayyan","Bilqis EV","Haifaa Al Waab","El Thay Maniha","NK Lubna","Loubna Al Waab","Rababa Al Rayyan"];
const C_MAP:Record<Color,string>={grey:"#94a3b8",chestnut:"#b45309",bay:"#7f1d1d",black:"#374151"};
const S_CLR:Record<Strain,string>={"Dahman Shahwan":"#4f8ef7","Koheilan Rodan":"#a78bfa","Saqlawi Jidran":"#34d399","Obeyan Om Jreis":"#c9a96e","Hadban Enzahi":"#fb7185"};
const HKEYS:Health[]=["melanoma","laminitis","epilepsy","pigmentation_loss","fertility","guttural_pouch","ovarian_tumor"];
const AGE_BUCKETS=[
  {min:0,max:1.9,hex:"#10b981"},{min:2,max:2.9,hex:"#14b8a6"},{min:3,max:3.9,hex:"#06b6d4"},
  {min:4,max:6.9,hex:"#4f8ef7"},{min:7,max:10.9,hex:"#818cf8"},{min:11,max:13.9,hex:"#a78bfa"},
  {min:14,max:17.9,hex:"#c9a96e"},{min:18,max:999,hex:"#fb7185"},
];
const GOLD="#C9A96E",BG="#06071A";

// ─── DATA UTILITIES (SMART PARSING) ───────────────────────────────────────────

function calculateAge(dateValue: any) {
  if (!dateValue) return 1;

  const today = new Date();
  let birthYear = today.getFullYear();
  let birthMonth = 0;
  let birthDay = 1;

  try {
    if (typeof dateValue === 'number' || (typeof dateValue === 'string' && !isNaN(Number(dateValue)) && Number(dateValue) > 10000)) {
      const date = new Date(Math.round((Number(dateValue) - 25569) * 86400 * 1000));
      birthYear = date.getFullYear();
      birthMonth = date.getMonth();
      birthDay = date.getDate();
    } else if (typeof dateValue === 'string') {
      if (dateValue.includes('/') || dateValue.includes('-')) {
        const parts = dateValue.split(/[\/\-]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            birthYear = Number(parts[0]);
            birthMonth = Number(parts[1]) - 1;
            birthDay = Number(parts[2]);
          } else if (parts[2].length === 4) {
            birthYear = Number(parts[2]);
            birthMonth = Number(parts[1]) - 1;
            birthDay = Number(parts[0]);
            if (birthMonth > 11) {
              birthMonth = Number(parts[0]) - 1;
              birthDay = Number(parts[1]);
            }
          }
        } else {
          const d = new Date(dateValue);
          birthYear = d.getFullYear(); birthMonth = d.getMonth(); birthDay = d.getDate();
        }
      } else if (dateValue.length === 4 && !isNaN(Number(dateValue))) {
        birthYear = Number(dateValue);
      } else {
        const d = new Date(dateValue);
        birthYear = d.getFullYear(); birthMonth = d.getMonth(); birthDay = d.getDate();
      }
    } else if (dateValue instanceof Date) {
      birthYear = dateValue.getFullYear();
      birthMonth = dateValue.getMonth();
      birthDay = dateValue.getDate();
    }
  } catch (e) {
    return 1;
  }

  if (isNaN(birthYear)) return 1;

  let age = today.getFullYear() - birthYear;
  const monthDiff = today.getMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age--;
  }
  
  return Math.max(1, age);
}

// 🛑 تم إصلاح مشكلة قراءة Female كـ Male 🛑
function getHorseSex(gender: string, birthDate: any): Sex {
  const age = calculateAge(birthDate);
  if (!gender) return age <= 3 ? "filly" : "mare";
  
  const g = String(gender).toLowerCase().trim();
  
  // نفحص بدقة هل هو ذكر صريح وليس مجرد أنه يحتوي كلمة male داخل female
  if (g === "male" || g === "m" || g.includes("stallion") || g.includes("colt")) {
    return age <= 3 ? "colt" : "stallion";
  }
  
  return age <= 3 ? "filly" : "mare";
}

function normalizeColor(color:string):Color{
  const value = (color || "grey").toLowerCase();
  if(value.includes("black")) return "black";
  if(value.includes("bay")) return "bay";
  if(value.includes("chestnut")) return "chestnut";
  return "grey";
}

function normalizeStrain(strain:string):Strain{
  if(!strain) return "Dahman Shahwan";
  const s = strain.toLowerCase().trim();
  const exact = STRAINS.find(x => x.toLowerCase() === s);
  if(exact) return exact;
  if(s.includes("dahman")) return "Dahman Shahwan";
  if(s.includes("koheil") || s.includes("kuhail")) return "Koheilan Rodan";
  if(s.includes("saqlaw") || s.includes("saklaw")) return "Saqlawi Jidran";
  if(s.includes("obey") || s.includes("ubay")) return "Obeyan Om Jreis";
  if(s.includes("hadban")) return "Hadban Enzahi";
  return "Dahman Shahwan";
}

function normalizeFamily(family:string):Family{
  const found = FAMILIES.find(f => f.toLowerCase() === (family || "").toLowerCase().trim());
  return found || "Ansata Meryta";
}

function mapHealthConditions(health: any, otherHealth?: any): Health[] {
  const result: Health[] = [];
  let value = "";
  if (Array.isArray(health)) {
      value = health.join(" ").toLowerCase();
  } else {
      value = `${health || ""} ${otherHealth || ""}`.toLowerCase();
  }

  if(value.includes("melanoma")) result.push("melanoma");
  if(value.includes("laminit")) result.push("laminitis");
  if(value.includes("epileps")) result.push("epilepsy");
  if(value.includes("pigment")) result.push("pigmentation_loss");
  if(value.includes("fertil")) result.push("fertility");
  if(value.includes("guttural")) result.push("guttural_pouch");
  if(value.includes("ovarian") || value.includes("tumor")) result.push("ovarian_tumor");
  
  return result;
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
const mk=(text:string,q:string)=>{
  if(!q) return <>{text}</>;
  const re=new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "gi");
  return <>{text.split(re).map((p,i)=>re.test(p)?<mark key={i} className="rounded-sm" style={{background:"rgba(201,169,110,0.45)",color:"white"}}>{p}</mark>:p)}</>;
};
const Num=({v,d=0}:{v:number;d?:number})=>{
  const [val,setVal]=useState("0");
  useEffect(()=>{
    let t0=0;const id=requestAnimationFrame(function f(ts){
      if(!t0)t0=ts;const p=Math.min((ts-t0)/1600,1),e=1-Math.pow(1-p,4);
      setVal(d?(e*v).toFixed(d):String(Math.floor(e*v)));
      if(p<1)requestAnimationFrame(f);else setVal(d?v.toFixed(d):String(v));
    });return()=>cancelAnimationFrame(id);
  },[v,d]);return<>{val}</>;
};
const Bar=({pct,hex="#C9A96E",delay=0,h="h-2"}:{pct:number;hex?:string;delay?:number;h?:string})=>(
  <div className={`w-full ${h} rounded-full overflow-hidden`} style={{background:"rgba(255,255,255,0.05)"}}>
    <motion.div className="h-full rounded-full" style={{background:hex}}
      initial={{width:0}} whileInView={{width:`${Math.min(pct,100)}%`}} viewport={{once:true}} transition={{duration:1.2,ease:"easeOut",delay}}/>
  </div>
);
const Ring=({pct,hex,size=56,sw=4}:{pct:number;hex:string;size?:number;sw?:number})=>{
  const r=(size-sw*2)/2,c=2*Math.PI*r;
  return(<svg width={size} height={size} className="-rotate-90">
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
    <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={hex} strokeWidth={sw} strokeLinecap="round"
      strokeDasharray={c} initial={{strokeDashoffset:c}} whileInView={{strokeDashoffset:c-(pct/100)*c}}
      viewport={{once:true}} transition={{duration:1.5,ease:"easeOut"}}/>
  </svg>);
};
const Donut=({items,size=190,thick=34}:{items:{name:string;pct:number;hex:string}[];size?:number;thick?:number})=>{
  const r=(size-thick)/2,c=2*Math.PI*r;
  const [hov,setHov]=useState<number|null>(null);
  let acc=0;const valid=items.filter(i=>i.pct>0);
  return(<div className="relative flex items-center justify-center" style={{width:size,height:size}}>
    <svg width={size} height={size} className="-rotate-90">
      {valid.map((item,i)=>{
        const dash=(item.pct/100)*c,offset=c-acc*c/100;acc+=item.pct;
        return<motion.circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={item.hex}
          strokeWidth={hov===i?thick+8:thick} strokeDasharray={`${dash} ${c}`} strokeDashoffset={offset}
          style={{transition:"stroke-width .2s,opacity .2s",opacity:hov!==null&&hov!==i?.25:1,cursor:"pointer"}}
          onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
          initial={{strokeDashoffset:c}} whileInView={{strokeDashoffset:offset}} viewport={{once:true}}
          transition={{duration:1.3,delay:i*.12,ease:"easeOut"}}/>;
      })}
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
      {hov!==null?<>
        <span className="text-xl font-black text-white">{valid[hov]?.pct.toFixed(1)}%</span>
        <span className="text-[10px] font-bold mt-0.5 max-w-[70px] leading-tight" style={{color:"rgba(255,255,255,0.5)"}}>{valid[hov]?.name}</span>
      </>:<span className="text-[10px] font-bold" style={{color:"rgba(255,255,255,0.2)"}}>hover</span>}
    </div>
  </div>);
};
const Cd=({children,className="",accent}:{children:React.ReactNode;className?:string;accent?:string})=>(
  <div className={`relative rounded-[1.75rem] overflow-hidden ${className}`}
    style={{background:"linear-gradient(155deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)",border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(20px)"}}>
    {accent&&<div className="absolute top-0 left-0 right-0 h-px" style={{background:`linear-gradient(90deg,transparent,${accent}55,transparent)`}}/>}
    {children}
  </div>
);
const SecNum=({n,hex}:{n:string;hex:string})=>(
  <span className="text-[100px] font-black absolute -top-4 leading-none select-none pointer-events-none" style={{color:hex,opacity:.04}}>{n}</span>
);
const SecHead=({n,icon:Icon,hex,title,sub}:{n:string;icon:React.ElementType;hex:string;title:string;sub?:string})=>(
  <div className="relative mb-7">
    <SecNum n={n} hex={hex}/>
    <div className="relative z-10 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{background:`${hex}14`,border:`1px solid ${hex}22`}}>
        <Icon className="w-5 h-5" style={{color:hex}}/>
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black" style={{background:`linear-gradient(90deg,#fff,${hex})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{title}</h2>
        {sub&&<p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.3)"}}>{sub}</p>}
      </div>
    </div>
  </div>
);

function SrchBox({value,onChange,placeholder,isAr}:{value:string;onChange:(v:string)=>void;placeholder:string;isAr:boolean}){
  return(<div className="relative">
    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isAr?"right-3.5":"left-3.5"}`} style={{color:"rgba(255,255,255,0.25)"}}/>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className={`w-full text-sm text-white placeholder-gray-600 focus:outline-none py-2.5 rounded-xl transition-colors ${isAr?"pr-10 pl-9":"pl-10 pr-9"}`}
      style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)"}} onFocus={e=>(e.target.style.borderColor=`${GOLD}45`)} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.09)")}/>
    {value&&<button onClick={()=>onChange("")} className={`absolute top-1/2 -translate-y-1/2 ${isAr?"left-3":"right-3"}`} style={{color:"rgba(255,255,255,0.3)"}}><X className="w-3.5 h-3.5"/></button>}
  </div>);
}

// ─── DISEASE TRACING DATA ─────────────────────────────────────────────────────
const DISEASE_TRACE=[
  {key:"epilepsy" as Health, srcAr:"ملاحظ في إنتاج: (Ajmal Ashhal) و (Ezz Al Rashediah).", srcEn:"Observed in offspring of: (Ajmal Ashhal) & (Ezz Al Rashediah).",sev:"critical"},
  {key:"laminitis" as Health, srcAr:"متكرر في خطوط: (Naseem Al Rashediah) و (Ansata Osiron).", srcEn:"Recurring in lines: (Naseem Al Rashediah) & (Ansata Osiron).",sev:"critical"},
  {key:"ovarian_tumor" as Health, srcAr:"لوحظت في إنتاج: (Ansata Sheikh Halim).", srcEn:"Observed in offspring of: (Ansata Sheikh Halim).",sev:"critical"},
  {key:"guttural_pouch" as Health, srcAr:"لوحظت في إنتاج: (Ajmal Al Kout) للأمهار الصغيرة.", srcEn:"Observed in offspring of: (Ajmal Al Kout) for young foals.",sev:"high"},
  {key:"melanoma" as Health, srcAr:"مرتبطة جينياً باللون الرمادي، تتركز في الخيل المؤسسة الأكبر سناً.", srcEn:"Genetically linked to grey coat color, concentrated in older foundation horses.",sev:"critical",
    analysisAr:"بمقاطعة بيانات الأنساب مع التركيبة العمرية، تتركز الحالات في الخيل المؤسسة والمنحدرين منها. السبب الطبي هو الارتباط الجيني الحتمي باللون الأزرق (طفرة جين STX17). مع تقدم عمر هذه الخيل وهيمنة اللون الأزرق، فإن الميلانوما تطور فسيولوجي طبيعي وغالباً حميد.", analysisEn:"Cross-referencing pedigree with age and color distribution reveals cases concentrated in foundation horses. The cause is inevitable genetic linkage to the Grey coat (STX17 mutation). With aging foundation stock and 93%+ grey prevalence, melanomas represent a natural, typically benign physiological progression."},
  {key:"pigmentation_loss" as Health, srcAr:"مرتبط بالعمر المتقدم ومتكرر مع الميلانوما.", srcEn:"Age-related, often co-occurring with melanomas.",sev:"high"},
  {key:"fertility" as Health, srcAr:"لوحظت في بعض الأفراس لدى سن متأخر.", srcEn:"Observed in some mares at advanced age.",sev:"medium"},
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GeneticsAnalyticsDashboard(){
  const router = useRouter();
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [farm, setFarm] = useState<any>(null);

  const [lang, setLang] = useState<"ar"|"en">("ar");
  const [mounted, setMounted] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [openDis, setOpenDis] = useState<Set<number>>(new Set([4]));
  const [sibQ, setSibQ] = useState("");
  const [openProd, setOpenProd] = useState<Set<string>>(new Set());
  
  const { scrollY } = useScroll();
  const prog = useTransform(scrollY, [0, 6000], ["0%", "100%"]);

  // ─── SUPABASE LOAD ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("farm");
    if (!saved) { router.push("/farmlogin"); return; }
    const parsed = JSON.parse(saved);
    setFarm(parsed);
    loadFarmHorses(parsed.id);
  }, []);

  async function loadFarmHorses(farmId: string) {
    setLoading(true);
    const { data, error } = await supabase.from("horses").select("*").eq("farm_id", farmId).order("created_at", { ascending: false });
    
    if (error) { console.error(error); setLoading(false); return; }
    
    if (!data) { setHorses([]); setLoading(false); return; }

    const formatted: Horse[] = data.map((h: any, index: number) => {
      const rawBirthDate = h.birth_date || h.birthDate || h.BirthDate || h.dob || null;
      const rawNameAr = h.name_ar || h.nameAr || h.NameArabic;
      
      return {
        id: h.id || `horse-${index}`,
        name: h.name || "",
        nameAr: rawNameAr || "",
        age: calculateAge(rawBirthDate),
        color: normalizeColor(h.color),
        sex: getHorseSex(h.gender || h.sex, rawBirthDate),
        sire: h.sire || h.Sire || "",
        dam: h.dam || h.Dam || "",
        strain: normalizeStrain(h.strain || h.Strain),
        family: normalizeFamily(h.family || h.Family),
        health: mapHealthConditions(h.health, h.otherHealth || h.other_health)
      };
    });
    
    setHorses(formatted);
    setLoading(false);
  }

  useEffect(() => {
    setMounted(true);
    const s = localStorage.getItem("lang") as "ar"|"en"|null;
    if (s === "ar" || s === "en") setLang(s);
  }, []);

  useEffect(() => {
    const fn = () => {
      setShowTop(window.scrollY > 500);
      const ids = ["overview", "genetics", "health-age", "diseases", "siblings", "production"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) { setActiveNav(id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleLang = useCallback(() => setLang(p => { const n = p === "en" ? "ar" : "en"; localStorage.setItem("lang", n); return n; }), []);
  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 160; 
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);
  const goTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  // ─── COMPUTED SMART STATS ─────────────────────────────────────────────────────
  const S = useMemo(() => {
    const tot = horses.length;
    const ages = AGE_BUCKETS.map(b => horses.filter(h => h.age >= b.min && h.age <= b.max).length);
    
    const col: Record<Color, number> = { grey: 0, chestnut: 0, bay: 0, black: 0 };
    horses.forEach(h => col[h.color]++);
    
    const str: Record<Strain, number> = { "Dahman Shahwan": 0, "Koheilan Rodan": 0, "Saqlawi Jidran": 0, "Obeyan Om Jreis": 0, "Hadban Enzahi": 0 };
    horses.forEach(h => { if(str[h.strain] !== undefined) str[h.strain]++; });
    
    const fam: Record<Family, number> = {} as any;
    FAMILIES.forEach(f => fam[f] = 0);
    horses.forEach(h => { if(fam[h.family] !== undefined) fam[h.family]++; });
    
    const dis: Record<Health, number> = { melanoma:0, laminitis:0, epilepsy:0, pigmentation_loss:0, fertility:0, guttural_pouch:0, ovarian_tumor:0 };
    horses.forEach(h => h.health.forEach(k => { if(dis[k] !== undefined) dis[k]++; }));
    
    const sibMap: Record<string, Horse[]> = {};
    horses.forEach(h => { 
      if (!h.sire || !h.dam) return; 
      const k = `${h.sire.trim()}|||${h.dam.trim()}`; 
      if (!sibMap[k]) sibMap[k] = []; 
      sibMap[k].push(h); 
    });
    const sibs = Object.entries(sibMap).filter(([, v]) => v.length >= 2).map(([k, v]) => ({ sire: k.split("|||")[0], dam: k.split("|||")[1], kids: v }));
    
    const sireMap: Record<string, Horse[]> = {};
    const damMap: Record<string, Horse[]> = {};
    horses.forEach(h => {
      if (h.sire && h.sire.trim() !== h.name.trim()) {
        if (!sireMap[h.sire]) sireMap[h.sire] = [];
        sireMap[h.sire].push(h);
      }
      if (h.dam && h.dam.trim() !== h.name.trim()) {
        if (!damMap[h.dam]) damMap[h.dam] = [];
        damMap[h.dam].push(h);
      }
    });

    const checkAge = (name: string) => {
      const found = horses.find(h => h.name.trim().toLowerCase() === name.trim().toLowerCase());
      return found ? found.age > 3 : true; 
    };

    const siresRanked = Object.entries(sireMap)
      .filter(([name, kids]) => kids.length >= 1 && checkAge(name)) 
      .map(([name, kids]) => ({ name, n: kids.length, kids }))
      .sort((a, b) => b.n - a.n);

    const damsRanked = Object.entries(damMap)
      .filter(([name, kids]) => kids.length >= 1 && checkAge(name))
      .map(([name, kids]) => ({ name, n: kids.length, kids }))
      .sort((a, b) => b.n - a.n);
      
    // 🛑 تم التأكيد على أن الفرس المنتجة عمرها >= 4 سنوات ومصنفة أنثى
    const prodMares = horses.filter(h => (h.sex === "mare" || h.sex === "filly") && h.age >= 4).length;

    return { tot, ages, col, str, fam, dis, sibs, siresRanked, damsRanked, prodMares };
  }, [horses]);

  const filtSibs = useMemo(() => {
    const q = sibQ.toLowerCase();
    return S.sibs.filter(g => !q || g.sire.toLowerCase().includes(q) || g.dam.toLowerCase().includes(q) || g.kids.some(k => k.name.toLowerCase().includes(q)));
  }, [S.sibs, sibQ]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#06071A]">
        <Dna className="w-12 h-12 text-[#C9A96E] animate-spin mb-4"/>
        <p className="text-white/50 font-black tracking-widest uppercase">Analyzing Genetic Data...</p>
      </div>
    );
  }

  const tr = T[lang]; const isAr = lang === "ar"; const dir = isAr ? "rtl" : "ltr";

  const hL = (k: Health) => ({ melanoma: tr.hMelanoma, laminitis: tr.hLaminitis, epilepsy: tr.hEpilepsy, pigmentation_loss: tr.hPig, fertility: tr.hFertility, guttural_pouch: tr.hGuttural, ovarian_tumor: tr.hOvarian })[k];
  const cL = (c: Color) => ({ grey: tr.colGrey, chestnut: tr.colChestnut, bay: tr.colBay, black: tr.colBlack })[c];
  const sevClr = (k: Health) => ["melanoma", "epilepsy", "laminitis", "ovarian_tumor"].includes(k) ? "#fb7185" : k === "fertility" || k === "guttural_pouch" ? "#f97316" : "#facc15";
  const sevLbl = (s: string) => s === "critical" ? tr.critical : s === "high" ? tr.high : tr.medium;

  const navItems = [
    { id: "overview", label: tr.navOverview }, { id: "genetics", label: tr.navGenetics },
    { id: "health-age", label: tr.navHealth }, { id: "diseases", label: tr.navDisease },
    { id: "siblings", label: tr.navSiblings }, { id: "production", label: tr.navProd },
  ];

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Cairo:wght@400;500;700;900&display=swap');
      *{box-sizing:border-box;}body{font-family:'Inter','Cairo',sans-serif;background:${BG};}html{scroll-behavior:smooth;}
      @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(35px,22px)}}
      @keyframes pg{0%,100%{opacity:.4}50%{opacity:1}}
      .ob1{animation:orb 22s ease-in-out infinite}.ob2{animation:orb 28s ease-in-out infinite reverse}
      @media print{html,body{background:${BG}!important;color:white!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}.no-print{display:none!important;}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;transition:none!important;animation:none!important;}}
      ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:rgba(255,255,255,.02)}::-webkit-scrollbar-thumb{background:rgba(201,169,110,.22);border-radius:9px}::-webkit-scrollbar-thumb:hover{background:rgba(201,169,110,.5)}
      input,select{color-scheme:dark}
    `}</style>
    
    <div dir={dir} style={{ background: BG }} className="min-h-screen text-white pb-24 overflow-x-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
        <div className={`ob1 absolute ${isAr?"right-[-25%]":"left-[-25%]"} top-[-25%] w-[70vw] h-[70vw] rounded-full`} style={{background:"radial-gradient(circle,rgba(201,169,110,0.08) 0%,transparent 65%)"}}/>
        <div className={`ob2 absolute ${isAr?"left-[-25%]":"right-[-25%]"} bottom-[-25%] w-[65vw] h-[65vw] rounded-full`} style={{background:"radial-gradient(circle,rgba(79,142,247,0.07) 0%,transparent 65%)"}}/>
        <div className="absolute top-1/3 left-1/3 w-[40vw] h-[40vw] rounded-full" style={{background:"radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 65%)"}}/>
        <svg className="absolute inset-0 w-full h-full" style={{opacity:.022}} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gr" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0L0 0 0 56" fill="none" stroke="white" strokeWidth=".5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gr)"/>
        </svg>
      </div>

      <motion.div className="fixed top-[88px] left-0 h-[2px] z-[100] no-print origin-left" style={{width:prog,background:`linear-gradient(90deg,${GOLD},#fbbf24,${GOLD})`}}/>

      <nav className="fixed top-[90px] left-0 right-0 z-50 no-print">
        <div style={{background:"rgba(6,7,26,0.82)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div className="max-w-[1440px] mx-auto px-4 flex items-center h-[50px] gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{background:GOLD,boxShadow:`0 0 8px 2px ${GOLD}55`,animation:"pg 2s infinite"}}/>
            <div className="flex items-center gap-0.5 overflow-x-auto flex-1 pb-px" style={{scrollbarWidth:"none"}}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => goTo(item.id)}
                  className="whitespace-nowrap px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                  style={activeNav === item.id ? { background: `${GOLD}18`, color: GOLD } : { color: "rgba(255,255,255,0.35)" }}>
                  {item.label}
                </button>
              ))}
            </div>
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.45)"}}>
              <Globe className="w-3.5 h-3.5"/>{isAr?"EN":"AR"}
            </button>
            <button onClick={() => router.push("/farmdashboard")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0"
              style={{background:`${GOLD}18`,border:`1px solid ${GOLD}40`,color:GOLD}}>
              BACK
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showTop && <motion.button onClick={goTop} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .7 }}
          className={`fixed bottom-8 ${isAr ? "left-8" : "right-8"} z-50 w-11 h-11 rounded-2xl flex items-center justify-center no-print`}
          style={{ background: GOLD, color: BG, boxShadow: `0 8px 30px ${GOLD}50` }}>
          <ChevronUp className="w-5 h-5" />
        </motion.button>}
      </AnimatePresence>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-7 pt-[160px]">

        {/* ═══ OVERVIEW ═══ */}
        <section id="overview">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}
            className="py-12 md:py-16 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
              <div className="flex-1">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
                  className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full"
                  style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}25` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD, animation: "pg 2s infinite" }} />
                  <span className="text-[11px] font-black uppercase tracking-[.22em]" style={{ color: GOLD }}>{farm?.farmName || tr.badge}</span>
                </motion.div>
                <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] mb-5 whitespace-pre-line"
                  style={{ background: `linear-gradient(135deg,#fff 0%,${GOLD} 55%,rgba(255,255,255,.3) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {tr.title}
                </h1>
                <p className="max-w-lg font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{tr.desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:w-[290px] shrink-0">
                {[
                  { icon: Activity, v: S.tot, label: tr.totHorses, hex: "#34d399", pct: 100 },
                  { icon: Dna, v: STRAINS.filter(s => S.str[s] > 0).length, label: tr.strains, hex: GOLD, pct: 50 },
                  { icon: Baby, v: S.prodMares, label: tr.prod, hex: "#4f8ef7", pct: Math.round(S.prodMares / Math.max(S.tot, 1) * 100) },
                  { icon: Users, v: S.sibs.length, label: tr.sib, hex: "#a78bfa", pct: Math.round(S.sibs.length / Math.max(S.tot, 1) * 100) },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .3 + i * .1 }}>
                    <Cd accent={c.hex} className="p-4 hover:scale-[1.02] transition-transform">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${c.hex}18` }}>
                          <c.icon className="w-[18px] h-[18px]" style={{ color: c.hex }} />
                        </div>
                        <Ring pct={c.pct} hex={c.hex} size={46} sw={4} />
                      </div>
                      <div className="text-4xl font-black text-white mb-1"><Num v={c.v} /></div>
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</div>
                    </Cd>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══ GENETICS ═══ */}
        <section id="genetics" className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <SecHead n="01" icon={Dna} hex={GOLD} title={tr.secStrains} />
          <Cd accent={GOLD} className="p-7 mb-6">
            <div className="flex flex-col xl:flex-row gap-8 items-center">
              <div className="shrink-0 flex flex-col items-center gap-5">
                <Donut items={STRAINS.map(s => ({ name: s, pct: S.tot > 0 ? (S.str[s] / S.tot) * 100 : 0, hex: S_CLR[s] }))} size={200} thick={38} />
                <div className="space-y-1.5">
                  {STRAINS.filter(s => S.str[s] > 0).map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: S_CLR[s] }} />
                      <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>{s}</span>
                      <span className="text-xs font-black text-white ml-auto pl-2">{S.str[s]}</span>
                    </div>
                  ))}
                  {STRAINS.every(s => S.str[s] === 0) && <div className="text-white/20 italic text-xs py-2">No data</div>}
                </div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {STRAINS.filter(s => S.str[s] > 0).map((s, i) => {
                  const pct = S.tot > 0 ? (S.str[s] / S.tot) * 100 : 0; return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{s}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-white">{pct.toFixed(1)}%</span>
                          <span className="text-sm font-black px-2.5 py-0.5 rounded-lg" style={{ background: S_CLR[s], color: BG }}>{S.str[s]}</span>
                        </div>
                      </div>
                      <Bar pct={pct} hex={S_CLR[s]} delay={.3 + i * .08} h="h-3" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Cd>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Cd accent={GOLD} className="lg:col-span-2 p-7">
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-5 h-5" style={{ color: GOLD }} />
                <h3 className="text-xl font-black">{tr.secFam}</h3>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-5" style={{ background: `${GOLD}09`, border: `1px solid ${GOLD}18` }}>
                <Award className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}><strong className="text-white">{tr.ansata}</strong> {tr.ansataDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FAMILIES.map((fam, i) => {
                  const cnt = S.fam[fam] || 0; const pct = S.tot > 0 ? (cnt / S.tot * 100) : 0;
                  return cnt > 0 ? (<div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <div className="font-bold text-sm text-white mb-1">{fam}</div>
                      <Bar pct={pct} hex={GOLD} h="h-1" delay={i * .03} />
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-lg font-black" style={{ color: GOLD }}>{pct.toFixed(1)}%</div>
                      <div className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>{cnt}</div>
                    </div>
                  </div>) : null;
                })}
              </div>
            </Cd>
            <Cd className="p-7 flex flex-col gap-5">
              <div className="flex items-center gap-3"><Palette className="w-5 h-5" style={{ color: GOLD }} /><h3 className="text-xl font-black">{tr.colorTitle}</h3></div>
              <div className="flex justify-center">
                <Donut items={(["grey", "chestnut", "bay", "black"] as Color[]).filter(c => S.col[c] > 0).map(c => ({ name: cL(c), pct: S.tot > 0 ? (S.col[c] / S.tot) * 100 : 0, hex: C_MAP[c] }))} size={168} thick={30} />
              </div>
              <div className="space-y-3">
                {(["grey", "chestnut", "bay", "black"] as Color[]).map((c, i) => {
                  const cnt = S.col[c], pct = S.tot > 0 ? (cnt / S.tot * 100) : 0;
                  return (<div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: C_MAP[c] }} /><span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.75)" }}>{cL(c)}</span></div>
                      <div className="flex items-center gap-2"><span className="font-black text-base text-white">{pct.toFixed(2)}%</span><span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: `${GOLD}18`, color: GOLD }}>{cnt}</span></div>
                    </div>
                    <Bar pct={pct} hex={C_MAP[c]} delay={i * .1} h="h-2" />
                  </div>);
                })}
              </div>
            </Cd>
          </div>
        </section>

        {/* ═══ HEALTH & AGE ═══ */}
        <section id="health-age" className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <SecHead n="02" icon={TrendingUp} hex="#4f8ef7" title={`${tr.secAge} · ${tr.secHealth}`} />
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <Cd accent="#4f8ef7" className="xl:col-span-3 p-7">
              <div className="flex items-center gap-3 mb-6"><TrendingUp className="w-5 h-5 text-blue-400" /><h3 className="text-xl font-black">{tr.secAge}</h3></div>
              <div className="space-y-4">
                {AGE_BUCKETS.map((b, i) => {
                  const cnt = S.ages[i]; const pct = S.tot > 0 ? (cnt / S.tot) * 100 : 0;
                  return (<div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.hex }} /><span className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{tr.ageGroup[i]}</span></div>
                      <div className="flex items-center gap-3"><span className="text-lg font-black text-white">{pct.toFixed(1)}%</span><span className="text-xs font-black px-2.5 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>{cnt}</span></div>
                    </div>
                    <Bar pct={pct} hex={b.hex} delay={i * .07} h="h-2.5" />
                  </div>);
                })}
              </div>
            </Cd>
            <Cd accent="#fb7185" className="xl:col-span-2 p-7">
              <div className="flex items-center gap-3 mb-5"><HeartPulse className="w-5 h-5 text-red-400" /><h3 className="text-xl font-black">{tr.secHealth}</h3></div>
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-5" style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.15)" }}>
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed" style={{ color: "rgba(255,200,200,0.8)" }}>{tr.healthNote}</p>
              </div>
              <div className="space-y-3">
                {HKEYS.map((k, i) => {
                  const cnt = S.dis[k] || 0; const hx = sevClr(k);
                  return cnt > 0 ? (<div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.75)" }}>{hL(k)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${hx}18`, color: hx, border: `1px solid ${hx}25` }}>
                          {sevLbl(DISEASE_TRACE.find(d => d.key === k)?.sev || "medium")}
                        </span>
                        <span className="text-sm font-black text-white">{cnt}</span>
                      </div>
                    </div>
                    <Bar pct={(cnt / Math.max(...HKEYS.map(k2 => S.dis[k2] || 0), 1)) * 100} hex={hx} delay={.1 + i * .07} h="h-1.5" />
                  </div>) : null;
                })}
              </div>
            </Cd>
          </div>
        </section>

        {/* ═══ DISEASES ═══ */}
        <section id="diseases" className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <SecHead n="03" icon={ShieldAlert} hex="#fb7185" title={tr.secDisease} sub={tr.diseaseDesc} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DISEASE_TRACE.map((trace, i) => {
              const cnt = S.dis[trace.key] || 0;
              if (cnt === 0) return null;
              const isOpen = openDis.has(i);
              const hx = sevClr(trace.key);
              const disNameAr = ({ melanoma: tr.hMelanoma, laminitis: tr.hLaminitis, epilepsy: tr.hEpilepsy, pigmentation_loss: tr.hPig, fertility: tr.hFertility, guttural_pouch: tr.hGuttural, ovarian_tumor: tr.hOvarian })[trace.key];
              return (<motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }}>
                <div className="rounded-[1.5rem] overflow-hidden cursor-pointer transition-all"
                  style={{ border: `1px solid rgba(251,113,133,${isOpen ? .25 : .1})`, background: isOpen ? "rgba(251,113,133,0.06)" : "rgba(251,113,133,0.025)" }}
                  onClick={() => setOpenDis(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${hx}18`, color: hx, border: `1px solid ${hx}25` }}>{sevLbl(trace.sev)}</span>
                        <h3 className="text-base font-black text-white">{isAr ? disNameAr : hL(trace.key)}</h3>
                      </div>
                      <div className="text-center shrink-0"><div className="text-3xl font-black" style={{ color: hx }}>{cnt}</div><div className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>{isAr ? "حالة" : "cases"}</div></div>
                    </div>
                    <Bar pct={(cnt / Math.max(S.dis.melanoma || 1, 1)) * 100} hex={hx} h="h-1" />
                    <button className="mt-3 flex items-center gap-1.5 text-xs font-bold transition-colors" style={{ color: `${hx}70` }}>
                      {isOpen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {isOpen ? tr.collapse : tr.expand}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t pt-4" style={{ borderColor: "rgba(251,113,133,0.1)" }}>
                        <p className="text-sm leading-[1.9] font-medium whitespace-pre-line mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>{isAr ? trace.srcAr : trace.srcEn}</p>
                        {"analysisAr" in trace && <div className="p-4 rounded-xl relative overflow-hidden" style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.12)" }}>
                          <div className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-0.5 h-full`} style={{ background: `linear-gradient(${hx},transparent)` }} />
                          <div className="flex items-center gap-2 mb-2"><Zap className="w-3.5 h-3.5 text-red-400" /><span className="text-xs font-black text-red-300">{tr.causalTitle}</span></div>
                          <p className="text-xs leading-relaxed font-medium text-justify" style={{ color: "rgba(255,255,255,0.65)" }}>
                            {isAr ? (trace as any).analysisAr : (trace as any).analysisEn}
                          </p>
                        </div>}
                      </div>
                    </motion.div>}
                  </AnimatePresence>
                </div>
              </motion.div>);
            })}
          </div>
        </section>

        {/* ═══ SIBLINGS ═══ */}
        <section id="siblings" className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <SecHead n="04" icon={Users} hex="#a78bfa" title={tr.secSib} sub={tr.sibDesc} />
            <div className="max-w-xs w-full shrink-0 no-print" style={{ marginTop: "-24px" }}><SrchBox value={sibQ} onChange={setSibQ} placeholder={tr.search} isAr={isAr} /></div>
          </div>
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>{tr.showing} {filtSibs.length} {tr.of} {S.sibs.length} {tr.groups}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {filtSibs.length === 0 ? <div className="col-span-4 py-10 text-center font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.noResults}</div>
                : filtSibs.map((g, idx) => (
                  <motion.div key={`${g.sire}-${g.dam}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: idx * .03 }}>
                    <div className="rounded-[1.5rem] p-4 h-full flex flex-col transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.28)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.1)")}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>#{S.sibs.indexOf(g) + 1}</span>
                        <span className="text-[9px] font-black" style={{ color: "rgba(167,139,250,0.5)" }}>{g.kids.length} {tr.thOffspring}</span>
                      </div>
                      <div className="space-y-2 mb-3 flex-1">
                        <div><div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.thSire}</div>
                          <div className="font-black text-sm text-blue-300">{sibQ ? mk(g.sire, sibQ) : g.sire}</div></div>
                        <div className="h-px" style={{ background: "linear-gradient(90deg,rgba(96,165,250,0.15),rgba(167,139,250,0.15),rgba(249,168,212,0.15))" }} />
                        <div><div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.thDam}</div>
                          <div className="font-black text-sm text-pink-300">{sibQ ? mk(g.dam, sibQ) : g.dam}</div></div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {g.kids.map((k, ki) => (
                          <span key={ki} className="text-[9px] font-bold px-1.5 py-0.5 rounded-lg" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(167,139,250,0.6)" }}>{k.name}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ PRODUCTION ═══ */}
        <section id="production" className="py-12">
          <SecHead n="05" icon={Layers} hex="#fbbf24" title={tr.secProd} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProdCard rows={S.siresRanked} title={tr.siresTitle} icon={Award} hex="#4f8ef7" lang={lang} open={openProd} setOpen={setOpenProd} prefix="s" />
            <ProdCard rows={S.damsRanked} title={tr.damsTitle} icon={Baby} hex="#ec4899" lang={lang} open={openProd} setOpen={setOpenProd} prefix="d" />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 flex flex-col sm:flex-row justify-between items-center gap-5 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {[{ label: tr.footerIdea, name: "ناصر", hex: GOLD }, { label: tr.footerDev, name: "أحمد الصالح", hex: "#4f8ef7" }].map((f, i) => (
            <Cd key={i} accent={f.hex} className="px-7 py-5 flex items-center gap-4 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${f.hex}15`, border: `1px solid ${f.hex}20` }}>
                {i === 0 ? <Star className="w-5 h-5" style={{ color: f.hex }} /> : <Globe className="w-5 h-5" style={{ color: f.hex }} />}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.22)" }}>{f.label}</div>
                <div className="text-xl font-black text-white">{f.name}</div>
              </div>
            </Cd>
          ))}
        </footer>
      </div>

    </div>
  </>);
}

// ─── PRODUCTION TABLE COMPONENT ───────────────────────────────────────────────
function ProdCard({ rows, title, icon: Icon, hex, lang, open, setOpen, prefix }: {
  rows: { name: string; n: number; kids: Horse[] }[]; title: string; icon: React.ElementType; hex: string;
  lang: "ar" | "en"; open: Set<string>; setOpen: React.Dispatch<React.SetStateAction<Set<string>>>; prefix: string;
}) {
  const tr = T[lang]; const isAr = lang === "ar";
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | null>("desc");
  const max = rows[0]?.n || 1;
  const medal = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
  const toggle = (k: string) => setOpen(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const filtered = useMemo(() => {
    let r = rows.filter(x => x.name.toLowerCase().includes(q.toLowerCase()) || x.kids.some(k => k.name.toLowerCase().includes(q.toLowerCase())));
    if (sort === "asc") r = [...r].sort((a, b) => a.n - b.n);
    if (sort === "desc") r = [...r].sort((a, b) => b.n - a.n);
    return r;
  }, [rows, q, sort]);
  return (<div className="rounded-[2rem] p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="relative top-0 left-0 right-0 h-px mb-1" style={{ background: `linear-gradient(90deg,transparent,${hex}40,transparent)` }} />
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${hex}15` }}>
        <Icon className="w-[18px] h-[18px]" style={{ color: hex }} />
      </div>
      <h3 className="text-lg font-black">{title}</h3>
    </div>
    <div className="flex gap-2 mb-3">
      <div className="flex-1">
        <div className="relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isAr ? "right-3.5" : "left-3.5"}`} style={{ color: "rgba(255,255,255,0.25)" }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={tr.search}
            className={`w-full text-sm text-white placeholder-gray-600 focus:outline-none py-2.5 rounded-xl transition-colors ${isAr ? "pr-10 pl-9" : "pl-10 pr-9"}`}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
          {q && <button onClick={() => setQ("")} className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "left-3" : "right-3"}`} style={{ color: "rgba(255,255,255,0.3)" }}><X className="w-3.5 h-3.5" /></button>}
        </div>
      </div>
      <button onClick={() => setSort(s => s === null ? "desc" : s === "desc" ? "asc" : null)}
        className="px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        style={sort ? { background: `${hex}15`, color: hex, border: `1px solid ${hex}25` } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {sort === "asc" ? <SortAsc className="w-4 h-4" /> : sort === "desc" ? <SortDesc className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
      </button>
    </div>
    <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.showing} {filtered.length} {tr.of} {rows.length}</p>
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      <AnimatePresence>
        {filtered.length === 0 ? <div className="py-8 text-center text-sm font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.noResults}</div>
          : filtered.map((row, i) => {
            const k = `${prefix}-${row.name}`; const isOpen = open.has(k); const origIdx = rows.indexOf(row);
            return (<motion.div key={row.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * .02 }}>
              <div className="rounded-2xl overflow-hidden cursor-pointer transition-all" onClick={() => toggle(k)}
                style={{ border: `1px solid ${isOpen ? `${hex}25` : "rgba(255,255,255,0.06)"}`, background: isOpen ? `${hex}08` : "rgba(255,255,255,0.02)" }}>
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="text-base font-black w-8 text-center shrink-0">{medal(origIdx)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-white truncate">{row.name}</span>
                      <span className="text-sm font-black shrink-0 ml-2" style={{ color: hex }}>{row.n}</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: hex }}
                        initial={{ width: 0 }} whileInView={{ width: `${(row.n / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: .1 + i * .04 }} />
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
                <AnimatePresence>
                  {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} className="overflow-hidden">
                    <div className="px-4 pb-3 border-t pt-3 flex flex-wrap gap-1.5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      {row.kids.map((h, ki) => <span key={ki} className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>{h.name}</span>)}
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>
            </motion.div>);
          })}
      </AnimatePresence>
    </div>
  </div>);
}