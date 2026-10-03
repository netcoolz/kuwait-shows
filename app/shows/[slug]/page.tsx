"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  CreditCard,
  Gavel,
  Clock3,
  CheckCircle2,
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
};

type Judge = {
  id: string;
  name_ar: string;
  name_en: string | null;
  country: string | null;
  photo_url: string | null;
};

type ShowJudge = {
  show_id: string;
  judge_id: string;
};

export default function ChampionshipDetailsPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);

  const [championship, setChampionship] = useState<Championship | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [showJudges, setShowJudges] = useState<ShowJudge[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") {
      setLang(saved);
    }

    const updateLang = () => {
      const current = localStorage.getItem("lang");
      if (current === "ar" || current === "en") {
        setLang(current);
      }
    };

    window.addEventListener("languageChange", updateLang);

    return () => {
      window.removeEventListener("languageChange", updateLang);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function loadPage() {
      setLoading(true);
      setError("");

      const slug = decodeURIComponent(
        window.location.pathname.split("/").filter(Boolean).pop() || ""
      );

      if (!slug) {
        setError("البطولة غير محددة.");
        setLoading(false);
        return;
      }

      const championshipResult = await supabase
        .from("championships")
        .select(
          "id,title_ar,title_en,slug,year,status,hero_image,description_ar,description_en,location_ar"
        )
        .eq("slug", slug)
        .maybeSingle();

      if (championshipResult.error || !championshipResult.data) {
        console.error(championshipResult.error);
        setError("لم يتم العثور على البطولة.");
        setLoading(false);
        return;
      }

      const championshipData = championshipResult.data as Championship;

      const [showsResult, judgesResult, showJudgesResult] = await Promise.all([
        supabase
          .from("shows")
          .select(
            "id,championship_id,title_ar,title_en,slug,start_date,end_date,registration_status,registration_fee"
          )
          .eq("championship_id", championshipData.id)
          .order("start_date", { ascending: true }),

        supabase
          .from("judges")
          .select("id,name_ar,name_en,country,photo_url")
          .order("name_ar", { ascending: true }),

        supabase
          .from("show_judges")
          .select("show_id,judge_id"),
      ]);

      if (showsResult.error) console.error(showsResult.error);
      if (judgesResult.error) console.error(judgesResult.error);
      if (showJudgesResult.error) console.error(showJudgesResult.error);

      setChampionship(championshipData);
      setShows((showsResult.data || []) as Show[]);
      setJudges((judgesResult.data || []) as Judge[]);
      setShowJudges((showJudgesResult.data || []) as ShowJudge[]);
      setLoading(false);
    }

    loadPage();
  }, [mounted]);

  if (!mounted) return null;

  const t = {
    en: {
      back: "Back to Championships",
      loading: "Loading championship...",
      error: "Unable to load championship.",
      description: "About the Championship",
      championships: "Championships",
      dates: "Dates",
      location: "Location",
      fee: "Registration Fee",
      free: "Free",
      register: "Register Now",
      closed: "Registration Closed",
      soon: "Coming Soon",
      ended: "Ended",
      postponed: "Postponed",
      judges: "Judges",
      noJudges: "Judges will be announced soon.",
      noShows: "No sub-championships have been added yet.",
      view: "View Championship",
    },
    ar: {
      back: "العودة إلى البطولات",
      loading: "جاري تحميل البطولة...",
      error: "تعذر تحميل البطولة.",
      description: "عن البطولة",
      championships: "البطولات",
      dates: "التاريخ",
      location: "الموقع",
      fee: "رسوم التسجيل",
      free: "مجانًا",
      register: "التسجيل الآن",
      closed: "التسجيل مغلق",
      soon: "قريبًا",
      ended: "انتهت",
      postponed: "مؤجلة",
      judges: "الحكام",
      noJudges: "سيتم الإعلان عن الحكام قريبًا.",
      noShows: "لم تتم إضافة بطولات فرعية حتى الآن.",
      view: "عرض البطولة",
    },
  };

  const text = t[lang];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      lang === "ar" ? "ar-KW" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function getShowStatus(status: string) {
    switch (status) {
      case "open":
        return {
          label: lang === "ar" ? "التسجيل مفتوح" : "Registration Open",
          className: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
        };

      case "closed":
        return {
          label: text.closed,
          className: "bg-red-500/15 text-red-300 border-red-400/20",
        };

      case "ended":
        return {
          label: text.ended,
          className: "bg-gray-500/15 text-gray-300 border-gray-400/20",
        };

      case "postponed":
        return {
          label: text.postponed,
          className: "bg-red-500/15 text-red-300 border-red-400/20",
        };

      default:
        return {
          label: text.soon,
          className: "bg-yellow-500/15 text-yellow-300 border-yellow-400/20",
        };
    }
  }

  function getJudgesForShow(showId: string) {
    const judgeIds = showJudges
      .filter((item) => item.show_id === showId)
      .map((item) => item.judge_id);

    return judges.filter((judge) => judgeIds.includes(judge.id));
  }

  function goToShow(show: Show) {
    if (show.registration_status === "open") {
      // التسجيل في البطولة الفرعية له مسار مستقل
      // حتى لا يتعارض مع صفحة تفاصيل البطولة الرئيسية /shows/[slug]
      window.location.href = `/shows/register/${encodeURIComponent(show.slug)}`;
    }
  }

  if (loading) {
    return (
      <main
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <div className="inline-block w-10 h-10 rounded-full border-2 border-white/20 border-t-[#bc9b6a] animate-spin" />
          <p className="mt-5 text-gray-400">{text.loading}</p>
        </div>
      </main>
    );
  }

  if (error || !championship) {
    return (
      <main
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center text-white px-5"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-lg w-full text-center rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10">
          <p className="text-red-300 mb-6">{error || text.error}</p>

          <button
            onClick={() => {
              window.location.href = "/shows/";
            }}
            className="rounded-xl px-6 py-3 font-bold"
            style={{ background: gold, color: "#050B18" }}
          >
            {text.back}
          </button>
        </div>
      </main>
    );
  }

  const championshipTitle =
    lang === "ar"
      ? championship.title_ar
      : championship.title_en || championship.title_ar;

  const description =
    lang === "ar"
      ? championship.description_ar
      : championship.description_en || championship.description_ar;

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white relative pb-24"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      <div className="relative z-10 w-full lg:ml-[90px] lg:w-[calc(100%-90px)] px-3 sm:px-4 md:px-10 pt-5 sm:pt-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => {
              window.location.href = "/shows/";
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5 sm:mb-8 text-sm sm:text-base"
          >
            <ArrowRight
              size={18}
              className={lang === "ar" ? "" : "rotate-180"}
            />
            {text.back}
          </button>

          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl"
          >
            <div className="relative h-[220px] sm:h-[280px] md:h-[430px] overflow-hidden">
              {championship.hero_image ? (
                <img
                  src={championship.hero_image}
                  alt={championshipTitle}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#151515] via-[#111] to-[#050505] flex items-center justify-center">
                  <span
                    className="text-2xl md:text-4xl tracking-[0.3em] font-bold"
                    style={{ color: gold }}
                  >
                    KUWAIT SHOWS
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7 md:p-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs sm:text-sm mb-2 sm:mb-4"
                  style={{ color: gold }}
                >
                  {championship.year || ""}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight break-words">
                  {championshipTitle}
                </h1>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {championship.location_ar && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 min-w-0">
                    <MapPin size={20} style={{ color: gold }} />
                    <p className="text-gray-500 text-xs mt-3 mb-1">
                      {text.location}
                    </p>
                    <p className="text-gray-200">{championship.location_ar}</p>
                  </div>
                )}

                {championship.year && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 min-w-0">
                    <CalendarDays size={20} style={{ color: gold }} />
                    <p className="text-gray-500 text-xs mt-3 mb-1">
                      {text.dates}
                    </p>
                    <p className="text-gray-200">{championship.year}</p>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 min-w-0">
                  <Clock3 size={20} style={{ color: gold }} />
                  <p className="text-gray-500 text-xs mt-3 mb-1">
                    {lang === "ar" ? "الحالة" : "Status"}
                  </p>
                  <p className="text-gray-200">
                    {championship.status === "open"
                      ? text.register
                      : championship.status === "ended"
                        ? text.ended
                        : championship.status === "postponed"
                          ? text.postponed
                          : text.soon}
                  </p>
                </div>
              </div>

              {description && (
                <div className="mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">{text.description}</h2>
                  <p className="text-gray-300 leading-7 sm:leading-8 whitespace-pre-line break-words">
                    {description}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-5 sm:mb-7">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${gold}15`, color: gold }}
                  >
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">{text.championships}</h2>
                    <p className="text-gray-500 text-sm">
                      {shows.length}{" "}
                      {lang === "ar" ? "بطولة فرعية" : "sub-championships"}
                    </p>
                  </div>
                </div>

                {shows.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center text-gray-500">
                    {text.noShows}
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                  >
                    {shows.map((show) => {
                      const status = getShowStatus(show.registration_status);
                      const showTitle =
                        lang === "ar"
                          ? show.title_ar
                          : show.title_en || show.title_ar;
                      const showJudgesList = getJudgesForShow(show.id);

                      return (
                        <motion.div
                          key={show.id}
                          variants={itemVariants}
                          className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-6 hover:border-[#bc9b6a55] transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <h3 className="text-lg sm:text-xl font-black leading-relaxed break-words">
                              {showTitle}
                            </h3>

                            <span
                              className={`self-start sm:self-auto shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 sm:mt-6">
                            <div className="rounded-xl bg-black/20 border border-white/5 p-3.5 sm:p-4 min-w-0">
                              <CalendarDays
                                size={17}
                                style={{ color: gold }}
                              />
                              <p className="text-gray-500 text-xs mt-2">
                                {text.dates}
                              </p>
                              <p className="text-sm sm:text-base text-gray-200 mt-1 break-words">
                                {formatDate(show.start_date)}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                                {formatDate(show.end_date)}
                              </p>
                            </div>

                            <div className="rounded-xl bg-black/20 border border-white/5 p-3.5 sm:p-4 min-w-0">
                              <CreditCard size={17} style={{ color: gold }} />
                              <p className="text-gray-500 text-xs mt-2">
                                {text.fee}
                              </p>
                              <p className="text-sm sm:text-base text-gray-200 mt-1 break-words">
                                {Number(show.registration_fee) > 0
                                  ? `${Number(show.registration_fee).toFixed(
                                      3
                                    )} د.ك`
                                  : text.free}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Gavel size={17} style={{ color: gold }} />
                              <span className="text-sm text-gray-400">
                                {text.judges}
                              </span>
                            </div>

                            {showJudgesList.length === 0 ? (
                              <p className="text-xs text-gray-600">
                                {text.noJudges}
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                                {showJudgesList.map((judge) => (
                                  <span
                                    key={judge.id}
                                    className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-gray-300 break-words"
                                  >
                                    {lang === "ar"
                                      ? judge.name_ar
                                      : judge.name_en || judge.name_ar}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => goToShow(show)}
                            disabled={show.registration_status !== "open"}
                            className="w-full mt-5 sm:mt-6 rounded-xl min-h-[52px] py-3.5 px-4 font-bold text-sm sm:text-base transition disabled:cursor-not-allowed"
                            style={{
                              background:
                                show.registration_status === "open"
                                  ? gold
                                  : "rgba(255,255,255,0.06)",
                              color:
                                show.registration_status === "open"
                                  ? "#050B18"
                                  : "#6b7280",
                            }}
                          >
                            {show.registration_status === "open"
                              ? text.register
                              : status.label}
                          </button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
