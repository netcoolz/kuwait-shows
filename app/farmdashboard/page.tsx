"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, LogOut, Settings, Pencil, Trash2, Save, X, Upload, Download, FileSpreadsheet, Search,
  Activity, Users, Baby, HeartPulse, Package, Wallet, CalendarClock, Syringe, Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

// ─── CONSTANTS & THEME ───────────────────────────────────────────────────────
const GOLD = "#D4AF37"; // ذهبي فاخر وأكثر سطوعاً
const BG_DARK = "#0B101E"; // لون أزرق ليلي عميق ومريح للعين
const TEXT_MUTED = "#94A3B8"; // لون رمادي فاتح واضح للنصوص الثانوية
const TEXT_LIGHT = "#F8FAFC"; // أبيض ساطع للنصوص الأساسية
const CARD_BG = "rgba(30, 41, 59, 0.4)"; // خلفية كروت أكثر وضوحاً
const BORDER_COLOR = "rgba(255, 255, 255, 0.12)"; // حدود أوضح

const HORSE_COLORS = ["Grey", "Bay", "Chestnut", "Black"];
const HORSE_GENDERS = ["Male", "Female"];
const HEALTH_OPTIONS = ["Melanomas", "Laminitis", "Fertility problems", "Pigmentation loss", "Epilepsy", "Ovarian tumor", "Guttural pouch tympany", "Other"];
const DEFAULT_STRAINS = ["Dahman Shahwan", "Koheilan Rodan", "Saqlawi Jidran", "Obeyan Om Jreis", "Hadban Enzahi"];
const DEFAULT_FAMILIES = ["Ansata Meryta", "Latiefa", "Ansata White Nile", "Alimaar Abbeyyah", "Ansata Sherrara", "Authentic Nabeelah", "Ghazala Al Rayyan", "Bilqis EV", "Haifaa Al Waab", "El Thay Maniha", "NK Lubna", "Loubna Al Waab", "Rababa Al Rayyan"];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function formatExcelDate(dateValue: any): string | null {
  if (!dateValue) return null;
  if (typeof dateValue === 'number') {
    const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    return date.toISOString().split('T')[0];
  }
  if (dateValue instanceof Date) return dateValue.toISOString().split('T')[0];
  if (typeof dateValue === 'string') {
    if (!isNaN(Number(dateValue)) && Number(dateValue) > 10000) {
      const date = new Date(Math.round((Number(dateValue) - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0];
    }
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
    return dateValue;
  }
  return null;
}

function calculateAge(dateValue: any) {
  if (!dateValue) return 0;
  let birth: Date;
  if (typeof dateValue === 'string' && !isNaN(Number(dateValue)) && Number(dateValue) > 10000) {
    birth = new Date(Math.round((Number(dateValue) - 25569) * 86400 * 1000));
  } else if (typeof dateValue === 'number') {
    birth = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
  } else {
    birth = new Date(dateValue);
  }
  if (isNaN(birth.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

function getHorseType(gender: string, birthDate: any) {
  const age = calculateAge(birthDate);
  if (!gender) return age <= 3 ? "Filly" : "Mare";
  const g = String(gender).toLowerCase().trim();
  if (g === "male" || g === "m" || g.includes("stallion") || g.includes("colt")) {
    return age <= 3 ? "Colt" : "Stallion";
  }
  return age <= 3 ? "Filly" : "Mare";
}

function normalizeStrain(strain: string) { return strain ? strain.trim() : ""; }
function normalizeFamily(family: string) { return family ? family.trim() : ""; }

export default function FarmDashboard() {
  const router = useRouter();
  const [farm, setFarm] = useState<any>(null);
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("horses");
  
  // States for Modals
  const [showAddHorse, setShowAddHorse] = useState(false);
  const [editingHorseId, setEditingHorseId] = useState<string | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [importingExcel, setImportingExcel] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("ar");

  const [horseForm, setHorseForm] = useState({
    name: "", nameAr: "", image: "", birthDate: "", color: "", gender: "", sire: "", dam: "",
    strain: "", family: "", health: "", otherHealth: "", breeder: "", country: "", achievements: "", notes: "",
  });

  const [farmForm, setFarmForm] = useState({
    display_name: "", country: "", instagram: "", website: "", bio: "", logo: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("farm");
    if (!saved) { router.push("/farmlogin"); return; }
    const parsed = JSON.parse(saved);
    loadFarm(parsed.id);
    loadHorses(parsed.id);
  }, []);

  async function loadFarm(id: string) {
    const { data } = await supabase.from("farms").select("*").eq("id", id).single();
    if (data) {
      setFarm(data);
      setFarmForm({
        display_name: data.display_name || "", country: data.country || "", instagram: data.instagram || "",
        website: data.website || "", bio: data.bio || "", logo: data.logo || "",
      });
    }
    setLoading(false);
  }

  async function loadHorses(id: string) {
    const { data } = await supabase.from("horses").select("*").eq("farm_id", id).order("created_at", { ascending: false });
    if (data) setHorses(data);
  }

  async function uploadHorseImage(file: any) {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `horse-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("horse-images").upload(fileName, file);
    if (error) { alert(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("horse-images").getPublicUrl(fileName);
    setHorseForm({ ...horseForm, image: data.publicUrl });
    setUploading(false);
  }

  async function uploadFarmLogo(file: any) {
    if (!file) return;
    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const fileName = `farm-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("farm-logos").upload(fileName, file);
    if (error) { alert(error.message); setUploadingLogo(false); return; }
    const { data } = supabase.storage.from("farm-logos").getPublicUrl(fileName);
    setFarmForm({ ...farmForm, logo: data.publicUrl });
    setUploadingLogo(false);
  }

  function openAddModal() {
    setEditingHorseId(null);
    setHorseForm({ name: "", nameAr: "", image: "", birthDate: "", color: "", gender: "", sire: "", dam: "", strain: "", family: "", health: "", otherHealth: "", breeder: "", country: "", achievements: "", notes: "" });
    setShowAddHorse(true);
  }

  function openEditModal(horse: any) {
    setEditingHorseId(horse.id);
    let healthVal = "";
    let otherHealthVal = "";
    if (horse.health && horse.health.length > 0) {
      if (HEALTH_OPTIONS.includes(horse.health[0])) { healthVal = horse.health[0]; } 
      else { healthVal = "Other"; otherHealthVal = horse.health[0]; }
    }

    setHorseForm({
      name: horse.name || "", nameAr: horse.name_ar || "", image: horse.image || "",
      birthDate: horse.birth_date ? new Date(horse.birth_date).toISOString().split('T')[0] : "",
      color: horse.color || "", gender: horse.gender || "", sire: horse.sire || "", dam: horse.dam || "",
      strain: horse.strain || "", family: horse.family || "", health: healthVal, otherHealth: otherHealthVal,
      breeder: horse.breeder || "", country: horse.country || "", achievements: horse.achievements || "", notes: horse.notes || ""
    });
    setShowAddHorse(true);
  }

  async function saveHorse() {
    if (!horseForm.name) { alert(language === "ar" ? "اسم الجواد مطلوب" : "Horse name required"); return; }
    const healthValue = horseForm.health === "Other" ? horseForm.otherHealth : horseForm.health;
    const horseType = getHorseType(horseForm.gender, horseForm.birthDate);
    const finalStrain = normalizeStrain(horseForm.strain);
    const finalFamily = normalizeFamily(horseForm.family);

    const horseData = {
      farm_id: farm.id, name: horseForm.name, name_ar: horseForm.nameAr, image: horseForm.image,
      birth_date: horseForm.birthDate, color: horseForm.color, gender: horseForm.gender, sex: horseType,
      sire: horseForm.sire, dam: horseForm.dam, strain: finalStrain, family: finalFamily,
      breeder: horseForm.breeder, country: horseForm.country, achievements: horseForm.achievements,
      notes: horseForm.notes, health: healthValue ? [healthValue] : []
    };

    setLoading(true);
    if (editingHorseId) {
      const { error } = await supabase.from("horses").update(horseData).eq("id", editingHorseId);
      if (error) { alert(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.from("horses").insert([horseData]);
      if (error) { alert(error.message); setLoading(false); return; }
    }

    setShowAddHorse(false);
    setEditingHorseId(null);
    setHorseForm({ name: "", nameAr: "", image: "", birthDate: "", color: "", gender: "", sire: "", dam: "", strain: "", family: "", health: "", otherHealth: "", breeder: "", country: "", achievements: "", notes: "" });
    loadHorses(farm.id);
    setLoading(false);
  }

  async function saveFarmSettings() {
    const { error } = await supabase.from("farms").update({
      display_name: farmForm.display_name, country: farmForm.country, instagram: farmForm.instagram,
      website: farmForm.website, bio: farmForm.bio, logo: farmForm.logo,
    }).eq("id", farm.id);
    if (error) { alert(error.message); return; }
    alert(language === "ar" ? "تم تحديث إعدادات المزرعة" : "Farm updated");
    setShowSettings(false);
    loadFarm(farm.id);
  }

  async function deleteHorse(id: string) {
    if (!confirm(language === "ar" ? "هل تريد بالتأكيد مسح هذا الجواد؟" : "Delete horse?")) return;
    await supabase.from("horses").delete().eq("id", id);
    loadHorses(farm.id);
  }

  async function deleteAllHorses() {
    const msg = language === "ar" ? "⚠️ تحذير: سيتم مسح جميع بيانات الخيل! هل أنت متأكد؟" : "⚠️ Warning: Delete ALL horses?";
    if (!confirm(msg)) return;
    setLoading(true);
    const { error } = await supabase.from("horses").delete().eq("farm_id", farm.id);
    if (error) { alert(error.message); setLoading(false); return; }
    alert(language === "ar" ? "تم مسح جميع الخيل بنجاح!" : "All horses deleted!");
    loadHorses(farm.id);
    setLoading(false);
  }

  async function importExcel(file: any) {
    if (!file || !farm) return;
    try {
      setImportingExcel(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      if (json.length === 0) { alert(language === "ar" ? "ملف الإكسل فارغ" : "Excel file is empty"); setImportingExcel(false); return; }

      const horsesToInsert = json.map((row: any) => {
        const formattedDate = formatExcelDate(row.birth_date || row.BirthDate || null);
        return {
          farm_id: farm.id, name: row.name || row.Name || "", name_ar: row.name_ar || row.NameArabic || "",
          image: row.image || "", birth_date: formattedDate, color: row.color || row.Color || "",
          gender: row.gender || row.Gender || "", sex: getHorseType(row.gender || row.Gender || "", formattedDate || ""),
          sire: row.sire || row.Sire || "", dam: row.dam || row.Dam || "", 
          strain: normalizeStrain(row.strain || row.Strain), family: normalizeFamily(row.family || row.Family), 
          breeder: row.breeder || row.Breeder || "", country: row.country || row.Country || "",
          achievements: row.achievements || row.Achievements || "", notes: row.notes || row.Notes || "",
          health: row.health ? [row.health] : row.Health ? [row.Health] : []
        };
      });

      const { error } = await supabase.from("horses").insert(horsesToInsert);
      if (error) { alert(error.message); setImportingExcel(false); return; }
      alert(language === "ar" ? `تم استيراد ${horsesToInsert.length} جواد بنجاح` : `Imported ${horsesToInsert.length} horses`);
      loadHorses(farm.id);
      setImportingExcel(false);
    } catch (err: any) {
      alert(language === "ar" ? "فشل استيراد الملف" : "Failed to import excel file");
      setImportingExcel(false);
    }
  }

  function exportExcel() {
    try {
      setExportingExcel(true);
      const rows = horses.map((horse) => ({
        name: horse.name, name_ar: horse.name_ar, birth_date: horse.birth_date, age: calculateAge(horse.birth_date),
        color: horse.color, gender: horse.gender, type: getHorseType(horse.gender, horse.birth_date),
        sire: horse.sire, dam: horse.dam, strain: horse.strain, family: horse.family, breeder: horse.breeder,
        country: horse.country, health: horse.health?.join(", ") || "", achievements: horse.achievements,
        notes: horse.notes, image: horse.image
      }));
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Horses");
      XLSX.writeFile(workbook, `${farm?.display_name || "farm"}-horses.xlsx`);
      setExportingExcel(false);
    } catch (err) {
      alert(language === "ar" ? "فشل التصدير" : "Export failed");
      setExportingExcel(false);
    }
  }

  function logout() {
    localStorage.removeItem("farm");
    router.push("/farmlogin");
  }

  // ─── SMART DATA EXTRACTORS ──────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: horses.length,
    stallions: horses.filter(x => getHorseType(x.gender, x.birth_date) === "Stallion").length,
    mares: horses.filter(x => getHorseType(x.gender, x.birth_date) === "Mare").length,
    foals: horses.filter(x => calculateAge(x.birth_date) <= 3).length,
  }), [horses]);

  const filteredHorses = useMemo(() => {
    if (!searchQuery) return horses;
    const q = searchQuery.toLowerCase();
    return horses.filter(h => 
      h.name?.toLowerCase().includes(q) || h.name_ar?.includes(q) || h.sire?.toLowerCase().includes(q) || h.dam?.toLowerCase().includes(q)
    );
  }, [horses, searchQuery]);

  const smartStrainsList = useMemo(() => {
    const set = new Set(DEFAULT_STRAINS);
    horses.forEach(h => { if (h.strain) set.add(h.strain); });
    return Array.from(set);
  }, [horses]);

  const smartFamiliesList = useMemo(() => {
    const set = new Set(DEFAULT_FAMILIES);
    horses.forEach(h => { if (h.family) set.add(h.family); });
    return Array.from(set);
  }, [horses]);

  const TABS = [
    { id: "overview", label: language === "ar" ? "نظرة عامة" : "Overview", icon: Activity },
    { id: "horses", label: language === "ar" ? "قطيع الخيل" : "My Herd", icon: Users },
    { id: "breeding", label: language === "ar" ? "التشبية والإنتاج" : "Breeding", icon: Baby },
    { id: "medical", label: language === "ar" ? "العيادة" : "Medical", icon: HeartPulse },
    { id: "inventory", label: language === "ar" ? "المستودع" : "Inventory", icon: Package },
    { id: "finance", label: language === "ar" ? "المالية" : "Finance", icon: Wallet },
  ];

  if (loading && horses.length === 0 && !farm) {
    return (
      <div style={{ minHeight: "100vh", background: BG_DARK, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: "bold", fontSize: "18px", letterSpacing: "2px" }}>
        LOADING DASHBOARD...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG_DARK, color: TEXT_LIGHT, fontFamily: "'Inter', 'Cairo', sans-serif" }} dir={language === "ar" ? "rtl" : "ltr"}>
      
      {/* ─── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <div style={{ width: "260px", position: "fixed", top: 0, left: language === "ar" ? "auto" : 0, right: language === "ar" ? 0 : "auto", bottom: 0, background: "#111827", borderRight: language === "ar" ? "none" : `1px solid ${BORDER_COLOR}`, borderLeft: language === "ar" ? `1px solid ${BORDER_COLOR}` : "none", padding: "30px 20px", zIndex: 100, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img src={farm?.logo || "https://placehold.co/200x200/png"} alt="Farm Logo" style={{ width: "110px", height: "110px", borderRadius: "999px", objectFit: "cover", marginBottom: "15px", border: `3px solid ${GOLD}`, padding: "4px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: TEXT_LIGHT }}>{farm?.display_name || farm?.farm_name}</h2>
          <div style={{ color: TEXT_MUTED, fontSize: "12px", marginTop: "5px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>{farm?.country || "Kuwait"}</div>
        </div>

        <button onClick={openAddModal} style={{...sidebarBtn, background: "rgba(212, 175, 55, 0.15)", border: `1px solid rgba(212, 175, 55, 0.3)`, color: GOLD}}><Plus size={18} /> {language === "ar" ? "إضافة جواد جديد" : "Add New Horse"}</button>
        <button onClick={() => router.push("/analytics")} style={{ ...sidebarBtn }}><Activity size={18} /> {language === "ar" ? "شاشة التحليلات" : "Analytics"}</button>
        <button onClick={() => setShowSettings(true)} style={sidebarBtn}><Settings size={18} /> {language === "ar" ? "إعدادات المزرعة" : "Farm Settings"}</button>

        <label style={{ ...sidebarBtn, cursor: "pointer", marginTop: "20px" }}>
          <FileSpreadsheet size={18} style={{color: "#60a5fa"}} /> {importingExcel ? (language === "ar" ? "جاري الاستيراد..." : "Importing...") : (language === "ar" ? "استيراد ملف إكسل" : "Import Excel")}
          <input type="file" hidden accept=".xlsx,.xls" onChange={(e) => { const file = e.target.files?.[0]; if (file) importExcel(file); }} />
        </label>
        <button onClick={exportExcel} style={{ ...sidebarBtn }}>
          <Download size={18} style={{color: "#34d399"}} /> {exportingExcel ? (language === "ar" ? "جاري التصدير..." : "Exporting...") : (language === "ar" ? "تصدير إلى إكسل" : "Export Excel")}
        </button>
        <button onClick={deleteAllHorses} style={{ ...sidebarBtn, color: "#ef4444" }}>
          <Trash2 size={18} /> {language === "ar" ? "مسح كل البيانات" : "Delete All Data"}
        </button>
        <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} style={{...sidebarBtn, marginTop: "auto", justifyContent: "center"}}>
          🌐 {language === "en" ? "التبديل للعربية" : "Switch to English"}
        </button>
        <button onClick={logout} style={{ ...sidebarBtn, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", justifyContent: "center" }}>
          <LogOut size={18} /> {language === "ar" ? "تسجيل الخروج" : "Logout"}
        </button>
      </div>

      {/* ─── MAIN DASHBOARD CONTENT ───────────────────────────────────────────── */}
      <div style={{ marginLeft: language === "ar" ? 0 : "260px", marginRight: language === "ar" ? "260px" : 0, padding: "40px 50px" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "38px", fontWeight: "900", marginBottom: "10px", color: TEXT_LIGHT, letterSpacing: "-0.5px" }}>
            {language === "ar" ? "لوحة التحكم" : "Farm Dashboard"}
          </h1>
          <p style={{ color: TEXT_MUTED, maxWidth: "700px", lineHeight: "1.6", fontSize: "16px" }}>
            {farm?.bio || (language === "ar" ? "إدارة عمليات مزرعتك وقطيع الخيل بكل احترافية وسهولة." : "Manage your Arabian horse breeding platform seamlessly.")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "40px", borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: "15px", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "12px",
                background: activeTab === tab.id ? "rgba(212, 175, 55, 0.15)" : "transparent", color: activeTab === tab.id ? GOLD : TEXT_MUTED,
                border: `1px solid ${activeTab === tab.id ? "rgba(212, 175, 55, 0.4)" : "transparent"}`, fontWeight: "bold", fontSize: "15px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap"
              }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {activeTab === "overview" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginBottom: "40px" }}>
                  <StatCard title={language === "ar" ? "العدد الإجمالي" : "Total Horses"} value={stats.total} color={GOLD} />
                  <StatCard title={language === "ar" ? "الفحول" : "Stallions"} value={stats.stallions} color="#60A5FA" />
                  <StatCard title={language === "ar" ? "الأفراس" : "Mares"} value={stats.mares} color="#F472B6" />
                  <StatCard title={language === "ar" ? "الأمهار/المهرات" : "Foals"} value={stats.foals} color="#34D399" />
                </div>
                <div style={{ padding: "40px", background: CARD_BG, borderRadius: "20px", border: `1px solid ${BORDER_COLOR}`, textAlign: "center" }}>
                  <Activity size={40} style={{ color: TEXT_MUTED, margin: "0 auto 15px", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "18px", fontWeight: "bold", color: TEXT_LIGHT }}>{language === "ar" ? "ملخص النشاط" : "Farm Activity Summary"}</h3>
                  <p style={{ color: TEXT_MUTED, fontSize: "15px", marginTop: "8px" }}>{language === "ar" ? "الأنشطة الأخيرة والتنبيهات ستظهر هنا." : "Recent activities and alerts will appear here."}</p>
                </div>
              </div>
            )}

            {activeTab === "horses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ position: "relative", flex: 1, maxWidth: "500px" }}>
                    <Search size={18} style={{ position: "absolute", left: language === "ar" ? "auto" : "16px", right: language === "ar" ? "16px" : "auto", top: "50%", transform: "translateY(-50%)", color: TEXT_MUTED }} />
                    <input 
                      type="text" placeholder={language === "ar" ? "ابحث بالاسم، اسم الأب، أو الأم..." : "Search by name, sire, or dam..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: language === "ar" ? "14px 44px 14px 16px" : "14px 16px 14px 44px", borderRadius: "12px", background: CARD_BG, border: `1px solid ${BORDER_COLOR}`, color: TEXT_LIGHT, outline: "none", fontSize: "15px", transition: "border-color 0.2s" }}
                      onFocus={(e) => e.target.style.borderColor = GOLD}
                      onBlur={(e) => e.target.style.borderColor = BORDER_COLOR}
                    />
                  </div>
                  <button onClick={openAddModal} style={{ background: GOLD, color: "#000", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(212, 175, 55, 0.2)" }}>
                    <Plus size={18} /> {language === "ar" ? "إضافة جواد" : "Add New Horse"}
                  </button>
                </div>

                {filteredHorses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", color: TEXT_MUTED, fontSize: "16px", fontWeight: "bold" }}>{language === "ar" ? "لم يتم العثور على خيل." : "No horses found."}</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "24px" }}>
                    <AnimatePresence>
                      {filteredHorses.map((horse) => (
                        <motion.div key={horse.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                          style={{ background: CARD_BG, border: `1px solid ${BORDER_COLOR}`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                          
                          <div style={{ height: "180px", width: "100%", position: "relative", background: "#1E293B" }}>
                            {horse.image ? (
                              <img src={horse.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                                <span style={{ fontSize: "40px", filter: "grayscale(100%)" }}>🐴</span>
                              </div>
                            )}
                            <div style={{ position: "absolute", top: "12px", right: language === "ar" ? "auto" : "12px", left: language === "ar" ? "12px" : "auto", background: "rgba(11, 16, 30, 0.85)", backdropFilter: "blur(4px)", color: GOLD, padding: "6px 10px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", border: `1px solid rgba(212, 175, 55, 0.4)` }}>
                              {calculateAge(horse.birth_date)} {language === "ar" ? "سنوات" : "YRS"}
                            </div>
                          </div>

                          <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{ marginBottom: "16px" }}>
                              <h3 style={{ fontSize: "20px", fontWeight: "900", color: TEXT_LIGHT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{horse.name}</h3>
                              <p style={{ color: TEXT_MUTED, fontSize: "14px", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} dir="rtl">{horse.name_ar}</p>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                              <span style={badgeStyle}>{getHorseType(horse.gender, horse.birth_date)}</span>
                              <span style={badgeStyle}>{horse.color || "Unknown"}</span>
                              {horse.strain && <span style={badgeStyle}>{horse.strain.split(' ')[0]}</span>}
                            </div>
                            <div style={{ fontSize: "13px", color: TEXT_MUTED, marginBottom: "24px", display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
                              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><strong style={{ color: TEXT_LIGHT }}>S:</strong> {horse.sire || "-"}</div>
                              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><strong style={{ color: TEXT_LIGHT }}>D:</strong> {horse.dam || "-"}</div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={() => openEditModal(horse)} style={{ ...actionBtn, background: "rgba(255,255,255,0.05)" }}><Pencil size={15} /> <span>{language === "ar" ? "تعديل" : "Edit"}</span></button>
                              <button onClick={() => deleteHorse(horse.id)} style={{ ...actionBtn, background: "rgba(239, 68, 68, 0.1)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.2)" }}><Trash2 size={15} /></button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {activeTab === "breeding" && <EmptyModuleState icon={CalendarClock} color="#F472B6" title={language === "ar" ? "التشبية والإنتاج" : "Breeding & Reproduction"} desc={language === "ar" ? "إدارة سجلات التشبية، وتتبع تواريخ الولادة المتوقعة، ونتائج السونار. سيتم تفعيل هذه الميزة قريباً." : "Track stud logs, expected foaling dates, and ultrasound results. Feature unlocking soon."} btnText={language === "ar" ? "ميزة قادمة" : "Coming Soon"} />}
            {activeTab === "medical" && <EmptyModuleState icon={Syringe} color="#FB7185" title={language === "ar" ? "السجل الطبي والعيادة" : "Medical Vault"} desc={language === "ar" ? "جدولة التطعيمات، زيارات الطبيب البيطري، ومواعيد البيطار. سيتم تفعيل هذه الميزة قريباً." : "Manage vaccinations, vet visits, farrier schedules, and documents. Feature unlocking soon."} btnText={language === "ar" ? "ميزة قادمة" : "Coming Soon"} />}
            {activeTab === "inventory" && <EmptyModuleState icon={Package} color="#34D399" title={language === "ar" ? "المستودع والعمليات" : "Inventory & Operations"} desc={language === "ar" ? "تتبع مخزون الأعلاف، المكملات الغذائية، وإدارة مهام العمال اليومية. سيتم تفعيل هذه الميزة قريباً." : "Track feed stock, supplements, and manage staff daily tasks. Feature unlocking soon."} btnText={language === "ar" ? "ميزة قادمة" : "Coming Soon"} />}
            {activeTab === "finance" && <EmptyModuleState icon={Receipt} color="#60A5FA" title={language === "ar" ? "الإدارة المالية" : "Financial Tracking"} desc={language === "ar" ? "سجل دقيق للمصروفات، الإيرادات، ورسوم التشبية والمبيعات. سيتم تفعيل هذه الميزة قريباً." : "Record expenses, sales, and stud fee revenues accurately. Feature unlocking soon."} btnText={language === "ar" ? "ميزة قادمة" : "Coming Soon"} />}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── ADD / EDIT HORSE MODAL ──────────────────────────────────────────── */}
      {showAddHorse && (
        <Modal title={editingHorseId ? (language === "ar" ? "تعديل بيانات الجواد" : "Edit Horse") : (language === "ar" ? "إضافة جواد" : "Add Horse")} onClose={() => setShowAddHorse(false)} dir={language === "ar" ? "rtl" : "ltr"}>
          
          <datalist id="sires-list">
            {horses.filter(h => h.gender === "Male" || getHorseType(h.gender, h.birth_date) === "Stallion" || getHorseType(h.gender, h.birth_date) === "Colt").map(h => <option key={h.id} value={h.name} />)}
          </datalist>
          <datalist id="dams-list">
            {horses.filter(h => h.gender === "Female" || getHorseType(h.gender, h.birth_date) === "Mare" || getHorseType(h.gender, h.birth_date) === "Filly").map(h => <option key={h.id} value={h.name} />)}
          </datalist>
          <datalist id="strains-list">
            {smartStrainsList.map((s, i) => <option key={i} value={s} />)}
          </datalist>
          <datalist id="families-list">
            {smartFamiliesList.map((f, i) => <option key={i} value={f} />)}
          </datalist>

          <div style={grid2}>
            <Input placeholder={language === "ar" ? "الاسم بالإنجليزي" : "Horse Name (English)"} value={horseForm.name} onChange={(v: any) => setHorseForm({ ...horseForm, name: v })} />
            <Input placeholder={language === "ar" ? "الاسم بالعربي" : "Arabic Name"} value={horseForm.nameAr} onChange={(v: any) => setHorseForm({ ...horseForm, nameAr: v })} />
            
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={uploadLabel}>
                <Upload size={18} /> {uploading ? (language === "ar" ? "جاري الرفع..." : "Uploading...") : (language === "ar" ? "رفع صورة الجواد" : "Upload Horse Image")}
                <input type="file" hidden accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadHorseImage(file); }} />
              </label>
              {horseForm.image && <img src={horseForm.image} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px", marginTop: "12px", border: `1px solid ${BORDER_COLOR}` }} />}
            </div>

            <Input placeholder="Birth Date" type="date" value={horseForm.birthDate} onChange={(v: any) => setHorseForm({ ...horseForm, birthDate: v })} />

            <select value={horseForm.color} onChange={(e) => setHorseForm({ ...horseForm, color: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: BG_DARK }}>{language === "ar" ? "اختر اللون" : "Select Color"}</option>
              {HORSE_COLORS.map((item) => <option key={item} value={item} style={{ background: BG_DARK }}>{item}</option>)}
            </select>

            <select value={horseForm.gender} onChange={(e) => setHorseForm({ ...horseForm, gender: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: BG_DARK }}>{language === "ar" ? "اختر الجنس" : "Select Gender"}</option>
              {HORSE_GENDERS.map((item) => <option key={item} value={item} style={{ background: BG_DARK }}>{item}</option>)}
            </select>

            <Input placeholder={language === "ar" ? "اسم الأب (Sire)" : "Sire Name"} list="sires-list" value={horseForm.sire} onChange={(v: any) => setHorseForm({ ...horseForm, sire: v })} />
            <Input placeholder={language === "ar" ? "اسم الأم (Dam)" : "Dam Name"} list="dams-list" value={horseForm.dam} onChange={(v: any) => setHorseForm({ ...horseForm, dam: v })} />
            <Input placeholder={language === "ar" ? "الرسن (Strain)" : "Strain"} list="strains-list" value={horseForm.strain} onChange={(v: any) => setHorseForm({ ...horseForm, strain: v })} />
            <Input placeholder={language === "ar" ? "العائلة (Family)" : "Family"} list="families-list" value={horseForm.family} onChange={(v: any) => setHorseForm({ ...horseForm, family: v })} />
            <Input placeholder={language === "ar" ? "المربي (Breeder)" : "Breeder"} value={horseForm.breeder} onChange={(v: any) => setHorseForm({ ...horseForm, breeder: v })} />
            <Input placeholder={language === "ar" ? "بلد المنشأ" : "Country"} value={horseForm.country} onChange={(v: any) => setHorseForm({ ...horseForm, country: v })} />
            <Input placeholder={language === "ar" ? "الإنجازات" : "Achievements"} value={horseForm.achievements} onChange={(v: any) => setHorseForm({ ...horseForm, achievements: v })} />
            <Input placeholder={language === "ar" ? "ملاحظات إضافية" : "Notes"} value={horseForm.notes} onChange={(v: any) => setHorseForm({ ...horseForm, notes: v })} />

            <select value={horseForm.health} onChange={(e) => setHorseForm({ ...horseForm, health: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: BG_DARK }}>{language === "ar" ? "الحالة الصحية" : "Select Health Status"}</option>
              {HEALTH_OPTIONS.map((item) => <option key={item} value={item} style={{ background: BG_DARK }}>{item}</option>)}
            </select>

            {horseForm.health === "Other" && <Input placeholder="Specify Other Health Status" value={horseForm.otherHealth} onChange={(v: any) => setHorseForm({ ...horseForm, otherHealth: v })} />}
          </div>

          <button onClick={saveHorse} style={saveBtnStyle}>
            <Save size={20} style={{ margin: "0 8px", verticalAlign: "middle" }} /> {editingHorseId ? (language === "ar" ? "حفظ التعديلات" : "Update Horse") : (language === "ar" ? "حفظ الجواد" : "Save Horse")}
          </button>
        </Modal>
      )}

      {/* FARM SETTINGS MODAL */}
      {showSettings && (
        <Modal title={language === "ar" ? "إعدادات المزرعة" : "Farm Settings"} onClose={() => setShowSettings(false)} dir={language === "ar" ? "rtl" : "ltr"}>
          <div style={grid2}>
            <Input placeholder="Display Name" value={farmForm.display_name} onChange={(v: any) => setFarmForm({ ...farmForm, display_name: v })} />
            <Input placeholder="Country" value={farmForm.country} onChange={(v: any) => setFarmForm({ ...farmForm, country: v })} />
            <Input placeholder="Instagram" value={farmForm.instagram} onChange={(v: any) => setFarmForm({ ...farmForm, instagram: v })} />
            <Input placeholder="Website" value={farmForm.website} onChange={(v: any) => setFarmForm({ ...farmForm, website: v })} />
            <div style={{ gridColumn: "1 / -1" }}>
              <Input placeholder="Bio" value={farmForm.bio} onChange={(v: any) => setFarmForm({ ...farmForm, bio: v })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={uploadLabel}>
                <Upload size={18} /> {uploadingLogo ? "Uploading..." : "Upload Farm Logo"}
                <input type="file" hidden accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFarmLogo(file); }} />
              </label>
              {farmForm.logo && <img src={farmForm.logo} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "999px", marginTop: "15px", border: `2px solid ${GOLD}` }} />}
            </div>
          </div>
          <button onClick={saveFarmSettings} style={saveBtnStyle}>
            <Save size={20} style={{ margin: "0 8px", verticalAlign: "middle" }} /> {language === "ar" ? "حفظ التعديلات" : "Save Settings"}
          </button>
        </Modal>
      )}

    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div style={{ padding: "24px", background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER_COLOR}` }}>
      <div style={{ color: TEXT_MUTED, fontSize: "13px", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</div>
      <div style={{ fontSize: "36px", fontWeight: "900", color }}>{value}</div>
    </div>
  );
}

function EmptyModuleState({ icon: Icon, color, title, desc, btnText }: any) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", background: CARD_BG, border: `1px dashed rgba(255,255,255,0.2)`, borderRadius: "20px" }}>
      <div style={{ width: "80px", height: "80px", background: `${color}15`, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: `1px solid ${color}40` }}>
        <Icon size={40} style={{ color }} />
      </div>
      <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "12px", color: TEXT_LIGHT }}>{title}</h2>
      <p style={{ color: TEXT_MUTED, maxWidth: "450px", margin: "0 auto 30px", lineHeight: "1.6", fontSize: "15px" }}>{desc}</p>
      <button style={{ background: color, color: "#000", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "not-allowed", opacity: 0.8 }}>
        {btnText}
      </button>
    </div>
  );
}

function Modal({ title, onClose, children, dir = "ltr" }: any) {
  return (
    <div dir={dir} style={{ position: "fixed", inset: 0, background: "rgba(11, 16, 30, 0.9)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: BG_DARK, border: `1px solid ${BORDER_COLOR}`, borderRadius: "24px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "35px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: TEXT_LIGHT }}>{title}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER_COLOR}`, color: TEXT_LIGHT, cursor: "pointer", width: "36px", height: "36px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ placeholder, type = "text", value, onChange, list }: any) {
  return (
    <input
      placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} list={list}
      style={{ width: "100%", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER_COLOR}`, color: TEXT_LIGHT, outline: "none", fontSize: "15px", transition: "all 0.2s" }}
      onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.background = "rgba(255,255,255,0.06)"; }}
      onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR; e.target.style.background = "rgba(255,255,255,0.04)"; }}
    />
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const sidebarBtn = { width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none", borderRadius: "12px", color: TEXT_MUTED, fontWeight: "bold", cursor: "pointer" as any, marginBottom: "4px", transition: "all 0.2s", fontSize: "14px" };
const badgeStyle = { padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: `1px solid ${BORDER_COLOR}`, borderRadius: "8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" as const, color: TEXT_LIGHT };
const actionBtn = { flex: 1, padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: `1px solid ${BORDER_COLOR}`, borderRadius: "10px", color: TEXT_LIGHT, cursor: "pointer" as any, transition: "background 0.2s" };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const uploadLabel = { display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "rgba(212, 175, 55, 0.05)", border: `1px dashed rgba(212, 175, 55, 0.4)`, borderRadius: "12px", color: GOLD, fontWeight: "bold", cursor: "pointer" as any, width: "100%", fontSize: "15px" };
const selectStyle = { width: "100%", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER_COLOR}`, color: TEXT_LIGHT, outline: "none", appearance: "none" as any, fontSize: "15px" };
const saveBtnStyle = { width: "100%", padding: "16px", background: GOLD, color: "#000", borderRadius: "12px", fontWeight: "bold", fontSize: "16px", marginTop: "30px", border: "none", cursor: "pointer" as any, display: "flex", justifyContent: "center", alignItems: "center", transition: "transform 0.1s" };