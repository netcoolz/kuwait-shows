"use client";

import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";
import { auth } from "@/lib/firebase"; // ✅ إضافة
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";


import { getRedirectResult } from "firebase/auth";



const gold = "#bc9b6a";

export default function SellHorsePage() {
  const [lang, setLang] = useState("en");
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false); // ✅ إضافة
const [authMode, setAuthMode] = useState("choose");
const [authData, setAuthData] = useState({
  email: "",
  password: "",
});

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

    await signInWithEmailAndPassword(
      auth,
      authData.email,
      authData.password
    );

    setShowLogin(false);
  } catch (err) {
    alert("Login error");
  }
};

const handleGoogleLogin = async () => {
  try {
    const { GoogleAuthProvider, signInWithRedirect } = await import("firebase/auth");

    const provider = new GoogleAuthProvider();

    await signInWithRedirect(auth, provider);

  } catch (err) {
    alert("Google login error");
  }
};

const handleAppleLogin = async () => {
  try {
    const { OAuthProvider, signInWithPopup } = await import("firebase/auth");

    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(auth, provider);

    setShowLogin(false);
  } catch (err) {
    alert("Apple login error");
  }
};

const handleRegister = async () => {
  try {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");

    await createUserWithEmailAndPassword(
      auth,
      authData.email,
      authData.password
    );

    setShowLogin(false);
  } catch (err) {
    alert("Register error");
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

      if (loadMore && lastDoc) {
        q = query(collection(db, "horses"), startAfter(lastDoc), limit(6));
      } else {
        q = query(collection(db, "horses"), limit(6));
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

  // ✅ My Horses logic
  const handleMyHorses = () => {
    const user = auth.currentUser;

    if (!user) {
      setShowLogin(true);
      return;
    }

    window.location.href = "/sell/my-horses/";
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white px-4 sm:px-6 py-12 sm:py-16"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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

        {/* CTA */}
        <div className="flex justify-center gap-4 mb-10">

          {/* Add */}
          <button
            onClick={() => router.replace("/sell/add")}
            className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 hover:bg-[#bc9b6a]/10"
            style={{
              borderColor: gold,
              color: gold,
              boxShadow: "0 0 20px #bc9b6a55",
            }}
          >
            <FaPlusCircle />
            {lang === "ar" ? "اعرض خيلك هنا" : "List Your Horse"}
          </button>

          {/* ✅ My Horses */}
          <button
            onClick={handleMyHorses}
            className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 hover:bg-[#bc9b6a]/10"
            style={{
              borderColor: gold,
              color: gold,
              boxShadow: "0 0 20px #bc9b6a55",
            }}
          >
            🐎 {lang === "ar" ? "الخيل التي اضفتها" : "My Horses"}
          </button>

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {horses.map((horse) => (
            <div
              key={horse.id}
              onClick={() => setSelectedHorse(horse)}
              className="group bg-[#111] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                border: "1px solid rgba(188,155,106,0.2)",
              }}
            >
              <div className="aspect-square overflow-hidden relative">
                <Image
                  src={horse.images?.[0] || "/placeholder.png"}
                  alt={horse.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  {horse.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400">
                  {horse.father} × {horse.mother}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        {lastDoc && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchHorses(true)}
              className="px-6 py-3 rounded-lg border text-white hover:bg-white/10"
              style={{ borderColor: gold }}
            >
              {lang === "ar" ? "تحميل المزيد" : "Load More"}
            </button>
          </div>
        )}

      </div>

      {/* ❗ هنا فقط hook للبوب (تربطه مع popup حقك الحالي) */}
    {/* LOGIN POPUP */}
{showLogin && (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
    <div
      className="bg-[#111] p-6 rounded-xl w-full max-w-sm text-center"
      style={{
        border: `1px solid ${gold}`,
        boxShadow: "0 0 30px #bc9b6a66",
      }}
    >

      {authMode === "choose" && (
        <>
          <h2 className="text-xl mb-4">
            {lang === "ar" ? "اختر" : "Choose"}
          </h2>

          <button
            onClick={() => setAuthMode("login")}
            className="w-full py-3 rounded-lg mb-3 font-semibold"
            style={{
              background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)",
            }}
          >
            {lang === "ar" ? "تسجيل دخول" : "Login"}
          </button>

          <button
            onClick={() => setAuthMode("register")}
            className="w-full py-3 rounded-lg font-semibold border"
            style={{ borderColor: gold }}
          >
            {lang === "ar" ? "إنشاء حساب" : "Register"}
          </button>
        </>
      )}

      {authMode === "login" && (
        <>
          <h2 className="text-xl mb-4">
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </h2>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg mb-3 flex items-center justify-center gap-2 font-semibold"
            style={{ background: "#fff", color: "#000" }}
          >
            <FcGoogle size={20} />
            Google
          </button>

          <button
            onClick={handleAppleLogin}
            className="w-full py-3 rounded-lg mb-4 flex items-center justify-center gap-2 font-semibold"
            style={{ background: "#000", color: "#fff" }}
          >
            <FaApple size={18} />
            Apple
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <input
            placeholder="Email"
            className="w-full p-3 mb-2 bg-black border rounded"
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 bg-black border rounded"
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
          />

          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-lg font-semibold"
            style={{
              background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)",
            }}
          >
            {lang === "ar" ? "دخول" : "Login"}
          </button>
        </>
      )}

      {authMode === "register" && (
        <>
          <h2 className="text-xl mb-4">
            {lang === "ar" ? "إنشاء حساب" : "Register"}
          </h2>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg mb-3 flex items-center justify-center gap-2 font-semibold"
            style={{ background: "#fff", color: "#000" }}
          >
            <FcGoogle size={20} />
            Google
          </button>

          <button
            onClick={handleAppleLogin}
            className="w-full py-3 rounded-lg mb-4 flex items-center justify-center gap-2 font-semibold"
            style={{ background: "#000", color: "#fff" }}
          >
            <FaApple size={18} />
            Apple
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <input
            placeholder="Email"
            className="w-full p-3 mb-2 bg-black border rounded"
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 bg-black border rounded"
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
          />

          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-lg font-semibold"
            style={{
              background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)",
            }}
          >
            {lang === "ar" ? "إنشاء الحساب" : "Register"}
          </button>
        </>
      )}

      <button
        onClick={() => setShowLogin(false)}
        className="w-full py-2 text-gray-400 mt-3"
      >
        {lang === "ar" ? "إلغاء" : "Cancel"}
      </button>

    </div>
  </div>
)}

      {/* MODAL */}
      {selectedHorse && (
        <div
          onClick={() => setSelectedHorse(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] p-5 sm:p-6 rounded-xl max-w-2xl w-full relative"
            style={{
              border: `1px solid ${gold}`,
              boxShadow: "0 0 30px #bc9b6a66",
            }}
          >

            <div className="flex gap-2 overflow-x-auto mb-4">
              {selectedHorse.images?.map((img: string, i: number) => (
                <Image
                  key={i}
                  src={img}
                  alt="horse"
                  width={200}
                  height={200}
                  onClick={() => setActiveImage(img)}
                  className="h-32 sm:h-40 w-auto rounded cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {selectedHorse.name}
            </h2>

            <p className="text-gray-300 text-sm mb-2">
              <span style={{ color: gold }}>
                {lang === "ar" ? "العمر:" : "Age:"}
              </span>{" "}
              {selectedHorse.age}
            </p>

            <p className="text-gray-300 text-sm">
              <span style={{ color: gold }}>
                {lang === "ar" ? "الأب:" : "Father:"}
              </span>{" "}
              {selectedHorse.father}
            </p>

            <p className="text-gray-300 text-sm">
              <span style={{ color: gold }}>
                {lang === "ar" ? "الأم:" : "Mother:"}
              </span>{" "}
              {selectedHorse.mother}
            </p>

            <p className="text-gray-400 mt-3 text-sm">
              {selectedHorse.description}
            </p>

            <a
              href={`https://wa.me/${selectedHorse.phone}`}
              target="_blank"
              className="block mt-5 text-center py-3 rounded-lg font-semibold transition"
              style={{
                background: "linear-gradient(90deg, #25D366, #1ebe5d)",
              }}
            >
              {lang === "ar" ? "تواصل واتساب" : "Contact WhatsApp"}
            </a>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
        >
          <Image
            src={activeImage}
            alt="horse"
            width={800}
            height={800}
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}