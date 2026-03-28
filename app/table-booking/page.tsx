"use client";

import { useEffect, useState } from "react";

export default function TableBooking() {

  // 🌍 اللغة من localStorage (مربوطة بالسايدبار)
  const [lang, setLang] = useState("en");

 useEffect(() => {
  const updateLang = () => {
    const newLang = localStorage.getItem("lang") || "en";
    setLang(newLang);
  };

  updateLang(); // أول تحميل

  window.addEventListener("langChange", updateLang);

  return () => window.removeEventListener("langChange", updateLang);
}, []);

  // 🏆 البطولات
  const championships = [
    {
      id: 1,
      name: { ar: "كأس المربين", en: "Breeders Cup" },
      prices: {
        Diamond: 1000,
        Platinum: 800,
        Gold: 600,
        Silver: 400,
        Bronze: 250,
        Prestige: 1500,
      },
    },
    {
      id: 2,
      name: { ar: "البطولة الدولية", en: "International Championship" },
      prices: {
        Diamond: 1200,
        Platinum: 900,
        Gold: 700,
        Silver: 500,
        Bronze: 300,
        Prestige: 1700,
      },
    },
    {
      id: 3,
      name: { ar: "بطولة الكوت", en: "Alkout Arabian Show" },
      prices: {
        Diamond: 900,
        Platinum: 700,
        Gold: 500,
        Silver: 350,
        Bronze: 200,
        Prestige: 1400,
      },
    },
  ];

  // 🪑 الفئات حسب الطاولات
  const tableCategories: any = {
    1: "Diamond", 2: "Diamond", 3: "Diamond",
    4: "Prestige", 5: "Prestige",
    6: "Diamond", 7: "Diamond", 8: "Diamond",
    9: "Gold", 10: "Gold", 11: "Gold",
    12: "Platinum", 13: "Platinum",
    14: "Platinum", 15: "Platinum",
    16: "Gold", 17: "Gold", 18: "Gold",
    19: "Silver", 20: "Silver",
    21: "Gold", 22: "Gold", 23: "Platinum",
    24: "Platinum", 25: "Gold",
    26: "Gold", 27: "Silver",
    28: "Silver", 29: "Bronze",
    30: "Bronze", 31: "Bronze",
    32: "Bronze", 33: "Bronze",
    34: "Bronze", 35: "Bronze",
    36: "Bronze",
  };

  // ⭐ ميزات الفئات
  const features: any = {
    Prestige: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
    Diamond: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
    Platinum: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
    Gold: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
    Silver: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
    Bronze: {
      ar: ["ديوانية خاصة","مواقف سيارات بالمنصة","فيديو 30 ثانية","صفحة بالكتيب","إعلان سوشيال"],
      en: ["Private Majlis","VIP Parking","30s Screen Video","Catalog Page","Social Media Ad"],
    },
  };

  const [champ, setChamp] = useState<any>(null);
  const [table, setTable] = useState<number | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  const category = table ? tableCategories[table] : null;
  const price = champ && category ? champ.prices[category] : null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex justify-center">

      <div className="w-full max-w-6xl px-6 py-12 md:mr-[190px]">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl md:text-5xl text-center mb-10 font-bold bg-gradient-to-r from-[#bc9b6a] via-[#f5e6c8] to-[#bc9b6a] bg-clip-text text-transparent">
          {lang === "ar" ? "احجز طاولتك VIP الآن" : "Book Your VIP Table Now"}
        </h1>

        {/* 🗺️ MAP */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-[#bc9b6a]/20">
          <img src="/map.jpg" className="w-full" />
        </div>

        <div className="bg-[#1a1a1a] border border-[#bc9b6a]/20 rounded-2xl p-6 space-y-6">

          {/* 🏆 البطولة */}
          <select
            onChange={(e) =>
              setChamp(championships.find(c => c.id === Number(e.target.value)))
            }
            className="w-full p-3 rounded-xl bg-[#1f1f1f]"
          >
            <option>{lang === "ar" ? "اختر البطولة" : "Select Championship"}</option>
            {championships.map(c => (
              <option key={c.id} value={c.id}>
                {lang === "ar" ? c.name.ar : c.name.en}
              </option>
            ))}
          </select>

          {/* 🪑 الطاولة */}
          <select
            onChange={(e) => setTable(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-[#1f1f1f]"
          >
            <option>{lang === "ar" ? "اختر الطاولة" : "Select Table"}</option>
            {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {lang === "ar" ? `طاولة ${num}` : `Table ${num}`}
              </option>
            ))}
          </select>

          {/* 💰 */}
          {table && (
            <div className="bg-[#141414] p-5 rounded-xl text-center">
              <p>{lang === "ar" ? "الفئة:" : "Category:"} {category}</p>
              <p>{lang === "ar" ? "السعر:" : "Price:"} {price} KWD</p>

              <button onClick={() => setShowFeatures(true)} className="text-[#bc9b6a] underline mt-2">
                {lang === "ar" ? "عرض الميزات" : "View Features"}
              </button>
            </div>
          )}

          <input placeholder={lang === "ar" ? "الاسم" : "Name"} className="w-full p-3 rounded-xl bg-[#1f1f1f]" />
          <input placeholder={lang === "ar" ? "رقم الهاتف" : "Phone"} className="w-full p-3 rounded-xl bg-[#1f1f1f]" />
          <input placeholder={lang === "ar" ? "اسم المربط" : "Stable Name"} className="w-full p-3 rounded-xl bg-[#1f1f1f]" />

          <button className="w-full bg-gradient-to-r from-[#bc9b6a] to-[#e6c88f] text-black font-bold py-3 rounded-xl">
            {lang === "ar" ? "تأكيد الحجز والدفع" : "Confirm & Pay"}
          </button>

        </div>
      </div>

      {/* Popup */}
      {showFeatures && category && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-6 rounded-xl text-center">
            <h2 className="text-[#bc9b6a] mb-4">{category}</h2>
            {features[category][lang].map((f: string, i: number) => (
              <p key={i}>• {f}</p>
            ))}
            <button onClick={() => setShowFeatures(false)} className="mt-4 bg-[#bc9b6a] px-4 py-2 rounded text-black">
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}