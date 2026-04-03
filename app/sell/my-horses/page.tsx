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
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth"; // ✅ إضافة
import { useRouter } from "next/navigation";

const gold = "#bc9b6a";

export default function MyHorses() {
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteDoc(doc(db, "horses", deleteId));
    setHorses((prev) => prev.filter((h) => h.id !== deleteId));
    setDeleteId(null);
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sell");
    } catch {
      alert("Error");
    }
  };

  // ✅ Back
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
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3 relative">

          {/* ✅ Back */}
          <button
            onClick={handleBack}
            className="px-3 py-1 rounded border text-gray-300"
          >
            {lang === "ar" ? "رجوع" : "Back"}
          </button>

          <h1
            className="text-2xl sm:text-3xl font-bold text-center w-full md:w-auto"
            style={{ color: gold }}
          >
            {lang === "ar" ? "إعلاناتي" : "My Ads"}
          </h1>

          {/* ✅ Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded border text-red-400"
          >
            {lang === "ar" ? "تسجيل خروج" : "Logout"}
          </button>

          <button
            onClick={() => router.push("/sell/add")}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{
              background: "linear-gradient(90deg, #bc9b6a, #8c6a3f)",
            }}
          >
            {lang === "ar" ? "إضافة إعلان" : "Add Ad"}
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-400">Loading...</p>
        )}

        {!loading && horses.length === 0 && (
          <p className="text-center text-gray-400">
            {lang === "ar" ? "لا يوجد إعلانات" : "No ads yet"}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

          {horses.map((horse) => (
            <div
              key={horse.id}
              className="bg-[#111] rounded-xl overflow-hidden border group cursor-pointer"
              style={{
                borderColor: gold,
                boxShadow: "0 0 20px #bc9b6a33",
              }}
              onClick={() => setSelectedHorse(horse)}
            >

              <div className="aspect-square overflow-hidden">
                <img
                  src={horse.images?.[0]}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-3 text-center">

                <h3 className="font-semibold text-sm mb-1">
                  {horse.name}
                </h3>

                <p className="text-xs text-gray-400 mb-3">
                  {horse.age}
                </p>

                <div className="flex justify-center gap-2">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/sell/edit/${horse.id}`);
                    }}
                    className="px-2 py-1 text-xs rounded border text-yellow-400"
                  >
                    {lang === "ar" ? "تعديل" : "Edit"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(horse.id);
                    }}
                    className="px-2 py-1 text-xs rounded border text-red-400"
                  >
                    {lang === "ar" ? "حذف" : "Delete"}
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>

      {selectedHorse && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedHorse(null)}
        >
          <div
            className="bg-[#111] rounded-xl max-w-md w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={selectedHorse.images?.[0]}
              className="w-full h-60 object-cover rounded mb-4"
            />

            <h2 className="text-lg mb-2">{selectedHorse.name}</h2>

            <p className="text-gray-400 text-sm mb-1">
              {selectedHorse.father} × {selectedHorse.mother}
            </p>

            <p className="text-gray-400 text-sm mb-3">
              {selectedHorse.description}
            </p>

            <button
              onClick={() => setSelectedHorse(null)}
              className="w-full py-2 bg-gray-700 rounded"
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>

          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-center">

            <p className="mb-4">
              {lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded"
              >
                {lang === "ar" ? "حذف" : "Delete"}
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}