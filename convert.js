// convert.js
const fs = require('fs');

console.log("⏳ جاري قراءة ملف new.csv وتحليل البيانات بذكاء...");

try {
  const csvData = fs.readFileSync('new.csv', 'utf-8');
  
  // معالجة جميع أنواع نهايات الأسطر (ويندوز، ماك، لينكس)
  const lines = csvData.split(/\r\n|\n|\r/);
  const horses = {};
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // تقسيم احترافي جداً (يفصل بالفاصلة لكنه يتجاهل الفواصل الموجودة داخل الأسماء)
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    // التأكد أن السطر يحتوي على أعمدة كافية
    if (row.length >= 8) {
      
      // دالة لتنظيف الكلمات من أي علامات تنصيص أو مسافات زائدة
      const clean = (str) => str ? str.replace(/^"|"$/g, '').trim() : "";

      const id = clean(row[0]);
      const name = clean(row[2]);
      const dam = clean(row[6]); // عمود الأم
      const sire = clean(row[7]); // عمود الأب

      // إذا كان هناك ID واسم، قم بإضافته لقاعدة البيانات
      if (id && name) {
        horses[id] = { n: name, s: sire, d: dam };
        count++;
      }
    }
  }

  // حفظ الملف النهائي
  fs.writeFileSync('horses.json', JSON.stringify(horses));
  console.log(`✅ ضربة معلم! تم استخراج ودمج ${count} حصان في ملف horses.json بنجاح.`);

} catch (error) {
  console.error("❌ حدث خطأ، تأكد من وجود ملف new.csv في المجلد:", error.message);
}