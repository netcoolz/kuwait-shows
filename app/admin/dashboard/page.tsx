"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Gavel,
  ClipboardList,
  LogOut,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Wallet,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  ChevronLeft,
  Activity,
} from "lucide-react";

const gold = "#bc9b6a";
const background = "#050B18";

type Championship = {
  id: string;
  title_ar: string;
  year: number | null;
  status: string;
};

type Show = {
  id: string;
  championship_id: string;
  title_ar: string;
  start_date: string;
  end_date: string;
  registration_status: string;
  registration_fee: number;
  color: string;
};

type Registration = {
  id: string;
  show_id: string;
  registration_number: string;
  participant_name: string;
  horse_name: string;
  payment_status: string;
  created_at: string;
};

type ClassItem = {
  id: string;
  show_id: string;
  name_ar: string;
  max_participants: number | null;
  status: string;
};

type DashboardStats = {
  championships: number;
  shows: number;
  registrations: number;
  judges: number;

  paid: number;
  unpaid: number;

  openShows: number;
  upcomingShows: number;
  closedShows: number;

  expectedRevenue: number;
  paidRevenue: number;
};

const defaultColor = "#BC9B6A";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    championships: 0,
    shows: 0,
    registrations: 0,
    judges: 0,
    paid: 0,
    unpaid: 0,
    openShows: 0,
    upcomingShows: 0,
    closedShows: 0,
    expectedRevenue: 0,
    paidRevenue: 0,
  });

  const [championships, setChampionships] = useState<Championship[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin";
      return;
    }

    await loadDashboard();
    setLoading(false);
  }

  async function loadDashboard() {
    try {
      const [
        championshipsResult,
        showsResult,
        registrationsResult,
        judgesResult,
        classesResult,
      ] = await Promise.all([
        supabase
          .from("championships")
          .select("id, title_ar, year, status")
          .order("year", { ascending: false }),

        supabase
          .from("shows")
          .select(
            "id, championship_id, title_ar, start_date, end_date, registration_status, registration_fee, color"
          )
          .order("start_date", { ascending: true }),

        supabase
          .from("registrations")
          .select(
            "id, show_id, registration_number, participant_name, horse_name, payment_status, created_at"
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("judges")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("classes")
          .select(
            "id, show_id, name_ar, max_participants, status"
          )
          .order("sort_order", { ascending: true }),
      ]);

      if (championshipsResult.error) {
        console.error(
          "Championships error:",
          championshipsResult.error
        );
      }

      if (showsResult.error) {
        console.error("Shows error:", showsResult.error);
      }

      if (registrationsResult.error) {
        console.error(
          "Registrations error:",
          registrationsResult.error
        );
      }

      if (judgesResult.error) {
        console.error("Judges error:", judgesResult.error);
      }

      if (classesResult.error) {
        console.error("Classes error:", classesResult.error);
      }

      const championshipsData =
        championshipsResult.data || [];

      const showsData = (showsResult.data || []).map(
        (show) => ({
          ...show,
          registration_fee:
            Number(show.registration_fee || 0),
          color: show.color || defaultColor,
        })
      );

      const registrationsData =
        registrationsResult.data || [];

      const classesData =
        classesResult.data || [];

      setChampionships(championshipsData);
      setShows(showsData);
      setRegistrations(registrationsData);
      setClasses(classesData);

      const paidRegistrations =
        registrationsData.filter(
          (item) =>
            item.payment_status === "paid"
        );

      const unpaidRegistrations =
        registrationsData.filter(
          (item) =>
            item.payment_status !== "paid"
        );

      const openShows =
        showsData.filter(
          (show) =>
            show.registration_status === "open"
        );

      const upcomingShows =
        showsData.filter(
          (show) =>
            show.registration_status ===
            "coming_soon"
        );

      const closedShows =
        showsData.filter(
          (show) =>
            show.registration_status === "closed"
        );

      let expectedRevenue = 0;
      let paidRevenue = 0;

      registrationsData.forEach(
        (registration) => {
          const show = showsData.find(
            (item) =>
              item.id === registration.show_id
          );

          if (!show) return;

          const fee =
            Number(show.registration_fee || 0);

          expectedRevenue += fee;

          if (
            registration.payment_status ===
            "paid"
          ) {
            paidRevenue += fee;
          }
        }
      );

      setStats({
        championships: championshipsData.length,
        shows: showsData.length,
        registrations:
          registrationsData.length,
        judges: judgesResult.count || 0,

        paid: paidRegistrations.length,
        unpaid: unpaidRegistrations.length,

        openShows: openShows.length,
        upcomingShows:
          upcomingShows.length,
        closedShows:
          closedShows.length,

        expectedRevenue,
        paidRevenue,
      });
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    }
  }

  async function refreshDashboard() {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/admin";
  }

  function goTo(path: string) {
    window.location.href = path;
  }

  function formatDate(date: string) {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("ar-KW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  }

  function getShowStatus(status: string) {
    if (status === "open") {
      return {
        label: "التسجيل مفتوح",
        color: "#4ADE80",
        icon: CheckCircle2,
      };
    }

    if (status === "closed") {
      return {
        label: "مغلق",
        color: "#F87171",
        icon: Clock3,
      };
    }

    return {
      label: "قريبًا",
      color: "#FBBF24",
      icon: Clock3,
    };
  }

  const paymentRate = useMemo(() => {
    if (stats.registrations === 0) return 0;

    return Math.round(
      (stats.paid / stats.registrations) * 100
    );
  }, [stats]);

  const fullClasses = useMemo(() => {
    return classes
      .map((classItem) => {
        if (
          !classItem.max_participants ||
          classItem.max_participants <= 0
        ) {
          return null;
        }

        const count =
          registrations.filter(
            (registration) =>
              registration.show_id ===
              classItem.show_id
          ).length;

        const showRegistrations =
          registrations.filter(
            (registration) =>
              registration.show_id ===
              classItem.show_id
          );

        const ratio =
          showRegistrations.length /
          classItem.max_participants;

        if (ratio < 0.8) {
          return null;
        }

        return {
          ...classItem,
          count: showRegistrations.length,
          ratio,
        };
      })
      .filter(Boolean)
      .slice(0, 5);
  }, [classes, registrations]);

  const recentRegistrations =
    registrations.slice(0, 6);

  const showMap = useMemo(() => {
    const map = new Map<string, Show>();

    shows.forEach((show) => {
      map.set(show.id, show);
    });

    return map;
  }, [shows]);

  const championshipMap = useMemo(() => {
    const map = new Map<string, Championship>();

    championships.forEach((item) => {
      map.set(item.id, item);
    });

    return map;
  }, [championships]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{
          background,
          color: "#f4f4f4",
        }}
      >
        <div className="text-center">
          <div
            className="w-11 h-11 border-2 border-white/10 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderTopColor: gold,
            }}
          />

          <p className="text-gray-400">
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </main>
    );
  }

  const statCards = [
    {
      title: "البطولات الرئيسية",
      value: stats.championships,
      icon: Trophy,
      href: "/admin/championships",
      description:
        "إدارة البطولات الرئيسية",
    },

    {
      title: "البطولات الفرعية",
      value: stats.shows,
      icon: CalendarDays,
      href: "/admin/championships",
      description:
        "البطولات والفئات التابعة لها",
    },

    {
      title: "إجمالي التسجيلات",
      value: stats.registrations,
      icon: ClipboardList,
      href: "/admin/registrations",
      description:
        `${stats.paid} مدفوع • ${stats.unpaid} غير مدفوع`,
    },

    {
      title: "الحكام",
      value: stats.judges,
      icon: Gavel,
      href: "/admin/judges",
      description:
        "إدارة قائمة الحكام",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen"
      style={{
        background,
        color: "#f4f4f4",
      }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-220px] right-[-180px] w-[600px] h-[600px] rounded-full blur-[170px] opacity-[0.07]"
          style={{
            background: gold,
          }}
        />

        <div
          className="absolute bottom-[-250px] left-[-180px] w-[600px] h-[600px] rounded-full blur-[170px] opacity-[0.05]"
          style={{
            background: gold,
          }}
        />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-5 md:px-6 py-5 flex items-center justify-between gap-4">

            <div>
              <p
                className="text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1"
                style={{
                  color: gold,
                }}
              >
                Kuwait Shows
              </p>

              <h1 className="text-xl md:text-3xl font-black">
                لوحة التحكم
              </h1>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition disabled:opacity-50"
                title="تحديث البيانات"
              >
                <RefreshCw
                  size={18}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 md:px-4 py-3 text-sm text-gray-300 transition hover:border-red-400/30 hover:text-red-300"
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  تسجيل الخروج
                </span>
              </button>

            </div>
          </div>
        </header>

        {/* Main */}
        <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-10">

          {/* Welcome */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

              <div>
                <p className="text-gray-400 mb-2">
                  مرحبًا بك في لوحة إدارة Kuwait Shows
                </p>

                <h2 className="text-2xl md:text-4xl font-black">
                  نظرة عامة على البطولات
                </h2>
              </div>

              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  color: gold,
                }}
              >
                <Activity size={16} />
                البيانات محدثة مباشرة
              </div>

            </div>
          </motion.div>

          {/* Main Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">

            {statCards.map(
              (card, index) => {
                const Icon = card.icon;

                return (
                  <motion.button
                    key={card.title}
                    onClick={() =>
                      goTo(card.href)
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.07,
                    }}
                    className="text-right rounded-[1.7rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 md:p-6 transition hover:border-[#bc9b6a]/50 hover:bg-white/[0.06] group"
                  >
                    <div className="flex items-start justify-between mb-6">

                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                        style={{
                          color: gold,
                          borderColor:
                            `${gold}30`,
                          background:
                            `${gold}10`,
                        }}
                      >
                        <Icon size={22} />
                      </div>

                      <ArrowLeft
                        size={17}
                        className="text-gray-600 group-hover:text-[#bc9b6a] transition"
                      />
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      {card.title}
                    </p>

                    <p className="text-3xl md:text-4xl font-black mb-2">
                      {card.value}
                    </p>

                    <p className="text-xs text-gray-500">
                      {card.description}
                    </p>
                  </motion.button>
                );
              }
            )}

          </div>

          {/* Financial + Payment Overview */}
          <div className="grid lg:grid-cols-3 gap-5 mt-5">

            {/* Revenue */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="lg:col-span-2 rounded-[1.7rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between mb-7">

                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    ملخص الرسوم
                  </p>

                  <h3 className="text-xl font-black">
                    الوضع المالي للتسجيلات
                  </h3>
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    color: gold,
                    background: `${gold}10`,
                  }}
                >
                  <Wallet size={21} />
                </div>

              </div>

              <div className="grid sm:grid-cols-3 gap-4">

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <CircleDollarSign size={16} />
                    المتوقع
                  </div>

                  <p className="text-2xl font-black">
                    {formatMoney(
                      stats.expectedRevenue
                    )}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    د.ك
                  </p>
                </div>

                <div className="rounded-2xl border border-green-400/10 bg-green-400/[0.03] p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <CreditCard size={16} />
                    المحصل
                  </div>

                  <p className="text-2xl font-black text-green-300">
                    {formatMoney(
                      stats.paidRevenue
                    )}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    د.ك
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Clock3 size={16} />
                    التحصيل
                  </div>

                  <p className="text-2xl font-black">
                    {paymentRate}%
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    من إجمالي التسجيلات
                  </p>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-6">

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">
                    نسبة التسجيلات المدفوعة
                  </span>

                  <span
                    style={{
                      color: gold,
                    }}
                  >
                    {stats.paid} /{" "}
                    {stats.registrations}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${paymentRate}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: gold,
                    }}
                  />

                </div>

              </div>
            </motion.div>

            {/* Registration Status */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    color: gold,
                    background: `${gold}10`,
                  }}
                >
                  <Activity size={21} />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    حالة البطولات
                  </p>

                  <h3 className="font-black text-lg">
                    التسجيلات
                  </h3>
                </div>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-xl border border-green-400/10 bg-green-400/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-sm">
                      مفتوحة
                    </span>
                  </div>

                  <span className="font-black">
                    {stats.openShows}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-yellow-400/10 bg-yellow-400/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="text-sm">
                      قريبًا
                    </span>
                  </div>

                  <span className="font-black">
                    {stats.upcomingShows}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-sm">
                      مغلقة
                    </span>
                  </div>

                  <span className="font-black">
                    {stats.closedShows}
                  </span>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Shows */}
          <div className="mt-8">

            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-gray-500 text-sm mb-1">
                  Overview
                </p>

                <h3 className="text-xl md:text-2xl font-black">
                  البطولات الفرعية
                </h3>
              </div>

              <button
                onClick={() =>
                  goTo("/admin/championships")
                }
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                عرض الكل
                <ChevronLeft size={16} />
              </button>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

              {shows
                .slice(0, 6)
                .map((show, index) => {
                  const status =
                    getShowStatus(
                      show.registration_status
                    );

                  const StatusIcon =
                    status.icon;

                  const parent =
                    championshipMap.get(
                      show.championship_id
                    );

                  const registrationCount =
                    registrations.filter(
                      (registration) =>
                        registration.show_id ===
                        show.id
                    ).length;

                  return (
                    <motion.div
                      key={show.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.06,
                      }}
                      className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:bg-white/[0.055] transition"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3 min-w-0">

                          <div
                            className="w-3 h-12 rounded-full shrink-0"
                            style={{
                              background:
                                show.color ||
                                defaultColor,
                            }}
                          />

                          <div className="min-w-0">

                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {parent?.title_ar ||
                                "بطولة"}
                            </p>

                            <h4 className="font-black text-base leading-6">
                              {show.title_ar}
                            </h4>

                          </div>

                        </div>

                        <div
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            color:
                              show.color ||
                              defaultColor,
                            background: `${
                              show.color ||
                              defaultColor
                            }15`,
                          }}
                        >
                          <Trophy size={17} />
                        </div>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-black/10 border border-white/5 p-3">

                          <p className="text-[11px] text-gray-500 mb-1">
                            الموعد
                          </p>

                          <p className="text-xs font-bold">
                            {formatDate(
                              show.start_date
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl bg-black/10 border border-white/5 p-3">

                          <p className="text-[11px] text-gray-500 mb-1">
                            التسجيلات
                          </p>

                          <p className="text-xs font-bold">
                            {registrationCount}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center justify-between mt-4">

                        <div
                          className="flex items-center gap-1.5 text-xs"
                          style={{
                            color:
                              status.color,
                          }}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </div>

                        <div className="text-xs text-gray-500">
                          {formatMoney(
                            Number(
                              show.registration_fee ||
                                0
                            )
                          )}{" "}
                          د.ك
                        </div>

                      </div>

                    </motion.div>
                  );
                })}

            </div>

            {shows.length === 0 && (
              <div className="rounded-[1.6rem] border border-dashed border-white/10 p-10 text-center text-gray-500">
                لا توجد بطولات فرعية حاليًا.
              </div>
            )}

          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-2 gap-5 mt-8">

            {/* Recent Registrations */}
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

              <div className="p-6 border-b border-white/10 flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    Latest
                  </p>

                  <h3 className="font-black text-xl">
                    آخر التسجيلات
                  </h3>
                </div>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/registrations"
                    )
                  }
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  عرض الكل
                </button>

              </div>

              <div className="divide-y divide-white/5">

                {recentRegistrations.map(
                  (registration) => {
                    const show =
                      showMap.get(
                        registration.show_id
                      );

                    const paid =
                      registration.payment_status ===
                      "paid";

                    return (
                      <div
                        key={
                          registration.id
                        }
                        className="p-5 flex items-center justify-between gap-4"
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              color:
                                show?.color ||
                                gold,
                              background: `${
                                show?.color ||
                                gold
                              }12`,
                            }}
                          >
                            <Users size={17} />
                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-sm truncate">
                              {
                                registration.participant_name
                              }
                            </p>

                            <p className="text-xs text-gray-500 truncate mt-1">
                              {
                                registration.registration_number
                              }{" "}
                              •{" "}
                              {
                                registration.horse_name
                              }
                            </p>

                          </div>

                        </div>

                        <div className="text-left shrink-0">

                          <div
                            className="text-[11px] px-2.5 py-1 rounded-full border"
                            style={{
                              color: paid
                                ? "#4ADE80"
                                : "#FBBF24",
                              borderColor:
                                paid
                                  ? "#4ADE8030"
                                  : "#FBBF2430",
                              background:
                                paid
                                  ? "#4ADE8008"
                                  : "#FBBF2408",
                            }}
                          >
                            {paid
                              ? "مدفوع"
                              : "غير مدفوع"}
                          </div>

                          <p className="text-[10px] text-gray-600 mt-2">
                            {formatDate(
                              registration.created_at
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

                {recentRegistrations.length ===
                  0 && (
                    <div className="p-10 text-center text-gray-500 text-sm">
                      لا توجد تسجيلات حتى الآن.
                    </div>
                  )}

              </div>

            </div>

            {/* Alerts / Capacity */}
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

              <div className="p-6 border-b border-white/10">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-400/[0.08] text-yellow-300">
                    <AlertTriangle
                      size={19}
                    />
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Monitoring
                    </p>

                    <h3 className="font-black text-xl">
                      تنبيهات الإدارة
                    </h3>
                  </div>

                </div>

              </div>

              <div className="p-5 space-y-3">

                {/* Unpaid */}
                <button
                  onClick={() =>
                    goTo(
                      "/admin/registrations"
                    )
                  }
                  className="w-full text-right rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.025] p-4 hover:bg-yellow-400/[0.05] transition"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Clock3
                        size={18}
                        className="text-yellow-300"
                      />

                      <div>
                        <p className="text-sm font-bold">
                          تسجيلات بانتظار الدفع
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          تحتاج إلى متابعة حالة الدفع
                        </p>
                      </div>

                    </div>

                    <span className="font-black text-yellow-300">
                      {stats.unpaid}
                    </span>

                  </div>
                </button>

                {/* Capacity */}
                {fullClasses.length > 0 ? (
                  fullClasses.map(
                    (item: any) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3 min-w-0">

                            <AlertTriangle
                              size={18}
                              className="text-red-300 shrink-0"
                            />

                            <div className="min-w-0">

                              <p className="text-sm font-bold truncate">
                                {item.name_ar}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                وصلت الفئة إلى{" "}
                                {Math.round(
                                  item.ratio *
                                    100
                                )}
                                %
                              </p>

                            </div>

                          </div>

                          <span className="text-xs text-red-300 whitespace-nowrap">
                            {item.count}/
                            {
                              item.max_participants
                            }
                          </span>

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-2xl border border-green-400/10 bg-green-400/[0.025] p-4">

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        size={19}
                        className="text-green-300"
                      />

                      <div>
                        <p className="text-sm font-bold">
                          لا توجد فئات ممتلئة
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          وضع السعة الحالي جيد
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Quick Actions */}
          <div className="mt-8">

            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-gray-500 text-sm mb-1">
                  Shortcuts
                </p>

                <h3 className="text-xl md:text-2xl font-black">
                  الوصول السريع
                </h3>
              </div>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <QuickAction
                icon={Plus}
                title="إضافة بطولة"
                description="إنشاء بطولة رئيسية جديدة"
                onClick={() =>
                  goTo("/admin/championships")
                }
              />

              <QuickAction
                icon={CalendarDays}
                title="إدارة البطولات الفرعية"
                description="التواريخ والفئات والرسوم"
                onClick={() =>
                  goTo("/admin/championships")
                }
              />

              <QuickAction
                icon={ClipboardList}
                title="إدارة التسجيلات"
                description="المشاركون وحالة الدفع"
                onClick={() =>
                  goTo("/admin/registrations")
                }
              />

              <QuickAction
                icon={Gavel}
                title="إدارة الحكام"
                description="إضافة وتعديل بيانات الحكام"
                onClick={() =>
                  goTo("/admin/judges")
                }
              />

            </div>

          </div>

        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-5 md:px-6 pb-10 pt-4">

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-xs text-gray-600">
              Kuwait Shows • Admin Dashboard
            </p>

            <p
              className="text-xs"
              style={{
                color: `${gold}99`,
              }}
            >
              Elite Arabian Horse Show Management
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{
        y: -3,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="text-right rounded-[1.6rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:border-[#bc9b6a]/40 hover:bg-white/[0.055] transition group"
    >
      <div className="flex items-start justify-between mb-5">

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{
            color: gold,
            borderColor: `${gold}25`,
            background: `${gold}0d`,
          }}
        >
          <Icon size={20} />
        </div>

        <ArrowLeft
          size={16}
          className="text-gray-600 group-hover:text-[#bc9b6a] transition"
        />

      </div>

      <h4 className="font-black mb-2">
        {title}
      </h4>

      <p className="text-xs text-gray-500 leading-5">
        {description}
      </p>
    </motion.button>
  );
}