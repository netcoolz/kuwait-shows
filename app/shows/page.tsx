"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Trophy,
  CalendarDays,
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const gold = "#bc9b6a";

type Championship = {
  id: string;
  title_ar: string;
  title_en: string | null;
  slug: string;
  year: number | null;
  status: string;
  hero_image: string | null;
  description_ar: string | null;
  description_en: string | null;
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
  horse_type: string;
  color: string;
};

export default function ShowsPage() {
  const [lang, setLang] =
    useState<"ar" | "en">("ar");

  const [mounted, setMounted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [championships, setChampionships] =
    useState<Championship[]>([]);

  const [shows, setShows] =
    useState<Show[]>([]);

  useEffect(() => {
    setMounted(true);

    const saved =
      localStorage.getItem("lang");

    if (
      saved === "ar" ||
      saved === "en"
    ) {
      setLang(saved);
    }

    const updateLang = () => {
      const current =
        localStorage.getItem("lang");

      if (
        current === "ar" ||
        current === "en"
      ) {
        setLang(current);
      }
    };

    window.addEventListener(
      "languageChange",
      updateLang
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        updateLang
      );
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function loadData() {
      setLoading(true);
      setError("");

      const [
        championshipsResult,
        showsResult,
      ] = await Promise.all([
        supabase
          .from("championships")
          .select(
            "id,title_ar,title_en,slug,year,status,hero_image,description_ar,description_en,location_ar"
          )
          .order("year", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("shows")
          .select(
            "id,championship_id,title_ar,title_en,slug,start_date,end_date,registration_status,registration_fee,horse_type,color"
          )
          .order("start_date", {
            ascending: true,
          }),
      ]);

      if (
        championshipsResult.error ||
        showsResult.error
      ) {
        console.error(
          championshipsResult.error ||
            showsResult.error
        );

        setError(
          championshipsResult.error?.message ||
            showsResult.error?.message ||
            "Unable to load championships."
        );

        setChampionships([]);
        setShows([]);
        setLoading(false);
        return;
      }

      setChampionships(
        championshipsResult.data || []
      );

      setShows(
        (showsResult.data || []).map(
          (show) => ({
            ...show,
            registration_fee:
              Number(
                show.registration_fee || 0
              ),
            color:
              show.color || gold,
          })
        )
      );

      setLoading(false);
    }

    loadData();
  }, [mounted]);

  const t = {
    ar: {
      title: "البطولات المتاحة",
      subtitle:
        "اكتشف وسجل في أرقى بطولات الخيل العربية.",
      loading:
        "جاري تحميل البطولات...",
      empty:
        "لا توجد بطولات متاحة حالياً.",
      error:
        "تعذر تحميل البطولات.",
      retry:
        "إعادة المحاولة",

      open:
        "التسجيل مفتوح",

      comingSoon:
        "قريباً",

      closed:
        "التسجيل مغلق",

      ended:
        "انتهت",

      postponed:
        "مؤجلة",

      view:
        "استعرض البطولة",

      register:
        "التسجيل الآن",

      subChampionships:
        "البطولات الفرعية",

      location:
        "مركز الجواد العربي",

      noImage:
        "KUWAIT SHOWS",
    },

    en: {
      title:
        "Available Championships",

      subtitle:
        "Explore and register for prestigious Arabian horse championships.",

      loading:
        "Loading championships...",

      empty:
        "No championships are currently available.",

      error:
        "Unable to load championships.",

      retry:
        "Try again",

      open:
        "Registration Open",

      comingSoon:
        "Coming Soon",

      closed:
        "Registration Closed",

      ended:
        "Ended",

      postponed:
        "Postponed",

      view:
        "View Championship",

      register:
        "Register Now",

      subChampionships:
        "Sub-Championships",

      location:
        "Arabian Horse Center",

      noImage:
        "KUWAIT SHOWS",
    },
  };

  const text = t[lang];

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },

    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  function getStatus(status: string) {
    switch (status) {
      case "open":
        return {
          label: text.open,
          color: "#4ADE80",
          icon: CheckCircle2,
        };

      case "closed":
        return {
          label: text.closed,
          color: "#F87171",
          icon: XCircle,
        };

      case "ended":
        return {
          label: text.ended,
          color: "#9CA3AF",
          icon: Clock3,
        };

      case "postponed":
        return {
          label: text.postponed,
          color: "#F87171",
          icon: XCircle,
        };

      default:
        return {
          label: text.comingSoon,
          color: "#FBBF24",
          icon: Clock3,
        };
    }
  }

  function formatDate(date: string) {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      lang === "ar"
        ? "ar-KW"
        : "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatDateRange(
    start: string,
    end: string
  ) {
    if (!start) return "";

    if (!end || start === end) {
      return formatDate(start);
    }

    const startDate =
      new Date(
        `${start}T00:00:00`
      );

    const endDate =
      new Date(
        `${end}T00:00:00`
      );

    const startText =
      startDate.toLocaleDateString(
        lang === "ar"
          ? "ar-KW"
          : "en-US",
        {
          day: "numeric",
          month: "short",
        }
      );

    const endText =
      endDate.toLocaleDateString(
        lang === "ar"
          ? "ar-KW"
          : "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );

    return `${startText} – ${endText}`;
  }

  function openChampionship(
    championship: Championship
  ) {
    if (
      championship.status === "open" ||
      championship.status ===
        "coming_soon"
    ) {
      window.location.href =
        `/shows/${championship.slug}`;

      return;
    }

    window.location.href =
      `/shows/${championship.slug}`;
  }

  if (!mounted) {
    return null;
  }

  return (
    <main
      dir={
        lang === "ar"
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen text-white relative pb-16"
      style={{
        backgroundImage:
          "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition:
          "center",
        backgroundAttachment:
          "fixed",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[#050B18]/80 pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#050B18]/60 to-[#050B18] pointer-events-none" />

      <div className="relative z-10 w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-4 sm:px-6 md:px-10 pt-8 md:pt-16">

        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="text-center mb-8 md:mb-14 max-w-3xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
            style={{
              color: gold,
              borderColor:
                `${gold}35`,
              background:
                `${gold}08`,
            }}
          >
            <Trophy size={15} />

            <span className="text-[11px] font-semibold tracking-[0.15em]">
              KUWAIT SHOWS
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-wide bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent">
            {text.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-7 px-3">
            {text.subtitle}
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="max-w-xl mx-auto text-center py-20">

            <div
              className="inline-block w-10 h-10 rounded-full border-2 border-white/10 animate-spin"
              style={{
                borderTopColor: gold,
              }}
            />

            <p className="mt-5 text-gray-400 text-sm">
              {text.loading}
            </p>

          </div>
        ) : error ? (
          /* Error */
          <div className="max-w-xl mx-auto text-center rounded-3xl border border-red-400/20 bg-red-500/5 backdrop-blur-md p-8">

            <XCircle
              size={36}
              className="mx-auto mb-4 text-red-300"
            />

            <p className="text-red-300 mb-5 text-sm">
              {text.error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="px-6 py-3 rounded-xl font-bold text-black hover:brightness-110 transition"
              style={{
                background: gold,
              }}
            >
              {text.retry}
            </button>

          </div>
        ) : championships.length ===
          0 ? (
          /* Empty */
          <div className="max-w-xl mx-auto text-center rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-10">

            <Trophy
              size={40}
              className="mx-auto mb-5"
              style={{
                color: gold,
              }}
            />

            <p className="text-gray-400">
              {text.empty}
            </p>

          </div>
        ) : (
          /* Championships */
          <motion.div
            variants={
              containerVariants
            }
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 max-w-6xl mx-auto"
          >
            {championships.map(
              (championship) => {
                const status =
                  getStatus(
                    championship.status
                  );

                const StatusIcon =
                  status.icon;

                const title =
                  lang === "ar"
                    ? championship.title_ar
                    : championship.title_en ||
                      championship.title_ar;

                const championshipShows =
                  shows.filter(
                    (show) =>
                      show.championship_id ===
                      championship.id
                  );

                const hasOpenShow =
                  championshipShows.some(
                    (show) =>
                      show.registration_status ===
                      "open"
                  );

                return (
                  <motion.article
                    key={
                      championship.id
                    }
                    variants={
                      itemVariants
                    }
                    className="group relative bg-[#0d121d]/90 backdrop-blur-xl rounded-[1.75rem] overflow-hidden border border-white/10 transition-all duration-300 hover:border-[#bc9b6a]/60 hover:shadow-[0_15px_45px_-15px_rgba(188,155,106,0.3)]"
                  >
                    {/* Image */}
                    <div className="relative w-full h-[190px] sm:h-[230px] md:h-[300px] overflow-hidden">

                      {championship.hero_image ? (
                        <img
                          src={
                            championship.hero_image
                          }
                          alt={title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#151515] via-[#101522] to-[#050505] flex items-center justify-center">

                          <Trophy
                            size={55}
                            strokeWidth={1}
                            style={{
                              color: gold,
                            }}
                          />

                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d121d] via-black/10 to-transparent" />

                      {/* Status */}
                      <div
                        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border border-white/10"
                        style={{
                          color:
                            status.color,
                          background: `${status.color}18`,
                        }}
                      >
                        <StatusIcon
                          size={13}
                        />

                        {status.label}
                      </div>

                      {/* Year */}
                      {championship.year && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold">
                          {championship.year}
                        </div>
                      )}

                      {/* Title on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight text-white">
                          {title}
                        </h2>

                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 md:p-6">

                      {/* Location */}
                      {championship.location_ar && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">

                          <MapPin
                            size={15}
                            style={{
                              color: gold,
                            }}
                          />

                          <span>
                            {
                              championship.location_ar
                            }
                          </span>

                        </div>
                      )}

                      {/* Sub Championships */}
                      {championshipShows.length >
                        0 && (
                        <div className="mb-5">

                          <div className="flex items-center gap-2 mb-3">

                            <CalendarDays
                              size={15}
                              style={{
                                color: gold,
                              }}
                            />

                            <p className="text-xs font-semibold text-gray-400">
                              {
                                text.subChampionships
                              }
                            </p>

                          </div>

                          <div className="space-y-2">

                            {championshipShows.map(
                              (show) => {
                                const showOpen =
                                  show.registration_status ===
                                  "open";

                                const showStatus =
                                  showOpen
                                    ? text.open
                                    : show.registration_status ===
                                        "closed"
                                      ? text.closed
                                      : text.comingSoon;

                                return (
                                  <div
                                    key={
                                      show.id
                                    }
                                    className="rounded-xl border border-white/5 bg-white/[0.025] p-3"
                                  >

                                    <div className="flex items-start gap-3">

                                      {/* Color */}
                                      <span
                                        className="w-2 h-10 rounded-full shrink-0 mt-0.5"
                                        style={{
                                          background:
                                            show.color ||
                                            gold,
                                        }}
                                      />

                                      <div className="flex-1 min-w-0">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">

                                          <p className="text-[13px] sm:text-sm font-bold text-white leading-5">
                                            {lang ===
                                            "ar"
                                              ? show.title_ar
                                              : show.title_en ||
                                                show.title_ar}
                                          </p>

                                          <span
                                            className="text-[10px] font-semibold shrink-0"
                                            style={{
                                              color:
                                                showOpen
                                                  ? "#4ADE80"
                                                  : show.registration_status ===
                                                      "closed"
                                                    ? "#F87171"
                                                    : "#FBBF24",
                                            }}
                                          >
                                            {
                                              showStatus
                                            }
                                          </span>

                                        </div>

                                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500">

                                          <CalendarDays
                                            size={12}
                                          />

                                          <span>
                                            {formatDateRange(
                                              show.start_date,
                                              show.end_date
                                            )}
                                          </span>

                                        </div>

                                      </div>

                                    </div>
                                  </div>
                                );
                              }
                            )}

                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {(lang ===
                        "ar"
                        ? championship.description_ar
                        : championship.description_en ||
                          championship.description_ar) && (
                        <p className="text-gray-500 text-xs sm:text-sm leading-6 mb-5 line-clamp-2">
                          {lang ===
                          "ar"
                            ? championship.description_ar
                            : championship.description_en ||
                              championship.description_ar}
                        </p>
                      )}

                      {/* CTA */}
                      <button
                        onClick={() =>
                          openChampionship(
                            championship
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 min-h-[50px] rounded-xl font-bold text-sm sm:text-base transition-all duration-300 active:scale-[0.98]"
                        style={{
                          background:
                            hasOpenShow ||
                            championship.status ===
                              "open"
                              ? `linear-gradient(90deg, ${gold}, #8c6a3f)`
                              : "rgba(255,255,255,0.07)",

                          color:
                            hasOpenShow ||
                            championship.status ===
                              "open"
                              ? "#050505"
                              : "#f4f4f4",

                          border:
                            hasOpenShow ||
                            championship.status ===
                              "open"
                              ? "none"
                              : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {hasOpenShow ||
                        championship.status ===
                          "open"
                          ? text.register
                          : text.view}

                        {lang ===
                        "ar" ? (
                          <ArrowLeft
                            size={17}
                          />
                        ) : (
                          <ArrowRight
                            size={17}
                          />
                        )}
                      </button>

                    </div>
                  </motion.article>
                );
              }
            )}
          </motion.div>
        )}

        {/* Bottom spacing */}
        <div className="h-8 md:h-12" />
      </div>
    </main>
  );
}