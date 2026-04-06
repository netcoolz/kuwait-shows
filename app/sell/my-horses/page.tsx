"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaUserEdit, FaTrashAlt, FaSignOutAlt, FaPlusCircle } from "react-icons/fa"; // إضافة أيقونات للتجميل

const gold = "#bc9b6a";

export default function MyHorses() {
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Profile States
  const [userData, setUserData] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        router.push("/sell"); // إذا لم يكن مسجلاً، أعده لصفحة البيع
        return;
      }

      // 1. جلب إعلانات الخيل الخاصة به
      const q = query(
        collection(db, "horses"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHorses(data);

      // 2. جلب بياناته الشخصية من قاعدة البيانات
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const uData = userDocSnap.data();
        setUserData(uData);
        setEditName(uData.name || "");
        setEditPhone(uData.phone || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "horses", deleteId));
    setHorses((prev) => prev.filter((h) => h.id !== deleteId));
    setDeleteId(null);
  };

  // ✅ تعديل البيانات الشخصية
  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: editName,
        phone: editPhone,
      });
      setUserData({ ...userData, name: editName, phone: editPhone });
      setShowProfile(false);
      alert(lang === "ar" ? "تم تحديث البيانات بنجاح" : "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating profile");
    }
  };

  // ✅ حذف الحساب نهائياً (متطلب آبل)
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1. حذف بياناته من قاعدة البيانات (اختياري ولكنه أفضل للخصوصية)
      await deleteDoc(doc(db, "users", user.uid));
      
      // 2. حذف حساب الدخول نهائياً
      await deleteUser(user);
      
      alert(lang === "ar" ? "تم حذف حسابك بنجاح" : "Account deleted successfully");
      router.push("/sell");
    } catch (error: any) {
      // إذا كان تسجيل دخوله قديماً، سيطلب منه فايربيس الدخول مجدداً للأمان
      if (error.code === "auth/requires-recent-login") {
        alert(
          lang === "ar"
            ? "لأسباب أمنية، يرجى تسجيل الخروج وتسجيل الدخول مجدداً لتتمكن من حذف حسابك."
            : "For security reasons, please log out and log in again to delete your account."
        );
      } else {
        alert("Error deleting account.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sell");
    } catch {
      alert("Error");
    }
  };

  const handleBack = () => {
    router.push("/sell");
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white px-4 sm:px-6 py-10"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="md:pr-[300px] max-w-6xl mx-auto">

        {/* 🔥 Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3 relative border-b border-gray-800 pb-5">
          
          <button onClick={handleBack} className="px-3 py-1.5 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 transition">
            {lang === "ar" ? "رجوع" : "Back"}
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1" style={{ color: gold }}>
            {lang === "ar" ? "إعلاناتي" : "My Ads"}
          </h1>

          <div className="flex gap-2">
            {/* ✅ زر الملف الشخصي */}
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-1.5 rounded border flex items-center gap-2 hover:bg-gray-800 transition"
              style={{ borderColor: gold, color: gold }}
            >
              <FaUserEdit />
              {lang === "ar" ? "حسابي" : "Profile"}
            </button>

            <button
              onClick={() => router.push("/sell/add")}
              className="px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition hover:scale-105"
              style={{ background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)", color: "#fff" }}
            >
              <FaPlusCircle />
              {lang === "ar" ? "إضافة إعلان" : "Add Ad"}
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {!loading && horses.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-lg">
            {lang === "ar" ? "لا يوجد إعلانات لديك حالياً" : "No ads yet"}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {horses.map((horse) => (
            <div
              key={horse.id}
              className="bg-[#111] rounded-xl overflow-hidden border group cursor-pointer hover:scale-105 transition-all"
              style={{ borderColor: "rgba(188,155,106,0.3)" }}
              onClick={() => setSelectedHorse(horse)}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={horse.images?.[0] || "/placeholder.png"}
                  className="w-full h-full object-cover group-hover:opacity-80 transition duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm mb-1">{horse.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{horse.age}</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/sell/edit?id=${horse.id}`);
                    }}
                    className="px-3 py-1 text-xs rounded border border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-white transition"
                  >
                    {lang === "ar" ? "تعديل" : "Edit"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(horse.id);
                    }}
                    className="px-3 py-1 text-xs rounded border border-red-800 text-red-500 hover:bg-red-800 hover:text-white transition"
                  >
                    {lang === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👤 MODAL: Profile & Settings */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-xl max-w-sm w-full p-6 border relative" style={{ borderColor: gold, boxShadow: "0 0 20px #bc9b6a44" }}>
            
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: gold }}>
              {lang === "ar" ? "الملف الشخصي" : "My Profile"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">{lang === "ar" ? "الاسم" : "Name"}</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2.5 bg-[#222] border-none rounded outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">{lang === "ar" ? "رقم الواتساب" : "WhatsApp Number"}</label>
              <input
                value={editPhone}
                dir="ltr"
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-2.5 bg-[#222] border-none rounded text-left outline-none text-white focus:ring-1 focus:ring-[#bc9b6a]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">{lang === "ar" ? "الإيميل (للقراءة فقط)" : "Email (Read Only)"}</label>
              <input
                value={userData?.email || ""}
                disabled
                className="w-full p-2.5 bg-[#1a1a1a] border-none rounded text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              className="w-full py-2.5 rounded-lg font-bold text-white mb-3 hover:opacity-90 transition"
              style={{ background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)" }}
            >
              {lang === "ar" ? "حفظ التعديلات" : "Save Changes"}
            </button>

            <div className="border-t border-gray-800 my-4"></div>

            <button
              onClick={handleLogout}
              className="w-full py-2 mb-2 flex justify-center items-center gap-2 text-gray-300 border border-gray-600 rounded hover:bg-gray-800 transition"
            >
              <FaSignOutAlt /> {lang === "ar" ? "تسجيل خروج" : "Logout"}
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2 flex justify-center items-center gap-2 text-red-500 border border-red-900 rounded hover:bg-red-900/30 transition"
            >
              <FaTrashAlt /> {lang === "ar" ? "حذف الحساب نهائياً" : "Delete Account Permanently"}
            </button>

            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ MODAL: Confirm Delete Account */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#111] p-6 rounded-xl text-center max-w-sm w-full border border-red-800">
            <FaTrashAlt className="text-red-500 text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">{lang === "ar" ? "تحذير نهائي!" : "Final Warning!"}</h3>
            <p className="text-gray-400 mb-6 text-sm">
              {lang === "ar" 
                ? "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء سيؤدي إلى مسح بياناتك ولن تتمكن من استعادتها." 
                : "Are you sure you want to delete your account? This will erase your data and cannot be undone."}
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
              >
                {lang === "ar" ? "نعم، احذف حسابي" : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-700 text-white rounded font-semibold hover:bg-gray-600 transition"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Horse Preview (Your existing modal) */}
      {selectedHorse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedHorse(null)}>
          <div className="bg-[#111] rounded-xl max-w-md w-full p-4 border" style={{ borderColor: gold }} onClick={(e) => e.stopPropagation()}>
            <img src={selectedHorse.images?.[0]} className="w-full h-60 object-cover rounded mb-4" />
            <h2 className="text-lg mb-2">{selectedHorse.name}</h2>
            <p className="text-gray-400 text-sm mb-1">{selectedHorse.father} × {selectedHorse.mother}</p>
            <p className="text-gray-400 text-sm mb-3">{selectedHorse.description}</p>
            <button onClick={() => setSelectedHorse(null)} className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded transition">
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Delete Horse (Your existing modal) */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-center border" style={{ borderColor: gold }}>
            <p className="mb-4">{lang === "ar" ? "هل أنت متأكد من حذف الإعلان؟" : "Delete this ad?"}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
                {lang === "ar" ? "حذف" : "Delete"}
              </button>
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition">
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}