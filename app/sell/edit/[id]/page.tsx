"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { db, storage, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const gold = "#bc9b6a";

export default function EditHorsePage() {
  const { id } = useParams();
  const router = useRouter();

  const [lang, setLang] = useState("en");

  const [form, setForm] = useState<any>({
    name: "",
    father: "",
    mother: "",
    age: "",
    phone: "",
    description: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // 🌍 لغة
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  // 🔥 جلب البيانات
  useEffect(() => {
    const fetchHorse = async () => {
      const refDoc = doc(db, "horses", id as string);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data();

        // 🔐 حماية
        if (auth.currentUser?.uid !== data.userId) {
          alert("Not allowed");
          router.push("/sell");
          return;
        }

        setForm(data);
        setImages(data.images || []);
      }
    };

    fetchHorse();
  }, [id]);

  // ✏️ تعديل الحقول
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼️ إضافة صور جديدة
  const handleImages = async (e: any) => {
    const files = Array.from(e.target.files);

    const compressed = await Promise.all(
      files.map(async (file: any) => {
        try {
          return await imageCompression(file, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 600,
          });
        } catch {
          return file;
        }
      })
    );

    setNewImages((prev) => [...prev, ...(compressed as File[])]);

    const urls = compressed.map((f: any) =>
      URL.createObjectURL(f)
    );

    setPreview((prev) => [...prev, ...urls]);
  };

  // ❌ حذف صورة قديمة
  const removeOldImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ❌ حذف صورة جديدة
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // 💾 حفظ
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const uploaded: string[] = [];

      for (let file of newImages) {
        const storageRef = ref(storage, `horses/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploaded.push(url);
      }

      const finalImages = [...images, ...uploaded];

      await updateDoc(doc(db, "horses", id as string), {
        ...form,
        images: finalImages,
      });

      alert(lang === "ar" ? "تم التعديل" : "Updated");

      router.push("/sell/my-horses");
    } catch (err) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen text-white px-4 py-10"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-xl mx-auto">

        <h1 className="text-center text-2xl mb-6" style={{ color: gold }}>
          {lang === "ar" ? "تعديل الإعلان" : "Edit Ad"}
        </h1>

        <div className="bg-black/70 p-6 rounded-xl space-y-4 border"
          style={{ borderColor: gold }}>

          {/* inputs */}
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="father" value={form.father} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="mother" value={form.mother} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="age" value={form.age} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 bg-black border rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-3 bg-black border rounded" />

          {/* الصور القديمة */}
          <div>
            <p className="text-sm mb-2">
              {lang === "ar" ? "الصور الحالية" : "Current Images"}
            </p>

            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-20 h-20 object-cover rounded" />
                  <button
                    onClick={() => removeOldImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-xs w-5 h-5 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* إضافة صور */}
          <input type="file" multiple onChange={handleImages} />

          <div className="flex gap-2 flex-wrap">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-20 h-20 rounded" />
                <button
                  onClick={() => removeNewImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-xs w-5 h-5 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* زر */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full py-3 rounded font-bold"
            style={{ background: gold }}
          >
            {loading
              ? lang === "ar"
                ? "جاري الحفظ..."
                : "Saving..."
              : lang === "ar"
              ? "حفظ التعديلات"
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}