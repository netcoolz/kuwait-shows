"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Dna, Palette, TrendingUp, Users, HeartPulse, Award, Download,
  ShieldAlert, Baby, Globe, Star, Search, X, ChevronUp,
  SortAsc, SortDesc, Eye, EyeOff, ChevronDown, Layers, Plus, Trash2,
  Edit2, Check, AlertCircle, Activity, Zap, ArrowUpDown, BarChart3,
} from "lucide-react";

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
    secHealth:"Medical Overview",secDisease:"Genetic Disease Tracing",secRegistry:"Horse Registry",
    secSib:"Sibling Groups",secProd:"Production Rankings",
    healthNote:"All percentages are calculated from the total herd.",
    ansata:"Ansata Bloodline Dominance:",ansataDesc:"Strong descent from Ansata & Latiefa lines.",
    colorTitle:"Coat Colors",addHorse:"Add Horse",editHorse:"Edit",deleteHorse:"Delete",
    save:"Save",cancel:"Cancel",confirmDelete:"Delete this horse?",
    nameLbl:"English Name",nameArLbl:"Arabic Name",ageLbl:"Age (yrs)",colorLbl:"Color",
    sexLbl:"Sex",sireLbl:"Sire",damLbl:"Dam",strainLbl:"Strain",familyLbl:"Family",
    healthLbl:"Health Conditions",searchHorse:"Search horses…",
    all:"All",stallions:"Stallions",mares:"Mares",youngsters:"Yearlings",
    noHorses:"No horses found.",totalShown:"Showing",of:"of",records:"horses",
    export:"Export PDF",search:"Search…",noResults:"No results.",sortBy:"Sort",showing:"Showing",
    navOverview:"Overview",navGenetics:"Genetics",navHealth:"Health & Age",
    navDisease:"Diseases",navRegistry:"Registry",navSiblings:"Siblings",navProd:"Production",
    diseaseDesc:"Linking health conditions to producing sires and dams.",
    sibDesc:"Grouped by Sire × Dam for genetic fixation analysis.",
    siresTitle:"Sires Production Ranking",damsTitle:"Dams Production Ranking",
    collapse:"Collapse",expand:"Details",offspring:"offspring",
    footerIdea:"Concept & Data",footerDev:"Design & Engineering",
    sexSt:"Stallion",sexMa:"Mare",sexCo:"Colt",sexFi:"Filly",
    colGrey:"Grey",colChestnut:"Chestnut",colBay:"Bay",colBlack:"Black",
    hMelanoma:"Melanomas",hLaminitis:"Laminitis",hEpilepsy:"Epilepsy",
    hPig:"Pigment Loss",hFertility:"Fertility Issues",hGuttural:"Guttural Pouch",hOvarian:"Ovarian Tumor",
    critical:"Critical",high:"High",medium:"Medium",
    ageGroup:["1 Year","2 Years","3 Years","4–6 Years","7–10 Years","11–13 Years","14–17 Years","18+ Years"],
    causalTitle:"Causal Analysis:",groups:"groups",thSire:"Sire",thDam:"Dam",thOffspring:"Offspring",
  },
  ar:{
    badge:"مركز الجواد العربي • تقرير الاستخبارات الاستراتيجية",
    title:"الذكاء الجيني\nوالصحي",
    desc:"تحليل استراتيجي يربط بين التركيبة العمرية والسيادة الجينية والمؤشرات الصحية لجميع الخيل المسجلة.",
    totHorses:"إجمالي الخيل",totSub:"100% مكتملة",strains:"أرسان الدم",strainSub:"رسن متميز",
    prod:"أفراس منتجة",prodSub:"من القطيع",sib:"مجموعات أشقاء",sibSub:"تثبيت جيني",
    secStrains:"توزيع الأرسان",secFam:"العوائل والألوان",secAge:"التركيبة العمرية",
    secHealth:"الواقع الطبي",secDisease:"تتبع الأمراض الجينية",secRegistry:"سجل الخيل",
    secSib:"مجموعات الأشقاء",secProd:"ترتيب الإنتاج",
    healthNote:"جميع النسب محسوبة من إجمالي الخيل.",
    ansata:"السيادة الجينية للعوائل:",ansataDesc:"يظهر انحدار قوي من خطوط أنساتا ولطيفة.",
    colorTitle:"توزيع الألوان",addHorse:"إضافة جواد",editHorse:"تعديل",deleteHorse:"حذف",
    save:"حفظ",cancel:"إلغاء",confirmDelete:"هل تريد حذف الجواد؟",
    nameLbl:"الاسم بالإنجليزية",nameArLbl:"الاسم بالعربية",ageLbl:"العمر (سنوات)",colorLbl:"اللون",
    sexLbl:"الجنس",sireLbl:"الأب",damLbl:"الأم",strainLbl:"الرسن",familyLbl:"العائلة",
    healthLbl:"الحالات الصحية",searchHorse:"ابحث عن جواد…",
    all:"الكل",stallions:"الفحول",mares:"الأفراس",youngsters:"الأمهار",
    noHorses:"لا توجد خيل.",totalShown:"يعرض",of:"من",records:"جواد",
    export:"تصدير PDF",search:"ابحث…",noResults:"لا توجد نتائج.",sortBy:"ترتيب",showing:"يعرض",
    navOverview:"نظرة عامة",navGenetics:"الجينات",navHealth:"الصحة والأعمار",
    navDisease:"الأمراض",navRegistry:"السجل",navSiblings:"الأشقاء",navProd:"الإنتاج",
    diseaseDesc:"ربط الحالات الصحية بالفحول والأفراس المنتجة.",
    sibDesc:"مجمّعة حسب نفس الأب والأم لمراجعة التثبيت الجيني.",
    siresTitle:"ترتيب إنتاج الفحول",damsTitle:"ترتيب إنتاج الأفراس",
    collapse:"طيّ",expand:"التفاصيل",offspring:"مُنتَج",
    footerIdea:"الفكرة والبيانات",footerDev:"التصميم والبرمجة",
    sexSt:"فحل",sexMa:"فرس",sexCo:"مُهر",sexFi:"مُهرة",
    colGrey:"أزرق (رمادي)",colChestnut:"أشقر",colBay:"أحمر",colBlack:"أسود",
    hMelanoma:"ميلانوما",hLaminitis:"حمرة الحافر",hEpilepsy:"صرع",
    hPig:"فقدان التصبغ",hFertility:"مشاكل خصوبة",hGuttural:"الأكياس الهوائية",hOvarian:"ورم المبيض",
    critical:"حرج",high:"مرتفع",medium:"متوسط",
    ageGroup:["سنة واحدة","سنتان","3 سنوات","4–6 سنوات","7–10 سنوات","11–13 سنة","14–17 سنة","18+ سنة"],
    causalTitle:"التحليل السببي:",groups:"مجموعات",thSire:"الأب",thDam:"الأم",thOffspring:"الأبناء",
  },
} as const;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STRAINS:Strain[]  = ["Dahman Shahwan","Koheilan Rodan","Saqlawi Jidran","Obeyan Om Jreis","Hadban Enzahi"];
const FAMILIES:Family[] = ["Ansata Meryta","Latiefa","Ansata White Nile","Alimaar Abbeyyah","Ansata Sherrara","Authentic Nabeelah","Ghazala Al Rayyan","Bilqis EV","Haifaa Al Waab","El Thay Maniha","NK Lubna","Loubna Al Waab","Rababa Al Rayyan"];
const C_MAP:Record<Color,string>={grey:"#94a3b8",chestnut:"#b45309",bay:"#7f1d1d",black:"#374151"};
const S_CLR:Record<Strain,string>={"Dahman Shahwan":"#4f8ef7","Koheilan Rodan":"#a78bfa","Saqlawi Jidran":"#34d399","Obeyan Om Jreis":"#c9a96e","Hadban Enzahi":"#fb7185"};
const HKEYS:Health[]=["melanoma","laminitis","epilepsy","pigmentation_loss","fertility","guttural_pouch","ovarian_tumor"];
const AGE_BUCKETS=[
  {min:1,max:1,hex:"#10b981"},{min:2,max:2,hex:"#14b8a6"},{min:3,max:3,hex:"#06b6d4"},
  {min:4,max:6,hex:"#4f8ef7"},{min:7,max:10,hex:"#818cf8"},{min:11,max:13,hex:"#a78bfa"},
  {min:14,max:17,hex:"#c9a96e"},{min:18,max:999,hex:"#fb7185"},
];
const GOLD="#C9A96E",BG="#06071A";
let _uid=0; const mkId=()=>`h${++_uid}`;

