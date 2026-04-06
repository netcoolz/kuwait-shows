"use client";

import { useState, useEffect } from "react";
import { FaPlusCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { auth } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";
import { getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth"; 
import { motion, AnimatePresence } from "framer-motion";

const gold = "#bc9b6a";

export default function SellHorsePage() {
  const [lang, setLang] = useState("en");
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const router = useRouter();
  
  const [showLogin, setShowLogin] = useState(false); 
  const [authMode, setAuthMode] = useState("login"); 
  const [user, setUser] = useState<any>(null);

  const [authData, setAuthData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => { if (result?.user) setShowLogin(false); })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    const handleLangChange = () => {
      const newLang = localStorage.getItem("lang");
      if (newLang) setLang(newLang);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const handleAuth = async () => {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, authData.email, authData.password);
      setShowLogin(false);
    } catch (err) {
      alert(lang === "ar" ? "خطأ في الدخول: تأكد من الإيميل وكلمة المرور" : "Login error: Please check your email and password.");
    }
  };

  const handleRegister = async () => {
    if (!authData.name || !authData.phone || !authData.email || !authData.password) {
      alert(lang === "ar" ? "الرجاء تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const userCredential = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: authData.name });

      await setDoc(doc(db, "users", newUser.uid), {
        name: authData.name,
        phone: authData.phone,
        email: authData.email,
        createdAt: new Date().toISOString()
      });

      setShowLogin(false);
    } catch (err) {
      alert(lang === "ar" ? "خطأ في التسجيل: قد يكون الإيميل مستخدم مسبقاً" : "Register error: The email might already be in use.");
    }
  };

  const fetchHorses = async (loadMore = false) => {
    try {
      const { collection, getDocs, query, limit, startAfter } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const fetchLimit = 12; 
      let q = loadMore && lastDoc 
        ? query(collection(db, "horses"), startAfter(lastDoc), limit(fetchLimit))
        : query(collection(db, "horses"), limit(fetchLimit));

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setHorses((prev) => (loadMore ? [...prev, ...data] : data));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching horses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHorses(); }, []);

  // أنيميشن للكروت
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white pb-20 relative"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      <div className="relative z-10 w-full px-4 md:px-10 pt-24 mx-auto max-w-screen-2xl">
        
        {/* 🌟 HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-block px-6 py-2 rounded-full border border-[#bc9b6a44] bg-white/5 backdrop-blur-sm mb-4 shadow-[0_0_15px_rgba(188,155,106,0.1)]">
            <span className="tracking-widest text-xs font-bold text-[#bc9b6a] uppercase">Luxury Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#ddc9ab] via-[#bc9b6a] to-[#8c6a3f] text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {lang === "ar" ? "سوق الخيل الفاخر" : "Premium Horses"}
          </h1>
          <p className="text-gray-300 text-base md:text-lg font-light">
            {lang === "ar" ? "المنصة الحصرية لعرض واقتناء أجمل الخيل العربية" : "The exclusive platform to buy and sell Arabian horses"}
          </p>
        </motion.div>

        {/* 🎛️ ACTION BAR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <button
            onClick={() => router.push("/sell/add")}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(188,155,106,0.4)] hover:shadow-[0_0_30px_rgba(188,155,106,0.6)]"
            style={{ background: "linear-gradient(135deg, #ddc9ab, #bc9b6a, #8c6a3f)", color: "#000" }}
          >
            <FaPlusCircle className="text-lg" />
            {lang === "ar" ? "اعرض خيلك للبيع" : "List Your Horse"}
          </button>

          {user ? (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/sell/my-horses/")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#bc9b6a] text-[#bc9b6a] hover:bg-[#bc9b6a11] transition-all backdrop-blur-sm"
              >
                🐎 {lang === "ar" ? "إعلاناتي" : "My Listings"}
              </button>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all backdrop-blur-sm"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { setAuthMode("login"); setShowLogin(true); }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#bc9b6a] text-[#bc9b6a] hover:bg-[#bc9b6a11] transition-all backdrop-blur-sm"
              >
                <FaSignInAlt /> {lang === "ar" ? "دخول" : "Login"}
              </button>
              <button
                onClick={() => { setAuthMode("register"); setShowLogin(true); }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:border-[#bc9b6a] transition-all backdrop-blur-sm"
              >
                <FaUserPlus /> {lang === "ar" ? "حساب جديد" : "Register"}
              </button>
            </div>
          )}
        </motion.div>

        {/* 🔄 LOADING & EMPTY STATES */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#bc9b6a44] border-t-[#bc9b6a] rounded-full animate-spin" />
          </div>
        )}
        {!loading && horses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 border border-[#bc9b6a44] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(188,155,106,0.1)]">
              <span className="text-4xl">🐴</span>
            </div>
            <p className="text-gray-400 text-xl font-light">{lang === "ar" ? "لا توجد خيل معروضة حالياً" : "No horses available yet"}</p>
          </motion.div>
        )}

        {/* 🖼️ HORSE CARDS GRID (تصميم كروت أصغر وكرتين في الجوال) */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 max-w-6xl mx-auto"
        >
          {horses.map((horse) => (
            <motion.div
              variants={itemVariants}
              key={horse.id}
              onClick={() => setSelectedHorse(horse)}
              className="group relative bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer border border-[#bc9b6a22] hover:border-[#bc9b6a] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(188,155,106,0.15)] flex flex-col"
            >
              <div className="aspect-square overflow-hidden relative bg-[#111]">
                {/* 🚫 تم حذف الـ quality بالكامل لتجاوز عطل Vercel */}
                <Image
                  src={horse.images?.[0] || "/placeholder.png"}
                  alt={horse.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy" 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              </div>

              <div className="p-4 flex flex-col flex-grow items-center text-center -mt-8 relative z-10">
                <h3 className="font-bold text-base md:text-lg text-white mb-2 truncate w-full drop-shadow-md">{horse.name}</h3>
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs w-full mt-auto">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded border border-white/10 text-gray-300 truncate max-w-[45%]">
                    {horse.father}
                  </span>
                  <span className="text-[#bc9b6a]">×</span>
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded border border-white/10 text-gray-300 truncate max-w-[45%]">
                    {horse.mother}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🔽 LOAD MORE */}
        {lastDoc && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => fetchHorses(true)}
              className="px-8 py-3 rounded-full border border-[#bc9b6a] text-[#bc9b6a] hover:bg-[#bc9b6a] hover:text-black font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(188,155,106,0.2)]"
            >
              {lang === "ar" ? "عرض المزيد" : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* 🔐 LOGIN/REGISTER POPUP */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f0f] p-8 rounded-3xl w-full max-w-sm text-center relative border border-[#bc9b6a44] shadow-[0_0_50px_rgba(188,155,106,0.15)]"
            >
              <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition">✕</button>
              
              <div className="w-16 h-16 mx-auto bg-[#bc9b6a11] rounded-full flex items-center justify-center mb-6 border border-[#bc9b6a22]">
                {authMode === "login" ? <FaSignInAlt className="text-2xl text-[#bc9b6a]" /> : <FaUserPlus className="text-2xl text-[#bc9b6a]" />}
              </div>

              <h2 className="text-2xl font-bold mb-6 text-white">{authMode === "login" ? (lang === "ar" ? "مرحباً بك مجدداً" : "Welcome Back") : (lang === "ar" ? "حساب جديد" : "Create Account")}</h2>

              <div className="space-y-4 mb-6">
                {authMode === "register" && (
                  <>
                    <input placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-[#bc9b6a] transition" onChange={(e) => setAuthData({ ...authData, name: e.target.value })} />
                    <input placeholder={lang === "ar" ? "رقم الواتساب" : "WhatsApp Number"} type="tel" dir="ltr" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-left focus:border-[#bc9b6a] transition" onChange={(e) => setAuthData({ ...authData, phone: e.target.value })} />
                  </>
                )}
                <input placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-[#bc9b6a] transition" onChange={(e) => setAuthData({ ...authData, email: e.target.value })} />
                <input placeholder={lang === "ar" ? "كلمة المرور" : "Password"} type="password" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-[#bc9b6a] transition" onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
              </div>

              <button onClick={authMode === "login" ? handleAuth : handleRegister} className="w-full py-4 rounded-xl font-bold text-black transition-all hover:opacity-90 shadow-lg hover:shadow-[0_0_20px_rgba(188,155,106,0.4)]" style={{ background: "linear-gradient(135deg, #ddc9ab, #bc9b6a)" }}>
                {authMode === "login" ? (lang === "ar" ? "دخول" : "Login") : (lang === "ar" ? "تسجيل" : "Register")}
              </button>

              <p className="text-sm mt-6 text-gray-400">
                {authMode === "login" ? (lang === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? ") : (lang === "ar" ? "لديك حساب بالفعل؟ " : "Already have an account? ")}
                <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[#bc9b6a] hover:underline font-semibold">
                  {authMode === "login" ? (lang === "ar" ? "سجل الآن" : "Register now") : (lang === "ar" ? "دخول" : "Login here")}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💎 MODAL HORSE PREVIEW (VIP STYLE) */}
      <AnimatePresence>
        {selectedHorse && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedHorse(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] rounded-3xl max-w-5xl w-full relative border border-[#bc9b6a44] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
            >
              <button onClick={() => setSelectedHorse(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#bc9b6a] hover:text-black transition border border-white/10">✕</button>

              {/* Main Image Area */}
              <div className="w-full md:w-1/2 relative h-[350px] md:h-auto bg-black">
                {/* 🚫 تم حذف الـ quality */}
                <Image src={selectedHorse.images?.[0] || "/placeholder.png"} alt={selectedHorse.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Details Area */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
                <div className="inline-block px-4 py-1.5 bg-[#bc9b6a22] border border-[#bc9b6a] rounded-full text-[#bc9b6a] text-xs font-bold w-max mb-6 tracking-wide">
                  {lang === "ar" ? "معروض للبيع" : "For Sale"}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white drop-shadow-md">{selectedHorse.name}</h2>
                
                <div className="space-y-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 font-light">{lang === "ar" ? "العمر" : "Age"}</span>
                    <span className="font-semibold text-white tracking-wide">{selectedHorse.age}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3 pt-3">
                    <span className="text-gray-400 font-light">{lang === "ar" ? "الأب" : "Sire"}</span>
                    <span className="font-semibold text-[#bc9b6a] tracking-wide">{selectedHorse.father}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-gray-400 font-light">{lang === "ar" ? "الأم" : "Dam"}</span>
                    <span className="font-semibold text-[#bc9b6a] tracking-wide">{selectedHorse.mother}</span>
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar mb-6">
                  {selectedHorse.images?.map((img: string, i: number) => (
                    <div key={i} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#bc9b6a] transition-all">
                      {/* 🚫 تم حذف الـ quality */}
                      <Image src={img} alt="thumb" fill sizes="80px" onClick={() => setActiveImage(img)} className="object-cover" />
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <a
                    href={`https://wa.me/${selectedHorse.phone}`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
                    style={{ background: "linear-gradient(90deg, #128C7E, #25D366)" }}
                  >
                    <FaWhatsapp className="text-2xl" />
                    {lang === "ar" ? "تواصل مع المالك" : "Contact Owner"}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔍 LIGHTBOX (FULL RES) */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-black/95 z-[90] flex items-center justify-center p-2 md:p-8"
          >
            <button className="absolute top-6 right-6 text-white text-4xl z-10 hover:text-[#bc9b6a] transition-colors">✕</button>
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              {/* هنا نحتفظ بـ unoptimized لأننا نريد الصورة الأصلية خام بدون ضغط */}
              <Image src={activeImage} alt="Zoomed" fill unoptimized className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(188,155,106,0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(188,155,106,0.8); }
      `}</style>
    </main>
  );
}