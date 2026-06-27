"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchLocalPedigree, getSearchSuggestions } from "@/lib/actions/pedigree";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PedigreeGen1 {
  sire: string;
  dam: string;
}

interface PedigreeGen2 {
  sireSire: string;
  sireDam: string;
  damSire: string;
  damDam: string;
}

interface PedigreeGen3 {
  sss: string;
  ssd: string;
  sds: string;
  sdd: string;
  dss: string;
  dsd: string;
  dds: string;
  ddd: string;
}

interface PedigreeResult {
  success: true;
  name: string;
  details: string;
  aiAnalysis?: string;
  aiStrain?: string;
  aiRasan?: string;
  pedigree: {
    gen1: PedigreeGen1;
    gen2: PedigreeGen2;
    gen3: PedigreeGen3;
  };
}

interface ErrorResult {
  success: false;
  error: string;
}

type SearchResult = PedigreeResult | ErrorResult;

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * ينزع الأقواس المزدوجة أو المفردة من بداية ونهاية الاسم
 * مثال: '"STORM CAT"'  →  'STORM CAT'
 */
function cleanName(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw.replace(/^[\u0022\u0027\u201C\u201D\u2018\u2019]+|[\u0022\u0027\u201C\u201D\u2018\u2019]+$/g, "").trim();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto animate-pulse space-y-6">
      <div className="h-28 bg-white/60 rounded-3xl" />
      <div className="h-[740px] bg-white/60 rounded-[2rem]" />
      <div className="h-56 bg-white/60 rounded-[2rem]" />
    </div>
  );
}

interface PedigreeCardProps {
  label: string;
  sublabel: string;
  color: "gold" | "teal";
  name: string;
}

