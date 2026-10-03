"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Users,
  CreditCard,
  CheckCircle2,
  Clock3,
  Eye,
  X,
  
} from "lucide-react";

const gold = "#bc9b6a";

type Championship = {
  id: string;
  title_ar: string;
  year: number | null;
};

type Show = {
  id: string;
  championship_id: string;
  title_ar: string;
  start_date: string;
  end_date: string;
  registration_status: string;
  color: string;
};

type ClassItem = {
  id: string;
  show_id: string;
  name_ar: string;
  name_en: string | null;
  class_code: string | null;
  horse_type: string;
  gender: string | null;
  max_participants: number | null;
};

type Registration = {
  id: string;
  show_id: string;
  registration_number: string;
  participant_name: string;
  phone: string;
  email: string | null;
  horse_type: string;
  horse_registration_number: string;
  horse_name: string;
  has_conflict_of_interest: boolean;
  conflict_judge_name: string | null;
  payment_status: string;
  payment_confirmed_at: string | null;
  created_at: string;
  class_id?: string | null;
};

export default function RegistrationsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [selectedChampionship, setSelectedChampionship] =
    useState("");

  const [selectedShow, setSelectedShow] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [details, setDetails] =
    useState<Registration | null>(null);

  function getReportTitle() {
    const championship = championships.find(
      (item) => item.id === selectedChampionship
    );

    const show = shows.find((item) => item.id === selectedShow);

    if (show) return show.title_ar;
    if (championship) return championship.title_ar;
    return "جميع البطولات";
  }

  function getSafeFileName(value: string) {
    return value
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\\s+/g, "_")
      .trim() || "kuwait-shows-report";
  }

  function exportExcel() {
    if (filteredRegistrations.length === 0) {
      alert("لا توجد بيانات لتصديرها.");
      return;
    }

    const rows = filteredRegistrations.map((registration) => {
      const show = getShow(registration.show_id);

      return {
        "رقم التسجيل": registration.registration_number,
        "اسم المشارك": registration.participant_name,
        "رقم الهاتف": registration.phone,
        "البريد الإلكتروني": registration.email || "",
        "البطولة": show?.title_ar || "",
        "تاريخ البطولة": show
          ? `${show.start_date} - ${show.end_date}`
          : "",
        "الفئة": (() => {
          const classId = registration.class_id;
          return (
            classes.find((item) => item.id === classId)?.name_ar || ""
          );
        })(),
        "اسم الخيل": registration.horse_name,
        "رقم تسجيل الخيل": registration.horse_registration_number,
        "نوع الخيل":
          registration.horse_type === "egyptian"
            ? "الخيل العربية المصرية"
            : "الخيل العربية",
        "تعارض مصالح":
          registration.has_conflict_of_interest ? "نعم" : "لا",
        "الحكم المتعارض":
          registration.conflict_judge_name || "",
        "حالة الدفع":
          registration.payment_status === "paid"
            ? "مدفوع"
            : "غير مدفوع",
        "وقت تأكيد الدفع":
          registration.payment_confirmed_at || "",
        "تاريخ التسجيل": registration.created_at,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 24 },
      { wch: 16 },
      { wch: 28 },
      { wch: 30 },
      { wch: 24 },
      { wch: 24 },
      { wch: 22 },
      { wch: 22 },
      { wch: 16 },
      { wch: 24 },
      { wch: 14 },
      { wch: 24 },
      { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "التسجيلات");

    XLSX.writeFile(
      workbook,
      `${getSafeFileName(getReportTitle())}_registrations.xlsx`
    );
  }

  function printReport() {
    if (filteredRegistrations.length === 0) {
      alert("لا توجد بيانات للطباعة.");
      return;
    }

    const reportTitle = getReportTitle();
    const generatedAt = new Date().toLocaleString("ar-KW", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const rows = filteredRegistrations
      .map((registration) => {
        const show = getShow(registration.show_id);

        return `
          <tr>
            <td>${registration.registration_number}</td>
            <td>${registration.participant_name}</td>
            <td dir="ltr">${registration.phone}</td>
            <td>${show?.title_ar || "—"}</td>
            <td>${
              classes.find(
                (item) => item.id === registration.class_id
              )?.name_ar || "—"
            }</td>
            <td>${registration.horse_name}</td>
            <td>${registration.horse_registration_number}</td>
            <td>${
              registration.horse_type === "egyptian"
                ? "الخيل العربية المصرية"
                : "الخيل العربية"
            }</td>
            <td>${
              registration.payment_status === "paid"
                ? "مدفوع"
                : "غير مدفوع"
            }</td>
            <td>${
              registration.has_conflict_of_interest
                ? registration.conflict_judge_name || "نعم"
                : "لا"
            }</td>
          </tr>
        `;
      })
      .join("");

    const printWindow = window.open("", "_blank", "width=1400,height=900");

    if (!printWindow) {
      alert("يرجى السماح بفتح نافذة الطباعة من المتصفح.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <title>${reportTitle}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 35px;
              font-family: Arial, Tahoma, sans-serif;
              color: #172033;
              background: white;
            }
            .header {
              border-bottom: 3px solid #bc9b6a;
              padding-bottom: 18px;
              margin-bottom: 24px;
            }
            .brand {
              color: #bc9b6a;
              font-size: 12px;
              letter-spacing: 2px;
              font-weight: bold;
            }
            h1 {
              margin: 8px 0;
              font-size: 26px;
            }
            .meta {
              color: #667085;
              font-size: 13px;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 24px;
            }
            .stat {
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 13px;
              background: #fafafa;
            }
            .stat-label {
              color: #667085;
              font-size: 11px;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 20px;
              font-weight: 800;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            th {
              background: #172033;
              color: white;
              padding: 9px 6px;
              border: 1px solid #172033;
            }
            td {
              padding: 8px 6px;
              border: 1px solid #e5e7eb;
              vertical-align: middle;
            }
            tr:nth-child(even) td {
              background: #f8fafc;
            }
            .footer {
              margin-top: 22px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
              color: #667085;
              font-size: 10px;
              text-align: center;
            }
            @media print {
              body { padding: 15px; }
              @page { size: A4 landscape; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">KUWAIT SHOWS</div>
            <h1>تقرير التسجيلات — ${reportTitle}</h1>
            <div class="meta">تاريخ إنشاء التقرير: ${generatedAt}</div>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-label">إجمالي التسجيلات</div>
              <div class="stat-value">${filteredRegistrations.length}</div>
            </div>
            <div class="stat">
              <div class="stat-label">المدفوع</div>
              <div class="stat-value">${paidCount}</div>
            </div>
            <div class="stat">
              <div class="stat-label">غير المدفوع</div>
              <div class="stat-value">${unpaidCount}</div>
            </div>
            <div class="stat">
              <div class="stat-label">تعارض المصالح</div>
              <div class="stat-value">${conflictCount}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>رقم التسجيل</th>
                <th>المشارك</th>
                <th>الهاتف</th>
                <th>البطولة</th>
                <th>الفئة</th>
                <th>اسم الخيل</th>
                <th>رقم تسجيل الخيل</th>
                <th>نوع الخيل</th>
                <th>الدفع</th>
                <th>تعارض المصالح</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="footer">
            Kuwait Shows — تقرير التسجيلات الرسمي
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 350);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [
      championshipsResult,
      showsResult,
      classesResult,
      registrationsResult,
    ] = await Promise.all([
      supabase
        .from("championships")
        .select("id,title_ar,year")
        .order("year", { ascending: false }),

      supabase
        .from("shows")
        .select(
          "id,championship_id,title_ar,start_date,end_date,registration_status,color"
        )
        .order("start_date", { ascending: true }),

      supabase
        .from("classes")
        .select(
          "id,show_id,name_ar,name_en,class_code,horse_type,gender,max_participants"
        )
        .order("sort_order", { ascending: true }),

      supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (championshipsResult.error) {
      console.error(championshipsResult.error);
    }

    if (showsResult.error) {
      console.error(showsResult.error);
    }

    if (classesResult.error) {
      console.error(classesResult.error);
    }

    if (registrationsResult.error) {
      console.error(registrationsResult.error);
      alert(
        `خطأ في تحميل التسجيلات: ${registrationsResult.error.message}`
      );
    }

    setChampionships(championshipsResult.data || []);
    setShows(showsResult.data || []);
    setClasses(classesResult.data || []);
    setRegistrations(registrationsResult.data || []);

    setLoading(false);
  }

  const filteredShows = useMemo(() => {
    if (!selectedChampionship) return shows;

    return shows.filter(
      (show) =>
        show.championship_id === selectedChampionship
    );
  }, [shows, selectedChampionship]);

  const filteredClasses = useMemo(() => {
    if (!selectedShow) return [];

    return classes.filter(
      (item) => item.show_id === selectedShow
    );
  }, [classes, selectedShow]);

  const classCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    registrations.forEach((registration) => {
      const classId = (registration as Registration & {
        class_id?: string | null;
      }).class_id;

      if (classId) {
        counts[classId] = (counts[classId] || 0) + 1;
      }
    });

    return counts;
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    let result = registrations;

    if (selectedChampionship) {
      const championshipShowIds = shows
        .filter(
          (show) =>
            show.championship_id === selectedChampionship
        )
        .map((show) => show.id);

      result = result.filter((registration) =>
        championshipShowIds.includes(registration.show_id)
      );
    }

    if (selectedShow) {
      result = result.filter(
        (registration) =>
          registration.show_id === selectedShow
      );
    }

    if (selectedPayment) {
      result = result.filter(
        (registration) =>
          registration.payment_status === selectedPayment
      );
    }

    if (selectedClass) {
      result = result.filter(
        (registration) =>
          (registration as Registration & {
            class_id?: string | null;
          }).class_id === selectedClass
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      result = result.filter((registration) => {
        const show = shows.find(
          (item) => item.id === registration.show_id
        );

        return (
          registration.participant_name
            .toLowerCase()
            .includes(q) ||
          registration.phone
            .toLowerCase()
            .includes(q) ||
          registration.registration_number
            .toLowerCase()
            .includes(q) ||
          registration.horse_name
            .toLowerCase()
            .includes(q) ||
          registration.horse_registration_number
            .toLowerCase()
            .includes(q) ||
          show?.title_ar.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [
    registrations,
    shows,
    selectedChampionship,
    selectedShow,
    selectedPayment,
    selectedClass,
    search,
  ]);

  const paidCount = filteredRegistrations.filter(
    (item) => item.payment_status === "paid"
  ).length;

  const unpaidCount = filteredRegistrations.filter(
    (item) => item.payment_status !== "paid"
  ).length;

  const conflictCount = filteredRegistrations.filter(
    (item) => item.has_conflict_of_interest
  ).length;

  function getShow(showId: string) {
    return shows.find((show) => show.id === showId);
  }

  function getShowName(showId: string) {
    return getShow(showId)?.title_ar || "—";
  }

  function formatDate(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("ar-KW", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatDateTime(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleString("ar-KW", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function togglePayment(
    registration: Registration
  ) {
    const isPaid =
      registration.payment_status === "paid";

    const newStatus = isPaid ? "unpaid" : "paid";

    const confirmed = confirm(
      isPaid
        ? "هل تريد إلغاء تأكيد الدفع؟"
        : "هل تريد تأكيد أن عملية الدفع تمت؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("registrations")
      .update({
        payment_status: newStatus,
        payment_confirmed_at: isPaid
          ? null
          : new Date().toISOString(),
      })
      .eq("id", registration.id);

    if (error) {
      console.error(error);
      alert(
        `حدث خطأ أثناء تحديث حالة الدفع: ${error.message}`
      );
      return;
    }

    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === registration.id
          ? {
              ...item,
              payment_status: newStatus,
              payment_confirmed_at: isPaid
                ? null
                : new Date().toISOString(),
            }
          : item
      )
    );

    if (details?.id === registration.id) {
      setDetails((prev) =>
        prev
          ? {
              ...prev,
              payment_status: newStatus,
              payment_confirmed_at: isPaid
                ? null
                : new Date().toISOString(),
            }
          : null
      );
    }
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
        <div className="text-gray-400">
          جاري تحميل التسجيلات...
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
                  "/admin/dashboard";
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5 text-sm"
            >
              <ArrowRight size={16} />
              العودة إلى لوحة التحكم
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: gold }}
                >
                  KUWAIT SHOWS
                </p>

                <h1 className="text-3xl md:text-4xl font-black">
                  المشاركون والتسجيلات
                </h1>

                <p className="text-gray-400 mt-2">
                  إدارة ومراجعة جميع طلبات التسجيل في البطولات.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="rounded-2xl border px-5 py-4"
                  style={{
                    borderColor: `${gold}25`,
                    background: `${gold}08`,
                  }}
                >
                  <p className="text-gray-500 text-xs mb-1">
                    إجمالي التسجيلات
                  </p>

                  <p
                    className="text-2xl font-black"
                    style={{ color: gold }}
                  >
                    {filteredRegistrations.length}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Content */}
        {selectedShow && (() => {
          const activeShow = getShow(selectedShow);
          const activeColor = activeShow?.color || gold;

          return (
            <div
              className="max-w-7xl mx-auto px-6 pt-5"
            >
              <div
                className="rounded-2xl border p-4 flex items-center gap-3"
                style={{
                  borderColor: activeColor + "35",
                  background: activeColor + "08",
                }}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: activeColor }}
                />
                <span
                  className="font-black"
                  style={{ color: activeColor }}
                >
                  {activeShow?.title_ar || "البطولة الفرعية"}
                </span>
              </div>
            </div>
          );
        })()}

        <section className="max-w-7xl mx-auto px-6 py-10">

          {/* Filters */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 mb-6">

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  البطولة الرئيسية
                </label>

                <select
                  value={selectedChampionship}
                  onChange={(e) => {
                    setSelectedChampionship(
                      e.target.value
                    );
                    setSelectedShow("");
                    setSelectedClass("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                >
                  <option value="">
                    جميع البطولات
                  </option>

                  {championships.map((championship) => (
                    <option
                      key={championship.id}
                      value={championship.id}
                    >
                      {championship.title_ar}
                      {championship.year
                        ? ` — ${championship.year}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  البطولة الفرعية
                </label>

                <select
                  value={selectedShow}
                  onChange={(e) => {
                    setSelectedShow(e.target.value);
                    setSelectedClass("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                >
                  <option value="">
                    جميع البطولات الفرعية
                  </option>

                  {filteredShows.map((show) => (
                    <option
                      key={show.id}
                      value={show.id}
                    >
                      {show.title_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  حالة الدفع
                </label>

                <select
                  value={selectedPayment}
                  onChange={(e) =>
                    setSelectedPayment(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                >
                  <option value="">كل حالات الدفع</option>
                  <option value="paid">مدفوع</option>
                  <option value="unpaid">غير مدفوع</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  الفئة
                </label>

                <select
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value)
                  }
                  disabled={!selectedShow}
                  className="w-full rounded-xl border border-white/10 bg-[#08101f] px-4 py-3.5 text-white outline-none focus:border-[#bc9b6a] disabled:opacity-50"
                >
                  <option value="">
                    {!selectedShow
                      ? "اختر البطولة الفرعية أولاً"
                      : "جميع الفئات"}
                  </option>

                  {filteredClasses.map((classItem) => {
                    const count = classCounts[classItem.id] || 0;
                    const limit = classItem.max_participants;

                    return (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name_ar} — {count}
                        {limit != null ? ` / ${limit}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  بحث
                </label>

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="اسم المشارك، الخيل، الهاتف، رقم التسجيل..."
                    className="w-full rounded-xl border border-white/10 bg-black/20 pr-11 pl-4 py-3.5 text-white outline-none focus:border-[#bc9b6a]"
                  />

                </div>
              </div>

            </div>
          </div>

          {/* Class Capacity Summary */}
          {selectedShow && filteredClasses.length > 0 && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-black text-gray-200">
                    حالة الفئات
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    عدد المسجلين مقارنة بالحد الأقصى لكل فئة.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredClasses.map((classItem) => {
                  const count = classCounts[classItem.id] || 0;
                  const limit = classItem.max_participants;
                  const full =
                    limit != null && count >= limit;

                  return (
                    <div
                      key={classItem.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-sm">
                          {classItem.name_ar}
                        </p>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs border ${
                            full
                              ? "border-red-400/20 bg-red-400/10 text-red-300"
                              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          {full ? "مكتملة" : "متاحة"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <span className="text-gray-500 text-xs">
                          المسجلون
                        </span>
                        <span className="font-black text-lg">
                          {count}
                          {limit != null ? (
                            <span className="text-gray-500 text-sm font-normal">
                              {" "} / {limit}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm font-normal">
                              {" "} / غير محدد
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Report Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm font-bold text-gray-200">
                تقرير التسجيلات
              </p>
              <p className="text-xs text-gray-500 mt-1">
                التقرير يعتمد على البطولة والفلاتر المحددة حاليًا.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadData()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-gray-300 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                تحديث
              </button>

              <button
                type="button"
                onClick={printReport}
                disabled={filteredRegistrations.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bc9b6a]/30 bg-[#bc9b6a]/10 px-4 py-3 text-sm font-bold text-[#bc9b6a] transition hover:bg-[#bc9b6a]/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer size={16} />
                طباعة التقرير
              </button>

              <button
                type="button"
                onClick={exportExcel}
                disabled={filteredRegistrations.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: gold,
                  color: "#050B18",
                }}
              >
                <Download size={16} />
                تصدير Excel
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users size={19} style={{ color: gold }} />
                <span className="text-gray-500 text-sm">
                  التسجيلات
                </span>
              </div>

              <p className="text-2xl font-black">
                {filteredRegistrations.length}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2
                  size={19}
                  className="text-emerald-300"
                />
                <span className="text-gray-500 text-sm">
                  مدفوع
                </span>
              </div>

              <p className="text-2xl font-black text-emerald-300">
                {paidCount}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock3
                  size={19}
                  className="text-yellow-300"
                />
                <span className="text-gray-500 text-sm">
                  غير مدفوع
                </span>
              </div>

              <p className="text-2xl font-black text-yellow-300">
                {unpaidCount}
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users
                  size={19}
                  className="text-red-300"
                />
                <span className="text-gray-500 text-sm">
                  تعارض مصالح
                </span>
              </div>

              <p className="text-2xl font-black text-red-300">
                {conflictCount}
              </p>
            </div>

          </div>

          {/* Table */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

            {filteredRegistrations.length === 0 ? (
              <div className="p-16 text-center">

                <Users
                  size={45}
                  className="mx-auto mb-5 text-gray-600"
                />

                <h3 className="text-xl font-black mb-2">
                  لا توجد تسجيلات
                </h3>

                <p className="text-gray-500">
                  لا توجد تسجيلات مطابقة للبحث أو الفلاتر الحالية.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        رقم التسجيل
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        المشارك
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        البطولة
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        الخيل
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        النوع
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        الدفع
                      </th>

                      <th className="text-right px-5 py-4 text-xs text-gray-500 font-medium">
                        الإجراء
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredRegistrations.map(
                      (registration) => (
                        <tr
                          key={registration.id}
                          className="border-b border-white/5 hover:bg-white/[0.025] transition"
                        >

                          <td className="px-5 py-4">
                            <span
                              className="font-bold"
                              style={{ color: gold }}
                            >
                              {registration.registration_number}
                            </span>
                          </td>

                          <td className="px-5 py-4">

                            <div>
                              <p className="font-bold">
                                {registration.participant_name}
                              </p>

                              <p
                                dir="ltr"
                                className="text-gray-500 text-xs mt-1 text-right"
                              >
                                {registration.phone}
                              </p>
                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <p className="text-sm text-gray-300">
                              {getShowName(
                                registration.show_id
                              )}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <Users
  size={17}
  style={{ color: gold }}
/>

                              <div>
                                <p className="font-bold text-sm">
                                  {registration.horse_name}
                                </p>

                                <p className="text-gray-500 text-xs mt-1">
                                  {
                                    registration.horse_registration_number
                                  }
                                </p>
                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-300">
                              {registration.horse_type ===
                              "egyptian"
                                ? "الخيل العربية المصرية"
                                : "الخيل العربية"}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            {registration.payment_status ===
                            "paid" ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs">
                                <CheckCircle2 size={14} />
                                مدفوع
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 text-xs">
                                <Clock3 size={14} />
                                غير مدفوع
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                setDetails(registration)
                              }
                              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#bc9b6a]/50 hover:text-white"
                            >
                              <Eye size={16} />
                              التفاصيل
                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>
      </div>

      {/* Details Modal */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setDetails(null)}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#08101f] shadow-2xl p-7"
          >

            <div className="flex items-center justify-between mb-7">

              <div>
                <p
                  className="text-xs tracking-[0.15em] mb-1"
                  style={{ color: gold }}
                >
                  REGISTRATION
                </p>

                <h2 className="text-2xl font-black">
                  تفاصيل التسجيل
                </h2>
              </div>

              <button
                onClick={() => setDetails(null)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 mb-5">

              <p className="text-gray-500 text-xs mb-2">
                رقم التسجيل
              </p>

              <p
                className="text-2xl font-black"
                style={{ color: gold }}
              >
                {details.registration_number}
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <Info
                label="اسم المشارك"
                value={details.participant_name}
              />

              <Info
                label="رقم الهاتف"
                value={details.phone}
                ltr
              />

              <Info
                label="البريد الإلكتروني"
                value={details.email || "غير مضاف"}
                ltr
              />

              <Info
                label="البطولة"
                value={(() => {
  const show = getShow(details.show_id);
  const color = show?.color || gold;
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold"
      style={{
        color,
        borderColor: color + "45",
        background: color + "10",
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: color }}
      />
      {show?.title_ar || "—"}
    </span>
  );
})()}
              />

              <Info
                label="نوع الخيل"
                value={
                  details.horse_type === "egyptian"
                    ? "الخيل العربية المصرية"
                    : "الخيل العربية"
                }
              />

              <Info
                label="اسم الخيل"
                value={details.horse_name}
              />

              <Info
                label="رقم تسجيل الخيل"
                value={
                  details.horse_registration_number
                }
                ltr
              />

              <Info
                label="تاريخ التسجيل"
                value={formatDateTime(details.created_at)}
              />

            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <p className="text-gray-500 text-xs mb-2">
                تعارض المصالح
              </p>

              {details.has_conflict_of_interest ? (
                <div>
                  <p className="text-red-300 font-bold">
                    يوجد تعارض مصالح
                  </p>

                  {details.conflict_judge_name && (
                    <p className="text-gray-300 text-sm mt-2">
                      الحكم:
                      <span className="font-bold mr-2">
                        {details.conflict_judge_name}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-emerald-300 font-bold">
                  لا يوجد تعارض مصالح
                </p>
              )}

            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-gray-500 text-xs mb-2">
                    حالة الدفع
                  </p>

                  {details.payment_status === "paid" ? (
                    <p className="text-emerald-300 font-bold">
                      تم الدفع
                    </p>
                  ) : (
                    <p className="text-yellow-300 font-bold">
                      لم يتم الدفع
                    </p>
                  )}

                  {details.payment_confirmed_at && (
                    <p className="text-gray-500 text-xs mt-2">
                      وقت تأكيد الدفع:
                      <span className="mr-1">
                        {formatDateTime(
                          details.payment_confirmed_at
                        )}
                      </span>
                    </p>
                  )}

                </div>

                <button
                  onClick={() =>
                    togglePayment(details)
                  }
                  className="rounded-xl px-5 py-3 font-bold transition"
                  style={{
                    background:
                      details.payment_status === "paid"
                        ? "#3f1d1d"
                        : gold,
                    color:
                      details.payment_status === "paid"
                        ? "#fca5a5"
                        : "#050B18",
                  }}
                >
                  {details.payment_status === "paid"
                    ? "إلغاء تأكيد الدفع"
                    : "تأكيد الدفع"}
                </button>

              </div>

            </div>

          </motion.div>

        </div>
      )}

    </main>
  );
}

function Info({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: ReactNode;
  ltr?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

      <p className="text-gray-500 text-xs mb-2">
        {label}
      </p>

      <p
        dir={ltr ? "ltr" : "rtl"}
        className={`text-gray-200 text-sm ${
          ltr ? "text-right" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}