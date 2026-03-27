"use client";

import { useState, useEffect } from "react";

export default function RegisterPage() {

  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState("single");

  const [horses, setHorses] = useState([
    {
      regNumber: "",
      horseName: "",
      ownerName: "",
      conflict: "no",
      conflictName: "",
      outside: false,
      file: null,
    },
  ]);

  const [agree, setAgree] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);

    const updateLang = () => {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
    };

    window.addEventListener("languageChange", updateLang);

    return () => {
      window.removeEventListener("languageChange", updateLang);
    };
  }, []);

  const t = {
    en: {
      title: "Breeder Cup Registration",
      addHorse: "Add Horse",
      delete: "Delete",
      regNumber: "Horse Registration Number",
      horseName: "Horse Name",
      ownerName: "Owner Name",
      agree: "I agree to Terms & Conditions",
      conflict: "Conflict of Interest",
      judge: "Judge Name",
      outside: "Horse is not registered in Kuwait",
      total: "Total Price",
      btn: "Continue to Payment",
    },
    ar: {
      title: "تسجيل لبطولة كأس المربين",
      addHorse: "إضافة خيل",
      delete: "حذف",
      regNumber: "رقم تسجيل الخيل",
      horseName: "اسم الخيل",
      ownerName: "اسم المالك",
      agree: "أوافق على الشروط",
      conflict: "تعارض المصالح",
      judge: "اسم الحكم",
      outside: "الخيل غير مسجل في الكويت",
      total: "السعر الإجمالي",
      btn: "الدفع",
    },
  };

  const handleHorseChange = (index, e) => {
    const { name, value, type, checked, files } = e.target;
    const updated = [...horses];

    if (type === "checkbox") {
      updated[index][name] = checked;
    } else if (type === "file") {
      updated[index].file = files[0];
    } else {
      updated[index][name] = value;
    }

    setHorses(updated);
  };

  const addHorse = () => {
    setHorses([
      ...horses,
      {
        regNumber: "",
        horseName: "",
        ownerName: "",
        conflict: "no",
        conflictName: "",
        outside: false,
        file: null,
      },
    ]);
  };

  const removeHorse = (index) => {
    setHorses(horses.filter((_, i) => i !== index));
  };

  const price = 500;
  const total = horses.length * price;

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl mb-6 text-yellow-500">
        {mounted ? t[lang].title : ""}
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        <div>
          <img src="/horse3.jpg" className="rounded-xl w-full object-cover" />
        </div>

        <div className="space-y-6">

          {horses.map((horse, index) => (
            <div key={index} className="border border-[#bc9b6a] p-4 rounded space-y-3">

              {horses.length > 1 && (
                <button
                  onClick={() => removeHorse(index)}
                  className="text-red-500 text-sm"
                >
                  {t[lang].delete}
                </button>
              )}

              <input
                type="text"
                placeholder={t[lang].regNumber}
                value={horse.regNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleHorseChange(index, {
                      target: { name: "regNumber", value }
                    });
                  }
                }}
                className="w-full p-3 bg-zinc-900 rounded"
              />

              <input
                type="text"
                name="horseName"
                placeholder={t[lang].horseName}
                value={horse.horseName}
                onChange={(e) => handleHorseChange(index, e)}
                className="w-full p-3 bg-zinc-900 rounded"
              />

              <input
                type="text"
                name="ownerName"
                placeholder={t[lang].ownerName}
                value={horse.ownerName}
                onChange={(e) => handleHorseChange(index, e)}
                className="w-full p-3 bg-zinc-900 rounded"
              />

              <div>
                <p>{t[lang].conflict}</p>

                <label className="mr-4">
                  <input
                    type="radio"
                    checked={horse.conflict === "no"}
                    onChange={() =>
                      handleHorseChange(index, {
                        target: { name: "conflict", value: "no" }
                      })
                    }
                  /> No
                </label>

                <label>
                  <input
                    type="radio"
                    checked={horse.conflict === "yes"}
                    onChange={() =>
                      handleHorseChange(index, {
                        target: { name: "conflict", value: "yes" }
                      })
                    }
                  /> Yes
                </label>

                {horse.conflict === "yes" && (
                  <input
                    type="text"
                    placeholder={t[lang].judge}
                    value={horse.conflictName}
                    onChange={(e) => handleHorseChange(index, e)}
                    name="conflictName"
                    className="w-full mt-2 p-3 bg-zinc-900 rounded"
                  />
                )}
              </div>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={horse.outside}
                  onChange={(e) =>
                    handleHorseChange(index, {
                      target: { name: "outside", type: "checkbox", checked: e.target.checked }
                    })
                  }
                />
                {t[lang].outside}
              </label>

              {horse.outside && (
                <input
                  type="file"
                  onChange={(e) => handleHorseChange(index, e)}
                  className="w-full p-2 bg-zinc-900"
                />
              )}

            </div>
          ))}

          <button
            onClick={addHorse}
            className="bg-[#bd9b6b] text-black px-4 py-2 rounded"
          >
            {t[lang].addHorse}
          </button>

          <label className="flex gap-2">
            <input type="checkbox" onChange={(e) => setAgree(e.target.checked)} />
            {t[lang].agree}
          </label>

          <div>
            {t[lang].total}: {total} KWD
          </div>

          <button className="bg-[#bd9b6b] text-black w-full py-3 rounded">
            {t[lang].btn}
          </button>

        </div>
      </div>
    </div>
  );
}