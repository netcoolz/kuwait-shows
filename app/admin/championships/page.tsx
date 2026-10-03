"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  X,
  MapPin,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

const gold = "#bc9b6a";

type Championship = {
  id: string;
  title_ar: string;
  title_en: string | null;
  slug: string;
  year: number | null;
  status: string;
  location_ar: string | null;
  description_ar: string | null;
  description_en: string | null;
  hero_image: string | null;
};

export default function ChampionshipsAdmin() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("coming_soon");

  const [locationAr, setLocationAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    loadChampionships();
  }, []);

  async function loadChampionships() {
    setLoading(true);

    const { data, error } = await supabase
      .from("championships")
      .select("*")
      .order("year", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChampionships(data || []);
    setLoading(false);
  }

  function resetForm() {
    setTitleAr("");
    setTitleEn("");
    setYear("");
    setStatus("coming_soon");

    setLocationAr("");
    setDescriptionAr("");
    setDescriptionEn("");
    setHeroImage("");

    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(championship: Championship) {
    setEditingId(championship.id);

    setTitleAr(championship.title_ar);
    setTitleEn(championship.title_en || "");
    setYear(championship.year?.toString() || "");
    setStatus(championship.status);

    setLocationAr(championship.location_ar || "");
    setDescriptionAr(championship.description_ar || "");
    setDescriptionEn(championship.description_en || "");
    setHeroImage(championship.hero_image || "");

    setShowForm(true);
  }

  async function saveChampionship(e: React.FormEvent) {
    e.preventDefault();

    if (!titleAr.trim()) {
      alert("يرجى إدخال اسم البطولة.");
      return;
    }

    const cleanTitle = titleAr.trim();

    const slug =
      cleanTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "") +
      "-" +
      (year || Date.now());

    const payload = {
      title_ar: cleanTitle,
      title_en: titleEn.trim() || null,
      slug,
      year: year ? Number(year) : null,
      status,

      location_ar: locationAr.trim() || null,
      description_ar: descriptionAr.trim() || null,
      description_en: descriptionEn.trim() || null,
      hero_image: heroImage.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("championships")
        .update({
          title_ar: payload.title_ar,
          title_en: payload.title_en,
          year: payload.year,
          status: payload.status,
          location_ar: payload.location_ar,
          description_ar: payload.description_ar,
          description_en: payload.description_en,
          hero_image: payload.hero_image,
        })
        .eq("id", editingId);

      if (error) {
        alert("حدث خطأ أثناء تعديل البطولة.");
        console.error(error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("championships")
        .insert(payload);

      if (error) {
        alert(`خطأ Supabase: ${error.message}`);
        console.error("Supabase error:", error);
        return;
      }
    }

    resetForm();
    await loadChampionships();
  }

  async function deleteChampionship(id: string) {
    const confirmed = confirm(
      "هل أنت متأكد من حذف هذه البطولة؟ سيتم حذف البطولات الفرعية المرتبطة بها أيضًا."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("championships")
      .delete()
      .eq("id", id);

    if (error) {
      alert("حدث خطأ أثناء الحذف.");
      console.error(error);
      return;
    }

    await loadChampionships();
  }

  function statusLabel(status: string) {
    if (status === "open") return "مفتوحة";
    if (status === "closed") return "مغلقة";
    if (status === "ended") return "انتهت";
    return "قريبًا";
  }

  function statusStyle(status: string) {
    if (status === "open") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (status === "closed") {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    if (status === "ended") {
      return "border-gray-400/20 bg-gray-400/10 text-gray-300";
    }

    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen"
      style={{
        background: "#050B18",
        color: "#f4f4f4",
      }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.07]"
          style={{ background: gold }}
        />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">

            <div>

              <button
                onClick={() => {
                  window.location.href = "/admin/dashboard";
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-3 text-sm"
              >
                <ArrowRight size={16} />
                العودة للوحة التحكم
              </button>

              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: gold }}
              >
                Kuwait Shows
              </p>

              <h1 className="text-2xl md:text-3xl font-black">
                إدارة البطولات
              </h1>

            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold transition hover:scale-[1.02]"
              style={{
                background: gold,
                color: "#050B18",
              }}
            >
              <Plus size={18} />
              إضافة بطولة
            </button>

          </div>
        </header>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-10">

          {loading ? (
            <div className="text-center py-20 text-gray-400">
              جاري تحميل البطولات...
            </div>

          ) : championships.length === 0 ? (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-12 text-center"
            >

              <Trophy
                size={45}
                className="mx-auto mb-5"
                style={{ color: gold }}
              />

              <h2 className="text-2xl font-black mb-3">
                لا توجد بطولات حتى الآن
              </h2>

              <p className="text-gray-400 mb-7">
                أضيفي أول بطولة من خلال زر إضافة بطولة.
              </p>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
                style={{
                  background: gold,
                  color: "#050B18",
                }}
              >
                <Plus size={18} />
                إضافة أول بطولة
              </button>

            </motion.div>

          ) : (

            <div className="grid gap-5">

              {championships.map((championship, index) => (

                <motion.div
                  key={championship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                    {/* Championship clickable area */}
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href =
                          `/admin/championships/${championship.id}`;
                      }}
                      className="flex items-start gap-4 text-right flex-1 group"
                    >

                      {championship.hero_image ? (
                        <img
                          src={championship.hero_image}
                          alt={championship.title_ar}
                          className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center border shrink-0 transition group-hover:border-[#bc9b6a]/60 group-hover:bg-[#bc9b6a]/15"
                          style={{
                            color: gold,
                            borderColor: `${gold}30`,
                            background: `${gold}10`,
                          }}
                        >
                          <Trophy size={25} />
                        </div>
                      )}

                      <div className="min-w-0">

                        <h2 className="text-xl font-black mb-2 group-hover:text-[#bc9b6a] transition">
                          {championship.title_ar}
                        </h2>

                        {championship.title_en && (
                          <p
                            className="text-gray-500 text-sm mb-2"
                            dir="ltr"
                          >
                            {championship.title_en}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mb-3">

                          {championship.year && (
                            <span className="text-sm text-gray-400">
                              {championship.year}
                            </span>
                          )}

                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${statusStyle(
                              championship.status
                            )}`}
                          >
                            {statusLabel(championship.status)}
                          </span>

                        </div>

                        {championship.location_ar && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <MapPin
                              size={15}
                              style={{ color: gold }}
                            />
                            <span>
                              {championship.location_ar}
                            </span>
                          </div>
                        )}

                        {championship.description_ar && (
                          <p className="text-gray-500 text-sm leading-7 max-w-3xl line-clamp-2">
                            {championship.description_ar}
                          </p>
                        )}

                      </div>

                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => startEdit(championship)}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 transition hover:border-[#bc9b6a]/50 hover:text-white"
                      >
                        <Pencil size={16} />
                        تعديل
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteChampionship(championship.id)
                        }
                        className="flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300 transition hover:bg-red-400/10"
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          )}

        </section>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={resetForm}
          />

          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#08101f] shadow-2xl p-7 max-h-[92vh] overflow-y-auto"
          >

            <div className="flex items-center justify-between mb-7">

              <div>

                <p
                  className="text-xs tracking-[0.15em] mb-1"
                  style={{ color: gold }}
                >
                  KUWAIT SHOWS
                </p>

                <h2 className="text-2xl font-black">
                  {editingId ? "تعديل البطولة" : "إضافة بطولة"}
                </h2>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={saveChampionship}
              className="space-y-5"
            >

              {/* Arabic title */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  اسم البطولة بالعربي *
                </label>

                <input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  required
                  placeholder="مثال: بطولة الكويت الوطنية للخيل العربية"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              {/* English title */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  اسم البطولة بالإنجليزي
                </label>

                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  dir="ltr"
                  placeholder="Kuwait National Arabian Horse Championship"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              {/* Year + Status */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    السنة
                  </label>

                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />

                </div>

                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    حالة البطولة
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  >
                    <option value="coming_soon">
                      قريبًا
                    </option>

                    <option value="open">
                      مفتوحة
                    </option>

                    <option value="closed">
                      مغلقة
                    </option>

                    <option value="ended">
                      انتهت
                    </option>
                  </select>

                </div>

              </div>

              {/* Location */}
              <div>

                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <MapPin size={15} style={{ color: gold }} />
                  موقع البطولة
                </label>

                <input
                  value={locationAr}
                  onChange={(e) =>
                    setLocationAr(e.target.value)
                  }
                  placeholder="مثال: مركز الجواد العربي - صبحان - الكويت"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              {/* Hero Image */}
              <div>

                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <ImageIcon size={15} style={{ color: gold }} />
                  رابط صورة البطولة
                </label>

                <input
                  value={heroImage}
                  onChange={(e) =>
                    setHeroImage(e.target.value)
                  }
                  dir="ltr"
                  placeholder="https://example.com/championship.jpg"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

                {heroImage && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-black/20">

                    <img
                      src={heroImage}
                      alt="معاينة صورة البطولة"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                  </div>
                )}

              </div>

              {/* Arabic Description */}
              <div>

                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <FileText size={15} style={{ color: gold }} />
                  وصف البطولة بالعربي
                </label>

                <textarea
                  value={descriptionAr}
                  onChange={(e) =>
                    setDescriptionAr(e.target.value)
                  }
                  rows={5}
                  placeholder="اكتب وصفًا مختصرًا عن البطولة..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              {/* English Description */}
              <div>

                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <FileText size={15} style={{ color: gold }} />
                  وصف البطولة بالإنجليزي
                </label>

                <textarea
                  value={descriptionEn}
                  onChange={(e) =>
                    setDescriptionEn(e.target.value)
                  }
                  rows={5}
                  dir="ltr"
                  placeholder="Write a short description about the championship..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">

                <button
                  type="submit"
                  className="flex-1 rounded-xl py-3.5 font-bold"
                  style={{
                    background: gold,
                    color: "#050B18",
                  }}
                >
                  {editingId
                    ? "حفظ التعديلات"
                    : "إضافة البطولة"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3.5 text-gray-300"
                >
                  إلغاء
                </button>

              </div>

            </form>

          </motion.div>

        </div>

      )}

    </main>
  );
}