// ─── HORSE DATA  (135 horses) ─────────────────────────────────────────────────
type HRow=[string,string,number,Color,Sex,string,string,Strain,Family,Health[]];
const RAW:HRow[]=[
  // STALLIONS (9)
  ["Marwan Elkuwait","مروان الكويت",22,"grey","stallion","Ansata Ibn Halima","Mesk Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma","pigmentation_loss"]],
  ["Naseem Al Rashediah","نسيم الراشدية",18,"grey","stallion","Anaza El Farid","Nadia Al Rashediah","Koheilan Rodan","Latiefa",["laminitis"]],
  ["Ansata Sheikh Halim","أنساتا شيخ حليم",20,"grey","stallion","Ansata Hejazi","Ansata Bint Mabrouka","Dahman Shahwan","Ansata Meryta",["melanoma","pigmentation_loss"]],
  ["Waseem Elkuwait","وسيم الكويت",14,"grey","stallion","Marwan Elkuwait","Wafeyah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Ajmal Ashhal","أجمل أشهل",16,"grey","stallion","Ashhal Al Rayyan","Ajmal Shadya","Koheilan Rodan","Latiefa",["epilepsy"]],
  ["Ajmal Al Kout","أجمل الكوت",15,"grey","stallion","Ajmal Hamed","Fariha Al Kout","Saqlawi Jidran","Ansata White Nile",[]],
  ["TM Rihan","تي إم ريحان",12,"grey","stallion","Top Mark","Rihana Al Arab","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Ezz Al Rashediah","عز الراشدية",13,"grey","stallion","Anaza El Farid","Ezza Al Rashediah","Koheilan Rodan","Latiefa",["epilepsy"]],
  ["Ajmal Talal","أجمل طلال",11,"grey","stallion","Ajmal Hamed","Talala Al Rayyan","Obeyan Om Jreis","Ansata Sherrara",[]],
  // FOUNDATION MARES (25)
  ["May Elkuwait","مي الكويت",19,"grey","mare","Ansata Ibn Halima","Mesk Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma","pigmentation_loss"]],
  ["Amal Elkuwait","أمل الكويت",16,"grey","mare","Ansata Sheikh Halim","Abla Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Mesk Elkuwait","مسك الكويت",25,"grey","mare","Ansata Hejazi","Old Foundation","Dahman Shahwan","Ansata Meryta",["melanoma","pigmentation_loss"]],
  ["Wafeyah Elkuwait","وفية الكويت",20,"grey","mare","Ansata Ibn Halima","Warda Al Arab","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Authentic Nabeelah","أوثنتيك نبيلة",18,"grey","mare","Authentic","Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Bint Wafaa Elkuwait","بنت وفاء الكويت",22,"grey","mare","Ansata Sheikh Halim","Wafaa Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Arwa Elkuwait","أروى الكويت",14,"grey","mare","Ajmal Al Kout","Amal Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Abla Elkuwait","عبلة الكويت",21,"grey","mare","Ansata Ibn Halima","Abla Al Arab","Dahman Shahwan","Ansata Meryta",["melanoma","pigmentation_loss"]],
  ["Amthal Elkuwait","أمثال الكويت",12,"grey","mare","Ajmal Al Kout","Amal Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Wa'ad Elkuwait","وعد الكويت",10,"grey","mare","Marwan Elkuwait","Wanisa Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Wanisa Elkuwait","وانيسا الكويت",17,"grey","mare","Naseem Al Rashediah","Wana Foundation","Koheilan Rodan","Latiefa",["laminitis"]],
  ["Lana Elkuwait","لانا الكويت",18,"grey","mare","Ansata Sheikh Halim","Lana Foundation","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Lutfia Elkuwait","لطفية الكويت",15,"grey","mare","Ajmal Ashhal","Lutfa Foundation","Koheilan Rodan","Latiefa",["melanoma","pigmentation_loss"]],
  ["Salma Elkuwait","سلمى الكويت",19,"grey","mare","Ansata Sheikh Halim","Salma Foundation","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Bilqis EV","بلقيس إي في",16,"grey","mare","Eventa","Bilqis Foundation","Obeyan Om Jreis","Bilqis EV",[]],
  ["Maramie Elkuwait","مرامي الكويت",13,"grey","mare","Ajmal Ashhal","Marama Foundation","Koheilan Rodan","Latiefa",[]],
  ["Sherifa Elkuwait","شريفة الكويت",16,"grey","mare","Ajmal Al Kout","Sharifa Foundation","Saqlawi Jidran","Ansata White Nile",["melanoma","ovarian_tumor"]],
  ["Ghalia Elkuwait","غالية الكويت",11,"grey","mare","Ajmal Al Kout","Ghalia Foundation","Saqlawi Jidran","Ansata White Nile",[]],
  ["Loubna Al Waab","لبنى الوعب",15,"grey","mare","NK Foundation","Loubna Foundation","Hadban Enzahi","Loubna Al Waab",[]],
  ["Salsabeel Elkuwait","سلسبيل الكويت",14,"grey","mare","Ajmal Al Kout","Salsa Foundation","Saqlawi Jidran","Ansata White Nile",["melanoma"]],
  ["Shams Elkuwait","شمس الكويت",17,"grey","mare","Naseem Al Rashediah","Shams Foundation","Koheilan Rodan","Latiefa",["melanoma","laminitis"]],
  ["Maysa Elkuwait","ميساء الكويت",15,"grey","mare","Ajmal Ashhal","May Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Layla Elkuwait","ليلى الكويت",16,"grey","mare","Naseem Al Rashediah","Layla Foundation","Koheilan Rodan","Latiefa",["melanoma"]],
  ["Madinah Elkuwait","مدينة الكويت",18,"grey","mare","Ansata Sheikh Halim","Mesk Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Maha Elkuwait","مها الكويت",17,"grey","mare","Ansata Sheikh Halim","Foundation Mare","Dahman Shahwan","Ansata Meryta",["melanoma","fertility"]],
  // MARWAN OFFSPRING (21)
  ["Anoud Elkuwait","عنود الكويت",11,"grey","mare","Marwan Elkuwait","Arwa Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Arzaag Elkuwait","أرزاق الكويت",7,"grey","stallion","Marwan Elkuwait","Arwa Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Aryam Elkuwait","أريام الكويت",5,"grey","filly","Marwan Elkuwait","Arwa Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Asmahan Elkuwait","أسمهان الكويت",8,"grey","mare","Marwan Elkuwait","Amal Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Azzah Elkuwait","عزة الكويت",6,"grey","mare","Marwan Elkuwait","Amal Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Amal Colt","مُهر أمل",1,"grey","colt","Marwan Elkuwait","Amal Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Shammah Elkuwait","شمّاء الكويت",9,"grey","mare","Marwan Elkuwait","Sherifa Elkuwait","Dahman Shahwan","Ansata White Nile",[]],
  ["Shafi Elkuwait","شافي الكويت",7,"grey","stallion","Marwan Elkuwait","Sherifa Elkuwait","Dahman Shahwan","Ansata White Nile",[]],
  ["Wahaj Elkuwait","وهج الكويت",12,"grey","mare","Marwan Elkuwait","Wanisa Elkuwait","Koheilan Rodan","Latiefa",["melanoma"]],
  ["Nabila Elkuwait","نبيلة الكويت",6,"grey","mare","Marwan Elkuwait","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Nadrah Elkuwait","ندرة الكويت",4,"grey","filly","Marwan Elkuwait","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Qamar Elkuwait","قمر الكويت",5,"grey","mare","Marwan Elkuwait","Loubna Al Waab","Hadban Enzahi","Loubna Al Waab",[]],
  ["Qatara Elkuwait","قطرة الكويت",3,"grey","filly","Marwan Elkuwait","Loubna Al Waab","Hadban Enzahi","Loubna Al Waab",[]],
  ["Taym Elkuwait","تيم الكويت",4,"grey","colt","Marwan Elkuwait","Sherifa Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Lahour Elkuwait","لهور الكويت",3,"grey","filly","Marwan Elkuwait","Lana Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Lana Filly","مُهرة لانا",1,"grey","filly","Marwan Elkuwait","Lana Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Bibi Elkuwait","بيبي الكويت",6,"grey","mare","Marwan Elkuwait","Bilqis EV","Obeyan Om Jreis","Bilqis EV",[]],
  ["Badriah Elkuwait","بدرية الكويت",4,"grey","filly","Marwan Elkuwait","Bilqis EV","Obeyan Om Jreis","Bilqis EV",[]],
  ["Lusail Elkuwait","لوسيل الكويت",2,"grey","filly","Marwan Elkuwait","Lana Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Luna Elkuwait","لونا الكويت",2,"grey","filly","Marwan Elkuwait","Lutfia Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Liblibah Elkuwait","لبلبة الكويت",1,"grey","filly","Marwan Elkuwait","Salma Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  // NASEEM OFFSPRING (11)
  ["Ayda Elkuwait","أيدا الكويت",8,"grey","mare","Naseem Al Rashediah","Wanisa Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Mafatin Elkuwait","مفاتين الكويت",7,"grey","mare","Naseem Al Rashediah","May Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Mahinoor Elkuwait","ماهي نور الكويت",5,"grey","filly","Naseem Al Rashediah","Maramie Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Marayem Elkuwait","مريم الكويت",6,"grey","mare","Naseem Al Rashediah","May Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Moudi Elkuwait","مودي الكويت",4,"grey","filly","Naseem Al Rashediah","Maramie Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Mozah Elkuwait","موزة الكويت",3,"grey","filly","Naseem Al Rashediah","May Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Shadad Elkuwait","شداد الكويت",9,"grey","stallion","Naseem Al Rashediah","Shams Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Washmah Elkuwait","وشمة الكويت",5,"grey","filly","Naseem Al Rashediah","Wa'ad Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Wasmah Elkuwait","وسمة الكويت",7,"grey","mare","Naseem Al Rashediah","Wa'ad Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Wisal Elkuwait","وصال الكويت",6,"grey","mare","Naseem Al Rashediah","Wanisa Elkuwait","Koheilan Rodan","Latiefa",["laminitis"]],
  ["Laaboobah Elkuwait","لعبوبة الكويت",4,"grey","filly","Naseem Al Rashediah","Layla Elkuwait","Koheilan Rodan","Latiefa",[]],
  // ANSATA SHEIKH HALIM OFFSPRING (11)
  ["Al Angaa Elkuwait","العنقاء الكويت",10,"grey","mare","Ansata Sheikh Halim","Abla Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Areej Elkuwait","أريج الكويت",8,"grey","mare","Ansata Sheikh Halim","Amthal Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Manal Filly","مُهرة منال",2,"grey","filly","Ansata Sheikh Halim","Madinah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Watfa Elkuwait","وطفاء الكويت",9,"grey","mare","Ansata Sheikh Halim","Bint Wafaa Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Warah Elkuwait","وراح الكويت",7,"grey","mare","Ansata Sheikh Halim","Bint Wafaa Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Najat Elkuwait","نجاة الكويت",6,"grey","mare","Ansata Sheikh Halim","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Nawal Elkuwait","نوال الكويت",8,"grey","mare","Ansata Sheikh Halim","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Nairah Elkuwait","نيرة الكويت",5,"grey","filly","Ansata Sheikh Halim","Maha Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Ghaneema Elkuwait","غنيمة الكويت",7,"grey","mare","Ansata Sheikh Halim","Ghalia Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Ghaiham Elkuwait","غيهم الكويت",5,"grey","stallion","Ansata Sheikh Halim","Ghalia Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Latifa Elkuwait","لطيفة الكويت",4,"grey","filly","Ansata Sheikh Halim","Lana Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  // WASEEM OFFSPRING (10)
  ["Aisha Elkuwait","عائشة الكويت",9,"grey","mare","Waseem Elkuwait","Abla Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Shamekh Elkuwait","شامخ الكويت",7,"grey","stallion","Waseem Elkuwait","Shams Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Hessah Elkuwait","حصة الكويت",5,"grey","mare","Waseem Elkuwait","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  ["Wajd Elkuwait","وجد الكويت",8,"grey","mare","Waseem Elkuwait","Wafeyah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Waly Elkuwait","والي الكويت",6,"grey","stallion","Waseem Elkuwait","Wafeyah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Wafeyah Colt","مُهر وفية",1,"grey","colt","Waseem Elkuwait","Wafeyah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Lora Elkuwait","لورا الكويت",6,"grey","mare","Waseem Elkuwait","Lutfia Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Lamasat Elkuwait","لمسات الكويت",4,"grey","filly","Waseem Elkuwait","Lutfia Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Luma Elkuwait","لمى الكويت",8,"grey","mare","Waseem Elkuwait","Salma Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma"]],
  ["Revan Elkuwait","ريفان الكويت",3,"grey","filly","Waseem Elkuwait","Wanisa Elkuwait","Koheilan Rodan","Latiefa",[]],
  // AJMAL ASHHAL OFFSPRING (7)
  ["Mariyam Elkuwait","مريم الكويت٢",9,"grey","mare","Ajmal Ashhal","Maramie Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Soaad Elkuwait","سعاد الكويت",7,"grey","mare","Ajmal Ashhal","Shams Elkuwait","Koheilan Rodan","Latiefa",["laminitis"]],
  ["Wahash Elkuwait","وحش الكويت",5,"grey","colt","Ajmal Ashhal","Wanisa Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Basma Elkuwait","بسمة الكويت",8,"grey","mare","Ajmal Ashhal","Bilqis EV","Obeyan Om Jreis","Bilqis EV",[]],
  ["Larien Elkuwait","لارين الكويت",6,"grey","mare","Ajmal Ashhal","Lana Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Losan Elkuwait","لوزان الكويت",4,"grey","filly","Ajmal Ashhal","Layla Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Lulu Elkuwait","لولو الكويت",3,"grey","filly","Ajmal Ashhal","Lutfia Elkuwait","Koheilan Rodan","Latiefa",[]],
  // AJMAL AL KOUT OFFSPRING (1)
  ["Najla Elkuwait","نجلاء الكويت",9,"grey","mare","Ajmal Al Kout","Authentic Nabeelah","Koheilan Rodan","Authentic Nabeelah",[]],
  // TM RIHAN OFFSPRING (6)
  ["Muhja Elkuwait","مُهجة الكويت",10,"grey","mare","TM Rihan","Maha Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Waleedah Elkuwait","وليدة الكويت",8,"grey","mare","TM Rihan","Bint Wafaa Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Rajwah Elkuwait","رجوة الكويت",7,"grey","mare","TM Rihan","Authentic Nabeelah","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Laddad Elkuwait","لداد الكويت",5,"grey","colt","TM Rihan","Salma Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Laman Elkuwait","لمان الكويت",3,"grey","filly","TM Rihan","Loubna Al Waab","Hadban Enzahi","Loubna Al Waab",[]],
  ["Haneen Elkuwait","حنين الكويت",2,"grey","filly","TM Rihan","Maha Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  // EZZ AL RASHEDIAH OFFSPRING (5)
  ["Mas Elkuwait","ماس الكويت",9,"grey","mare","Ezz Al Rashediah","Madinah Elkuwait","Koheilan Rodan","Ansata Meryta",[]],
  ["Wataniyah Elkuwait","وطنية الكويت",7,"grey","mare","Ezz Al Rashediah","Wanisa Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Wadea Elkuwait","وديعة الكويت",5,"grey","mare","Ezz Al Rashediah","Wa'ad Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Linda Elkuwait","ليندا الكويت",4,"chestnut","filly","Ezz Al Rashediah","Lana Elkuwait","Koheilan Rodan","Ansata Meryta",[]],
  ["Larien Filly","لارين مُهرة",2,"grey","filly","Ezz Al Rashediah","Layla Elkuwait","Koheilan Rodan","Latiefa",[]],
  // AJMAL TALAL OFFSPRING (5)
  ["Mamdooh Elkuwait","ممدوح الكويت",8,"grey","stallion","Ajmal Talal","Maramie Elkuwait","Obeyan Om Jreis","Ansata Sherrara",[]],
  ["Moayed Elkuwait","مؤيد الكويت",6,"grey","stallion","Ajmal Talal","May Elkuwait","Dahman Shahwan","Ansata Sherrara",[]],
  ["Sultan Elkuwait","سلطان الكويت",5,"grey","stallion","Ajmal Talal","Sherifa Elkuwait","Saqlawi Jidran","Ansata Sherrara",[]],
  ["Labah Elkuwait","لبّاح الكويت",4,"grey","colt","Ajmal Talal","Lutfia Elkuwait","Koheilan Rodan","Ansata Sherrara",[]],
  ["Louz Elkuwait","لوز الكويت",3,"grey","filly","Ajmal Talal","Loubna Al Waab","Hadban Enzahi","Ansata Sherrara",[]],
  // MAY EXTRA (4)
  ["Majdah Elkuwait","ماجدة الكويت",14,"grey","mare","Ansata Sheikh Halim","May Elkuwait","Dahman Shahwan","Ansata Meryta",["melanoma","laminitis"]],
  ["Mashael Elkuwait","مشاعل الكويت",10,"grey","mare","Naseem Al Rashediah","May Elkuwait","Koheilan Rodan","Ansata Meryta",[]],
  ["Mohalabiah Elkuwait","محلبية الكويت",8,"grey","mare","Ajmal Ashhal","May Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Morooj Elkuwait","مروج الكويت",7,"grey","mare","Waseem Elkuwait","May Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  // MESK OFFSPRING (1)
  ["Malika Elkuwait","ملكة الكويت",12,"grey","mare","Ansata Sheikh Halim","Mesk Elkuwait","Dahman Shahwan","Ansata Meryta",["pigmentation_loss"]],
  // OTHER (3)
  ["Alhan Elkuwait","ألحان الكويت",6,"grey","mare","Naseem Al Rashediah","Amthal Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Amthal Colt","مُهر أمثال",1,"grey","colt","Ajmal Ashhal","Amthal Elkuwait","Saqlawi Jidran","Ansata White Nile",["guttural_pouch"]],
  ["Wed Elkuwait","ود الكويت",1,"grey","filly","Waseem Elkuwait","Wafeyah Elkuwait","Dahman Shahwan","Ansata Meryta",["guttural_pouch"]],
  // ADDITIONAL TO REACH 135 (16)
  ["Reem Elkuwait","ريم الكويت",2,"grey","filly","Naseem Al Rashediah","Maramie Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Haya Elkuwait","هيا الكويت",1,"grey","filly","Waseem Elkuwait","Amal Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Nouf Elkuwait","نوف الكويت",3,"grey","filly","Ajmal Talal","Madinah Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Dalal Elkuwait","دلال الكويت",5,"grey","mare","TM Rihan","Shams Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",["laminitis"]],
  ["Shurooq Elkuwait","شروق الكويت",4,"grey","filly","Ezz Al Rashediah","Sherifa Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Fajer Elkuwait","فجر الكويت",1,"chestnut","filly","Ajmal Al Kout","Maramie Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Ghada Elkuwait","غادة الكويت",1,"grey","filly","Ajmal Ashhal","Ghalia Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Noor Elkuwait","نور الكويت",2,"grey","filly","Naseem Al Rashediah","Abla Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Sana Elkuwait","سناء الكويت",6,"grey","mare","TM Rihan","Bint Wafaa Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Rawan Elkuwait","روان الكويت",3,"grey","filly","Waseem Elkuwait","Arwa Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Jouharah Elkuwait","جوهرة الكويت",1,"grey","filly","Ajmal Talal","Ghalia Elkuwait","Saqlawi Jidran","Ansata White Nile",[]],
  ["Samah Elkuwait","سماح الكويت",2,"grey","filly","Ajmal Al Kout","Maha Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Rand Elkuwait","رند الكويت",1,"grey","filly","Ezz Al Rashediah","Maramie Elkuwait","Koheilan Rodan","Latiefa",[]],
  ["Dina Elkuwait","دينا الكويت",2,"bay","filly","TM Rihan","Abla Elkuwait","Hadban Enzahi","Alimaar Abbeyyah",[]],
  ["Zeina Elkuwait","زينة الكويت",1,"chestnut","filly","Ajmal Ashhal","Wa'ad Elkuwait","Dahman Shahwan","Ansata Meryta",[]],
  ["Hayat Elkuwait","حياة الكويت",4,"grey","mare","Naseem Al Rashediah","Shams Elkuwait","Koheilan Rodan","Latiefa",["pigmentation_loss"]],
];

// Build Horse objects
const INITIAL_HORSES:Horse[] = RAW.map(r=>({
  id:mkId(), name:r[0], nameAr:r[1], age:r[2] as number,
  color:r[3] as Color, sex:r[4] as Sex, sire:r[5] as string,
  dam:r[6] as string, strain:r[7] as Strain, family:r[8] as Family,
  health:r[9] as Health[],
}));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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
const inp="w-full text-sm text-white placeholder-gray-600 focus:outline-none py-2.5 px-3.5 rounded-xl transition-colors";
const inpSt={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)"};
const Fld=({label,children}:{label:string;children:React.ReactNode})=>(
  <label className="block">
    <span className="text-[10px] font-black uppercase tracking-wider block mb-1.5" style={{color:"rgba(255,255,255,0.3)"}}>{label}</span>
    {children}
  </label>
);
function SrchBox({value,onChange,placeholder,isAr}:{value:string;onChange:(v:string)=>void;placeholder:string;isAr:boolean}){
  return(<div className="relative">
    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isAr?"right-3.5":"left-3.5"}`} style={{color:"rgba(255,255,255,0.25)"}}/>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className={`w-full text-sm text-white placeholder-gray-600 focus:outline-none py-2.5 rounded-xl transition-colors ${isAr?"pr-10 pl-9":"pl-10 pr-9"}`}
      style={inpSt} onFocus={e=>(e.target.style.borderColor=`${GOLD}45`)} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.09)")}/>
    {value&&<button onClick={()=>onChange("")} className={`absolute top-1/2 -translate-y-1/2 ${isAr?"left-3":"right-3"}`} style={{color:"rgba(255,255,255,0.3)"}}><X className="w-3.5 h-3.5"/></button>}
  </div>);
}

// ─── DISEASE TRACING DATA ─────────────────────────────────────────────────────
const DISEASE_TRACE=[
  {key:"epilepsy" as Health,
    srcAr:"ملاحظ في إنتاج: (Ajmal Ashhal) و (Ezz Al Rashediah).",
    srcEn:"Observed in offspring of: (Ajmal Ashhal) & (Ezz Al Rashediah).",sev:"critical"},
  {key:"laminitis" as Health,
    srcAr:"متكرر في خطوط: (Naseem Al Rashediah) و (Ansata Osiron).",
    srcEn:"Recurring in lines: (Naseem Al Rashediah) & (Ansata Osiron).",sev:"critical"},
  {key:"ovarian_tumor" as Health,
    srcAr:"لوحظت في إنتاج: (Ansata Sheikh Halim).",
    srcEn:"Observed in offspring of: (Ansata Sheikh Halim).",sev:"critical"},
  {key:"guttural_pouch" as Health,
    srcAr:"لوحظت في إنتاج: (Ajmal Al Kout) للأمهار الصغيرة.",
    srcEn:"Observed in offspring of: (Ajmal Al Kout) for young foals.",sev:"high"},
  {key:"melanoma" as Health,
    srcAr:"مرتبطة جينياً باللون الرمادي، تتركز في الخيل المؤسسة الأكبر سناً.",
    srcEn:"Genetically linked to grey coat color, concentrated in older foundation horses.",sev:"critical",
    analysisAr:"بمقاطعة بيانات الأنساب مع التركيبة العمرية، تتركز الحالات في الخيل المؤسسة والمنحدرين منها. السبب الطبي هو الارتباط الجيني الحتمي باللون الأزرق (طفرة جين STX17). مع تقدم عمر هذه الخيل وهيمنة اللون الأزرق، فإن الميلانوما تطور فسيولوجي طبيعي وغالباً حميد.",
    analysisEn:"Cross-referencing pedigree with age and color distribution reveals cases concentrated in foundation horses. The cause is inevitable genetic linkage to the Grey coat (STX17 mutation). With aging foundation stock and 93%+ grey prevalence, melanomas represent a natural, typically benign physiological progression."},
  {key:"pigmentation_loss" as Health,
    srcAr:"مرتبط بالعمر المتقدم ومتكرر مع الميلانوما.",
    srcEn:"Age-related, often co-occurring with melanomas.",sev:"high"},
  {key:"fertility" as Health,
    srcAr:"لوحظت في بعض الأفراس لدى سن متأخر.",
    srcEn:"Observed in some mares at advanced age.",sev:"medium"},
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GeneticsAnalyticsDashboard(){
  const[lang,setLang]=useState<"ar"|"en">("ar");
  const[mounted,setMounted]=useState(false);
  const[horses,setHorses]=useState<Horse[]>(INITIAL_HORSES);
  const[showTop,setShowTop]=useState(false);
  const[activeNav,setActiveNav]=useState("overview");
  const[openDis,setOpenDis]=useState<Set<number>>(new Set([4]));
  const[regQ,setRegQ]=useState("");
  const[regFilter,setRegFilter]=useState<"all"|"stallion"|"mare"|"young">("all");
  const[showModal,setShowModal]=useState(false);
  const[editH,setEditH]=useState<Horse|null>(null);
  const[delId,setDelId]=useState<string|null>(null);
  const[sibQ,setSibQ]=useState("");
  const[openProd,setOpenProd]=useState<Set<string>>(new Set());
  const{scrollY}=useScroll();
  const prog=useTransform(scrollY,[0,6000],["0%","100%"]);
  const emptyF=():Omit<Horse,"id">=>({name:"",nameAr:"",age:1,color:"grey",sex:"filly",sire:"",dam:"",strain:"Dahman Shahwan",family:"Ansata Meryta",health:[]});
  const[form,setForm]=useState<Omit<Horse,"id">>(emptyF());

  useEffect(()=>{setMounted(true);const s=localStorage.getItem("lang") as "ar"|"en"|null;if(s==="ar"||s==="en")setLang(s);},[]);
  useEffect(()=>{
    const fn=()=>{
      setShowTop(window.scrollY>500);
      const ids=["overview","genetics","health-age","diseases","registry","siblings","production"];
      for(const id of[...ids].reverse()){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<110){setActiveNav(id);break;}}
    };
    window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);
  },[]);
  const toggleLang=useCallback(()=>setLang(p=>{const n=p==="en"?"ar":"en";localStorage.setItem("lang",n);return n;}),[]);
  const goTo=useCallback((id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}),[]);
  const goTop=useCallback(()=>window.scrollTo({top:0,behavior:"smooth"}),[]);

  // COMPUTED STATS
  const S=useMemo(()=>{
    const tot=horses.length;
    const ages=AGE_BUCKETS.map(b=>horses.filter(h=>h.age>=b.min&&h.age<=b.max).length);
    const col:Record<Color,number>={grey:0,chestnut:0,bay:0,black:0};
    horses.forEach(h=>col[h.color]++);
    const str:Record<Strain,number>={} as any;
    STRAINS.forEach(s=>str[s]=horses.filter(h=>h.strain===s).length);
    const fam:Record<Family,number>={} as any;
    FAMILIES.forEach(f=>fam[f]=horses.filter(h=>h.family===f).length);
    const dis:Record<Health,number>={} as any;
    HKEYS.forEach(k=>dis[k]=horses.filter(h=>h.health.includes(k)).length);
    const sibMap:Record<string,Horse[]>={};
    horses.forEach(h=>{if(!h.sire||!h.dam)return;const k=`${h.sire}|||${h.dam}`;if(!sibMap[k])sibMap[k]=[];sibMap[k].push(h);});
    const sibs=Object.entries(sibMap).filter(([,v])=>v.length>=2).map(([k,v])=>({sire:k.split("|||")[0],dam:k.split("|||")[1],kids:v}));
    const sireMap:Record<string,Horse[]>={};
    horses.forEach(h=>{if(!h.sire)return;if(!sireMap[h.sire])sireMap[h.sire]=[];sireMap[h.sire].push(h);});
    const siresRanked=Object.entries(sireMap).filter(([,v])=>v.length>=2).map(([name,kids])=>({name,n:kids.length,kids})).sort((a,b)=>b.n-a.n);
    const damMap:Record<string,Horse[]>={};
    horses.forEach(h=>{if(!h.dam)return;if(!damMap[h.dam])damMap[h.dam]=[];damMap[h.dam].push(h);});
    const damsRanked=Object.entries(damMap).filter(([,v])=>v.length>=2).map(([name,kids])=>({name,n:kids.length,kids})).sort((a,b)=>b.n-a.n);
    return{tot,ages,col,str,fam,dis,sibs,siresRanked,damsRanked,prodMares:damsRanked.length};
  },[horses]);

  // HORSE CRUD
  const openAdd=()=>{setForm(emptyF());setEditH(null);setShowModal(true);};
  const openEdit=(h:Horse)=>{setForm({name:h.name,nameAr:h.nameAr,age:h.age,color:h.color,sex:h.sex,sire:h.sire,dam:h.dam,strain:h.strain,family:h.family,health:[...h.health]});setEditH(h);setShowModal(true);};
  const saveH=()=>{if(!form.name.trim())return;if(editH)setHorses(p=>p.map(h=>h.id===editH.id?{...form,id:h.id}:h));else setHorses(p=>[...p,{...form,id:mkId()}]);setShowModal(false);};
  const delH=(id:string)=>{setHorses(p=>p.filter(h=>h.id!==id));setDelId(null);};
  const togH=(k:Health)=>setForm(p=>({...p,health:p.health.includes(k)?p.health.filter(x=>x!==k):[...p.health,k]}));

  const displayed=useMemo(()=>{
    let h=[...horses];
    if(regFilter==="stallion")h=h.filter(x=>x.sex==="stallion");
    else if(regFilter==="mare")h=h.filter(x=>x.sex==="mare"||x.sex==="filly");
    else if(regFilter==="young")h=h.filter(x=>x.age<=2);
    if(regQ){const q=regQ.toLowerCase();h=h.filter(x=>x.name.toLowerCase().includes(q)||x.nameAr.includes(regQ)||x.sire.toLowerCase().includes(q)||x.dam.toLowerCase().includes(q));}
    return h;
  },[horses,regFilter,regQ]);

  const filtSibs=useMemo(()=>{const q=sibQ.toLowerCase();return S.sibs.filter(g=>!q||g.sire.toLowerCase().includes(q)||g.dam.toLowerCase().includes(q)||g.kids.some(k=>k.name.toLowerCase().includes(q)));},[ S.sibs,sibQ]);

  if(!mounted)return null;
  const tr=T[lang];const isAr=lang==="ar";const dir=isAr?"rtl":"ltr";

  const hL=(k:Health)=>({melanoma:tr.hMelanoma,laminitis:tr.hLaminitis,epilepsy:tr.hEpilepsy,pigmentation_loss:tr.hPig,fertility:tr.hFertility,guttural_pouch:tr.hGuttural,ovarian_tumor:tr.hOvarian})[k];
  const cL=(c:Color)=>({grey:tr.colGrey,chestnut:tr.colChestnut,bay:tr.colBay,black:tr.colBlack})[c];
  const sxL=(s:Sex)=>({stallion:tr.sexSt,mare:tr.sexMa,colt:tr.sexCo,filly:tr.sexFi})[s];
  const sevClr=(k:Health)=>["melanoma","epilepsy","laminitis","ovarian_tumor"].includes(k)?"#fb7185":k==="fertility"||k==="guttural_pouch"?"#f97316":"#facc15";
  const sevLbl=(s:string)=>s==="critical"?tr.critical:s==="high"?tr.high:tr.medium;

  const navItems=[
    {id:"overview",label:tr.navOverview},{id:"genetics",label:tr.navGenetics},
    {id:"health-age",label:tr.navHealth},{id:"diseases",label:tr.navDisease},
    {id:"registry",label:tr.navRegistry},{id:"siblings",label:tr.navSiblings},
    {id:"production",label:tr.navProd},
  ];

  return(<>
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
    <div dir={dir} style={{background:BG}} className="min-h-screen text-white pb-24 overflow-x-hidden">

      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
        <div className={`ob1 absolute ${isAr?"right-[-25%]":"left-[-25%]"} top-[-25%] w-[70vw] h-[70vw] rounded-full`} style={{background:"radial-gradient(circle,rgba(201,169,110,0.08) 0%,transparent 65%)"}}/>
        <div className={`ob2 absolute ${isAr?"left-[-25%]":"right-[-25%]"} bottom-[-25%] w-[65vw] h-[65vw] rounded-full`} style={{background:"radial-gradient(circle,rgba(79,142,247,0.07) 0%,transparent 65%)"}}/>
        <div className="absolute top-1/3 left-1/3 w-[40vw] h-[40vw] rounded-full" style={{background:"radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 65%)"}}/>
        <svg className="absolute inset-0 w-full h-full" style={{opacity:.022}} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gr" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0L0 0 0 56" fill="none" stroke="white" strokeWidth=".5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gr)"/>
        </svg>
      </div>

      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 h-[2px] z-[100] no-print origin-left" style={{width:prog,background:`linear-gradient(90deg,${GOLD},#fbbf24,${GOLD})`}}/>

      {/* Nav */}
      <nav className="fixed top-[2px] left-0 right-0 z-50 no-print">
        <div style={{background:"rgba(6,7,26,0.82)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div className="max-w-[1440px] mx-auto px-4 flex items-center h-[50px] gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{background:GOLD,boxShadow:`0 0 8px 2px ${GOLD}55`,animation:"pg 2s infinite"}}/>
            <div className="flex items-center gap-0.5 overflow-x-auto flex-1 pb-px" style={{scrollbarWidth:"none"}}>
              {navItems.map(item=>(
                <button key={item.id} onClick={()=>goTo(item.id)}
                  className="whitespace-nowrap px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                  style={activeNav===item.id?{background:`${GOLD}18`,color:GOLD}:{color:"rgba(255,255,255,0.35)"}}>
                  {item.label}
                </button>
              ))}
            </div>
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.45)"}}>
              <Globe className="w-3.5 h-3.5"/>{isAr?"EN":"AR"}
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll top btn */}
      <AnimatePresence>
        {showTop&&<motion.button onClick={goTop} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.7}}
          className={`fixed bottom-8 ${isAr?"left-8":"right-8"} z-50 w-11 h-11 rounded-2xl flex items-center justify-center no-print`}
          style={{background:GOLD,color:BG,boxShadow:`0 8px 30px ${GOLD}50`}}>
          <ChevronUp className="w-5 h-5"/>
        </motion.button>}
      </AnimatePresence>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-7 pt-[58px]">

        {/* ═══ OVERVIEW ═══ */}
        <section id="overview">
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.9}}
            className="py-12 md:py-16 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
              <div className="flex-1">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}
                  className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full"
                  style={{background:`${GOLD}12`,border:`1px solid ${GOLD}25`}}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{background:GOLD,animation:"pg 2s infinite"}}/>
                  <span className="text-[11px] font-black uppercase tracking-[.22em]" style={{color:GOLD}}>{tr.badge}</span>
                </motion.div>
                <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] mb-5 whitespace-pre-line"
                  style={{background:`linear-gradient(135deg,#fff 0%,${GOLD} 55%,rgba(255,255,255,.3) 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                  {tr.title}
                </h1>
                <p className="max-w-lg font-medium leading-relaxed" style={{color:"rgba(255,255,255,0.4)"}}>{tr.desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:w-[290px] shrink-0">
                {[
                  {icon:Activity,v:S.tot,label:tr.totHorses,hex:"#34d399",pct:100},
                  {icon:Dna,v:STRAINS.length,label:tr.strains,hex:GOLD,pct:50},
                  {icon:Baby,v:S.prodMares,label:tr.prod,hex:"#4f8ef7",pct:Math.round(S.prodMares/Math.max(S.tot,1)*100)},
                  {icon:Users,v:S.sibs.length,label:tr.sib,hex:"#a78bfa",pct:Math.round(S.sibs.length/Math.max(S.tot,1)*100)},
                ].map((c,i)=>(
                  <motion.div key={i} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:.3+i*.1}}>
                    <Cd accent={c.hex} className="p-4 hover:scale-[1.02] transition-transform">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`${c.hex}18`}}>
                          <c.icon className="w-[18px] h-[18px]" style={{color:c.hex}}/>
                        </div>
                        <Ring pct={c.pct} hex={c.hex} size={46} sw={4}/>
                      </div>
                      <div className="text-4xl font-black text-white mb-1"><Num v={c.v}/></div>
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{color:"rgba(255,255,255,0.3)"}}>{c.label}</div>
                    </Cd>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══ GENETICS ═══ */}
        <section id="genetics" className="py-12 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <SecHead n="01" icon={Dna} hex={GOLD} title={tr.secStrains}/>
          <Cd accent={GOLD} className="p-7 mb-6">
            <div className="flex flex-col xl:flex-row gap-8 items-center">
              <div className="shrink-0 flex flex-col items-center gap-5">
                <Donut items={STRAINS.map(s=>({name:s,pct:S.tot>0?(S.str[s]/S.tot)*100:0,hex:S_CLR[s]}))} size={200} thick={38}/>
                <div className="space-y-1.5">
                  {STRAINS.map((s,i)=>(
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background:S_CLR[s]}}/>
                      <span className="text-xs font-bold" style={{color:"rgba(255,255,255,0.45)"}}>{s}</span>
                      <span className="text-xs font-black text-white ml-auto pl-2">{S.str[s]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {STRAINS.map((s,i)=>{const pct=S.tot>0?(S.str[s]/S.tot)*100:0;return(
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm" style={{color:"rgba(255,255,255,0.75)"}}>{s}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">{pct.toFixed(1)}%</span>
                        <span className="text-sm font-black px-2.5 py-0.5 rounded-lg" style={{background:S_CLR[s],color:BG}}>{S.str[s]}</span>
                      </div>
                    </div>
                    <Bar pct={pct} hex={S_CLR[s]} delay={.3+i*.08} h="h-3"/>
                  </div>
                );})}
              </div>
            </div>
          </Cd>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Cd accent={GOLD} className="lg:col-span-2 p-7">
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-5 h-5" style={{color:GOLD}}/>
                <h3 className="text-xl font-black">{tr.secFam}</h3>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-5" style={{background:`${GOLD}09`,border:`1px solid ${GOLD}18`}}>
                <Award className="w-4 h-4 shrink-0 mt-0.5" style={{color:GOLD}}/>
                <p className="text-sm font-medium leading-relaxed" style={{color:"rgba(255,255,255,0.6)"}}><strong className="text-white">{tr.ansata}</strong> {tr.ansataDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FAMILIES.map((fam,i)=>{
                  const cnt=S.fam[fam]||0;const pct=S.tot>0?(cnt/S.tot*100):0;
                  return cnt>0?(<div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                    style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <div>
                      <div className="font-bold text-sm text-white mb-1">{fam}</div>
                      <Bar pct={pct} hex={GOLD} h="h-1" delay={i*.03}/>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-lg font-black" style={{color:GOLD}}>{pct.toFixed(1)}%</div>
                      <div className="text-[10px] font-bold" style={{color:"rgba(255,255,255,0.25)"}}>{cnt}</div>
                    </div>
                  </div>):null;
                })}
              </div>
            </Cd>
            <Cd className="p-7 flex flex-col gap-5">
              <div className="flex items-center gap-3"><Palette className="w-5 h-5" style={{color:GOLD}}/><h3 className="text-xl font-black">{tr.colorTitle}</h3></div>
              <div className="flex justify-center">
                <Donut items={(["grey","chestnut","bay","black"] as Color[]).filter(c=>S.col[c]>0).map(c=>({name:cL(c),pct:S.tot>0?(S.col[c]/S.tot)*100:0,hex:C_MAP[c]}))} size={168} thick={30}/>
              </div>
              <div className="space-y-3">
                {(["grey","chestnut","bay","black"] as Color[]).map((c,i)=>{
                  const cnt=S.col[c],pct=S.tot>0?(cnt/S.tot*100):0;
                  return(<div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:C_MAP[c]}}/><span className="text-sm font-bold" style={{color:"rgba(255,255,255,0.75)"}}>{cL(c)}</span></div>
                      <div className="flex items-center gap-2"><span className="font-black text-base text-white">{pct.toFixed(2)}%</span><span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{background:`${GOLD}18`,color:GOLD}}>{cnt}</span></div>
                    </div>
                    <Bar pct={pct} hex={C_MAP[c]} delay={i*.1} h="h-2"/>
                  </div>);
                })}
              </div>
            </Cd>
          </div>
        </section>

        {/* ═══ HEALTH & AGE ═══ */}
        <section id="health-age" className="py-12 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <SecHead n="02" icon={TrendingUp} hex="#4f8ef7" title={`${tr.secAge} · ${tr.secHealth}`}/>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <Cd accent="#4f8ef7" className="xl:col-span-3 p-7">
              <div className="flex items-center gap-3 mb-6"><TrendingUp className="w-5 h-5 text-blue-400"/><h3 className="text-xl font-black">{tr.secAge}</h3></div>
              <div className="space-y-4">
                {AGE_BUCKETS.map((b,i)=>{
                  const cnt=S.ages[i];const pct=S.tot>0?(cnt/S.tot)*100:0;
                  return(<div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:b.hex}}/><span className="font-bold text-sm" style={{color:"rgba(255,255,255,0.75)"}}>{tr.ageGroup[i]}</span></div>
                      <div className="flex items-center gap-3"><span className="text-lg font-black text-white">{pct.toFixed(1)}%</span><span className="text-xs font-black px-2.5 py-0.5 rounded-lg" style={{background:"rgba(255,255,255,0.1)",color:"white"}}>{cnt}</span></div>
                    </div>
                    <Bar pct={pct} hex={b.hex} delay={i*.07} h="h-2.5"/>
                  </div>);
                })}
              </div>
            </Cd>
            <Cd accent="#fb7185" className="xl:col-span-2 p-7">
              <div className="flex items-center gap-3 mb-5"><HeartPulse className="w-5 h-5 text-red-400"/><h3 className="text-xl font-black">{tr.secHealth}</h3></div>
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-5" style={{background:"rgba(251,113,133,0.07)",border:"1px solid rgba(251,113,133,0.15)"}}>
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/>
                <p className="text-xs font-medium leading-relaxed" style={{color:"rgba(255,200,200,0.8)"}}>{tr.healthNote}</p>
              </div>
              <div className="space-y-3">
                {HKEYS.map((k,i)=>{
                  const cnt=S.dis[k]||0;const hx=sevClr(k);
                  return cnt>0?(<div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold" style={{color:"rgba(255,255,255,0.75)"}}>{hL(k)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{background:`${hx}18`,color:hx,border:`1px solid ${hx}25`}}>
                          {sevLbl(DISEASE_TRACE.find(d=>d.key===k)?.sev||"medium")}
                        </span>
                        <span className="text-sm font-black text-white">{cnt}</span>
                      </div>
                    </div>
                    <Bar pct={(cnt/Math.max(...HKEYS.map(k2=>S.dis[k2]||0),1))*100} hex={hx} delay={.1+i*.07} h="h-1.5"/>
                  </div>):null;
                })}
              </div>
            </Cd>
          </div>
        </section>

        {/* ═══ DISEASES ═══ */}
        <section id="diseases" className="py-12 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <SecHead n="03" icon={ShieldAlert} hex="#fb7185" title={tr.secDisease} sub={tr.diseaseDesc}/>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DISEASE_TRACE.map((trace,i)=>{
              const cnt=S.dis[trace.key]||0;
              if(cnt===0)return null;
              const isOpen=openDis.has(i);
              const hx=sevClr(trace.key);
              const disNameAr=({melanoma:tr.hMelanoma,laminitis:tr.hLaminitis,epilepsy:tr.hEpilepsy,pigmentation_loss:tr.hPig,fertility:tr.hFertility,guttural_pouch:tr.hGuttural,ovarian_tumor:tr.hOvarian})[trace.key];
              return(<motion.div key={i} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}>
                <div className="rounded-[1.5rem] overflow-hidden cursor-pointer transition-all"
                  style={{border:`1px solid rgba(251,113,133,${isOpen?.25:.1})`,background:isOpen?"rgba(251,113,133,0.06)":"rgba(251,113,133,0.025)"}}
                  onClick={()=>setOpenDis(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n;})}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full mb-2 inline-block" style={{background:`${hx}18`,color:hx,border:`1px solid ${hx}25`}}>{sevLbl(trace.sev)}</span>
                        <h3 className="text-base font-black text-white">{isAr?disNameAr:hL(trace.key)}</h3>
                      </div>
                      <div className="text-center shrink-0"><div className="text-3xl font-black" style={{color:hx}}>{cnt}</div><div className="text-[10px] font-bold" style={{color:"rgba(255,255,255,0.25)"}}>{isAr?"حالة":"cases"}</div></div>
                    </div>
                    <Bar pct={(cnt/Math.max(S.dis.melanoma||1,1))*100} hex={hx} h="h-1"/>
                    <button className="mt-3 flex items-center gap-1.5 text-xs font-bold transition-colors" style={{color:`${hx}70`}}>
                      {isOpen?<EyeOff className="w-3 h-3"/>:<Eye className="w-3 h-3"/>}
                      {isOpen?tr.collapse:tr.expand}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isOpen?"rotate-180":""}`}/>
                    </button>
                  </div>
                  <AnimatePresence>
                    {isOpen&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.3}} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t pt-4" style={{borderColor:"rgba(251,113,133,0.1)"}}>
                        <p className="text-sm leading-[1.9] font-medium whitespace-pre-line mb-4" style={{color:"rgba(255,255,255,0.65)"}}>{isAr?trace.srcAr:trace.srcEn}</p>
                        {"analysisAr" in trace&&<div className="p-4 rounded-xl relative overflow-hidden" style={{background:"rgba(251,113,133,0.07)",border:"1px solid rgba(251,113,133,0.12)"}}>
                          <div className={`absolute top-0 ${isAr?"right-0":"left-0"} w-0.5 h-full`} style={{background:`linear-gradient(${hx},transparent)`}}/>
                          <div className="flex items-center gap-2 mb-2"><Zap className="w-3.5 h-3.5 text-red-400"/><span className="text-xs font-black text-red-300">{tr.causalTitle}</span></div>
                          <p className="text-xs leading-relaxed font-medium text-justify" style={{color:"rgba(255,255,255,0.65)"}}>
                            {isAr?(trace as any).analysisAr:(trace as any).analysisEn}
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

        {/* ═══ HORSE REGISTRY ═══ */}
        <section id="registry" className="py-12 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <SecHead n="04" icon={BarChart3} hex="#34d399" title={tr.secRegistry} sub={`${S.tot} ${isAr?"جواد مسجل":"horses registered"}`}/>
            <div className="flex gap-2 flex-wrap shrink-0 no-print" style={{marginTop:"-24px"}}>
              <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all"
                style={{border:`1px solid ${GOLD}30`,background:`${GOLD}09`,color:GOLD}}>
                <Download className="w-3.5 h-3.5"/>{tr.export}
              </button>
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                style={{background:GOLD,color:BG}}>
                <Plus className="w-3.5 h-3.5"/>{tr.addHorse}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1"><SrchBox value={regQ} onChange={setRegQ} placeholder={tr.searchHorse} isAr={isAr}/></div>
            <div className="flex gap-1.5">
              {([["all",tr.all],["stallion",tr.stallions],["mare",tr.mares],["young",tr.youngsters]] as [typeof regFilter,string][]).map(([f,label])=>(
                <button key={f} onClick={()=>setRegFilter(f)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={regFilter===f?{background:`${GOLD}18`,color:GOLD,border:`1px solid ${GOLD}30`}:{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs mb-4" style={{color:"rgba(255,255,255,0.25)"}}>{tr.totalShown} {displayed.length} {tr.of} {S.tot} {tr.records}</p>
          {displayed.length===0?<div className="py-16 text-center font-bold" style={{color:"rgba(255,255,255,0.2)"}}>{tr.noHorses}</div>
          :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {displayed.map((h,idx)=>(
                <motion.div key={h.id} layout initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} transition={{duration:.2,delay:idx*.012}}>
                  <div className="rounded-[1.5rem] p-4 transition-all relative overflow-hidden h-full flex flex-col"
                    style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}
                    onMouseEnter={e=>(e.currentTarget.style.borderColor=`${GOLD}30`)}
                    onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)")}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{background:C_MAP[h.color]}}/>
                        <span className="text-[10px] font-black uppercase" style={{color:h.sex==="stallion"||h.sex==="colt"?"#60a5fa":"#f9a8d4"}}>{sxL(h.sex)}</span>
                      </div>
                      <span className="text-[10px] font-black" style={{color:"rgba(255,255,255,0.2)"}}>{h.age}y</span>
                    </div>
                    <div className="font-black text-sm text-white mb-0.5 leading-snug">{regQ?mk(h.name,regQ):h.name}</div>
                    <div className="text-xs font-bold mb-2" dir="rtl" style={{color:"rgba(255,255,255,0.35)"}}>{regQ?mk(h.nameAr,regQ):h.nameAr}</div>
                    <div className="text-[10px] font-bold mb-2 space-y-0.5" style={{color:"rgba(255,255,255,0.25)"}}>
                      <div>{h.strain.split(" ")[0]}</div>
                      <div className="truncate opacity-70">{h.family}</div>
                    </div>
                    {h.health.length>0&&<div className="flex flex-wrap gap-1 mb-2">
                      {h.health.map((hk,i)=><span key={i} className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{background:`${sevClr(hk)}15`,color:sevClr(hk)}}>{hL(hk)}</span>)}
                    </div>}
                    <div className="flex gap-1.5 mt-auto pt-2">
                      <button onClick={()=>openEdit(h)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-black transition-all"
                        style={{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)"}}>
                        <Edit2 className="w-3 h-3"/>{tr.editHorse}
                      </button>
                      <button onClick={()=>setDelId(h.id)} className="px-2.5 py-1.5 rounded-xl" style={{background:"rgba(251,113,133,0.08)",color:"#fb7185"}}>
                        <Trash2 className="w-3 h-3"/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>}
        </section>

        {/* ═══ SIBLINGS ═══ */}
        <section id="siblings" className="py-12 border-b" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <SecHead n="05" icon={Users} hex="#a78bfa" title={tr.secSib} sub={tr.sibDesc}/>
            <div className="max-w-xs w-full shrink-0 no-print" style={{marginTop:"-24px"}}><SrchBox value={sibQ} onChange={setSibQ} placeholder={tr.search} isAr={isAr}/></div>
          </div>
          <p className="text-xs mb-4" style={{color:"rgba(255,255,255,0.25)"}}>{tr.showing} {filtSibs.length} {tr.of} {S.sibs.length} {tr.groups}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {filtSibs.length===0?<div className="col-span-4 py-10 text-center font-bold" style={{color:"rgba(255,255,255,0.2)"}}>{tr.noResults}</div>
              :filtSibs.map((g,idx)=>(
                <motion.div key={`${g.sire}-${g.dam}`} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{delay:idx*.03}}>
                  <div className="rounded-[1.5rem] p-4 h-full flex flex-col transition-all"
                    style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(167,139,250,0.1)"}}
                    onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(167,139,250,0.28)")}
                    onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(167,139,250,0.1)")}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{background:"rgba(167,139,250,0.1)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.2)"}}>#{S.sibs.indexOf(g)+1}</span>
                      <span className="text-[9px] font-black" style={{color:"rgba(167,139,250,0.5)"}}>{g.kids.length} {tr.thOffspring}</span>
                    </div>
                    <div className="space-y-2 mb-3 flex-1">
                      <div><div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{color:"rgba(255,255,255,0.2)"}}>{tr.thSire}</div>
                        <div className="font-black text-sm text-blue-300">{sibQ?mk(g.sire,sibQ):g.sire}</div></div>
                      <div className="h-px" style={{background:"linear-gradient(90deg,rgba(96,165,250,0.15),rgba(167,139,250,0.15),rgba(249,168,212,0.15))"}}/>
                      <div><div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{color:"rgba(255,255,255,0.2)"}}>{tr.thDam}</div>
                        <div className="font-black text-sm text-pink-300">{sibQ?mk(g.dam,sibQ):g.dam}</div></div>
                    </div>
                    <div className="pt-3 border-t flex flex-wrap gap-1" style={{borderColor:"rgba(255,255,255,0.05)"}}>
                      {g.kids.map((k,i)=><span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded-lg" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.5)"}}>
                        {sibQ?mk(k.name,sibQ):k.name}
                      </span>)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ PRODUCTION ═══ */}
        <section id="production" className="py-12">
          <SecHead n="06" icon={Layers} hex="#fbbf24" title={tr.secProd}/>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProdCard rows={S.siresRanked} title={tr.siresTitle} icon={Award} hex="#4f8ef7" lang={lang} open={openProd} setOpen={setOpenProd} prefix="s"/>
            <ProdCard rows={S.damsRanked} title={tr.damsTitle} icon={Baby} hex="#ec4899" lang={lang} open={openProd} setOpen={setOpenProd} prefix="d"/>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 flex flex-col sm:flex-row justify-between items-center gap-5 border-t" style={{borderColor:"rgba(255,255,255,0.05)"}}>
          {[{label:tr.footerIdea,name:"ناصر الغيث",hex:GOLD},{label:tr.footerDev,name:"أحمد الصالح",hex:"#4f8ef7"}].map((f,i)=>(
            <Cd key={i} accent={f.hex} className="px-7 py-5 flex items-center gap-4 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{background:`${f.hex}15`,border:`1px solid ${f.hex}20`}}>
                {i===0?<Star className="w-5 h-5" style={{color:f.hex}}/>:<Globe className="w-5 h-5" style={{color:f.hex}}/>}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{color:"rgba(255,255,255,0.22)"}}>{f.label}</div>
                <div className="text-xl font-black text-white">{f.name}</div>
              </div>
            </Cd>
          ))}
        </footer>
      </div>

      {/* ═══ ADD/EDIT MODAL ═══ */}
      <AnimatePresence>
        {showModal&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.85)",backdropFilter:"blur(14px)"}}>
          <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.9,opacity:0}}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-7"
            style={{background:"#0B0C20",border:`1px solid ${GOLD}28`}}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black" style={{color:GOLD}}>{editH?tr.editHorse:tr.addHorse}</h3>
              <button onClick={()=>setShowModal(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><X className="w-5 h-5" style={{color:"rgba(255,255,255,0.4)"}}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Fld label={tr.nameLbl}><input className={inp} style={inpSt} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Marwan Elkuwait"/></Fld>
              <Fld label={tr.nameArLbl}><input className={inp} style={inpSt} value={form.nameAr} onChange={e=>setForm(p=>({...p,nameAr:e.target.value}))} dir="rtl" placeholder="مروان الكويت"/></Fld>
              <Fld label={tr.ageLbl}><input type="number" min={1} max={40} className={inp} style={inpSt} value={form.age} onChange={e=>setForm(p=>({...p,age:+e.target.value}))}/></Fld>
              <Fld label={tr.sexLbl}><select className={inp} style={inpSt} value={form.sex} onChange={e=>setForm(p=>({...p,sex:e.target.value as Sex}))}>
                {(["stallion","mare","colt","filly"] as Sex[]).map(s=><option key={s} value={s}>{s}</option>)}
              </select></Fld>
              <Fld label={tr.colorLbl}><select className={inp} style={inpSt} value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value as Color}))}>
                {(["grey","chestnut","bay","black"] as Color[]).map(c=><option key={c} value={c}>{c}</option>)}
              </select></Fld>
              <Fld label={tr.strainLbl}><select className={inp} style={inpSt} value={form.strain} onChange={e=>setForm(p=>({...p,strain:e.target.value as Strain}))}>
                {STRAINS.map(s=><option key={s} value={s}>{s}</option>)}
              </select></Fld>
              <Fld label={tr.sireLbl}><input className={inp} style={inpSt} value={form.sire} onChange={e=>setForm(p=>({...p,sire:e.target.value}))} placeholder="e.g. Marwan Elkuwait"/></Fld>
              <Fld label={tr.damLbl}><input className={inp} style={inpSt} value={form.dam} onChange={e=>setForm(p=>({...p,dam:e.target.value}))} placeholder="e.g. Arwa Elkuwait"/></Fld>
              <div className="sm:col-span-2"><Fld label={tr.familyLbl}><select className={inp} style={inpSt} value={form.family} onChange={e=>setForm(p=>({...p,family:e.target.value as Family}))}>
                {FAMILIES.map(f=><option key={f} value={f}>{f}</option>)}
              </select></Fld></div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider block mb-2" style={{color:"rgba(255,255,255,0.3)"}}>{tr.healthLbl}</span>
                <div className="flex flex-wrap gap-2">
                  {HKEYS.map(k=>{const active=form.health.includes(k);const hx=sevClr(k);return(
                    <button key={k} onClick={()=>togH(k)} className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                      style={active?{background:`${hx}22`,color:hx,border:`1px solid ${hx}35`}:{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>
                      {active&&<Check className="w-3 h-3 inline mr-1"/>}{hL(k)}
                    </button>);
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={saveH} className="flex-1 py-3 rounded-2xl font-black text-sm" style={{background:GOLD,color:BG}}><Check className="w-4 h-4 inline mr-1.5"/>{tr.save}</button>
              <button onClick={()=>setShowModal(false)} className="px-6 py-3 rounded-2xl font-black text-sm" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)"}}>{tr.cancel}</button>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      {/* ═══ DELETE CONFIRM ═══ */}
      <AnimatePresence>
        {delId&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.85)",backdropFilter:"blur(14px)"}}>
          <motion.div initial={{scale:.9}} animate={{scale:1}} exit={{scale:.9}}
            className="rounded-[1.5rem] p-7 w-full max-w-sm text-center" style={{background:"#0B0C20",border:"1px solid rgba(251,113,133,0.28)"}}>
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:"rgba(251,113,133,0.15)"}}>
              <Trash2 className="w-7 h-7 text-red-400"/>
            </div>
            <p className="font-black text-white text-lg mb-1">{tr.confirmDelete}</p>
            <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.35)"}}>{horses.find(h=>h.id===delId)?.name}</p>
            <div className="flex gap-3">
              <button onClick={()=>delH(delId!)} className="flex-1 py-2.5 rounded-2xl font-black text-sm" style={{background:"#fb7185",color:"white"}}>{tr.deleteHorse}</button>
              <button onClick={()=>setDelId(null)} className="flex-1 py-2.5 rounded-2xl font-black text-sm" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)"}}>{tr.cancel}</button>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

    </div>
  </>);
}

