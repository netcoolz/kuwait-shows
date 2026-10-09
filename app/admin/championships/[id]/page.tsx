"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  Trophy,
  ArrowRight,
  Plus,
  CalendarDays,
  Pencil,
  Trash2,
  X,
  Gavel,
  UserPlus,
  Check,
  ListChecks,
} from "lucide-react";

const gold = "#bc9b6a";

type Championship = {
  id: string;
  title_ar: string;
  title_en: string | null;
  year: number | null;
  status: string;
};

type Show = {
  id: string;
  championship_id: string;
  title_ar: string;
  title_en: string | null;
  start_date: string;
  end_date: string;
  registration_status: string;
  registration_fee: number;
  color: string;
};

type Judge = {
  id: string;
  name_ar: string;
  name_en: string | null;
  country: string | null;
  photo_url: string | null;
};

type ShowJudge = {
  id: string;
  show_id: string;
  judge_id: string;
};

type ClassItem = {
  id: string;
  show_id: string;
  name_ar: string;
  name_en: string | null;
  class_code: string | null;
  horse_type: string;
  gender: string | null;
  birth_date_from: string | null;
  birth_date_to: string | null;
  status: string;
  sort_order: number;
  max_participants: number | null;
};

export default function ChampionshipDetails() {
  const params = useParams();
  const id = params.id as string;

  const [championship, setChampionship] =
    useState<Championship | null>(null);

  const [shows, setShows] = useState<Show[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [showJudges, setShowJudges] = useState<ShowJudge[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [judgesLoading, setJudgesLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationStatus, setRegistrationStatus] =
    useState("coming_soon");
  const [showColor, setShowColor] = useState("#BC9B6A");
  const [registrationFee, setRegistrationFee] = useState("");

  const [selectedJudgeId, setSelectedJudgeId] = useState<
    Record<string, string>
  >({});

  /* =========================
     CLASS FORM
  ========================= */

  const [classForm, setClassForm] = useState(false);
  const [classEditingId, setClassEditingId] = useState<string | null>(null);
  const [classShowId, setClassShowId] = useState<string | null>(null);

  const [classNameAr, setClassNameAr] = useState("");
  const [classNameEn, setClassNameEn] = useState("");
  const [classCode, setClassCode] = useState("");
  const [classHorseType, setClassHorseType] = useState("arabian");
  const [classGender, setClassGender] = useState("");
  const [birthDateFrom, setBirthDateFrom] = useState("");
  const [birthDateTo, setBirthDateTo] = useState("");
  const [classStatus, setClassStatus] = useState("open");
  const [classSortOrder, setClassSortOrder] = useState("0");
  const [classMaxParticipants, setClassMaxParticipants] = useState("");

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    setLoading(true);
    setJudgesLoading(true);
    setClassesLoading(true);

    const {
      data: championshipData,
      error: championshipError,
    } = await supabase
      .from("championships")
      .select("*")
      .eq("id", id)
      .single();

    if (championshipError) {
      console.error(championshipError);
      setLoading(false);
      setJudgesLoading(false);
      setClassesLoading(false);
      return;
    }

    setChampionship(championshipData);

    const { data: showsData, error: showsError } =
      await supabase
        .from("shows")
        .select("*")
        .eq("championship_id", id)
        .order("start_date", { ascending: true });

    if (showsError) {
      console.error(showsError);
    }

    setShows(showsData || []);

    const { data: judgesData, error: judgesError } =
      await supabase
        .from("judges")
        .select("*")
        .order("name_ar", { ascending: true });

    if (judgesError) {
      console.error(judgesError);
    }

    setJudges(judgesData || []);

    const showIds = (showsData || []).map((show) => show.id);

    if (showIds.length > 0) {
      const {
        data: showJudgesData,
        error: showJudgesError,
      } = await supabase
        .from("show_judges")
        .select("*")
        .in("show_id", showIds);

      if (showJudgesError) {
        console.error(showJudgesError);
      }

      setShowJudges(showJudgesData || []);

      const {
        data: classesData,
        error: classesError,
      } = await supabase
        .from("classes")
        .select("*")
        .in("show_id", showIds)
        .order("sort_order", { ascending: true });

      if (classesError) {
        console.error(classesError);
      }

      setClasses(classesData || []);
    } else {
      setShowJudges([]);
      setClasses([]);
    }

    setLoading(false);
    setJudgesLoading(false);
    setClassesLoading(false);
  }

  /* =========================
     SHOW FORM
  ========================= */

  function resetForm() {
    setTitleAr("");
    setTitleEn("");
    setStartDate("");
    setEndDate("");
    setRegistrationStatus("coming_soon");
    setShowColor("#BC9B6A");
    setRegistrationFee("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(show: Show) {
    setEditingId(show.id);
    setTitleAr(show.title_ar);
    setTitleEn(show.title_en || "");
    setStartDate(show.start_date);
    setEndDate(show.end_date);
    setRegistrationStatus(show.registration_status);
    setShowColor(show.color || "#BC9B6A");
    setRegistrationFee(
      show.registration_fee != null
        ? String(show.registration_fee)
        : "0"
    );
    setShowForm(true);
  }

  async function saveShow(e: React.FormEvent) {
    e.preventDefault();

    if (!titleAr.trim()) {
      alert("يرجى إدخال اسم البطولة الفرعية.");
      return;
    }

    if (!startDate || !endDate) {
      alert("يرجى تحديد تاريخ البداية والنهاية.");
      return;
    }

    if (endDate < startDate) {
      alert("تاريخ النهاية يجب أن يكون بعد تاريخ البداية.");
      return;
    }

    const slug =
      titleAr
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "") +
      "-" +
      Date.now();

    const registrationFeeValue =
      registrationFee.trim() === ""
        ? 0
        : Number(registrationFee);

    if (
      !Number.isFinite(registrationFeeValue) ||
      registrationFeeValue < 0
    ) {
      alert("يرجى إدخال رسوم تسجيل صحيحة.");
      return;
    }

    const payload = {
      championship_id: id,
      title_ar: titleAr.trim(),
      title_en: titleEn.trim() || null,
      slug,
      start_date: startDate,
      end_date: endDate,
      registration_status: registrationStatus,
      registration_fee: registrationFeeValue,
      color: showColor,
    };

    if (editingId) {
      const { error } = await supabase
        .from("shows")
        .update({
          title_ar: payload.title_ar,
          title_en: payload.title_en,
          start_date: payload.start_date,
          end_date: payload.end_date,
          registration_status: payload.registration_status,
          registration_fee: payload.registration_fee,
          color: payload.color,
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("حدث خطأ أثناء تعديل البطولة الفرعية.");
        return;
      }
    } else {
      const { error } = await supabase
        .from("shows")
        .insert(payload);

      if (error) {
        alert(`خطأ Supabase: ${error.message}`);
        console.error("Supabase error:", error);
        return;
      }
    }

    resetForm();
    await loadData();
  }

  async function deleteShow(showId: string) {
    const confirmed = confirm(
      "هل أنت متأكد من حذف هذه البطولة الفرعية؟ سيتم حذف الحكام والفئات والتسجيلات المرتبطة بها."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("shows")
      .delete()
      .eq("id", showId);

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحذف.");
      return;
    }

    await loadData();
  }

  /* =========================
     JUDGES
  ========================= */

  function getJudgesForShow(showId: string) {
    const relations = showJudges.filter(
      (item) => item.show_id === showId
    );

    return relations
      .map((relation) =>
        judges.find((judge) => judge.id === relation.judge_id)
      )
      .filter(Boolean) as Judge[];
  }

  async function addJudgeToShow(showId: string) {
    const judgeId = selectedJudgeId[showId];

    if (!judgeId) {
      alert("يرجى اختيار حكم أولاً.");
      return;
    }

    const alreadyExists = showJudges.some(
      (item) =>
        item.show_id === showId && item.judge_id === judgeId
    );

    if (alreadyExists) {
      alert("هذا الحكم مضاف بالفعل لهذه البطولة.");
      return;
    }

    const { data, error } = await supabase
      .from("show_judges")
      .insert({
        show_id: showId,
        judge_id: judgeId,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert(`خطأ Supabase: ${error.message}`);
      return;
    }

    if (data) {
      setShowJudges((prev) => [...prev, data]);
    }

    setSelectedJudgeId((prev) => ({
      ...prev,
      [showId]: "",
    }));
  }

  async function removeJudgeFromShow(
    showId: string,
    judgeId: string
  ) {
    const confirmed = confirm(
      "هل تريد إزالة هذا الحكم من البطولة؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("show_judges")
      .delete()
      .eq("show_id", showId)
      .eq("judge_id", judgeId);

    if (error) {
      console.error(error);
      alert(`خطأ Supabase: ${error.message}`);
      return;
    }

    setShowJudges((prev) =>
      prev.filter(
        (item) =>
          !(
            item.show_id === showId &&
            item.judge_id === judgeId
          )
      )
    );
  }

  /* =========================
     CLASSES
  ========================= */

  function getClassesForShow(showId: string) {
    return classes
      .filter((item) => item.show_id === showId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  function resetClassForm() {
    setClassForm(false);
    setClassEditingId(null);
    setClassShowId(null);

    setClassNameAr("");
    setClassNameEn("");
    setClassCode("");
    setClassHorseType("arabian");
    setClassGender("");
    setBirthDateFrom("");
    setBirthDateTo("");
    setClassStatus("open");
    setClassSortOrder("0");
    setClassMaxParticipants("");
  }

  function startAddClass(showId: string) {
    resetClassForm();

    setClassShowId(showId);
    setClassForm(true);
  }

  function startEditClass(classItem: ClassItem) {
    setClassEditingId(classItem.id);
    setClassShowId(classItem.show_id);

    setClassNameAr(classItem.name_ar);
    setClassNameEn(classItem.name_en || "");
    setClassCode(classItem.class_code || "");
    setClassHorseType(classItem.horse_type || "arabian");
    setClassGender(classItem.gender || "");
    setBirthDateFrom(classItem.birth_date_from || "");
    setBirthDateTo(classItem.birth_date_to || "");
    setClassStatus(classItem.status || "open");
    setClassSortOrder(String(classItem.sort_order ?? 0));
    setClassMaxParticipants(
      classItem.max_participants != null
        ? String(classItem.max_participants)
        : ""
    );

    setClassForm(true);
  }

  async function saveClass(e: React.FormEvent) {
    e.preventDefault();

    if (!classShowId) {
      alert("لم يتم تحديد البطولة الفرعية.");
      return;
    }

    if (!classNameAr.trim()) {
      alert("يرجى إدخال اسم الفئة بالعربي.");
      return;
    }

    if (
      birthDateFrom &&
      birthDateTo &&
      birthDateTo < birthDateFrom
    ) {
      alert(
        "تاريخ الميلاد النهائي يجب أن يكون بعد تاريخ الميلاد الابتدائي."
      );
      return;
    }

    const payload = {
      show_id: classShowId,
      name_ar: classNameAr.trim(),
      name_en: classNameEn.trim() || null,
      class_code: classCode.trim() || null,
      horse_type: classHorseType,
      gender: classGender || null,
      birth_date_from: birthDateFrom || null,
      birth_date_to: birthDateTo || null,
      status: classStatus,
      sort_order: Number(classSortOrder) || 0,
      max_participants:
        classMaxParticipants.trim() === ""
          ? null
          : Math.max(1, Number(classMaxParticipants)),
    };

    if (classEditingId) {
      const { error } = await supabase
        .from("classes")
        .update({
          name_ar: payload.name_ar,
          name_en: payload.name_en,
          class_code: payload.class_code,
          horse_type: payload.horse_type,
          gender: payload.gender,
          birth_date_from: payload.birth_date_from,
          birth_date_to: payload.birth_date_to,
          status: payload.status,
          sort_order: payload.sort_order,
          max_participants: payload.max_participants,
        })
        .eq("id", classEditingId);

      if (error) {
        console.error(error);
        alert(`خطأ Supabase: ${error.message}`);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("classes")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error(error);
        alert(`خطأ Supabase: ${error.message}`);
        return;
      }

      if (data) {
        setClasses((prev) => [...prev, data]);
      }
    }

    resetClassForm();
    await loadData();
  }

  async function deleteClass(classId: string) {
    const confirmed = confirm(
      "هل أنت متأكد من حذف هذه الفئة؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", classId);

    if (error) {
      console.error(error);
      alert(`خطأ Supabase: ${error.message}`);
      return;
    }

    setClasses((prev) =>
      prev.filter((item) => item.id !== classId)
    );
  }

  function classStatusLabel(status: string) {
    if (status === "open") return "مفتوحة";
    if (status === "closed") return "مغلقة";
    return "غير نشطة";
  }

  function classStatusStyle(status: string) {
    if (status === "open") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (status === "closed") {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }

  function horseTypeLabel(type: string) {
    if (type === "egyptian") return "الخيل العربية المصرية";
    if (type === "arabian") return "الخيل العربية";
    return "الكل";
  }

  function genderLabel(gender: string | null) {
    if (gender === "male") return "ذكور";
    if (gender === "female") return "إناث";
    return "ذكور وإناث";
  }

  /* =========================
     GENERAL
  ========================= */

  function statusLabel(status: string) {
    if (status === "open") return "التسجيل مفتوح";
    if (status === "closed") return "التسجيل مغلق";
    return "قريبًا";
  }

  function statusStyle(status: string) {
    if (status === "open") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (status === "closed") {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }

  function formatDate(date: string) {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "ar-KW",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#050B18",
          color: "#f4f4f4",
        }}
      >
        <div className="text-center text-gray-400">
          جاري تحميل البطولة...
        </div>
      </main>
    );
  }

  if (!championship) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#050B18",
          color: "#f4f4f4",
        }}
      >
        <div className="text-center">
          <Trophy
            size={45}
            className="mx-auto mb-5"
            style={{ color: gold }}
          />

          <h1 className="text-2xl font-black mb-3">
            البطولة غير موجودة
          </h1>

          <button
            onClick={() => {
              window.location.href =
                "/admin/championships";
            }}
            className="text-gray-400 hover:text-white"
          >
            العودة إلى البطولات
          </button>
        </div>
      </main>
    );
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
          <div className="max-w-7xl mx-auto px-6 py-5">

            <button
              onClick={() => {
                window.location.href =
                  "/admin/championships";
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5 text-sm"
            >
              <ArrowRight size={16} />
              العودة إلى البطولات
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              <div className="flex items-start gap-4">

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0"
                  style={{
                    color: gold,
                    borderColor: `${gold}30`,
                    background: `${gold}10`,
                  }}
                >
                  <Trophy size={28} />
                </div>

                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: gold }}
                  >
                    Kuwait Shows
                  </p>

                  <h1 className="text-2xl md:text-3xl font-black">
                    {championship.title_ar}
                  </h1>

                  {championship.title_en && (
                    <p
                      dir="ltr"
                      className="text-gray-500 text-sm mt-2"
                    >
                      {championship.title_en}
                    </p>
                  )}

                  {championship.year && (
                    <p className="text-gray-400 text-sm mt-2">
                      {championship.year}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition hover:scale-[1.02]"
                style={{
                  background: gold,
                  color: "#050B18",
                }}
              >
                <Plus size={18} />
                إضافة بطولة فرعية
              </button>

            </div>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">
                البطولات الفرعية
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                إدارة البطولات والتواريخ وحالة التسجيل والحكام والفئات.
              </p>
            </div>

            <span className="text-gray-500 text-sm">
              {shows.length} بطولة
            </span>
          </div>

          {shows.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-12 text-center">

              <CalendarDays
                size={45}
                className="mx-auto mb-5"
                style={{ color: gold }}
              />

              <h3 className="text-xl font-black mb-3">
                لا توجد بطولات فرعية
              </h3>

              <p className="text-gray-400 mb-6">
                أضيفي أول بطولة فرعية لهذه البطولة.
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
                إضافة بطولة فرعية
              </button>

            </div>
          ) : (
            <div className="grid gap-5">

              {shows.map((show, index) => {

                const showJudgesList =
                  getJudgesForShow(show.id);

                const availableJudges =
                  judges.filter(
                    (judge) =>
                      !showJudges.some(
                        (relation) =>
                          relation.show_id === show.id &&
                          relation.judge_id === judge.id
                      )
                  );

                const showClasses =
                  getClassesForShow(show.id);

                return (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6"
                  >

                    {/* Show information */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                      <div className="flex items-start gap-4">

                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0"
                          style={{
                            color: show.color || gold,
                            borderColor: `${show.color || gold}55`,
                            background: `${show.color || gold}15`,
                          }}
                        >
                          <CalendarDays size={24} />
                        </div>

                        <div>

                          <h3
                            className="text-xl font-black mb-2"
                            style={{ color: show.color || gold }}
                          >
                            {show.title_ar}
                          </h3>

                          {show.title_en && (
                            <p
                              dir="ltr"
                              className="text-gray-500 text-sm mb-3"
                            >
                              {show.title_en}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-sm">

                            <span className="text-gray-400">
                              {formatDate(show.start_date)}
                            </span>

                            <span className="text-gray-600">
                              —
                            </span>

                            <span className="text-gray-400">
                              {formatDate(show.end_date)}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs border ${statusStyle(
                                show.registration_status
                              )}`}
                            >
                              {statusLabel(
                                show.registration_status
                              )}
                            </span>

                          </div>

                        </div>
                      </div>

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => startEdit(show)}
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 transition hover:border-[#bc9b6a]/50 hover:text-white"
                        >
                          <Pencil size={16} />
                          تعديل
                        </button>

                        <button
                          onClick={() => deleteShow(show.id)}
                          className="flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300 transition hover:bg-red-400/10"
                        >
                          <Trash2 size={16} />
                          حذف
                        </button>

                      </div>

                    </div>

                    {/* =========================
                        JUDGES
                    ========================= */}

                    <div className="mt-7 pt-6 border-t border-white/10">

                      <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border"
                            style={{
                              color: gold,
                              borderColor: `${gold}30`,
                              background: `${gold}10`,
                            }}
                          >
                            <Gavel size={19} />
                          </div>

                          <div>
                            <h4 className="font-black">
                              الحكام المشاركون
                            </h4>

                            <p className="text-gray-500 text-xs mt-1">
                              الحكام المرتبطون بهذه البطولة
                            </p>
                          </div>

                        </div>

                        <span className="text-gray-500 text-sm">
                          {showJudgesList.length} حكم
                        </span>

                      </div>

                      {/* Current judges */}
                      {showJudgesList.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">

                          {showJudgesList.map((judge) => (

                            <div
                              key={judge.id}
                              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                            >

                              {judge.photo_url ? (
                                <img
                                  src={judge.photo_url}
                                  alt={judge.name_ar}
                                  className="w-11 h-11 rounded-xl object-cover border border-white/10"
                                />
                              ) : (
                                <div
                                  className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
                                  style={{
                                    color: gold,
                                    borderColor: `${gold}30`,
                                    background: `${gold}10`,
                                  }}
                                >
                                  <Gavel size={18} />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">

                                <p className="font-bold text-sm truncate">
                                  {judge.name_ar}
                                </p>

                                {judge.name_en && (
                                  <p
                                    dir="ltr"
                                    className="text-gray-500 text-xs truncate"
                                  >
                                    {judge.name_en}
                                  </p>
                                )}

                                {judge.country && (
                                  <p className="text-gray-500 text-xs mt-1">
                                    {judge.country}
                                  </p>
                                )}

                              </div>

                              <button
                                onClick={() =>
                                  removeJudgeFromShow(
                                    show.id,
                                    judge.id
                                  )
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-300 hover:bg-red-400/10 transition shrink-0"
                                title="إزالة الحكم"
                              >
                                <X size={16} />
                              </button>

                            </div>

                          ))}

                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center mb-5">

                          <Gavel
                            size={28}
                            className="mx-auto mb-3 text-gray-600"
                          />

                          <p className="text-gray-500 text-sm">
                            لم يتم إضافة أي حكام لهذه البطولة حتى الآن.
                          </p>

                        </div>
                      )}

                      {/* Add judge */}
                      <div className="flex flex-col sm:flex-row gap-3">

                        <select
                          value={selectedJudgeId[show.id] || ""}
                          onChange={(e) =>
                            setSelectedJudgeId((prev) => ({
                              ...prev,
                              [show.id]: e.target.value,
                            }))
                          }
                          disabled={
                            judgesLoading ||
                            availableJudges.length === 0
                          }
                          className="flex-1 rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-white outline-none focus:border-[#bc9b6a]"
                        >
                          <option value="">
                            {judgesLoading
                              ? "جاري تحميل الحكام..."
                              : availableJudges.length === 0
                              ? "جميع الحكام مضافون"
                              : "اختر حكمًا لإضافته"}
                          </option>

                          {availableJudges.map((judge) => (
                            <option
                              key={judge.id}
                              value={judge.id}
                            >
                              {judge.name_ar}
                              {judge.country
                                ? ` — ${judge.country}`
                                : ""}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            addJudgeToShow(show.id)
                          }
                          disabled={
                            judgesLoading ||
                            availableJudges.length === 0 ||
                            !selectedJudgeId[show.id]
                          }
                          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: gold,
                            color: "#050B18",
                          }}
                        >
                          <UserPlus size={17} />
                          إضافة الحكم
                        </button>

                      </div>

                      {judges.length === 0 && !judgesLoading && (
                        <div className="mt-4 rounded-xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4 text-yellow-300 text-sm">
                          لا يوجد حكام في النظام حاليًا.
                          <br />
                          أضيفي الحكام أولًا من قسم
                          <span className="font-bold mx-1">
                            إدارة الحكام
                          </span>
                          ثم عودي لهذه الصفحة.
                        </div>
                      )}

                    </div>

                    {/* =========================
                        CLASSES
                    ========================= */}

                    <div className="mt-7 pt-6 border-t border-white/10">

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border"
                            style={{
                              color: gold,
                              borderColor: `${gold}30`,
                              background: `${gold}10`,
                            }}
                          >
                            <ListChecks size={19} />
                          </div>

                          <div>
                            <h4 className="font-black">
                              فئات البطولة
                            </h4>

                            <p className="text-gray-500 text-xs mt-1">
                              الفئات الخاصة بهذه البطولة وقواعد أعمار الخيل
                            </p>
                          </div>

                        </div>

                        <div className="flex items-center gap-3">

                          <span className="text-gray-500 text-sm">
                            {showClasses.length} فئة
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              startAddClass(show.id)
                            }
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition hover:scale-[1.02]"
                            style={{
                              background: gold,
                              color: "#050B18",
                            }}
                          >
                            <Plus size={16} />
                            إضافة فئة
                          </button>

                        </div>

                      </div>

                      {classesLoading ? (
                        <div className="rounded-2xl border border-white/10 bg-black/10 p-6 text-center">
                          <p className="text-gray-500 text-sm">
                            جاري تحميل الفئات...
                          </p>
                        </div>
                      ) : showClasses.length > 0 ? (
                        <div className="grid gap-3">

                          {showClasses.map((classItem) => (

                            <div
                              key={classItem.id}
                              className="rounded-2xl border border-white/10 bg-black/20 p-4"
                            >

                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                <div className="flex items-start gap-4">

                                  <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
                                    style={{
                                      color: gold,
                                      borderColor: `${gold}30`,
                                      background: `${gold}10`,
                                    }}
                                  >
                                    <ListChecks size={18} />
                                  </div>

                                  <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                      <h5 className="font-black">
                                        {classItem.name_ar}
                                      </h5>

                                      {classItem.class_code && (
                                        <span
                                          dir="ltr"
                                          className="px-2 py-1 rounded-md bg-white/[0.05] border border-white/10 text-xs text-gray-400"
                                        >
                                          {classItem.class_code}
                                        </span>
                                      )}

                                      <span
                                        className={`px-2.5 py-1 rounded-full text-xs border ${classStatusStyle(
                                          classItem.status
                                        )}`}
                                      >
                                        {classStatusLabel(
                                          classItem.status
                                        )}
                                      </span>

                                    </div>

                                    {classItem.name_en && (
                                      <p
                                        dir="ltr"
                                        className="text-gray-500 text-xs mt-1"
                                      >
                                        {classItem.name_en}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-3">

                                      <span className="px-3 py-1.5 rounded-lg bg-white/[0.035] border border-white/10 text-xs text-gray-400">
                                        {horseTypeLabel(
                                          classItem.horse_type
                                        )}
                                      </span>

                                      <span className="px-3 py-1.5 rounded-lg bg-white/[0.035] border border-white/10 text-xs text-gray-400">
                                        {genderLabel(
                                          classItem.gender
                                        )}
                                      </span>

                                      {(classItem.birth_date_from ||
                                        classItem.birth_date_to) && (
                                        <span className="px-3 py-1.5 rounded-lg bg-white/[0.035] border border-white/10 text-xs text-gray-400">
                                          الميلاد:
                                          {" "}
                                          {classItem.birth_date_from ||
                                            "—"}
                                          {" "}
                                          إلى
                                          {" "}
                                          {classItem.birth_date_to ||
                                            "—"}
                                        </span>
                                      )}

                                      <span className="px-3 py-1.5 rounded-lg bg-white/[0.035] border border-white/10 text-xs text-gray-500">
                                        ترتيب:{" "}
                                        {classItem.sort_order}
                                      </span>

                                      <span className="px-3 py-1.5 rounded-lg bg-white/[0.035] border border-white/10 text-xs text-gray-400">
                                        الحد الأقصى:{" "}
                                        {classItem.max_participants != null
                                          ? `${classItem.max_participants} خيل`
                                          : "غير محدد"}
                                      </span>

                                    </div>

                                  </div>

                                </div>

                                <div className="flex items-center gap-2 shrink-0">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditClass(classItem)
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#bc9b6a]/50 hover:text-white"
                                  >
                                    <Pencil size={15} />
                                    تعديل
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteClass(classItem.id)
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                                  >
                                    <Trash2 size={15} />
                                    حذف
                                  </button>

                                </div>

                              </div>

                            </div>

                          ))}

                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-7 text-center">

                          <ListChecks
                            size={30}
                            className="mx-auto mb-3 text-gray-600"
                          />

                          <p className="text-gray-500 text-sm mb-4">
                            لم تتم إضافة أي فئات لهذه البطولة حتى الآن.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              startAddClass(show.id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-sm"
                            style={{
                              background: gold,
                              color: "#050B18",
                            }}
                          >
                            <Plus size={16} />
                            إضافة أول فئة
                          </button>

                        </div>
                      )}

                    </div>

                  </motion.div>
                );
              })}

            </div>
          )}

        </section>
      </div>

      {/* =========================
          ADD / EDIT SHOW MODAL
      ========================= */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={resetForm}
          />

          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#08101f] shadow-2xl p-7 max-h-[90vh] overflow-y-auto"
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
                  {editingId
                    ? "تعديل البطولة الفرعية"
                    : "إضافة بطولة فرعية"}
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
              onSubmit={saveShow}
              className="space-y-5"
            >

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  اسم البطولة الفرعية بالعربي *
                </label>

                <input
                  value={titleAr}
                  onChange={(e) =>
                    setTitleAr(e.target.value)
                  }
                  required
                  placeholder="مثال: بطولة الخيل العربية"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  الاسم بالإنجليزي
                </label>

                <input
                  value={titleEn}
                  onChange={(e) =>
                    setTitleEn(e.target.value)
                  }
                  dir="ltr"
                  placeholder="Arabian Horse Championship"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    تاريخ البداية *
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    تاريخ النهاية *
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />
                </div>

              </div>

              {/* Registration Fee */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  رسوم التسجيل (د.ك)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={registrationFee}
                  onChange={(e) =>
                    setRegistrationFee(e.target.value)
                  }
                  placeholder="مثال: 100.000"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

                <p className="text-gray-500 text-xs mt-2">
                  أدخلي 0 إذا كانت البطولة مجانية.
                </p>
              </div>

              {/* Show Color */}
              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  لون البطولة الفرعية
                </label>

                <div className="grid grid-cols-5 gap-3">
                  {[
                    { name: "ذهبي", value: "#BC9B6A" },
                    { name: "أزرق", value: "#4DA3FF" },
                    { name: "بنفسجي", value: "#A78BFA" },
                    { name: "أخضر", value: "#4ADE80" },
                    { name: "وردي", value: "#F472B6" },
                    { name: "سماوي", value: "#22D3EE" },
                    { name: "برتقالي", value: "#FB923C" },
                    { name: "أحمر", value: "#F87171" },
                    { name: "فضي", value: "#CBD5E1" },
                    { name: "تركوازي", value: "#2DD4BF" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setShowColor(item.value)}
                      className="h-12 rounded-xl border-2 transition relative"
                      style={{
                        background: `${item.value}20`,
                        borderColor:
                          showColor === item.value
                            ? item.value
                            : "rgba(255,255,255,0.08)",
                        boxShadow:
                          showColor === item.value
                            ? `0 0 0 2px ${item.value}35`
                            : "none",
                      }}
                      title={item.name}
                    >
                      <span
                        className="block w-5 h-5 rounded-full mx-auto"
                        style={{ background: item.value }}
                      />
                    </button>
                  ))}
                </div>

                <div
                  className="mt-4 rounded-xl border p-3 flex items-center gap-3"
                  style={{
                    borderColor: `${showColor}40`,
                    background: `${showColor}10`,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ background: showColor }}
                  />
                  <span
                    className="font-bold"
                    style={{ color: showColor }}
                  >
                    {titleAr || "اسم البطولة الفرعية"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  حالة التسجيل
                </label>

                <select
                  value={registrationStatus}
                  onChange={(e) =>
                    setRegistrationStatus(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                >
                  <option value="coming_soon">
                    قريبًا
                  </option>

                  <option value="open">
                    مفتوح
                  </option>

                  <option value="closed">
                    مغلق
                  </option>
                </select>
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

      {/* =========================
          ADD / EDIT CLASS MODAL
      ========================= */}

      {classForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={resetClassForm}
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
                  {classEditingId
                    ? "تعديل الفئة"
                    : "إضافة فئة جديدة"}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  يتم حفظ هذه الفئة لهذه البطولة الفرعية فقط.
                </p>
              </div>

              <button
                onClick={resetClassForm}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={saveClass}
              className="space-y-5"
            >

              {/* Arabic name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  اسم الفئة بالعربي *
                </label>

                <input
                  value={classNameAr}
                  onChange={(e) =>
                    setClassNameAr(e.target.value)
                  }
                  required
                  placeholder="مثال: مهرات مواليد 2023"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />
              </div>

              {/* English name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  اسم الفئة بالإنجليزي
                </label>

                <input
                  value={classNameEn}
                  onChange={(e) =>
                    setClassNameEn(e.target.value)
                  }
                  dir="ltr"
                  placeholder="Fillies Born in 2023"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />
              </div>

              {/* Code + Sort */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    كود الفئة
                  </label>

                  <input
                    value={classCode}
                    onChange={(e) =>
                      setClassCode(e.target.value)
                    }
                    dir="ltr"
                    placeholder="C01"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    ترتيب الفئة
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={classSortOrder}
                    onChange={(e) =>
                      setClassSortOrder(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />
                </div>

              </div>

              {/* Maximum participants */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  الحد الأقصى لعدد الخيل في الفئة
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={classMaxParticipants}
                  onChange={(e) =>
                    setClassMaxParticipants(e.target.value)
                  }
                  placeholder="مثال: 20"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                />

                <p className="text-gray-500 text-xs mt-2">
                  اتركي الحقل فارغًا إذا كانت الفئة بدون حد أقصى.
                </p>
              </div>

              {/* Horse type + Gender */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    نوع الخيل *
                  </label>

                  <select
                    value={classHorseType}
                    onChange={(e) =>
                      setClassHorseType(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  >
                    <option value="arabian">
                      الخيل العربية
                    </option>

                    <option value="egyptian">
                      الخيل العربية المصرية
                    </option>

                    <option value="all">
                      الكل
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    الجنس
                  </label>

                  <select
                    value={classGender}
                    onChange={(e) =>
                      setClassGender(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  >
                    <option value="">
                      ذكور وإناث
                    </option>

                    <option value="male">
                      ذكور
                    </option>

                    <option value="female">
                      إناث
                    </option>
                  </select>
                </div>

              </div>

              {/* Birth dates */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                <div className="mb-4">
                  <h3 className="font-black">
                    نطاق تاريخ ميلاد الخيل
                  </h3>

                  <p className="text-gray-500 text-xs mt-1">
                    استخدميه إذا كانت الفئة تعتمد على عمر أو تاريخ ميلاد الخيل.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      من تاريخ
                    </label>

                    <input
                      type="date"
                      value={birthDateFrom}
                      onChange={(e) =>
                        setBirthDateFrom(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      إلى تاريخ
                    </label>

                    <input
                      type="date"
                      value={birthDateTo}
                      onChange={(e) =>
                        setBirthDateTo(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                    />
                  </div>

                </div>

              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  حالة الفئة
                </label>

                <select
                  value={classStatus}
                  onChange={(e) =>
                    setClassStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                >
                  <option value="open">
                    مفتوحة
                  </option>

                  <option value="closed">
                    مغلقة
                  </option>

                  <option value="inactive">
                    غير نشطة
                  </option>
                </select>
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
                  {classEditingId
                    ? "حفظ تعديلات الفئة"
                    : "إضافة الفئة"}
                </button>

                <button
                  type="button"
                  onClick={resetClassForm}
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