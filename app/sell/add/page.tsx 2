"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { FaPlus } from "react-icons/fa";
import { db, storage, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const gold = "#bc9b6a";

export default function AddHorsePage() {
  const [lang, setLang] = useState("en");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    father: "",
    mother: "",
    age: "",
    phone: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [authMode, setAuthMode] = useState<"choose" | "login" | "register">("choose");

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = async (e: any) => {
    const files = Array.from(e.target.files);

    const compressedFiles = await Promise.all(
      files.map(async (file: any) => {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 600,
          useWebWorker: true,
        };

        try {
          return await imageCompression(file, options);
        } catch {
          return file;
        }
      })
    );

    setImages((prev) => [...prev, ...(compressedFiles as File[])]);
    const previewUrls = compressedFiles.map((file: any) =>
      URL.createObjectURL(file)
    );
    setPreview((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ تسجيل دخول
  const handleAuth = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );

      await publishAd(res.user);

      setShowLogin(false);
    } catch (err) {
      alert("Login error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await publishAd(result.user);

      setShowLogin(false);
    } catch (err) {
      alert("Google login error");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider);

      await publishAd(result.user);

      setShowLogin(false);
    } catch (err) {
      alert("Apple login error");
    }
  };

  // ✅ إنشاء حساب
  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );

      await publishAd(res.user);

      setShowLogin(false);
    } catch (err) {
      alert("Register error");
    }
  };

  // ✅ هنا التعديل المهم فقط
  const publishAd = async (user: any) => {
    try {
      if (!user?.uid) {
        alert("User error");
        return;
      }

      setLoading(true);

      const imageUrls: string[] = [];

      for (let file of images) {
        const storageRef = ref(storage, `horses/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, "horses"), {
        ...form,
        images: imageUrls,
        createdAt: new Date(),
        userId: user.uid, // 🔥 هذا المهم
      });

      alert(lang === "ar" ? "تم نشر الإعلان بنجاح" : "Ad published successfully");

      router.push("/sell");
    } catch (err) {
      console.error(err);
      alert("ERROR OCCURRED");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!agree) {
      alert("agree first");
      return;
    }

    if (images.length === 0) {
      alert("no images");
      return;
    }

    if (!user) {
      setShowLogin(true);
      setAuthMode("choose");
      return;
    }

    await publishAd(user);
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white px-4 sm:px-6 py-12"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="md:pr-[300px] max-w-2xl mx-auto">

        <h1
          className="text-3xl font-bold text-center mb-8"
          style={{ color: gold }}
        >
          {lang === "ar" ? "إضافة خيل للبيع" : "Add Horse For Sale"}
        </h1>

        <div
          className="bg-black/70 backdrop-blur-md p-6 rounded-xl border space-y-4"
          style={{
            borderColor: gold,
            boxShadow: "0 0 25px #bc9b6a55",
          }}
        >

          <input name="name" placeholder={lang === "ar" ? "اسم الخيل" : "Horse Name"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="father" placeholder={lang === "ar" ? "اسم الأب" : "Sire Name"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="mother" placeholder={lang === "ar" ? "اسم الأم" : "Dam Name"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="age" placeholder={lang === "ar" ? "العمر" : "Age"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="phone" placeholder={lang === "ar" ? "رقم الموبايل" : "Mobile Number"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <textarea name="description" placeholder={lang === "ar" ? "تفاصيل إضافية (اختياري)" : "Additional Details"} onChange={handleChange} className="w-full p-3 bg-black border rounded" />

          <div>
            <p className="mb-3 text-sm text-gray-400">
              {lang === "ar" ? "أضف صور الخيل" : "Add Horse Images"}
            </p>

            <label className="flex items-center justify-center w-full h-32 rounded-xl cursor-pointer border-2 border-dashed"
              style={{ borderColor: gold, color: gold }}>
              <FaPlus size={20} />
              <input type="file" multiple onChange={handleImages} className="hidden" />
            </label>

            {preview.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="w-20 h-20 object-cover rounded-lg border" style={{ borderColor: gold }} />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span className="text-sm">
              {lang === "ar"
                ? "أوافق على شروط وأحكام موقع كويت شوز"
                : "I agree to Kuwait Shows terms & conditions"}
            </span>
          </div>

          <div className="flex gap-3 mt-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 rounded-lg border text-gray-300 hover:bg-white/10 transition relative z-10"
              style={{ borderColor: "#444" }}
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold relative z-10"
              style={{
                background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)",
                opacity: loading ? 0.6 : 1,
              }}
            >
             {loading ? (
  <div className="flex items-center justify-center gap-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span>{lang === "ar" ? "جاري النشر..." : "Publishing..."}</span>
  </div>
) : (
  lang === "ar" ? "نشر الإعلان" : "Publish Ad"
)}
            </button>

          </div>

        </div>
      </div>

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

      {/* CHOOSE */}
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

      {/* LOGIN */}
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

      {/* REGISTER */}
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

      {/* CANCEL */}
      <button
        onClick={() => setShowLogin(false)}
        className="w-full py-2 text-gray-400 mt-3"
      >
        {lang === "ar" ? "إلغاء" : "Cancel"}
      </button>

    </div>
  </div>
)}   </div>
  );
}