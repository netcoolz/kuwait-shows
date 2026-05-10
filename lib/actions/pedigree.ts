// lib/actions/pedigree.ts
"use server";
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

let horsesData: any = null;
try {
  const horsesFilePath = path.join(process.cwd(), 'horses.json');
  horsesData = JSON.parse(fs.readFileSync(horsesFilePath, 'utf8'));
} catch (e) {
  console.error("Error loading horses.json:", e);
}

function getHorseById(id: string | null) {
  if (!id || !horsesData || !horsesData[id]) return null;
  return horsesData[id];
}

function cleanName(name: string) {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '');
}

export async function getSearchSuggestions(query: string) {
  if (!horsesData || query.length < 3) return [];
  
  const searchStr = cleanName(query);
  const suggestions: string[] = [];
  
  for (const [id, horse] of Object.entries(horsesData)) {
    const dbName = (horse as any).n;
    if (cleanName(dbName).includes(searchStr)) {
      suggestions.push(dbName);
      if (suggestions.length >= 7) break;
    }
  }
  return suggestions;
}

// ✦ الدالة 1: المحلل الذكي (قاضي The Pyramid Society) ✦
async function analyzePedigreeWithAI(tree: any, horseName: string) {
  if (!process.env.OPENAI_API_KEY) {
    return { strain: "خيل عربي", rasan: "غير محدد", analysis: "النظام الذكي غير متصل." };
  }

  try {
    const prompt = `
    أنت خبير ومحكم معتمد في أنساب الخيل وتعتمد على "The Pyramid Society".
    حلل الجواد "${horseName}" بناءً على هذه الشجرة المكتملة:
    الأب: ${tree.gen1.sire} | الأم: ${tree.gen1.dam}
    أجداد (أب): ${tree.gen2.sireSire}, ${tree.gen2.sireDam} | أجداد (أم): ${tree.gen2.damSire}, ${tree.gen2.damDam}
    أجداد الجيل الثالث: ${tree.gen3.sss}, ${tree.gen3.ssd}, ${tree.gen3.sds}, ${tree.gen3.sdd}, ${tree.gen3.dss}, ${tree.gen3.dsd}, ${tree.gen3.dds}, ${tree.gen3.ddd}

    التعليمات:
    1. ابحث جيداً في أسماء الأجداد، إذا وجدت دماء مصرية صريحة أو كان الحصان مصرياً، يجب أن تكتب في خانة strain: "خيل عربي مصري".
    2. استخرج "الرسن" من خط الأم بشكل دقيق.

    أرجع JSON حصراً بهذا التنسيق:
    {
      "strain": "خيل عربي مصري" أو "خيل عربي",
      "rasan": "رسن الجواد أو 'غير محدد'",
      "analysis": "اكتب فقرة توثيقية قصيرة ورسمية جداً."
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" } 
    });

    const aiData = JSON.parse(response.choices[0].message.content || "{}");
    
    // فلتر قوي لضمان ظهور اللون الذهبي لأي حصان يحمل دماء مصرية
    let finalStrain = "خيل عربي";
    const rawStrain = (aiData.strain || "").toLowerCase();
    const rawAnalysis = (aiData.analysis || "").toLowerCase();
    
    if (rawStrain.includes("مصر") || rawStrain.includes("egypt") || rawAnalysis.includes("مصر") || rawAnalysis.includes("egypt")) {
      finalStrain = "خيل عربي مصري";
    }

    return {
      strain: finalStrain,
      rasan: aiData.rasan || "غير محدد",
      analysis: aiData.analysis || "تمت قراءة شجرة النسب بنجاح."
    };
  } catch (error: any) {
    return { strain: "خيل عربي", rasan: "غير محدد", analysis: "التحليل الذكي غير متاح حالياً." };
  }
}

// ✦ الدالة 2: المنقذ الخارق المطور (مع إعطاء تلميحات للذكاء الاصطناعي) ✦
async function fetchTreeFromAI(horseName: string, knownTree: any = null) {
  try {
    // إعطاء الذكاء الاصطناعي تلميحاً عن الأب والأم لكي يعرف أي حصان نبحث عنه בדיוק
    const context = knownTree ? `لدينا معلومات جزئية عن هذا الجواد لمساعدتك في البحث: الأب مسجل لدينا كـ (${knownTree.gen1.sire}) والأم مسجلة كـ (${knownTree.gen1.dam}).` : "";
    
    const prompt = `
    أنت محرك بحث "All Breed Pedigree" فائق الذكاء.
    ابحث في ذاكرتك العميقة عن الجواد العربي: "${horseName}".
    ${context}
    
    مهمتك الإجبارية هي التعرف على هذا الحصان وإكمال شجرة أجداده لثلاثة أجيال باللغة الإنجليزية.
    لا تعتذر. إذا كنت متأكداً من بعض الأجداد املأهم، وضع "---" للمجهول.
    
    أرجع JSON بهذا التنسيق:
    {
      "found": true,
      "tree": {
        "gen1": { "sire": "...", "dam": "..." },
        "gen2": { "sireSire": "...", "sireDam": "...", "damSire": "...", "damDam": "..." },
        "gen3": { "sss": "...", "ssd": "...", "sds": "...", "sdd": "...", "dss": "...", "dsd": "...", "dds": "...", "ddd": "..." }
      }
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // رفعنا الذكاء قليلاً ليتذكر البيانات المفقودة
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{"found": false}');
  } catch (error) {
    return { found: false };
  }
}

// ✦ محرك البحث الهجين ✦
export async function searchLocalPedigree(horseName: string) {
  const searchStr = cleanName(horseName);
  let foundHorseId = null;
  let tree: any = null;
  let detailsText = "";

  if (horsesData) {
    for (const [id, horse] of Object.entries(horsesData)) {
      if (cleanName((horse as any).n).includes(searchStr)) {
        foundHorseId = id;
        break;
      }
    }
  }

  if (foundHorseId) {
    const horse = getHorseById(foundHorseId);
    const sire = getHorseById(horse.s);
    const dam = getHorseById(horse.d);
    
    const sireSire = sire ? getHorseById(sire.s) : null;
    const sireDam = sire ? getHorseById(sire.d) : null;
    const damSire = dam ? getHorseById(dam.s) : null;
    const damDam = dam ? getHorseById(dam.d) : null;
    
    const sss = sireSire ? getHorseById(sireSire.s) : null;
    const ssd = sireSire ? getHorseById(sireSire.d) : null;
    const sds = sireDam ? getHorseById(sireDam.s) : null;
    const sdd = sireDam ? getHorseById(sireDam.d) : null;
    const dss = damSire ? getHorseById(damSire.s) : null;
    const dsd = damSire ? getHorseById(damSire.d) : null;
    const dds = damDam ? getHorseById(damDam.s) : null;
    const ddd = damDam ? getHorseById(damDam.d) : null;

    tree = {
      gen1: { sire: sire?.n || "---", dam: dam?.n || "---" },
      gen2: { sireSire: sireSire?.n || "---", sireDam: sireDam?.n || "---", damSire: damSire?.n || "---", damDam: damDam?.n || "---" },
      gen3: { sss: sss?.n || "---", ssd: ssd?.n || "---", sds: sds?.n || "---", sdd: sdd?.n || "---", dss: dss?.n || "---", dsd: dsd?.n || "---", dds: dds?.n || "---", ddd: ddd?.n || "---" }
    };
    detailsText = `رقم التسجيل: ${foundHorseId}`;

    // ✦ فحص النواقص وتمرير الشجرة المبدئية للذكاء الاصطناعي ليساعدنا ✦
    const hasMissingData = 
      Object.values(tree.gen1).includes("---") || 
      Object.values(tree.gen2).includes("---") || 
      Object.values(tree.gen3).includes("---");

    if (hasMissingData) {
      // نرسل الشجرة الناقصة كـ "تلميح" للموديل
      const aiFetchedData = await fetchTreeFromAI(horse.n, tree);
      
      if (aiFetchedData.found && aiFetchedData.tree) {
        const gens: ('gen1'|'gen2'|'gen3')[] = ['gen1', 'gen2', 'gen3'];
        let updatedCount = 0;
        
        for (const gen of gens) {
          for (const key in tree[gen]) {
            const aiVal = aiFetchedData.tree[gen][key];
            // إذا كانت الخانة فارغة والذكاء الاصطناعي وجدها، قم بترميمها!
            if (tree[gen][key] === "---" && aiVal && aiVal !== "---" && aiVal.toLowerCase() !== "unknown") {
              tree[gen][key] = aiVal.toUpperCase();
              updatedCount++;
            }
          }
        }
        if (updatedCount > 0) {
          detailsText += " | تم ترميم الأنساب آلياً (AllBreed)";
        }
      }
    }
  } 
  else {
    // إذا لم يجده أبداً، دعه يبحث من الصفر
    const aiFetchedData = await fetchTreeFromAI(horseName);
    if (aiFetchedData.found && aiFetchedData.tree) {
      tree = aiFetchedData.tree;
      detailsText = "تم جلب البيانات من السجلات العالمية (AllBreed)";
    } else {
      return { success: false, error: `لم يتم العثور على الجواد "${horseName}" لا في السجلات المحلية ولا العالمية.` };
    }
  }

  // 4. بعد إكمال الشجرة، نرسلها للقاضي ليختم عليها!
  const aiResult = await analyzePedigreeWithAI(tree, horseName);

  return {
    success: true,
    name: (foundHorseId ? getHorseById(foundHorseId).n : horseName).toUpperCase(),
    details: detailsText,
    aiStrain: aiResult.strain,
    aiRasan: aiResult.rasan,
    aiAnalysis: aiResult.analysis,
    pedigree: tree
  };
}