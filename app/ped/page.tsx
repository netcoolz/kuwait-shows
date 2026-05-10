// app/ped/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { searchLocalPedigree, getSearchSuggestions } from '@/lib/actions/pedigree';

export default function PedigreeSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // التحكم الذكي في القائمة المنسدلة
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 3) {
        const sugs = await getSearchSuggestions(query);
        setSuggestions(sugs);
        
        // إذا كان الاسم مطابقاً تماماً لما في المربع، يتم إخفاء القائمة تلقائياً
        if (sugs.length === 1 && sugs[0].toLowerCase() === query.trim().toLowerCase()) {
          setShowDropdown(false);
        } else {
          setShowDropdown(true);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // ✦ إجبار التفريغ والإغلاق الفوري للقائمة ✦
    setQuery(searchQuery);
    setSuggestions([]); 
    setShowDropdown(false); 
    
    setLoading(true);
    setResult(null);

    try {
      const data = await searchLocalPedigree(searchQuery);
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: "فشل الاتصال بقاعدة البيانات / Connection Failed" });
    } finally {
      setLoading(false);
    }
  };

  const isEgyptian = result?.aiStrain?.includes("مصر");

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
      `}} />

      <div 
        className="min-h-screen relative font-cairo selection:bg-[#bea57e] selection:text-white"
        style={{ 
          backgroundImage: "url('/bgcopy.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
        dir="rtl"
      >
        <div className="absolute inset-0 bg-[#fcfbf9]/85 backdrop-blur-[2px] -z-10"></div>

        <div className="p-4 md:p-12 relative z-10 pb-20">
          
          {/* Header */}
          <div className="max-w-5xl mx-auto text-center mb-14 pt-6">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bea57e] to-[#4eadb3] mb-4 tracking-tight drop-shadow-sm">
              KUWAIT SHOWS <span className="font-light text-slate-700">PEDIGREE</span>
            </h1>
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#bea57e] to-transparent mx-auto mb-4 opacity-70"></div>
            <p className="text-slate-600 font-semibold text-sm md:text-base tracking-wide">
              قاعدة بيانات الأنساب المعتمدة | <span className="text-slate-400 font-normal">Official Pedigree Database</span>
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-16 relative">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex flex-col gap-6 items-center">
              
              <div className="w-full relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { 
                    if(suggestions.length > 0 && !(suggestions.length === 1 && suggestions[0].toLowerCase() === query.toLowerCase())) {
                      setShowDropdown(true); 
                    }
                  }}
                  placeholder="أدخل اسم الجواد بالإنجليزية / Enter horse name..."
                  className="w-full bg-white/90 backdrop-blur-md border-2 border-slate-100 rounded-2xl py-6 px-8 text-xl outline-none focus:border-[#bea57e] focus:ring-4 focus:ring-[#bea57e]/10 transition-all duration-300 placeholder:text-slate-300 shadow-xl text-slate-800 text-left font-sans relative z-20"
                  dir="ltr"
                />
                
                {/* القائمة المنسدلة - تمت معالجتها لتختفي فوراً عند الاختيار */}
                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl overflow-hidden" dir="ltr">
                    {suggestions.map((sug, idx) => (
                      <li 
                        key={idx}
                        // إضافة e.stopPropagation() لمنع أي تداخلات تؤدي لإبقاء القائمة مفتوحة
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearch(sug);
                        }}
                        className="px-8 py-4 hover:bg-[#bea57e]/10 hover:text-[#bea57e] hover:pl-10 cursor-pointer border-b border-slate-50 last:border-0 transition-all duration-300 text-slate-600 font-semibold text-left font-sans"
                      >
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-2/3 bg-gradient-to-r from-[#bea57e] via-[#cbb18a] to-[#4eadb3] hover:from-[#a89065] hover:to-[#3e959a] text-white py-4 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 font-bold tracking-widest text-lg shadow-[0_10px_20px_rgba(190,165,126,0.2)] hover:shadow-[0_15px_30px_rgba(78,173,179,0.3)] hover:-translate-y-1 relative z-10"
              >
                {loading ? "جاري المعالجة والتحليل..." : "بحث / SEARCH"}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {result && result.success && (
            <div className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700">
              
              <div className="text-center mb-12 bg-white/70 backdrop-blur-lg py-8 px-10 rounded-3xl border border-white/60 shadow-lg inline-block w-full">
                <h2 className="text-4xl md:text-5xl text-slate-800 mb-4 uppercase tracking-widest font-bold font-sans">{result.name}</h2>
                <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-[#bea57e]/20 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4eadb3] animate-pulse"></div>
                  <p className="text-slate-600 text-sm font-bold tracking-wide">{result.details}</p>
                </div>
              </div>

              {/* Pedigree Horizontal Bracket */}
              <div dir="ltr" className="bg-white/90 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] overflow-x-auto mb-14 scrollbar-thin scrollbar-thumb-[#bea57e] scrollbar-track-transparent">
                <div className="min-w-[950px] grid grid-cols-3 gap-6 auto-rows-fr h-[680px]">
                  
                  {/* SIRE */}
                  <div className="col-start-1 row-start-1 row-span-4 flex flex-col justify-center p-6 bg-gradient-to-r from-slate-50 to-[#bea57e]/5 border-l-4 border-[#bea57e] rounded-2xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-4 left-5 text-[10px] font-bold text-[#bea57e] tracking-widest uppercase bg-[#bea57e]/10 px-3 py-1.5 rounded-md">MALE / الأب</span>
                    <p className="font-sans text-2xl font-bold text-slate-800 mt-4">{result.pedigree.gen1.sire}</p>
                  </div>
                  <div className="col-start-2 row-start-1 row-span-2 flex flex-col justify-center p-5 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-3 left-4 text-[9px] text-[#bea57e] font-bold uppercase tracking-wider">Grandsire (M)</span>
                    <p className="font-sans text-lg font-semibold text-slate-700 mt-3">{result.pedigree.gen2.sireSire}</p>
                  </div>
                  <div className="col-start-2 row-start-3 row-span-2 flex flex-col justify-center p-5 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-3 left-4 text-[9px] text-[#4eadb3] font-bold uppercase tracking-wider">Granddam (F)</span>
                    <p className="font-sans text-lg font-semibold text-slate-700 mt-3">{result.pedigree.gen2.sireDam}</p>
                  </div>
                  <div className="col-start-3 row-start-1 flex items-center p-4 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm"><span className="text-[#bea57e] mr-4 font-bold text-sm">M:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.sss}</p></div>
                  <div className="col-start-3 row-start-2 flex items-center p-4 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm"><span className="text-[#4eadb3] mr-4 font-bold text-sm">F:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.ssd}</p></div>
                  <div className="col-start-3 row-start-3 flex items-center p-4 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm"><span className="text-[#bea57e] mr-4 font-bold text-sm">M:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.sds}</p></div>
                  <div className="col-start-3 row-start-4 flex items-center p-4 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm"><span className="text-[#4eadb3] mr-4 font-bold text-sm">F:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.sdd}</p></div>

                  {/* DAM */}
                  <div className="col-start-1 row-start-5 row-span-4 flex flex-col justify-center p-6 bg-gradient-to-r from-slate-50 to-[#4eadb3]/5 border-l-4 border-[#4eadb3] rounded-2xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-4 left-5 text-[10px] font-bold text-[#4eadb3] tracking-widest uppercase bg-[#4eadb3]/10 px-3 py-1.5 rounded-md">FEMALE / الأم</span>
                    <p className="font-sans text-2xl font-bold text-slate-800 mt-4">{result.pedigree.gen1.dam}</p>
                  </div>
                  <div className="col-start-2 row-start-5 row-span-2 flex flex-col justify-center p-5 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-3 left-4 text-[9px] text-[#bea57e] font-bold uppercase tracking-wider">Grandsire (M)</span>
                    <p className="font-sans text-lg font-semibold text-slate-700 mt-3">{result.pedigree.gen2.damSire}</p>
                  </div>
                  <div className="col-start-2 row-start-7 row-span-2 flex flex-col justify-center p-5 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm hover:shadow-md transition-all relative">
                    <span className="absolute top-3 left-4 text-[9px] text-[#4eadb3] font-bold uppercase tracking-wider">Granddam (F)</span>
                    <p className="font-sans text-lg font-semibold text-slate-700 mt-3">{result.pedigree.gen2.damDam}</p>
                  </div>
                  <div className="col-start-3 row-start-5 flex items-center p-4 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm"><span className="text-[#bea57e] mr-4 font-bold text-sm">M:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.dss}</p></div>
                  <div className="col-start-3 row-start-6 flex items-center p-4 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm"><span className="text-[#4eadb3] mr-4 font-bold text-sm">F:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.dsd}</p></div>
                  <div className="col-start-3 row-start-7 flex items-center p-4 bg-slate-50 border-l-4 border-[#bea57e] rounded-xl shadow-sm"><span className="text-[#bea57e] mr-4 font-bold text-sm">M:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.dds}</p></div>
                  <div className="col-start-3 row-start-8 flex items-center p-4 bg-slate-50 border-l-4 border-[#4eadb3] rounded-xl shadow-sm"><span className="text-[#4eadb3] mr-4 font-bold text-sm">F:</span> <p className="font-sans text-[15px] font-semibold text-slate-600">{result.pedigree.gen3.ddd}</p></div>
                </div>
              </div>

              {/* ✦ ✦ التوزيع الجديد لمربع الذكاء الاصطناعي (أفقي ومرتب) ✦ ✦ */}
              {result.aiAnalysis && (
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-[0_20px_40px_rgba(190,165,126,0.15)] transition-all duration-700">
                  <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-[#4eadb3] via-[#bea57e] to-[#4eadb3]"></div>
                  
                  <div className="relative z-10 flex flex-col gap-10">
                    
                    {/* 1. النص الرسمي بالأعلى */}
                    <div className="text-slate-700 font-semibold leading-relaxed text-xl md:text-2xl text-center md:text-right px-4">
                      {result.aiAnalysis}
                    </div>
                    
                    {/* 2. توزيع الأيقونات الثلاث بشكل عرضي بالأسفل */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200/50">
                      
                      {/* أيقونة التحليل */}
                      <div className="flex flex-col items-center justify-center p-6 bg-white/60 rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="relative flex h-12 w-12 mb-3">
                          <span className="relative inline-flex rounded-full h-12 w-12 bg-slate-800 flex items-center justify-center text-white shadow-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          </span>
                        </div>
                        <h3 className="text-slate-800 text-xs font-bold tracking-widest uppercase text-center">
                           Analysis<br/><span className="text-slate-500 text-[11px] mt-1 block"> التحليل</span>
                        </h3>
                      </div>

                      {/* أيقونة السلالة */}
                      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border shadow-sm hover:-translate-y-1 transition-transform ${isEgyptian ? 'bg-[#bea57e]/10 border-[#bea57e]/30' : 'bg-[#4eadb3]/10 border-[#4eadb3]/30'}`}>
                        <div className="relative flex h-12 w-12 mb-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: isEgyptian ? '#bea57e' : '#4eadb3' }}></span>
                          <span className="relative inline-flex rounded-full h-12 w-12 flex items-center justify-center text-white shadow-md" style={{ backgroundColor: isEgyptian ? '#bea57e' : '#4eadb3' }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                          </span>
                        </div>
                        <h3 className="text-slate-800 text-[15px] font-bold text-center">
                          {result.aiStrain}
                          <br/><span className="text-slate-500 text-[11px] uppercase tracking-widest mt-1 block">السلالة</span>
                        </h3>
                      </div>

                      {/* أيقونة الرسن */}
                      <div className="flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="relative flex h-12 w-12 mb-3">
                          <span className="relative inline-flex rounded-full h-12 w-12 bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center text-white shadow-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                          </span>
                        </div>
                        <h3 className="text-slate-800 text-[15px] font-bold text-center">
                          {result.aiRasan || "غير محدد"}
                          <br/><span className="text-slate-500 text-[11px] font-normal uppercase tracking-widest mt-1 block">رسن الجواد</span>
                        </h3>
                      </div>

                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {result && !result.success && (
            <div className="max-w-md mx-auto mt-12 text-center p-6 bg-red-50/90 backdrop-blur-md border border-red-200 rounded-2xl shadow-md">
              <p className="text-red-600 font-bold text-lg">{result.error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}