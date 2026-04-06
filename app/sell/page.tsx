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

  // مراقبة حالة الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setShowLogin(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const fetchHorses = async (loadMore = false) => {
    try {
      const { collection, getDocs, query, limit, startAfter } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      let q;
      // 🔥 سحب 12 إعلان بدلاً من 6 ليتناسب مع حجم الكروت الجديد ويملأ الشاشة
      const fetchLimit = 12; 

      if (loadMore && lastDoc) {
        q = query(collection(db, "horses"), startAfter(lastDoc), limit(fetchLimit));
      } else {
        q = query(collection(db, "horses"), limit(fetchLimit));
      }

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHorses((prev) => (loadMore ? [...prev, ...data] : data));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

    } catch (error) {
      console.error("Error fetching horses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

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
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white px-4 sm:px-6 py-12 sm:py-16"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="md:pr-[300px]">

        {/* HEADER */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: gold }}>
            {lang === "ar" ? "خيل معروضة للبيع" : "Horses for Sale"}
          </h1>

          <p className="text-gray-400">
            {lang === "ar"
              ? "منصة تجمع ملاك الخيل والمشترين"
              : "A professional marketplace connecting horse owners and buyers"}
          </p>
        </div>

        {/* CTA - الأزرار */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          
          {/* 🌟 الزر الثابت للجميع: إضافة إعلان */}
          <button
            onClick={() => router.push("/sell/add")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)", color: "#fff", boxShadow: "0 0 15px #bc9b6a66" }}
          >
            <FaPlusCircle />
            {lang === "ar" ? "اعرض خيلك هنا" : "List Your Horse"}
          </button>

          {user ? (
            // 🟢 إذا كان المستخدم مسجل دخول
            <>
              <button
                onClick={() => router.push("/sell/my-horses/")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:bg-[#bc9b6a]/10"
                style={{ borderColor: gold, color: gold }}
              >
                🐎 {lang === "ar" ? "اعلاناتي وحسابي" : "My Horses & Profile"}
              </button>

              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/50 text-red-400 transition-all duration-300 hover:bg-red-500/10"
              >
                <FaSignOutAlt />
                {lang === "ar" ? "خروج" : "Logout"}
              </button>
            </>
          ) : (
            // 🔴 إذا لم يكن مسجل دخول
            <>
              <button
                onClick={() => { setAuthMode("login"); setShowLogin(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#bc9b6a]/10"
                style={{ borderColor: gold, color: gold }}
              >
                <FaSignInAlt />
                {lang === "ar" ? "تسجيل دخول" : "Login"}
              </button>

              <button
                onClick={() => { setAuthMode("register"); setShowLogin(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#bc9b6a]/10"
                style={{ borderColor: gold, color: gold }}
              >
                <FaUserPlus />
                {lang === "ar" ? "إنشاء حساب" : "Register"}
              </button>
            </>
          )}

        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        )}

        {/* EMPTY */}
        {!loading && horses.length === 0 && (
          <p className="text-center text-gray-400">
            {lang === "ar" ? "لا يوجد إعلانات حالياً" : "No ads yet"}
          </p>
        )}

        {/* CARDS */}
        {/* 🔥 التعديل هنا: 4 أعمدة في الشاشات الكبيرة، 3 للآيباد، 2 للجوال (ليصبح الكارت أصغر بـ 20-25%) */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto"
        >
          {horses.map((horse) => (
            <motion.div
              variants={itemVariants}
              key={horse.id}
              onClick={() => setSelectedHorse(horse)}
              className="group bg-[#111] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(188,155,106,0.2)" }}
            >
              {/* صورة الكارت المعروض (مقاسات محسنة للحجم الجديد) - بدون كواليتي */}
              <div className="aspect-square overflow-hidden relative bg-[#222]">
                <Image
                  src={horse.images?.[0] || "/placeholder.png"}
                  alt={horse.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  loading="lazy" 
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {horse.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {horse.father} × {horse.mother}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* LOAD MORE */}
        {lastDoc && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => fetchHorses(true)}
              className="px-6 py-3 rounded-lg border text-white hover:bg-white/10 transition"
              style={{ borderColor: gold }}
            >
              {lang === "ar" ? "تحميل المزيد" : "Load More"}
            </button>
          </div>
        )}

      </div>

      {/* LOGIN/REGISTER POPUP */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] p-6 rounded-xl w-full max-w-sm text-center relative"
              style={{ border: `1px solid ${gold}`, boxShadow: "0 0 30px #bc9b6a66" }}
            >
              
              {/* Login Form */}
              {authMode === "login" && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    {lang === "ar" ? "تسجيل الدخول" : "Login"}
                  </h2>

                  <input
                    placeholder="Email"
                    className="w-full p-3 mb-3 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-6 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  />

                  <button
                    onClick={handleAuth}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)" }}
                  >
                    {lang === "ar" ? "دخول" : "Login"}
                  </button>

                  <p className="text-sm mt-5 text-gray-400">
                    {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                    <span onClick={() => setAuthMode("register")} className="cursor-pointer hover:underline" style={{ color: gold }}>
                      {lang === "ar" ? "سجل الآن" : "Register now"}
                    </span>
                  </p>
                </>
              )}

              {/* Register Form */}
              {authMode === "register" && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    {lang === "ar" ? "إنشاء حساب" : "Register"}
                  </h2>

                  <input
                    placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                    className="w-full p-3 mb-3 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  />

                  <input
                    placeholder={lang === "ar" ? "رقم الواتساب" : "WhatsApp Number"}
                    type="tel"
                    dir="ltr"
                    className="w-full p-3 mb-3 bg-[#222] border-none rounded text-left outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                  />

                  <input
                    placeholder="Email"
                    className="w-full p-3 mb-3 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-6 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  />

                  <button
                    onClick={handleRegister}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)" }}
                  >
                    {lang === "ar" ? "إنشاء حساب" : "Register"}
                  </button>

                  <p className="text-sm mt-5 text-gray-400">
                    {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                    <span onClick={() => setAuthMode("login")} className="cursor-pointer hover:underline" style={{ color: gold }}>
                      {lang === "ar" ? "تسجيل الدخول" : "Login here"}
                    </span>
                  </p>
                </>
              )}

              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-white text-xl"
              >
                ✕
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL HORSE PREVIEW */}
      <AnimatePresence>
        {selectedHorse && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedHorse(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] p-5 sm:p-6 rounded-xl max-w-2xl w-full relative"
              style={{ border: `1px solid ${gold}`, boxShadow: "0 0 30px #bc9b6a66" }}
            >
              {/* صور المصغرات - بدون كواليتي */}
              <div className="flex gap-2 overflow-x-auto mb-4 pb-2 custom-scrollbar">
                {selectedHorse.images?.map((img: string, i: number) => (
                  <div key={i} className="relative h-32 sm:h-40 w-32 sm:w-40 shrink-0 bg-[#222] rounded cursor-pointer overflow-hidden transition hover:opacity-80">
                    <Image
                      src={img}
                      alt="horse thumbnail"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      onClick={() => setActiveImage(img)}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedHorse.name}</h2>
              <p className="text-gray-300 text-sm mb-2"><span style={{ color: gold }}>{lang === "ar" ? "العمر:" : "Age:"}</span> {selectedHorse.age}</p>
              <p className="text-gray-300 text-sm"><span style={{ color: gold }}>{lang === "ar" ? "الأب:" : "Father:"}</span> {selectedHorse.father}</p>
              <p className="text-gray-300 text-sm"><span style={{ color: gold }}>{lang === "ar" ? "الأم:" : "Mother:"}</span> {selectedHorse.mother}</p>
              <p className="text-gray-400 mt-3 text-sm">{selectedHorse.description}</p>

              <a
                href={`https://wa.me/${selectedHorse.phone}`}
                target="_blank"
                className="block mt-5 text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #25D366, #1ebe5d)" }}
              >
                {lang === "ar" ? "تواصل واتساب" : "Contact WhatsApp"}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX (الصورة العالية الدقة الخام) */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          >
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
              <Image
                src={activeImage}
                alt="horse zoom"
                fill
                unoptimized={true} 
                className="object-contain rounded-lg shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(188,155,106,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}