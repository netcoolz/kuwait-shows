"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Gavel,
  Loader2,
  MapPin,
  Phone,
  User,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const gold = "#bc9b6a";

type Championship = {
  id: string;
  title_ar: string;
  year: number | null;
  location_ar: string | null;
};

type Show = {
  id: string;
  championship_id: string;
  title_ar: string;
  title_en: string | null;
  slug: string;
  start_date: string;
  end_date: string;
  registration_status: string;
  registration_fee: number;
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
};

type FormData = {
  participant_name: string;
  phone: string;
  email: string;
  horse_type: "arabian" | "egyptian";
  horse_registration_number: string;
  horse_name: string;
  horse_birth_date: string;
  gender: "male" | "female" | "";
  class_id: string;
  has_conflict_of_interest: boolean;
  conflict_judge_name: string;
};

function formatDate(date: string) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("ar-KW", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatFee(value: number) {
  return Number(value || 0).toFixed(3);
}

function getHorseTypeLabel(type: string) {
  return type === "egyptian" ? "الخيل العربية المصرية" : "الخيل العربية";
}

function getGenderLabel(gender: string | null) {
  if (gender === "male") return "ذكور";
  if (gender === "female") return "إناث";
  return "الكل";
}

export default function RegistrationPage() {
  const params = useParams();
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [championship, setChampionship] = useState<Championship | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classRegistrationCounts, setClassRegistrationCounts] =
    useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNumber, setSuccessNumber] = useState("");

  const [form, setForm] = useState<FormData>({
    participant_name: "",
    phone: "",
    email: "",
    horse_type: "arabian",
    horse_registration_number: "",
    horse_name: "",
    horse_birth_date: "",
    gender: "",
    class_id: "",
    has_conflict_of_interest: false,
    conflict_judge_name: "",
  });

  useEffect(() => {
    if (!slug) return;
    loadPage();
  }, [slug]);

  async function loadPage() {
    setLoading(true);
    setErrorMessage("");

    // نأخذ الـ slug من المسار مباشرة كحل آمن في حال أعاد useParams
    // قيمة غير متوقعة، ثم نفك ترميز الرابط مرة واحدة فقط.
    let routeSlug = slug;

    if (typeof window !== "undefined") {
      const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

      const registerIndex = parts.indexOf("register");

      if (registerIndex >= 0 && parts[registerIndex + 1]) {
        routeSlug = parts[registerIndex + 1];
      }
    }

    try {
      routeSlug = decodeURIComponent(routeSlug).trim();
    } catch {
      routeSlug = routeSlug.trim();
    }

    if (!routeSlug) {
      setErrorMessage("رابط البطولة غير صحيح.");
      setLoading(false);
      return;
    }

    const showColumns =
      "id,championship_id,title_ar,title_en,slug,start_date,end_date,registration_status,registration_fee,horse_type";

    // نستخدم maybeSingle بدلاً من single حتى لا يتحول عدم وجود سجل
    // إلى خطأ غير واضح من Supabase.
    let { data: showData, error: showError } = await supabase
      .from("shows")
      .select(showColumns)
      .eq("slug", routeSlug)
      .maybeSingle();

    // محاولة احتياطية: في حال كان الـ slug مخزناً بترميز مختلف،
    // نقرأ السجلات المتاحة ونطابق القيمة بعد فك الترميز.
    if (!showData && !showError) {
      const { data: allShows, error: allShowsError } = await supabase
        .from("shows")
        .select(showColumns);

      if (!allShowsError && allShows) {
        showData =
          allShows.find((item) => {
            let itemSlug = item.slug || "";

            try {
              itemSlug = decodeURIComponent(itemSlug);
            } catch {
              // نستخدم القيمة الأصلية إذا لم تكن بحاجة إلى فك ترميز.
            }

            return itemSlug.trim() === routeSlug;
          }) || null;
      }
    }

    if (showError || !showData) {
      console.error("Registration show lookup failed:", showError);

      setErrorMessage(
        "لم نتمكن من العثور على هذه البطولة الفرعية. يرجى الرجوع إلى صفحة البطولات والمحاولة من زر التسجيل مرة أخرى."
      );

      setLoading(false);
      return;
    }

    setShow(showData);

    const showHorseType =
      showData.horse_type === "egyptian" ? "egyptian" : "arabian";

    setForm((prev) => ({
      ...prev,
      horse_type: showHorseType,
      class_id: "",
    }));

    // نجلب البيانات الأساسية بالتوازي حتى لا ينتظر الهاتف طلبًا بعد الآخر.
    // عدّاد التسجيلات ليس مطلوبًا لعرض الصفحة، لذلك نجلبه في الخلفية
    // بعد إظهار النموذج حتى يظهر المحتوى بسرعة على الآيفون.
    const [championshipResult, classesResult] = await Promise.all([
      supabase
        .from("championships")
        .select("id,title_ar,year,location_ar")
        .eq("id", showData.championship_id)
        .single(),

      supabase
        .from("classes")
        .select(
          "id,show_id,name_ar,name_en,class_code,horse_type,gender,birth_date_from,birth_date_to,status,sort_order"
        )
        .eq("show_id", showData.id)
        .eq("status", "open")
        .order("sort_order", { ascending: true }),
    ]);

    if (championshipResult.error) {
      console.error("Championship lookup failed:", championshipResult.error);
    }

    if (classesResult.error) {
      console.error("Classes lookup failed:", classesResult.error);
      setErrorMessage(
        "تعذر تحميل فئات البطولة. يرجى المحاولة مرة أخرى."
      );
    }

    setChampionship(championshipResult.data || null);
    setClasses(classesResult.data || []);
    setLoading(false);

    // نحمّل عدد المسجلين في الخلفية بعد ظهور الصفحة مباشرة،
    // حتى لا يتأخر فتح نموذج التسجيل على الآيفون بسبب طلب إضافي.
    void (async () => {
      const { data: registrationRows, error: registrationCountsError } =
        await supabase
          .from("registrations")
          .select("class_id")
          .eq("show_id", showData.id)
          .not("class_id", "is", null);

      if (registrationCountsError) {
        console.error(
          "Class registration counts lookup failed:",
          registrationCountsError
        );
        return;
      }

      const counts: Record<string, number> = {};

      (registrationRows || []).forEach((row) => {
        if (!row.class_id) return;
        counts[row.class_id] = (counts[row.class_id] || 0) + 1;
      });

      setClassRegistrationCounts(counts);
    })();
  }

  const availableClasses = useMemo(() => {
    if (!form.horse_birth_date) return [];

    const birthDate = form.horse_birth_date;

    return classes.filter((item) => {
      const typeMatches =
        item.horse_type === form.horse_type ||
        item.horse_type === "all";

      const genderMatches =
        !item.gender ||
        item.gender === "all" ||
        item.gender === form.gender;

      const fromMatches =
        !item.birth_date_from || birthDate >= item.birth_date_from;

      const toMatches =
        !item.birth_date_to || birthDate <= item.birth_date_to;

      return typeMatches && genderMatches && fromMatches && toMatches;
    });
  }, [
    classes,
    form.horse_type,
    form.gender,
    form.horse_birth_date,
  ]);

  useEffect(() => {
    if (
      form.class_id &&
      !availableClasses.some((item) => item.id === form.class_id)
    ) {
      setForm((prev) => ({ ...prev, class_id: "" }));
    }
  }, [availableClasses, form.class_id]);

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function submitRegistration(e: React.FormEvent) {
    e.preventDefault();

    if (!show) return;

    setErrorMessage("");

    if (show.registration_status !== "open") {
      setErrorMessage("التسجيل في هذه البطولة غير مفتوح حالياً.");
      return;
    }

    if (!form.participant_name.trim()) {
      setErrorMessage("يرجى إدخال اسم المشارك.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage("يرجى إدخال رقم الهاتف.");
      return;
    }

    if (!form.horse_registration_number.trim()) {
      setErrorMessage("يرجى إدخال رقم تسجيل الخيل.");
      return;
    }

    if (!form.horse_name.trim()) {
      setErrorMessage("يرجى إدخال اسم الخيل.");
      return;
    }

    if (!form.horse_birth_date) {
      setErrorMessage("يرجى إدخال تاريخ ميلاد الخيل.");
      return;
    }

    if (!form.gender) {
      setErrorMessage("يرجى اختيار جنس الخيل.");
      return;
    }

    if (!form.class_id) {
      setErrorMessage("يرجى اختيار الفئة المناسبة للخيل.");
      return;
    }

    if (
      form.has_conflict_of_interest &&
      !form.conflict_judge_name.trim()
    ) {
      setErrorMessage("يرجى ذكر اسم الحكم الذي يوجد معه تعارض مصالح.");
      return;
    }

    const selectedClass = availableClasses.find(
      (item) => item.id === form.class_id
    );

    if (!selectedClass) {
      setErrorMessage(
        "الفئة المختارة غير متوافقة مع بيانات الخيل. يرجى إعادة اختيار الفئة."
      );
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("registrations")
      .insert({
        show_id: show.id,
        participant_name: form.participant_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        horse_type: form.horse_type,
        horse_registration_number:
          form.horse_registration_number.trim(),
        horse_name: form.horse_name.trim(),
        horse_birth_date: form.horse_birth_date,
        class_id: form.class_id,
        has_conflict_of_interest:
          form.has_conflict_of_interest,
        conflict_judge_name:
          form.has_conflict_of_interest
            ? form.conflict_judge_name.trim()
            : null,
      })
      .select("registration_number")
      .single();

    setSubmitting(false);

    if (error) {
      console.error(error);

      if (error.code === "23505") {
        setErrorMessage(
          "حدث تعارض أثناء إنشاء رقم التسجيل. يرجى المحاولة مرة أخرى."
        );
      } else {
        setErrorMessage(
          `تعذر إتمام التسجيل: ${error.message}`
        );
      }

      return;
    }

    setSuccessNumber(data.registration_number);
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
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="animate-spin" size={22} />
          جاري تحميل نموذج التسجيل...
        </div>
      </main>
    );
  }

  if (errorMessage && !show) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "#050B18",
          color: "#f4f4f4",
        }}
      >
        <div className="text-center max-w-xl">
          <p className="text-red-300 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#bc9b6a]/50 transition"
          >
            العودة
          </button>
        </div>
      </main>
    );
  }

  if (successNumber && show) {
    return (
      <main
        dir="rtl"
        className="min-h-screen px-3 sm:px-6 py-8 sm:py-12"
        style={{
          background: "#050B18",
          color: "#f4f4f4",
        }}
      >
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-220px] right-[-180px] w-[600px] h-[600px] rounded-full blur-[170px] opacity-[0.08]"
            style={{ background: gold }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-none sm:backdrop-blur-xl p-5 sm:p-8 md:p-14 text-center shadow-2xl"
          >
            <div
              className="mx-auto mb-7 w-20 h-20 rounded-full flex items-center justify-center border"
              style={{
                color: gold,
                borderColor: `${gold}55`,
                background: `${gold}12`,
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <p
              className="text-xs tracking-[0.25em] uppercase mb-3"
              style={{ color: gold }}
            >
              KUWAIT SHOWS
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-5 break-words">
              تم استلام التسجيل بنجاح
            </h1>

            <p className="text-gray-300 leading-8 mb-3">
              تم تسجيل مشاركتك في:
            </p>

            <h2
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-8 break-words"
              style={{ color: gold }}
            >
              {show.title_ar}
            </h2>

            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-6 mb-7">
              <p className="text-sm text-gray-400 mb-3">
                رقم التسجيل
              </p>

              <div
                dir="ltr"
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.08em] sm:tracking-[0.12em] break-all"
                style={{ color: gold }}
              >
                {successNumber}
              </div>
            </div>

            <p className="text-gray-400 leading-8 text-sm md:text-base">
              يرجى الاحتفاظ برقم التسجيل.
              <br />
              سيتم إرسال رابط الدفع إلى رقم الهاتف المسجل
              لاستكمال عملية الدفع.
            </p>

            <button
              onClick={() => router.push(`/shows/${show.slug}`)}
              className="mt-9 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 min-h-[52px] font-semibold transition hover:scale-[1.02]"
              style={{
                background: gold,
                color: "#050B18",
              }}
            >
              العودة إلى البطولة
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!show) return null;

  const isOpen = show.registration_status === "open";

  return (
    <main
      dir="rtl"
      className="min-h-screen"
      style={{
        background: "#050B18",
        color: "#f4f4f4",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-220px] right-[-180px] w-[600px] h-[600px] rounded-full blur-[170px] opacity-[0.07]"
          style={{ background: gold }}
        />
        <div
          className="absolute bottom-[-250px] left-[-200px] w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.04]"
          style={{ background: gold }}
        />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-none sm:backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
            >
              <ArrowRight size={17} />
              العودة
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-7 sm:py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={20} style={{ color: gold }} />
              <span
                className="text-xs tracking-[0.22em] uppercase"
                style={{ color: gold }}
              >
                KUWAIT SHOWS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight break-words">
              التسجيل في {show.title_ar}
            </h1>

            <p className="text-gray-400 mt-4 max-w-3xl leading-8">
              {championship?.title_ar}
              {championship?.year ? ` — ${championship.year}` : ""}
            </p>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 min-w-0">
                <CalendarDays size={16} style={{ color: gold }} />
                {formatDate(show.start_date)} —{" "}
                {formatDate(show.end_date)}
              </div>

              {championship?.location_ar && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 min-w-0">
                  <MapPin size={16} style={{ color: gold }} />
                  {championship.location_ar}
                </div>
              )}

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 min-w-0">
                <CircleDollarSign size={16} style={{ color: gold }} />
                رسوم التسجيل:{" "}
                <span style={{ color: gold }}>
                  {formatFee(show.registration_fee)} د.ك
                </span>
              </div>
            </div>
          </motion.div>

          {!isOpen ? (
            <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/5 p-8 text-center">
              <p className="text-yellow-200 font-semibold text-lg">
                التسجيل غير مفتوح حالياً
              </p>
              <p className="text-gray-400 mt-2">
                يرجى العودة لاحقاً لمتابعة فتح التسجيل.
              </p>
            </div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submitRegistration}
              className="rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-none sm:backdrop-blur-xl p-4 sm:p-6 md:p-10"
            >
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <section>
                  <SectionTitle
                    icon={<User size={19} />}
                    title="بيانات المشارك"
                  />

                  <div className="space-y-4 sm:space-y-5">
                    <Field
                      label="اسم المشارك *"
                      value={form.participant_name}
                      onChange={(value) =>
                        updateField("participant_name", value)
                      }
                      placeholder="أدخل اسم المشارك"
                    />

                    <Field
                      label="رقم الهاتف *"
                      type="tel"
                      value={form.phone}
                      onChange={(value) =>
                        updateField("phone", value)
                      }
                      placeholder="مثال: 965XXXXXXXX"
                      icon={<Phone size={17} />}
                      dir="ltr"
                    />

                    <Field
                      label="البريد الإلكتروني"
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField("email", value)
                      }
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle
                    icon={<FileText size={19} />}
                    title="بيانات الخيل"
                  />

                  <div className="space-y-4 sm:space-y-5">

                    <div className="rounded-2xl border border-[#bc9b6a]/20 bg-[#bc9b6a]/[0.06] p-3.5 sm:p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            نوع الخيل في هذه البطولة
                          </p>
                          <p className="font-bold text-[#bc9b6a]">
                            {getHorseTypeLabel(form.horse_type)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          يتم تحديده تلقائيًا
                        </span>
                      </div>
                    </div>

                    <Field
                      label="رقم تسجيل الخيل *"
                      value={form.horse_registration_number}
                      onChange={(value) =>
                        updateField(
                          "horse_registration_number",
                          value
                        )
                      }
                      placeholder="أدخل رقم تسجيل الخيل"
                    />

                    <Field
                      label="اسم الخيل *"
                      value={form.horse_name}
                      onChange={(value) =>
                        updateField("horse_name", value)
                      }
                      placeholder="أدخل اسم الخيل"
                    />

                    <Field
                      label="تاريخ ميلاد الخيل *"
                      type="date"
                      value={form.horse_birth_date}
                      onChange={(value) => {
                        updateField("horse_birth_date", value);
                        updateField("class_id", "");
                      }}
                    />

                    <SelectField
                      label="جنس الخيل *"
                      value={form.gender}
                      onChange={(value) => {
                        updateField(
                          "gender",
                          value as FormData["gender"]
                        );
                        updateField("class_id", "");
                      }}
                      options={[
                        {
                          value: "",
                          label: "اختر الجنس",
                        },
                        {
                          value: "male",
                          label: "ذكر",
                        },
                        {
                          value: "female",
                          label: "أنثى",
                        },
                      ]}
                    />
                  </div>
                </section>
              </div>

              <div className="border-t border-white/10 my-10" />

              <section>
                <SectionTitle
                  icon={<Trophy size={19} />}
                  title="اختيار الفئة"
                />

                {!form.horse_birth_date || !form.gender ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-gray-400 text-sm leading-7">
                    أدخل <span className="text-white">تاريخ ميلاد الخيل</span>{" "}
                    واختر <span className="text-white">جنس الخيل</span>{" "}
                    حتى تظهر الفئات المناسبة تلقائياً.
                  </div>
                ) : availableClasses.length === 0 ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-red-200 text-sm leading-7">
                    لا توجد فئة مفتوحة مطابقة لبيانات الخيل الحالية.
                    يرجى مراجعة تاريخ الميلاد ونوع وجنس الخيل أو التواصل مع
                    اللجنة المنظمة.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {availableClasses.map((item) => {
                      const currentCount = classRegistrationCounts[item.id] || 0;

                      return (
                        <label
                          key={item.id}
                          className={`relative rounded-2xl border p-4 sm:p-5 transition cursor-pointer ${
                            form.class_id === item.id
                              ? "border-[#bc9b6a]/70 bg-[#bc9b6a]/10"
                              : "border-white/10 bg-white/[0.025] hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="class_id"
                            value={item.id}
                            checked={form.class_id === item.id}
                            onChange={() => updateField("class_id", item.id)}
                            className="sr-only"
                          />

                          <div className="flex items-start justify-between gap-4">
                            <div>
                              {item.class_code && (
                                <p
                                  className="text-xs mb-2"
                                  style={{ color: gold }}
                                >
                                  {item.class_code}
                                </p>
                              )}

                              <p className="font-semibold text-base sm:text-lg break-words">
                                {item.name_ar}
                              </p>

                              <p className="text-sm text-gray-500 mt-2">
                                {getHorseTypeLabel(item.horse_type)}
                                {" · "}
                                {getGenderLabel(item.gender)}
                              </p>

                              <p className="text-xs text-gray-500 mt-3">
                                المسجلون حاليًا:{" "}
                                <span style={{ color: gold }}>{currentCount}</span>
                              </p>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border flex-shrink-0 mt-1 ${
                                form.class_id === item.id
                                  ? "border-[#bc9b6a] bg-[#bc9b6a]"
                                  : "border-white/20"
                              }`}
                            >
                              {form.class_id === item.id && (
                                <div className="w-full h-full rounded-full scale-50 bg-[#050B18]" />
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                    </div>
                )}
              </section>

              <div className="border-t border-white/10 my-10" />

              <section>
                <SectionTitle
                  icon={<Gavel size={19} />}
                  title="تعارض المصالح"
                />

                <label className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.has_conflict_of_interest}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateField(
                        "has_conflict_of_interest",
                        checked
                      );

                      if (!checked) {
                        updateField("conflict_judge_name", "");
                      }
                    }}
                    className="mt-1 w-5 h-5 accent-[#bc9b6a]"
                  />

                  <div>
                    <p className="font-semibold break-words">
                      هل لديك تعارض مصالح مع أحد الحكام؟
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      في حال وجود تعارض، يرجى تحديد اسم الحكم.
                    </p>
                  </div>
                </label>

                {form.has_conflict_of_interest && (
                  <div className="mt-5">
                    <Field
                      label="اسم الحكم *"
                      value={form.conflict_judge_name}
                      onChange={(value) =>
                        updateField(
                          "conflict_judge_name",
                          value
                        )
                      }
                      placeholder="أدخل اسم الحكم"
                    />
                  </div>
                )}
              </section>

              {errorMessage && (
                <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-red-200 text-sm leading-7">
                  {errorMessage}
                </div>
              )}

              <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-black/10 p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <p className="text-gray-400 text-sm">
                      رسوم التسجيل
                    </p>
                    <p
                      className="text-2xl sm:text-3xl font-bold mt-1"
                      style={{ color: gold }}
                    >
                      {formatFee(show.registration_fee)} د.ك
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-6 sm:px-8 py-4 min-h-[54px] font-bold transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: gold,
                      color: "#050B18",
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                        جاري إتمام التسجيل...
                      </>
                    ) : (
                      <>
                        إتمام عملية التسجيل
                        <ArrowRight size={19} />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-5 leading-6">
                  بعد إرسال الطلب سيتم إنشاء رقم تسجيل خاص بك، وسيتم
                  إرسال رابط الدفع إلى رقم الهاتف المسجل لاستكمال عملية
                  الدفع.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </main>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          color: gold,
          background: `${gold}12`,
          border: `1px solid ${gold}25`,
        }}
      >
        {icon}
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={`w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#bc9b6a]/60 focus:bg-white/[0.05] ${
            icon ? "pr-11" : ""
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white outline-none transition focus:border-[#bc9b6a]/60"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#0b1220]"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
        />
      </div>
    </div>
  );
}