function PedigreeCard({ label, sublabel, color, name }: PedigreeCardProps) {
  const accent = color === "gold" ? "#bea57e" : "#4eadb3";
  return (
    <div
      className="flex flex-col justify-center p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative"
      style={{
        background: `linear-gradient(to right, #f8f8f8, ${accent}0d)`,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <span
        className="absolute top-4 left-5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md"
        style={{ color: accent, backgroundColor: `${accent}1a` }}
      >
        {label}
      </span>
      <p className="font-sans text-2xl font-bold text-slate-800 mt-6">{name || "—"}</p>
      <p className="text-[11px] text-slate-400 mt-1 tracking-wide">{sublabel}</p>
    </div>
  );
}

interface Gen2CardProps {
  label: string;
  color: "gold" | "teal";
  name: string;
}

function Gen2Card({ label, color, name }: Gen2CardProps) {
  const accent = color === "gold" ? "#bea57e" : "#4eadb3";
  return (
    <div
      className="flex flex-col justify-center p-5 bg-slate-50 rounded-xl shadow-sm hover:shadow-md transition-all relative"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <span
        className="absolute top-3 left-4 text-[9px] font-bold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {label}
      </span>
      <p className="font-sans text-lg font-semibold text-slate-700 mt-5">{name || "—"}</p>
    </div>
  );
}

interface Gen3CellProps {
  isMale: boolean;
  name: string;
}

function Gen3Cell({ isMale, name }: Gen3CellProps) {
  const accent = isMale ? "#bea57e" : "#4eadb3";
  return (
    <div
      className="flex items-center p-4 bg-slate-50 rounded-xl shadow-sm"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <span
        className="mr-4 font-bold text-sm shrink-0"
        style={{ color: accent }}
      >
        {isMale ? "M:" : "F:"}
      </span>
      <p className="font-sans text-[15px] font-semibold text-slate-600 truncate">{name || "—"}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PedigreeSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const id = setTimeout(async () => {
      const sugs = await getSearchSuggestions(query);
      setSuggestions(sugs);
      const exactMatch =
        sugs.length === 1 && sugs[0].toLowerCase() === query.trim().toLowerCase();
      setShowDropdown(!exactMatch && sugs.length > 0);
    }, 300);

    return () => clearTimeout(id);
  }, [query]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setSuggestions([]);
    setShowDropdown(false);
    setLoading(true);
    setResult(null);

    try {
      const data = await searchLocalPedigree(trimmed);

if (data.success) {
  setResult(data as PedigreeResult);
} else {
  setResult(data as ErrorResult);
}
    } catch {
      setResult({
        success: false,
        error: "فشل الاتصال بقاعدة البيانات / Connection Failed",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Keyboard navigation for dropdown
  const [activeIdx, setActiveIdx] = useState(-1);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSearch(suggestions[activeIdx]);
      setActiveIdx(-1);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIdx(-1);
    }
  }

  const isSuccess = result?.success === true;
  const successResult = isSuccess ? (result as PedigreeResult) : null;

  // يُعتبر الجواد مصرياً فقط إذا كان aiStrain يحتوي على "مصري" أو "Egyptian"
  // وليس مجرد ذكر كلمة "مصر" في سياق آخر
  const EGYPTIAN_KEYWORDS = ["مصري", "مصرية", "egyptian"];
  const strainLower = successResult?.aiStrain?.toLowerCase() ?? "";
  const isEgyptian = EGYPTIAN_KEYWORDS.some((kw) => strainLower.includes(kw));

  return (
    <>
      {/* Load Cairo font via <link> instead of dangerouslySetInnerHTML */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
      />

      <div
        className="min-h-screen relative font-cairo selection:bg-[#bea57e] selection:text-white"
        style={{
          fontFamily: "'Cairo', sans-serif",
          backgroundImage: "url('/bgcopy.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        dir="rtl"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#fcfbf9]/85 backdrop-blur-[2px] -z-10" />

        <div className="p-4 md:p-12 relative z-10 pb-20">

          {/* ── Header ── */}
          <header className="max-w-5xl mx-auto text-center mb-14 pt-6">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bea57e] to-[#4eadb3] mb-4 tracking-tight drop-shadow-sm">
              KUWAIT SHOWS{" "}
              <span className="font-light text-slate-700">PEDIGREE</span>
            </h1>
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#bea57e] to-transparent mx-auto mb-4 opacity-70" />
            <p className="text-slate-600 font-semibold text-sm md:text-base tracking-wide">
              قاعدة بيانات الأنساب المعتمدة |{" "}
              <span className="text-slate-400 font-normal">
                Official Pedigree Database
              </span>
            </p>
          </header>

          {/* ── Search Form ── */}
          <div className="max-w-2xl mx-auto mb-16">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query);
              }}
              className="flex flex-col gap-6 items-center"
            >
              {/* Input + Dropdown wrapper */}
              <div className="w-full relative" ref={containerRef}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIdx(-1);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="أدخل اسم الجواد بالإنجليزية / Enter horse name..."
                  aria-label="Horse name search"
                  aria-autocomplete="list"
                  aria-expanded={showDropdown}
                  aria-haspopup="listbox"
                  className="w-full bg-white/90 backdrop-blur-md border-2 border-slate-100 rounded-2xl py-6 px-8 text-xl outline-none focus:border-[#bea57e] focus:ring-4 focus:ring-[#bea57e]/10 transition-all duration-300 placeholder:text-slate-300 shadow-xl text-slate-800 text-left font-sans relative z-20"
                  dir="ltr"
                />

                {/* Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl overflow-hidden"
                    dir="ltr"
                  >
                    {suggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        role="option"
                        aria-selected={activeIdx === idx}
                        // Use onMouseDown instead of onClick so it fires before onBlur
                        onMouseDown={(e) => {
                          e.preventDefault(); // prevents input blur
                          handleSearch(sug);
                        }}
                        className={`px-8 py-4 cursor-pointer border-b border-slate-50 last:border-0 transition-all duration-200 text-slate-600 font-semibold text-left font-sans ${
                          activeIdx === idx
                            ? "bg-[#bea57e]/15 text-[#bea57e] pl-10"
                            : "hover:bg-[#bea57e]/10 hover:text-[#bea57e] hover:pl-10"
                        }`}
                      >
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full md:w-2/3 bg-gradient-to-r from-[#bea57e] via-[#cbb18a] to-[#4eadb3] hover:from-[#a89065] hover:to-[#3e959a] text-white py-4 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-bold tracking-widest text-lg shadow-[0_10px_20px_rgba(190,165,126,0.2)] hover:shadow-[0_15px_30px_rgba(78,173,179,0.3)] hover:-translate-y-1 relative z-10"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    جاري المعالجة والتحليل...
                  </span>
                ) : (
                  "بحث / SEARCH"
                )}
              </button>
            </form>
          </div>

          {/* ── Loading Skeleton ── */}
          {loading && <LoadingSkeleton />}

          {/* ── Results ── */}
          {!loading && successResult && (
            <div className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700">

              {/* Horse name banner */}
              <div className="text-center mb-12 bg-white/70 backdrop-blur-lg py-8 px-10 rounded-3xl border border-white/60 shadow-lg w-full">
                <h2 className="text-4xl md:text-5xl text-slate-800 mb-4 uppercase tracking-widest font-bold font-sans">
                  {cleanName(successResult.name)}
                </h2>
                <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-[#bea57e]/20 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4eadb3] animate-pulse" />
                  <p className="text-slate-600 text-sm font-bold tracking-wide">
                    {successResult.details}
                  </p>
                </div>
              </div>

              {/* ── Pedigree Grid ── */}
              <div
                dir="ltr"
                className="bg-white/90 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] overflow-x-auto mb-14 scrollbar-thin scrollbar-thumb-[#bea57e] scrollbar-track-transparent"
              >
                <div className="min-w-[950px] grid grid-cols-3 gap-6 auto-rows-fr h-[680px]">

                  {/* Gen 1 — Sire */}
                  <div className="col-start-1 row-start-1 row-span-4">
                    <PedigreeCard
                      label="MALE / الأب"
                      sublabel="Sire"
                      color="gold"
                      name={cleanName(successResult.pedigree.gen1.sire)}
                    />
                  </div>

                  {/* Gen 2 — Sire side */}
                  <div className="col-start-2 row-start-1 row-span-2">
                    <Gen2Card label="Grandsire (M)" color="gold" name={cleanName(successResult.pedigree.gen2.sireSire)} />
                  </div>
                  <div className="col-start-2 row-start-3 row-span-2">
                    <Gen2Card label="Granddam (F)" color="teal" name={cleanName(successResult.pedigree.gen2.sireDam)} />
                  </div>

                  {/* Gen 3 — Sire side */}
                  <div className="col-start-3 row-start-1"><Gen3Cell isMale name={cleanName(successResult.pedigree.gen3.sss)} /></div>
                  <div className="col-start-3 row-start-2"><Gen3Cell isMale={false} name={cleanName(successResult.pedigree.gen3.ssd)} /></div>
                  <div className="col-start-3 row-start-3"><Gen3Cell isMale name={cleanName(successResult.pedigree.gen3.sds)} /></div>
                  <div className="col-start-3 row-start-4"><Gen3Cell isMale={false} name={cleanName(successResult.pedigree.gen3.sdd)} /></div>

                  {/* Gen 1 — Dam */}
                  <div className="col-start-1 row-start-5 row-span-4">
                    <PedigreeCard
                      label="FEMALE / الأم"
                      sublabel="Dam"
                      color="teal"
                      name={cleanName(successResult.pedigree.gen1.dam)}
                    />
                  </div>

                  {/* Gen 2 — Dam side */}
                  <div className="col-start-2 row-start-5 row-span-2">
                    <Gen2Card label="Grandsire (M)" color="gold" name={cleanName(successResult.pedigree.gen2.damSire)} />
                  </div>
                  <div className="col-start-2 row-start-7 row-span-2">
                    <Gen2Card label="Granddam (F)" color="teal" name={cleanName(successResult.pedigree.gen2.damDam)} />
                  </div>

                  {/* Gen 3 — Dam side */}
                  <div className="col-start-3 row-start-5"><Gen3Cell isMale name={cleanName(successResult.pedigree.gen3.dss)} /></div>
                  <div className="col-start-3 row-start-6"><Gen3Cell isMale={false} name={cleanName(successResult.pedigree.gen3.dsd)} /></div>
                  <div className="col-start-3 row-start-7"><Gen3Cell isMale name={cleanName(successResult.pedigree.gen3.dds)} /></div>
                  <div className="col-start-3 row-start-8"><Gen3Cell isMale={false} name={cleanName(successResult.pedigree.gen3.ddd)} /></div>
                </div>
              </div>

              {/* ── AI Analysis Panel ── */}
              {successResult.aiAnalysis && (
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-[0_20px_40px_rgba(190,165,126,0.15)]">
                  {/* Top accent bar */}
                  <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-[#4eadb3] via-[#bea57e] to-[#4eadb3]" />

                  <div className="relative z-10 flex flex-col gap-10">

                    {/* Analysis text */}
                    <p className="text-slate-700 font-semibold leading-relaxed text-xl md:text-2xl text-center md:text-right px-4">
                      {successResult.aiAnalysis}
                    </p>

                    {/* Three info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200/50">

                      {/* Analysis icon */}
                      <InfoCard
                        icon={
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                        iconBg="#1e293b"
                        label="Analysis"
                        sublabel="التحليل"
                        ping={false}
                      />

                      {/* Strain */}
                      <InfoCard
                        icon={
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        }
                        iconBg={isEgyptian ? "#bea57e" : "#4eadb3"}
                        label={successResult.aiStrain ?? "—"}
                        sublabel="السلالة"
                        ping
                        pingColor={isEgyptian ? "#bea57e" : "#4eadb3"}
                        cardBg={isEgyptian ? "bg-[#bea57e]/10" : "bg-[#4eadb3]/10"}
                        cardBorder={isEgyptian ? "border-[#bea57e]/30" : "border-[#4eadb3]/30"}
                      />

                      {/* Rasan */}
                      <InfoCard
                        icon={
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        }
                        iconBg="linear-gradient(to right, #94a3b8, #64748b)"
                        label={successResult.aiRasan ?? "غير محدد"}
                        sublabel="رسن الجواد"
                        ping={false}
                        cardBg="bg-slate-50/80"
                        cardBorder="border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && result && !result.success && (
            <div
              className="max-w-md mx-auto mt-12 text-center p-6 bg-red-50/90 backdrop-blur-md border border-red-200 rounded-2xl shadow-md"
              role="alert"
            >
              <svg
                className="w-10 h-10 text-red-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-red-600 font-bold text-lg">{(result as ErrorResult).error}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ─── InfoCard helper ──────────────────────────────────────────────────────────

interface InfoCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel: string;
  ping?: boolean;
  pingColor?: string;
  cardBg?: string;
  cardBorder?: string;
}

function InfoCard({
  icon,
  iconBg,
  label,
  sublabel,
  ping = false,
  pingColor,
  cardBg = "bg-white/60",
  cardBorder = "border-slate-100",
}: InfoCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${cardBg} rounded-2xl border ${cardBorder} shadow-sm hover:-translate-y-1 transition-transform`}
    >
      <div className="relative flex h-12 w-12 mb-3">
        {ping && pingColor && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30"
            style={{ backgroundColor: pingColor }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-12 w-12 items-center justify-center text-white shadow-md"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-slate-800 text-[15px] font-bold text-center">
        {label}
        <br />
        <span className="text-slate-500 text-[11px] font-normal uppercase tracking-widest mt-1 block">
          {sublabel}
        </span>
      </h3>
    </div>
  );
}
