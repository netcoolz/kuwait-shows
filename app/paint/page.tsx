"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
const paintings = [
  { id: 1,  file: "PHOTO-2020-03-25-11-37-00 2", title: "Majestic Stride",  loc: "Main Farm",   date: "2020", size: "100×120 cm", w: 100, h: 120 },
  { id: 2,  file: "PHOTO-2020-03-25-11-37-00 3", title: "Arabian Spirit",   loc: "Royal Hall",  date: "2020", size: "80×100 cm",  w: 80,  h: 100 },
  { id: 4,  file: "PHOTO-2020-03-25-11-37-00 5", title: "Pride",            loc: "Diwaniya",    date: "2020", size: "120×150 cm", w: 120, h: 150 },
  { id: 19, file: "PHOTO-2022-05-30-12-18-16",   title: "The Great One",    loc: "Main Farm",   date: "2022", size: "100×120 cm", w: 100, h: 120 },
];
const locations = ["All", "Main Farm", "Royal Hall", "Diwaniya", "Main Office"];
// مكوّن يعرض المقاس بشكل بصري (مستطيل مصغّر بالنسبة الحقيقية)
function SizeVisualizer({ w, h, size }: { w: number; h: number; size: string }) {
  const MAX = 48;
  const ratio = w / h;
  const rectW = ratio >= 1 ? MAX : Math.round(MAX * ratio);
  const rectH = ratio <= 1 ? MAX : Math.round(MAX / ratio);
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-end justify-center" style={{ width: MAX, height: MAX }}>
        <div
          className="border border-[#c5a059]/60 bg-[#c5a059]/10"
          style={{ width: rectW, height: rectH }}
        />
      </div>
      <span className="text-[#c5a059] font-mono text-xs tracking-widest">{size}</span>
    </div>
  );
}
type Painting = typeof paintings[0];
// مودال عرض اللوحة بالكامل
function LightboxModal({ painting, onClose }: { painting: Painting; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex flex-col lg:flex-row gap-0 max-w-5xl w-full max-h-[90vh] bg-[#0d0d0d] border border-[#c5a059]/20 overflow-hidden"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* الصورة */}
        <div className="relative flex-1 min-h-[320px] lg:min-h-0 bg-[#050505]">
          {/* إطار ذهبي داخلي */}
          <div className="absolute inset-[8px] border border-[#c5a059]/30 z-10 pointer-events-none" />
          <div className="absolute inset-[11px] border border-[#c5a059]/15 z-10 pointer-events-none" />
          <Image
            src={`/paintings/${painting.file}.jpg`}
            alt={painting.title}
            fill
            className="object-contain p-5"
          />
        </div>
        {/* تفاصيل اللوحة */}
        <div className="w-full lg:w-72 flex flex-col justify-between p-8 border-t lg:border-t-0 lg:border-l border-[#c5a059]/20">
          {/* خط ذهبي علوي */}
          <div className="w-8 h-px bg-[#c5a059] mb-6" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#c5a059] mb-3">
              Al Arab Stud · {painting.date}
            </p>
            <h2 className="text-2xl font-serif text-white leading-snug mb-6">
              {painting.title}
            </h2>
            <div className="space-y-4 text-[11px] uppercase tracking-[0.2em]">
              <div>
                <p className="text-[#444] mb-1">Location</p>
                <p className="text-[#aaa]">{painting.loc}</p>
              </div>
              <div>
                <p className="text-[#444] mb-1">Year</p>
                <p className="text-[#aaa]">{painting.date}</p>
              </div>
              <div>
                <p className="text-[#444] mb-3">Dimensions</p>
                <SizeVisualizer w={painting.w} h={painting.h} size={painting.size} />
                <p className="text-[#555] mt-3 text-[10px]">Width × Height</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-8 w-full border border-[#333] hover:border-[#c5a059] text-[#666] hover:text-[#c5a059] py-3 text-[9px] uppercase tracking-[0.3em] transition-all duration-300"
          >
            Close
          </button>
        </div>
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#555] hover:text-[#c5a059] transition-colors z-20 text-lg"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
export default function LuxuryGallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Painting | null>(null);
  const filtered =
    filter === "All" ? paintings : paintings.filter((p) => p.loc === filter);
  return (
    <>
      <main className="min-h-screen bg-[#060606] text-[#cccccc] selection:bg-[#c5a059]/20">
        {/* شريط ذهبي علوي */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
        {/* الهيدر */}
        <header className="py-20 px-6 md:px-16 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            {/* شعار / الهوية */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.5em] text-[#c5a059] mb-4">
                  Private Collection
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-none">
                  Al Arab Stud
                </h1>
                <h2 className="text-4xl md:text-6xl font-serif text-[#c5a059]/40 tracking-tight leading-none">
                  Collection
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#444] mb-1">
                  Works
                </p>
                <p className="text-5xl font-serif text-[#c5a059]">
                  {filtered.length.toString().padStart(2, "0")}
                </p>
              </div>
            </div>
            {/* الفاصل والتصفية */}
            <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#333] shrink-0">
                Filter by location
              </p>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilter(loc)}
                    className={`px-5 py-2 text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                      filter === loc
                        ? "border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5"
                        : "border-[#1e1e1e] text-[#444] hover:border-[#333] hover:text-[#666]"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        {/* الشبكة */}
        <section className="py-16 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, idx) => (
                  <motion.article
                    layout
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.07 } }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="group cursor-pointer"
                    onClick={() => setSelected(p)}
                  >
                    {/* الإطار */}
                    <div className="relative">
                      {/* ظل ذهبي خفي عند الهوفر */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#c5a059]/0 to-[#c5a059]/0 group-hover:from-[#c5a059]/10 group-hover:to-[#4a3a1f]/20 transition-all duration-700 blur-sm" />
                      {/* الإطار الذهبي */}
                      <div className="relative p-[1px] bg-gradient-to-br from-[#c5a059] via-[#8a6a2a] to-[#4a3a1f] group-hover:from-[#d4af6a] group-hover:via-[#c5a059] group-hover:to-[#7a5a2a] transition-all duration-500">
                        {/* الإطار الداخلي */}
                        <div className="p-[6px] bg-[#060606]">
                          <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                            <Image
                              src={`/paintings/${p.file}.jpg`}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* طبقة hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                            {/* رقم اللوحة */}
                            <div className="absolute top-3 left-3 text-[9px] font-mono text-[#c5a059]/60 tracking-widest">
                              #{String(p.id).padStart(2, "0")}
                            </div>
                            {/* زر العرض */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="border border-[#c5a059]/70 px-5 py-2 text-[9px] uppercase tracking-[0.3em] text-[#c5a059] bg-black/50 backdrop-blur-sm">
                                View Work
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* المعلومات */}
                    <div className="mt-6 px-1">
                      {/* فاصل ذهبي */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-5 h-px bg-[#c5a059]" />
                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#c5a059]/70">
                          {p.date}
                        </p>
                      </div>
                      <h3 className="text-lg font-serif text-[#e8e8e8] mb-4 group-hover:text-white transition-colors">
                        {p.title}
                      </h3>
                      {/* الميتاداتا */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-[#333] mb-1">
                            Location
                          </p>
                          <p className="text-[10px] text-[#888]">{p.loc}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-[#333] mb-1">
                            Dimensions
                          </p>
                          <p className="text-[10px] text-[#c5a059] font-mono">{p.size}</p>
                        </div>
                      </div>
                      {/* المقياس البصري للحجم */}
                      <div className="mt-4 pt-4 border-t border-[#111]">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#2a2a2a] mb-3">
                          Scale
                        </p>
                        <SizeVisualizer w={p.w} h={p.h} size={p.size} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
            {filtered.length === 0 && (
              <div className="text-center py-32">
                <p className="text-[#333] text-[11px] uppercase tracking-[0.5em]">
                  No works in this location
                </p>
              </div>
            )}
          </div>
        </section>
        {/* فوتر */}
        <footer className="border-t border-[#1a1a1a] py-12 px-6 md:px-16 mt-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#2a2a2a]">
              Al Arab Stud · Private Art Collection
            </p>
            <div className="h-px w-16 bg-[#c5a059]/30" />
            <p className="text-[8px] uppercase tracking-[0.4em] text-[#2a2a2a]">
              All Rights Reserved
            </p>
          </div>
        </footer>
        {/* شريط ذهبي سفلي */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
      </main>
      {/* المودال */}
      <AnimatePresence>
        {selected && (
          <LightboxModal painting={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}