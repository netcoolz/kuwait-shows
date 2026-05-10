// merge.js
const fs = require('fs');

console.log("⏳ جاري دمج بيانات كتاب The Pyramid Society مع قاعدة البيانات الرئيسية...");

try {
  // قراءة الملفين
  const baseHorses = JSON.parse(fs.readFileSync('horses.json', 'utf-8'));
  const pyramidHorses = JSON.parse(fs.readFileSync('pyramid_horses.json', 'utf-8'));

  let addedCount = 0;

  // جلب الأسماء الموجودة مسبقاً في قاعدة الـ 40 ألف لتجنب التكرار
  const existingNames = new Set();
  for (const id in baseHorses) {
    existingNames.add(baseHorses[id].n.toUpperCase());
  }

  // إضافة الخيول الجديدة من كتاب الهرم
  for (const key in pyramidHorses) {
    const horse = pyramidHorses[key];
    const upperName = horse.n.toUpperCase();

    // إذا لم يكن الحصان موجوداً في الـ 40 ألف، أضفه بختم الهرم!
    if (!existingNames.has(upperName)) {
      // إنشاء ID خاص لخيول الهرم
      const newId = "PYR-" + upperName.replace(/[^A-Z0-9]/g, '');
      baseHorses[newId] = horse;
      addedCount++;
    }
  }

  // حفظ قاعدة البيانات العملاقة النهائية
  fs.writeFileSync('horses.json', JSON.stringify(baseHorses));
  console.log(`✅ تمت المصادقة! تم إضافة ${addedCount} حصان مصري موثق من الكتاب إلى قاعدة بياناتك.`);

} catch (error) {
  console.error("❌ حدث خطأ، تأكد من وجود ملفي horses.json و pyramid_horses.json:", error.message);
}