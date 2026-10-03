"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  Gavel,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";

const gold = "#bc9b6a";

type Judge = {
  id: string;
  name_ar: string;
  name_en: string | null;
  country: string | null;
  photo_url: string | null;
};

export default function JudgesAdmin() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [country, setCountry] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    loadJudges();
  }, []);

  async function loadJudges() {
    setLoading(true);

    const { data, error } = await supabase
      .from("judges")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setJudges(data || []);
    setLoading(false);
  }

  function resetForm() {
    setNameAr("");
    setNameEn("");
    setCountry("");
    setPhotoUrl("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(judge: Judge) {
    setEditingId(judge.id);
    setNameAr(judge.name_ar);
    setNameEn(judge.name_en || "");
    setCountry(judge.country || "");
    setPhotoUrl(judge.photo_url || "");
    setShowForm(true);
  }

  async function saveJudge(e: React.FormEvent) {
    e.preventDefault();

    if (!nameAr.trim()) {
      alert("يرجى إدخال اسم الحكم بالعربي.");
      return;
    }

    const payload = {
      name_ar: nameAr.trim(),
      name_en: nameEn.trim() || null,
      country: country.trim() || null,
      photo_url: photoUrl.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("judges")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(`خطأ Supabase: ${error.message}`);
        console.error("Supabase error:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("judges")
        .insert(payload);

      if (error) {
        alert(`خطأ Supabase: ${error.message}`);
        console.error("Supabase error:", error);
        return;
      }
    }

    resetForm();
    await loadJudges();
  }

  async function deleteJudge(id: string) {
    const confirmed = confirm(
      "هل أنت متأكد من حذف هذا الحكم؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("judges")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`خطأ Supabase: ${error.message}`);
      console.error("Supabase error:", error);
      return;
    }

    await loadJudges();
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
                إدارة الحكام
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
              إضافة حكم
            </button>

          </div>
        </header>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-10">

          {loading ? (
            <div className="text-center py-20 text-gray-400">
              جاري تحميل الحكام...
            </div>
          ) : judges.length === 0 ? (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-12 text-center"
            >

              <Gavel
                size={45}
                className="mx-auto mb-5"
                style={{ color: gold }}
              />

              <h2 className="text-2xl font-black mb-3">
                لا يوجد حكام حتى الآن
              </h2>

              <p className="text-gray-400 mb-7">
                أضيفي أول حكم من خلال زر إضافة حكم.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
                style={{
                  background: gold,
                  color: "#050B18",
                }}
              >
                <Plus size={18} />
                إضافة أول حكم
              </button>

            </motion.div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {judges.map((judge, index) => (

                <motion.div
                  key={judge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 overflow-hidden"
                        style={{
                          color: gold,
                          borderColor: `${gold}30`,
                          background: `${gold}10`,
                        }}
                      >
                        {judge.photo_url ? (
                          <img
                            src={judge.photo_url}
                            alt={judge.name_ar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Gavel size={24} />
                        )}
                      </div>

                      <div>

                        <h2 className="font-black text-lg">
                          {judge.name_ar}
                        </h2>

                        {judge.name_en && (
                          <p
                            dir="ltr"
                            className="text-gray-500 text-sm mt-1"
                          >
                            {judge.name_en}
                          </p>
                        )}

                        {judge.country && (
                          <p className="text-gray-400 text-sm mt-2">
                            {judge.country}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() => startEdit(judge)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 transition hover:border-[#bc9b6a]/50 hover:text-white"
                    >
                      <Pencil size={16} />
                      تعديل
                    </button>

                    <button
                      onClick={() => deleteJudge(judge.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300 transition hover:bg-red-400/10"
                    >
                      <Trash2 size={16} />
                      حذف
                    </button>

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
            className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#08101f] shadow-2xl p-7"
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
                  {editingId ? "تعديل الحكم" : "إضافة حكم"}
                </h2>

              </div>

              <button
                onClick={resetForm}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={saveJudge}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  اسم الحكم بالعربي *
                </label>

                <input
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  required
                  placeholder="اسم الحكم"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  اسم الحكم بالإنجليزي
                </label>

                <input
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  dir="ltr"
                  placeholder="Judge Name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  الدولة
                </label>

                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="مثال: الكويت"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  رابط صورة الحكم
                </label>

                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  dir="ltr"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

                <p className="text-xs text-gray-500 mt-2">
                  يمكن تركه فارغًا الآن وإضافة الصور لاحقًا.
                </p>

              </div>

              <div className="flex gap-3 pt-3">

                <button
                  type="submit"
                  className="flex-1 rounded-xl py-3.5 font-bold"
                  style={{
                    background: gold,
                    color: "#050B18",
                  }}
                >
                  {editingId ? "حفظ التعديلات" : "إضافة الحكم"}
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