// ─── PRODUCTION TABLE COMPONENT ───────────────────────────────────────────────
function ProdCard({rows,title,icon:Icon,hex,lang,open,setOpen,prefix}:{
  rows:{name:string;n:number;kids:Horse[]}[];title:string;icon:React.ElementType;hex:string;
  lang:"ar"|"en";open:Set<string>;setOpen:React.Dispatch<React.SetStateAction<Set<string>>>;prefix:string;
}){
  const tr=T[lang];const isAr=lang==="ar";
  const[q,setQ]=useState("");
  const[sort,setSort]=useState<"asc"|"desc"|null>("desc");
  const max=rows[0]?.n||1;
  const medal=(i:number)=>i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
  const toggle=(k:string)=>setOpen(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});
  const filtered=useMemo(()=>{
    let r=rows.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())||x.kids.some(k=>k.name.toLowerCase().includes(q.toLowerCase())));
    if(sort==="asc")r=[...r].sort((a,b)=>a.n-b.n);
    if(sort==="desc")r=[...r].sort((a,b)=>b.n-a.n);
    return r;
  },[rows,q,sort]);
  return(<div className="rounded-[2rem] p-6" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
    <div className="relative top-0 left-0 right-0 h-px mb-1" style={{background:`linear-gradient(90deg,transparent,${hex}40,transparent)`}}/>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`${hex}15`}}>
        <Icon className="w-[18px] h-[18px]" style={{color:hex}}/>
      </div>
      <h3 className="text-lg font-black">{title}</h3>
    </div>
    <div className="flex gap-2 mb-3">
      <div className="flex-1"><SrchBox value={q} onChange={setQ} placeholder={tr.search} isAr={isAr}/></div>
      <button onClick={()=>setSort(s=>s===null?"desc":s==="desc"?"asc":null)}
        className="px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        style={sort?{background:`${hex}15`,color:hex,border:`1px solid ${hex}25`}:{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.07)"}}>
        {sort==="asc"?<SortAsc className="w-4 h-4"/>:sort==="desc"?<SortDesc className="w-4 h-4"/>:<ArrowUpDown className="w-4 h-4"/>}
      </button>
    </div>
    <p className="text-xs mb-3" style={{color:"rgba(255,255,255,0.2)"}}>{tr.showing} {filtered.length} {tr.of} {rows.length}</p>
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      <AnimatePresence>
        {filtered.length===0?<div className="py-8 text-center text-sm font-bold" style={{color:"rgba(255,255,255,0.2)"}}>{tr.noResults}</div>
        :filtered.map((row,i)=>{
          const k=`${prefix}-${row.name}`;const isOpen=open.has(k);const origIdx=rows.indexOf(row);
          return(<motion.div key={row.name} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{delay:i*.02}}>
            <div className="rounded-2xl overflow-hidden cursor-pointer transition-all" onClick={()=>toggle(k)}
              style={{border:`1px solid ${isOpen?`${hex}25`:"rgba(255,255,255,0.06)"}`,background:isOpen?`${hex}08`:"rgba(255,255,255,0.02)"}}>
              <div className="px-4 py-3 flex items-center gap-3">
                <span className="text-base font-black w-8 text-center shrink-0">{medal(origIdx)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white truncate">{row.name}</span>
                    <span className="text-sm font-black shrink-0 ml-2" style={{color:hex}}>{row.n}</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
                    <motion.div className="h-full rounded-full" style={{background:hex}}
                      initial={{width:0}} whileInView={{width:`${(row.n/max)*100}%`}} viewport={{once:true}} transition={{duration:1,ease:"easeOut",delay:.1+i*.04}}/>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen?"rotate-180":""}`} style={{color:"rgba(255,255,255,0.3)"}}/>
              </div>
              <AnimatePresence>
                {isOpen&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}} className="overflow-hidden">
                  <div className="px-4 pb-3 border-t pt-3 flex flex-wrap gap-1.5" style={{borderColor:"rgba(255,255,255,0.05)"}}>
                    {row.kids.map((h,ki)=><span key={ki} className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.45)"}}>{h.name}</span>)}
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
