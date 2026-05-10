"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Plus,
  LogOut,
  Settings,
  Globe,
  BadgeCheck,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  Download,
  FileSpreadsheet
} from "lucide-react";

import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

const HORSE_COLORS = [
  "Grey",
  "Bay",
  "Chestnut",
  "Black"
];

const HORSE_GENDERS = [
  "Male",
  "Female"
];

const HEALTH_OPTIONS = [
  "Melanomas",
  "Laminitis",
  "Fertility problems",
  "Pigmentation loss",
  "Epilepsy",
  "Ovarian tumor",
  "Guttural pouch tympany",
  "Other"
];

// دالة مساعدة ذكية لتحويل تواريخ الإكسل (سواء كانت أرقام تسلسلية مثل 37257 أو نصوص)
function formatExcelDate(dateValue: any): string | null {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'number') {
    const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    return date.toISOString().split('T')[0];
  }
  
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }
  
  if (typeof dateValue === 'string') {
    if (!isNaN(Number(dateValue)) && Number(dateValue) > 10000) {
      const date = new Date(Math.round((Number(dateValue) - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0];
    }
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return dateValue;
  }
  
  return null;
}

// تم تحديثها لتتفادى أي أخطاء في تنسيق التاريخ الوارد
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

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

function getHorseType(gender: string, birthDate: any) {
  const age = calculateAge(birthDate);

  if (gender === "Male" || gender === "Stallion" || gender === "Colt") {
    return age <= 3 ? "Colt" : "Stallion";
  }

  return age <= 3 ? "Filly" : "Mare";
}

export default function FarmDashboard() {
  const router = useRouter();

  const [farm, setFarm] = useState<any>(null);
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddHorse, setShowAddHorse] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [importingExcel, setImportingExcel] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const [horseForm, setHorseForm] = useState({
    name: "",
    nameAr: "",
    image: "",
    birthDate: "",
    color: "",
    gender: "",
    sire: "",
    dam: "",
    strain: "",
    family: "",
    health: "",
    otherHealth: "",
    breeder: "",
    country: "",
    achievements: "",
    notes: "",
  });

  const [farmForm, setFarmForm] = useState({
    display_name: "",
    country: "",
    instagram: "",
    website: "",
    bio: "",
    logo: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("farm");

    if (!saved) {
      router.push("/farmlogin");
      return;
    }

    const parsed = JSON.parse(saved);
    loadFarm(parsed.id);
    loadHorses(parsed.id);
  }, []);

  async function loadFarm(id: string) {
    const { data } = await supabase
      .from("farms")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFarm(data);
      setFarmForm({
        display_name: data.display_name || "",
        country: data.country || "",
        instagram: data.instagram || "",
        website: data.website || "",
        bio: data.bio || "",
        logo: data.logo || "",
      });
    }

    setLoading(false);
  }

  async function loadHorses(id: string) {
    const { data } = await supabase
      .from("horses")
      .select("*")
      .eq("farm_id", id)
      .order("created_at", { ascending: false });

    if (data) {
      setHorses(data);
    }
  }

  async function uploadHorseImage(file: any) {
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `horse-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("horse-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("horse-images")
      .getPublicUrl(fileName);

    setHorseForm({
      ...horseForm,
      image: data.publicUrl
    });

    setUploading(false);
  }

  async function uploadFarmLogo(file: any) {
    if (!file) return;

    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const fileName = `farm-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("farm-logos")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploadingLogo(false);
      return;
    }

    const { data } = supabase.storage
      .from("farm-logos")
      .getPublicUrl(fileName);

    setFarmForm({
      ...farmForm,
      logo: data.publicUrl
    });

    setUploadingLogo(false);
  }

  async function saveHorse() {
    if (!horseForm.name) {
      alert("Horse name required");
      return;
    }

    const healthValue =
      horseForm.health === "Other"
        ? horseForm.otherHealth
        : horseForm.health;

    const horseType = getHorseType(
      horseForm.gender,
      horseForm.birthDate
    );

    const { error } = await supabase
      .from("horses")
      .insert([
        {
          farm_id: farm.id,
          name: horseForm.name,
          name_ar: horseForm.nameAr,
          image: horseForm.image,
          birth_date: horseForm.birthDate,
          color: horseForm.color,
          gender: horseForm.gender,
          sex: horseType,
          sire: horseForm.sire,
          dam: horseForm.dam,
          strain: horseForm.strain,
          family: horseForm.family,
          breeder: horseForm.breeder,
          country: horseForm.country,
          achievements: horseForm.achievements,
          notes: horseForm.notes,
          health: healthValue ? [healthValue] : []
        }
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setShowAddHorse(false);
    setHorseForm({
      name: "", nameAr: "", image: "", birthDate: "", color: "",
      gender: "", sire: "", dam: "", strain: "", family: "",
      health: "", otherHealth: "", breeder: "", country: "", achievements: "", notes: "",
    });

    loadHorses(farm.id);
  }

  async function saveFarmSettings() {
    const { error } = await supabase
      .from("farms")
      .update({
        display_name: farmForm.display_name,
        country: farmForm.country,
        instagram: farmForm.instagram,
        website: farmForm.website,
        bio: farmForm.bio,
        logo: farmForm.logo,
      })
      .eq("id", farm.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Farm updated");
    setShowSettings(false);
    loadFarm(farm.id);
  }

  async function deleteHorse(id: string) {
    if (!confirm("Delete horse?")) return;

    await supabase
      .from("horses")
      .delete()
      .eq("id", id);

    loadHorses(farm.id);
  }

  async function importExcel(file: any) {
    if (!file || !farm) return;
    
    try {
      setImportingExcel(true);
      const data = await file.arrayBuffer();
      // تمرير cellDates لمكتبة XLSX
      const workbook = XLSX.read(data, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      if (json.length === 0) {
        alert("Excel file is empty");
        setImportingExcel(false);
        return;
      }

      const horsesToInsert = json.map((row: any) => {
        // تحويل التاريخ من الإكسل
        const rawDate = row.birth_date || row.BirthDate || null;
        const formattedDate = formatExcelDate(rawDate);

        return {
          farm_id: farm.id,
          name: row.name || row.Name || "",
          name_ar: row.name_ar || row.NameArabic || "",
          image: row.image || "",
          birth_date: formattedDate, // التاريخ الصحيح لقاعدة البيانات
          color: row.color || row.Color || "",
          gender: row.gender || row.Gender || "",
          sex: getHorseType(
            row.gender || row.Gender || "",
            formattedDate || "" // إرسال التاريخ الصحيح لحساب النوع
          ),
          sire: row.sire || row.Sire || "",
          dam: row.dam || row.Dam || "",
          strain: row.strain || row.Strain || "",
          family: row.family || row.Family || "",
          breeder: row.breeder || row.Breeder || "",
          country: row.country || row.Country || "",
          achievements: row.achievements || row.Achievements || "",
          notes: row.notes || row.Notes || "",
          health: row.health ? [row.health] : row.Health ? [row.Health] : []
        };
      });

      const { error } = await supabase.from("horses").insert(horsesToInsert);
      
      if (error) {
        alert(error.message);
        setImportingExcel(false);
        return;
      }
      
      alert(`${horsesToInsert.length} horses imported successfully`);
      loadHorses(farm.id);
      setImportingExcel(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to import excel file");
      setImportingExcel(false);
    }
  }

  function exportExcel() {
    try {
      setExportingExcel(true);
      const rows = horses.map((horse) => ({
        name: horse.name,
        name_ar: horse.name_ar,
        birth_date: horse.birth_date,
        age: calculateAge(horse.birth_date),
        color: horse.color,
        gender: horse.gender,
        type: getHorseType(horse.gender, horse.birth_date),
        sire: horse.sire,
        dam: horse.dam,
        strain: horse.strain,
        family: horse.family,
        breeder: horse.breeder,
        country: horse.country,
        health: horse.health?.join(", ") || "",
        achievements: horse.achievements,
        notes: horse.notes,
        image: horse.image
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Horses");
      XLSX.writeFile(workbook, `${farm?.display_name || "farm"}-horses.xlsx`);
      setExportingExcel(false);
    } catch (err) {
      console.error(err);
      alert("Export failed");
      setExportingExcel(false);
    }
  }

  function logout() {
    localStorage.removeItem("farm");
    router.push("/farmlogin");
  }

  const stats = useMemo(() => {
    return {
      total: horses.length,
      stallions: horses.filter(x => getHorseType(x.gender, x.birth_date) === "Stallion").length,
      mares: horses.filter(x => getHorseType(x.gender, x.birth_date) === "Mare").length,
      foals: horses.filter(x => calculateAge(x.birth_date) <= 3).length,
    };
  }, [horses]);

  if (loading) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#06071A", color: "white" }}>
      <div style={{ width: "260px", position: "fixed", top: 0, left: 0, bottom: 0, background: "rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "30px 20px", backdropFilter: "blur(20px)", zIndex: 100, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img
            src={farm?.logo || "https://placehold.co/200x200/png"}
            alt="Farm Logo"
            style={{ width: "110px", height: "110px", borderRadius: "999px", objectFit: "cover", marginBottom: "15px", border: "4px solid rgba(201,169,110,0.4)" }}
          />
          <h2 style={{ fontSize: "24px", fontWeight: "900" }}>
            {farm?.display_name || farm?.farm_name}
          </h2>
          <div style={{ color: "rgba(255,255,255,0.45)", marginTop: "5px" }}>
            {farm?.country || "Kuwait"}
          </div>
        </div>

        <button onClick={() => setShowAddHorse(true)} style={sidebarBtn}>
          <Plus size={18} /> Add Horse
        </button>

        <button onClick={() => setShowSettings(true)} style={sidebarBtn}>
          <Settings size={18} /> Farm Settings
        </button>

        <button onClick={() => router.push("/analytics")} style={{ ...sidebarBtn, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", color: "#C9A96E" }}>
          📊 Analytics
        </button>

        <label style={{ ...sidebarBtn, cursor: "pointer", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", color: "#60a5fa" }}>
          <FileSpreadsheet size={18} />
          {importingExcel ? "Importing..." : "Import Excel"}
          <input type="file" hidden accept=".xlsx,.xls" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importExcel(file);
          }} />
        </label>

        <button onClick={exportExcel} style={{ ...sidebarBtn, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}>
          <Download size={18} />
          {exportingExcel ? "Exporting..." : "Export Excel"}
        </button>

        <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} style={sidebarBtn}>
          🌐 {language === "en" ? "العربية" : "English"}
        </button>

        <button onClick={logout} style={{ ...sidebarBtn, marginTop: "auto", background: "rgba(251,113,133,0.15)", color: "#fb7185" }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ marginLeft: "260px", padding: "40px" }}>
        <div style={{ marginBottom: "35px" }}>
          <h1 style={{ fontSize: "52px", fontWeight: "900", marginBottom: "10px", background: "linear-gradient(to right,#fff,#C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {farm?.display_name || farm?.farm_name}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: "700px", lineHeight: "1.8" }}>
            {farm?.bio || "Arabian horse breeding platform"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginBottom: "35px" }}>
          <StatCard title="Total Horses" value={stats.total} color="#C9A96E" />
          <StatCard title="Stallions" value={stats.stallions} color="#60a5fa" />
          <StatCard title="Mares" value={stats.mares} color="#f472b6" />
          <StatCard title="Foals" value={stats.foals} color="#34d399" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
          {horses.map((horse) => (
            <div key={horse.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "28px", overflow: "hidden" }}>
              <img src={horse.image || "https://placehold.co/800x500/png"} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: "900" }}>{horse.name}</h2>
                    <div style={{ color: "rgba(255,255,255,0.45)" }}>{horse.name_ar}</div>
                  </div>
                  <div style={{ background: "#C9A96E", color: "#06071A", padding: "8px 12px", borderRadius: "12px", fontWeight: "900", height: "fit-content" }}>
                    {calculateAge(horse.birth_date)}Y
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "rgba(255,255,255,0.7)", marginBottom: "20px", fontSize: "14px" }}>
                  <div>Color: {horse.color}</div>
                  <div>Type: {getHorseType(horse.gender, horse.birth_date)}</div>
                  <div>Gender: {horse.gender}</div>
                  <div>Sire: {horse.sire}</div>
                  <div>Dam: {horse.dam}</div>
                  <div>Strain: {horse.strain}</div>
                  <div>Family: {horse.family}</div>
                  <div>Country: {horse.country}</div>
                </div>

                <div style={{ marginBottom: "15px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  Birth: {horse.birth_date ? new Date(horse.birth_date).toLocaleDateString() : "-"}
                </div>

                {horse.health?.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ color: "#C9A96E", fontWeight: "800", marginBottom: "8px" }}>Health</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {horse.health.map((item: any, index: number) => (
                        <div key={index} style={{ padding: "6px 10px", borderRadius: "999px", background: "rgba(251,113,133,0.12)", color: "#fb7185", fontSize: "12px", fontWeight: "700" }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={actionBtn}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteHorse(horse.id)} style={{ ...actionBtn, background: "rgba(251,113,133,0.15)", color: "#fb7185" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD HORSE MODAL */}
      {showAddHorse && (
        <Modal title="Add Horse" onClose={() => setShowAddHorse(false)}>
          <div style={grid2}>
            <Input placeholder="Horse Name" value={horseForm.name} onChange={(v: any) => setHorseForm({ ...horseForm, name: v })} />
            <Input placeholder="Horse Arabic Name" value={horseForm.nameAr} onChange={(v: any) => setHorseForm({ ...horseForm, nameAr: v })} />
            
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={uploadLabel}>
                <Upload size={18} />
                {uploading ? "Uploading..." : "Upload Horse Image"}
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadHorseImage(file);
                }} />
              </label>
              {horseForm.image && (
                <img src={horseForm.image} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "18px", marginTop: "10px" }} />
              )}
            </div>

            <Input placeholder="Birth Date" type="date" value={horseForm.birthDate} onChange={(v: any) => setHorseForm({ ...horseForm, birthDate: v })} />

            <select value={horseForm.color} onChange={(e) => setHorseForm({ ...horseForm, color: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: "#0B0C20" }}>Select Color</option>
              {HORSE_COLORS.map((item) => (
                <option key={item} value={item} style={{ background: "#0B0C20" }}>{item}</option>
              ))}
            </select>

            <select value={horseForm.gender} onChange={(e) => setHorseForm({ ...horseForm, gender: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: "#0B0C20" }}>Select Gender</option>
              {HORSE_GENDERS.map((item) => (
                <option key={item} value={item} style={{ background: "#0B0C20" }}>{item}</option>
              ))}
            </select>

            <Input placeholder="Sire" value={horseForm.sire} onChange={(v: any) => setHorseForm({ ...horseForm, sire: v })} />
            <Input placeholder="Dam" value={horseForm.dam} onChange={(v: any) => setHorseForm({ ...horseForm, dam: v })} />
            <Input placeholder="Strain" value={horseForm.strain} onChange={(v: any) => setHorseForm({ ...horseForm, strain: v })} />
            <Input placeholder="Family" value={horseForm.family} onChange={(v: any) => setHorseForm({ ...horseForm, family: v })} />
            <Input placeholder="Breeder" value={horseForm.breeder} onChange={(v: any) => setHorseForm({ ...horseForm, breeder: v })} />
            <Input placeholder="Country" value={horseForm.country} onChange={(v: any) => setHorseForm({ ...horseForm, country: v })} />
            <Input placeholder="Achievements" value={horseForm.achievements} onChange={(v: any) => setHorseForm({ ...horseForm, achievements: v })} />
            <Input placeholder="Notes" value={horseForm.notes} onChange={(v: any) => setHorseForm({ ...horseForm, notes: v })} />

            <select value={horseForm.health} onChange={(e) => setHorseForm({ ...horseForm, health: e.target.value })} style={selectStyle}>
              <option value="" style={{ background: "#0B0C20" }}>Select Health Status</option>
              {HEALTH_OPTIONS.map((item) => (
                <option key={item} value={item} style={{ background: "#0B0C20" }}>{item}</option>
              ))}
            </select>

            {horseForm.health === "Other" && (
              <Input placeholder="Specify Other Health Status" value={horseForm.otherHealth} onChange={(v: any) => setHorseForm({ ...horseForm, otherHealth: v })} />
            )}
          </div>

          <button onClick={saveHorse} style={saveBtnStyle}>
            <Save size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Save Horse
          </button>
        </Modal>
      )}

      {/* FARM SETTINGS MODAL */}
      {showSettings && (
        <Modal title="Farm Settings" onClose={() => setShowSettings(false)}>
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
                <Upload size={18} />
                {uploadingLogo ? "Uploading..." : "Upload Farm Logo"}
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFarmLogo(file);
                }} />
              </label>
              {farmForm.logo && (
                <img src={farmForm.logo} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "999px", marginTop: "15px", border: "2px solid rgba(201,169,110,0.4)" }} />
              )}
            </div>
          </div>
          <button onClick={saveFarmSettings} style={saveBtnStyle}>
            <Save size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Save Settings
          </button>
        </Modal>
      )}

    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS & STYLES
// ============================================================================

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div style={{ padding: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: "36px", fontWeight: "900", color }}>{value}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: "#0B0C20", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "28px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "35px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#C9A96E" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer", width: "36px", height: "36px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ placeholder, type = "text", value, onChange }: any) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: "15px" }}
    />
  );
}

const sidebarBtn = { width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "white", fontWeight: "bold", cursor: "pointer" as any, marginBottom: "10px", transition: "all 0.2s", fontSize: "14px" };
const actionBtn = { flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", cursor: "pointer" as any };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const uploadLabel = { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "rgba(201,169,110,0.15)", border: "1px dashed rgba(201,169,110,0.4)", borderRadius: "16px", color: "#C9A96E", fontWeight: "bold", cursor: "pointer" as any, width: "100%" };
const selectStyle = { width: "100%", padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", appearance: "none" as any, fontSize: "15px" };
const saveBtnStyle = { width: "100%", padding: "16px", background: "#C9A96E", color: "#06071A", borderRadius: "16px", fontWeight: "900", fontSize: "16px", marginTop: "30px", border: "none", cursor: "pointer" as any, display: "flex", justifyContent: "center", alignItems: "center" };