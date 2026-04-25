"use client";

import { useState, useEffect } from "react";

// --- قاموس اللغات المرجعي (المتطابق 100% مع منهج ECAHO) ---
const translations = {
  ar: {
    dir: "rtl",
    hero: {
      badge: "المرجع الرسمي الشامل - ECAHO",
      title: "الدليل الشامل لمعايير<br/>تقييم الخيل العربية",
      subtitle: "دليل أكاديمي مفصل يستند حرفياً إلى مقررات الهيئة الأوروبية لمسابقات الخيل العربية (ECAHO). يغطي التكوين، المشيات، إجراءات الساحة، والعيوب الوراثية.",
      quote: "بدون الهوية (التايب)، تُفقد هوية الخيل العربية، وهي لذلك أهم بدرجة طفيفة من التكوين الهيكلي."
    },
    sections: [
      {
        id: "type",
        icon: "🧬",
        title: "1. جوهر الخيل العربية (Arab Horse Type)",
        desc: "الهوية هي السمة الأكثر تميزاً. الخيل العربية تمتلك هيكلاً عظمياً مختلفاً بـ 17 ضلعاً فقط (بدل 18 أو 19) مما يمنحها ظهراً أقوى ومظهراً متماسكاً.",
        points: [
          { t: "الرأس والفك:", d: "وتدي الشكل من الأمام والجانب، جبهة عريضة، عيون منخفضة وكبيرة غير مغطاة بعظم الحاجب. مساحة الفك السفلية يجب أن تتسع لقبضة اليد." },
          { t: "الرقبة (المذبح):", d: "الزاوية الأقل حدة عند اتصال الفقرات بالجمجمة تسمح بانحناء طبيعي (المذبح). يجب أن تنبثق الرقبة للأعلى من الكتف مع حنجرة دقيقة." },
          { t: "الجلد والعظام:", d: "العظام أكثر نعومة وكثافة، المحيط الضخم للعظام غير مطلوب لأنه يفقد الخيل أناقتها. الجلد رقيق والشعر ناعم جداً." },
          { t: "الذيل:", d: "يجب أن يتبع خط العمود الفقري ولا يبدو كأنه (ملتصق). يُحمل عالياً ومقوساً في الحركة، ويمكن أن ينقلب فوق الأرباع الخلفية عند الإثارة الشديدة." }
        ]
      },
      {
        id: "conformation",
        icon: "📐",
        title: "2. التكوين الهيكلي والنسب (Conformation)",
        desc: "القياسات المتساوية (قاعدة الأثلاث) هي الأساس: المسافة من الكتف للظهر، ومن الظهر للورك، ومن الورك للأرداف يجب أن تكون متساوية.",
        points: [
          { t: "الكتف (Scapula):", d: "لا يتصل لوح الكتف بالعمود الفقري إلا بالعضلات. يُفضل أن يكون طويلاً ومائلاً للخلف. إذا كان الكتف قصيراً ستبدو الرقبة متدلية." },
          { t: "الأرباع الخلفية (Quarters):", d: "الكفل يجب أن يكون مستوياً وطويلاً، وعظم الفخذ مائلاً للأمام ليجلب الرجل الخلفية تحت الحصان بشكل صحيح، والعضلات (Gaskin) ممتلئة وقوية." },
          { t: "الأرجل والمفاصل:", d: "الركب والعراقيب يجب أن تكون كبيرة ومنخفضة. عظام الأوتار مستقيمة ونظيفة ومتوازية. زاوية الرسغ (Pastern) يجب أن تطابق زاوية الحافر." },
          { t: "الحوافر (Hooves):", d: "صلبة، مستديرة في الأمام وبيضاوية في الخلف. الحوافر غير المستديرة في الأمام تنمو بنعال وهمية (False Soles) وقد تصبح كتلية إذا لم تُقلم. وجود حلقات على الحافر (Rings) يدل على الإجهاد، والتموجات قد تدل على مرض مزمن." }
        ]
      },
      {
        id: "movement",
        icon: "🐎",
        title: "3. الحركة والمشيات (Movement & Action)",
        desc: "الخفة والإيقاع المتناغم هما السر. سواء كانت الخطوة عالية من الركبة أو متأرجحة طويلة، الأهم هو التوازن والاندفاع من الكتف والعرقوب.",
        points: [
          { t: "المسار (The Walk):", d: "حركة رباعية الإيقاع. الاندفاع من الخلف. لا توجد (فترة تحليق بالهواء)، ويجب أن تتخطى آثار الأقدام الخلفية آثار الأمامية." },
          { t: "الخبب (The Trot):", d: "حركة ثنائية الإيقاع تتحرك فيها الأقطار بانسجام. الميزة الأساسية هي (فترة التحليق)؛ كلما طالت الفترة زادت روعة واستعراض الخطوة." },
          { t: "العدو (Canter / Gallop):", d: "الكانتر حركة ثلاثية سلسة. الجالوب رباعي الإيقاع يُحمل فيه الرأس عالياً والذيل منتصباً بفخر." },
          { t: "عيوب الحركة:", d: "الالتواء للداخل من الركبة يعني (انحراف للخارج Toe Out). والالتواء للخارج يعني (انحراف للداخل Toe In)، والأول أخطر لاحتمال اصطدام الأرجل." }
        ]
      },
      {
        id: "development",
        icon: "⏳",
        title: "4. مراحل النمو والفروق الشكلية",
        desc: "يراعي الحكام تغيرات العمر والجنس. الطول المتوسط للمهرة 14.3 شبر وللفحل 15 شبر، ولكن الجودة (Quality) تتفوق على الحجم.",
        points: [
          { t: "الأمهار لعمر سنة:", d: "تمتلك أرجلاً طويلة وظهراً قصيراً. في عمر السنة تبلغ قمة الأناقة، لكن قد ينمو الربع الخلفي أسرع من الأمامي مؤقتاً." },
          { t: "عمر 2 إلى 3 سنوات:", d: "تظهر (نتوءات الأسنان) تحت الفك، وتفتقر للتناسق، وتحتاج الخيل لوقت حتى (تجف - Dry out) لتبرز ملامحها النهائية." },
          { t: "الفحول (Stallions):", d: "أطول، عضلية أكثر، والعظام أسمك. الرقبة تكون مقوسة بشدة (Crested) مع حضور ويقظة استثنائية." },
          { t: "الأفراس (Mares):", d: "يُسمح لها بآذان أطول. أجسامها أعمق وأطول، مع رؤوس أكثر نعومة وعيون تعكس اللطف والأمومة." }
        ]
      },
      {
        id: "procedure",
        icon: "🏆",
        title: "5. إجراءات الساحة والبطولات (Ring Procedure)",
        desc: "تتبع بطولات ECAHO نظاماً صارماً داخل حلبة العرض لضمان العدالة.",
        points: [
          { t: "دخول الساحة:", d: "تدخل الخيل وتمشي 3 دورات كاملة حول الساحة ليعطي الحكم تقييماً أولياً، ثم تنسحب للخارج استعداداً للتقييم الفردي." },
          { t: "العرض الفردي:", d: "يُقيّم كل جواد بشكل فردي: يقف أمام الحكام، يمشي بعيداً ثم يعود، ثم يركض بالخبب (Trot) في مسار (مثلث) لليمين ثم يعود ليقف مجدداً للتقييم النهائي." },
          { t: "البطولات (Championships):", d: "يُقسم الخيل لفئات عمرية: صغار (أمهار، سنة، سنتين، ثلاث) وكبار (4-6، 7-10، 11+). يتأهل الفائزون الأوائل لكل فئة للمنافسة على لقب البطل." },
          { t: "المركز الثاني:", d: "يجب استدعاء الخيل الحائزة على المركز الثاني (Reserve) في التصفيات، لتقييمها ضد الأبطال، تحسباً لأن تكون فئة معينة أقوى من باقي الفئات." }
        ]
      },
      {
        id: "ethics",
        icon: "📜",
        title: "6. الأخلاقيات وأنظمة التحكيم (Ethics)",
        desc: "يُمنع الحكام من الاطلاع على كتالوج الخيل، ويُمنعون من قبول الضيافة الفردية.",
        points: [
          { t: "لجنة الانضباط (DC):", d: "لجنة الـ DC تفحص الخيل قبل الدخول لأي شبهة تخدير، ضرب، أو إخفاء عيوب. ويحق للحكم التوقف واستدعاء اللجنة إن شك في جواد." },
          { t: "التحكيم غير المقارن:", d: "النظام المعتمد هو إعطاء نقاط (من 100) مقسمة على 5 معايير (النوع، الرأس والرقبة، الجسم، الأرجل، الحركة) بـ 20 نقطة لكل معيار. يُمنع مقارنة الخيل ببعضها ثم وضع النقاط." }
        ]
      }
    ],
    faults: {
      title: "⚠️ الأخطاء الهيكلية والأمراض المؤدية للخصم",
      desc: "هذه العيوب تُنقص التقييم بشدة، ويجب فحصها بدقة بناءً على منهج ECAHO:",
      items: [
        { t: "انحراف الأرجل (Toe Out / Toe In):", d: "الانحراف للخارج يسبب التفافاً يؤدي لاصطدام الأرجل ببعضها، وهو عيب خطير. الانحراف للداخل يضعف الأربطة." },
        { t: "عيوب الركبة (Bow Legs / Knock Knees / Offset):", d: "تقوس الركب للخارج (Bow)، التقاء الركب للداخل (Knock)، أو الركب غير المحاذية للأسفل (Offset Knees) تسبب ضغطاً على الأربطة وعظام الشظية (Splints)." },
        { t: "عيوب الركبة الأمامية (Back / Over at knee):", d: "تراجع الركبة للخلف يضع ضغطاً هائلاً على الأوتار ويسبب شروخاً عظمية. الميل للأمام عيب أقل خطورة." },
        { t: "استقامة العراقيب وتورماتها (Straight Hocks & Spavins):", d: "استقامة المفصل الخلفي تضع ضغطاً يسبب تورمات (Bog Spavins). وهناك (Bone Spavin) وهو التهاب مفصلي يصيب العراقيب الضيقة." },
        { t: "العقد الكاذبة والحقيقية (False / True Curbs):", d: "العقدة الحقيقية تضخم أسفل العرقوب يضغط على الوتر وهو خطير جداً. العقدة الكاذبة عيب شكلي ناتج عن عرقوب صغير وضعيف." },
        { t: "أمراض العظام (Ringbones & Sidebones):", d: "الـ Ringbone نمو عظمي حول مفاصل الرسغ يسبب التحام المفصل. الـ Sidebones تعظم الغضاريف الجانبية للحافر بسبب الرسغ القائم أو سوء البيطرة." },
        { t: "عيوب الفك الوراثية (Parrot / Undershot):", d: "عدم تطابق القواطع العلوية مع السفلية (البارز أو المتراجع) يمنع الرعي الطبيعي، وهو عيب وراثي يُحاسب عليه بشدة ولا يُتغاضى عنه." }
      ]
    },
    table: {
      title: "📊 بطاقة التقييم القياسية (Scorecard)",
      desc: "في نظام (إيكاهو) الشائع، يُقسم التقييم إلى 5 عناصر أساسية، لكل عنصر 20 نقطة بمجموع 100 نقطة:",
      cols: ["المعيار", "النقاط", "نقاط التركيز للتقييم"],
      rows: [
        ["1. الهوية (Type)", "/ 20", "الكاريزما، نعومة العظام، الجلد الرقيق، التعبير العام وحمل الذيل."],
        ["2. الرأس والرقبة", "/ 20", "الرأس الوتدي، العيون البارزة والمنخفضة، بروز المذبح وحجم الفك."],
        ["3. الجسم والخط العلوي", "/ 20", "قاعدة الأثلاث المتساوية، قوة الظهر، واستواء الكفل والكتف المائل."],
        ["4. الأرجل والقوائم", "/ 20", "استقامة العظام، غياب التشوهات والأمراض، وحالة الحوافر."],
        ["5. الحركة (Movement)", "/ 20", "فترة التحليق في التروت، الاندفاع، التوازن وعدم التواء الخطوة."]
      ],
      total: "المجموع النهائي للبطاقة"
    },
    footer: "© 2026 KUWAIT SHOWS. جميع الحقوق محفوظة."
  },
  en: {
    dir: "ltr",
    hero: {
      badge: "Official ECAHO Judging Syllabus",
      title: "The Ultimate Guide to<br/>Arabian Horse Judging",
      subtitle: "An exhaustive academic manual based strictly on the ECAHO syllabus. Covering conformation, diseases, ring procedures, and hereditary faults.",
      quote: "Without type, identity is lost, and it is therefore marginally more important than conformation."
    },
    sections: [
      {
        id: "type",
        icon: "🧬",
        title: "1. Arab Horse Type",
        desc: "Type is the most distinctive feature. The Arab has 17 ribs (instead of 18 or 19) giving it a compact, strong-loined appearance.",
        points: [
          { t: "Head & Jowl:", d: "Wedge-shaped, broad forehead, large prominently set low eyes. The jowl should allow a fist to fit between the jaw branches." },
          { t: "Neck (Mitbah):", d: "The cervical vertebrae allow a natural curve (mitbah). The lower end should spring upwards out of the shoulder with a fine throat." },
          { t: "Skin & Bone:", d: "The bone is smoother and denser; great circumference is not required. Skin is thin and hair is fine." },
          { t: "Tail:", d: "Should follow the line of the spine when standing. Carried in an arch at walk and elevated gaily at faster paces." }
        ]
      },
      {
        id: "conformation",
        icon: "📐",
        title: "2. Conformation & Proportions",
        desc: "Equal measurements are key: The distance from shoulder to withers, the barrel, and from hip to buttock should be perfectly equal.",
        points: [
          { t: "The Shoulder (Scapula):", d: "Connected only by muscle. A long and sloping shoulder is desirable. If too short, the neck will be low slung." },
          { t: "Quarters & Back:", d: "The croup should be level and long, with a slanting femur to bring the hind leg well under the horse. Gaskin must be muscular." },
          { t: "Legs & Joints:", d: "Hocks and knees large and low down. Tendons straight and parallel. Angle of pastern and hoof must be identical." },
          { t: "Hooves:", d: "Hard, round in front and oval behind. Rings on walls indicate stress. Wavy lines indicate chronic foot disease." }
        ]
      },
      {
        id: "movement",
        icon: "🐎",
        title: "3. Movement & Action",
        desc: "Action should be light and cadenced. High knee action or a long swinging stride are both correct as long as cadence and balance are present.",
        points: [
          { t: "The Walk:", d: "A 4-time gait. Propulsion is from the hind limbs. No period of suspension. Hind foot imprints should overstep the front." },
          { t: "The Trot:", d: "A 2-time gait where diagonals move in unison. Characterized by a 'period of suspension' in the air; longer suspension equals better stride." },
          { t: "Canter & Gallop:", d: "Canter is a 3-time gait. Gallop is 4-time where the head is carried high and tail upright." },
          { t: "Deviations:", d: "A winding movement inwards indicates turning out toes (dangerous interference). Swinging out indicates turning in toes." }
        ]
      },
      {
        id: "development",
        icon: "⏳",
        title: "4. Development & Sexual Dimorphism",
        desc: "Judges must consider natural growth stages. Average height is 14.3hh for mares and 15hh for stallions, but quality is paramount.",
        points: [
          { t: "Foals & Yearlings:", d: "Long legs and short backs. Yearlings are very elegant but may grow up behind first, unbalancing them temporarily." },
          { t: "2 and 3 Year Olds:", d: "Can look lumpy. Heads develop 'tooth bumps' caused by permanent teeth. They need time to 'dry out'." },
          { t: "Stallions:", d: "Taller and more powerful. Necks are crested, possessing overwhelming presence and alertness." },
          { t: "Mares:", d: "Allowed longer ears. Deeper and longer in the body with finer, more elegant heads and gentle eyes." }
        ]
      },
      {
        id: "procedure",
        icon: "🏆",
        title: "5. Ring Procedure & Championships",
        desc: "ECAHO enforces a strict procedural framework inside the arena.",
        points: [
          { t: "Entering the Ring:", d: "All horses walk round three times for a preliminary assessment, then withdraw from the center." },
          { t: "Individual Judging:", d: "Judged individually: Stand in front of judges, walk away and back, trot in a triangle away, to the right, return, and stand up again." },
          { t: "Championships:", d: "Classes are divided into Juniors (foals, yearlings, 2 & 3 yr olds) and Seniors. First-place winners compete for the Champion title." },
          { t: "Reserve Champions:", d: "Second-placed horses must be brought forward to be judged against other first-prize winners to ensure fairness across strong classes." }
        ]
      },
      {
        id: "ethics",
        icon: "📜",
        title: "6. Ethics & Disciplinary Committee",
        desc: "ECAHO lays down a strict legal and ethical framework for judges.",
        points: [
          { t: "Disciplinary Committee (DC):", d: "Examines horses for whipping or doping. A judge must stop and consult the DC if they suspect a horse has been altered or abused." },
          { t: "Non-Comparative System:", d: "Horses are marked out of 100 across 5 topics. Judges must NOT compare horses against each other and fix marks afterwards." }
        ]
      }
    ],
    faults: {
      title: "⚠️ Conformational & Hereditary Faults / Diseases",
      desc: "These specific faults and bone diseases directly penalize the final score:",
      items: [
        { t: "Toe Out / Toe In:", d: "Toes pointing away cause winding where one foreleg may strike the other. Toes pointing in cause strain on fetlock ligaments." },
        { t: "Knee Deviations (Bow / Knock / Offset):", d: "Bow legs strain the inside joint. Knock knees strain the outside. Offset knees stress the splint bone severely." },
        { t: "Back/Over at the Knee:", d: "Back at the knee places immense strain on tendons (serious). Over at the knee is less severe but still faulty." },
        { t: "Straight Hocks & Spavins:", d: "Too little angulation causes Bog Spavins (fluid swelling). Bone Spavins are osteoarthritis affecting weak, narrow hocks." },
        { t: "True vs. False Curbs:", d: "True curbs are tendon displacement caused by strain (severe). False curbs are just visual blemishes due to a small hock structure." },
        { t: "Ringbones & Sidebones:", d: "Ringbone is bone growth on pastern joints causing fusion. Sidebones are ossification of lateral cartilages due to upright pasterns." },
        { t: "Parrot / Undershot Mouth:", d: "Incisors not meeting prevents natural grazing. It is a severe hereditary fault heavily penalized in the show ring." }
      ]
    },
    table: {
      title: "📊 The Scorecard System",
      desc: "In common ECAHO Non-Comparative systems, horses are marked out of 100 against an ideal standard, divided into 5 topics:",
      cols: ["Topic", "Points", "Focus Points"],
      rows: [
        ["1. Type", "/ 20", "Charisma, fine skin, expression, tail carriage."],
        ["2. Head & Neck", "/ 20", "Wedge shape, large low eyes, mitbah curve."],
        ["3. Body & Topline", "/ 20", "Rule of thirds, strong back, level croup."],
        ["4. Legs", "/ 20", "Straight bone, large clean joints, lack of diseases."],
        ["5. Movement", "/ 20", "Lightness, suspension period, lack of interference."]
      ],
      total: "Maximum Total Score"
    },
    footer: "© 2026 KUWAIT SHOWS. ALL RIGHTS RESERVED."
  }
};

export default function ECAHOJudgingGuidePage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved as "en" | "ar");

    const updateLang = () => {
      const l = (localStorage.getItem("lang") || "en") as "en" | "ar";
      setLang(l);
    };

    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  if (!mounted) return null;

  const t = translations[lang];

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center text-white" 
      style={{ backgroundImage: "url('/bg.png')" }}
      dir={t.dir}
    >
      <div className="min-h-screen bg-black/80 px-4 py-8 md:px-12 md:py-16 backdrop-blur-[2px] flex flex-col">
        
        <div className="max-w-7xl mx-auto flex-grow w-full">

          {/* ----- Hero Section ----- */}
          <div className="relative rounded-[2.5rem] overflow-hidden mb-16 h-[55vh] min-h-[550px] flex items-center justify-center border border-[#bc9b6a]/50 shadow-[0_0_60px_rgba(188,155,106,0.2)]">
            <img 
              src="/about4.png" 
              alt="ECAHO Arabian Horse Judging Syllabus" 
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            
            <div className="relative z-10 text-center px-6 max-w-5xl mt-20 space-y-6">
              <div className="inline-block px-6 py-2 rounded-full border border-[#bc9b6a] bg-black/60 text-sm md:text-base text-[#bc9b6a] font-bold tracking-widest uppercase shadow-inner">
                {t.hero.badge}
              </div>
              <h1 
                className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#bc9b6a] leading-tight drop-shadow-2xl" 
                dangerouslySetInnerHTML={{ __html: t.hero.title }} 
              />
              <p className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto mb-20 space-y-6 bg-black/40 p-10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <p className="text-xl md:text-3xl text-[#bc9b6a] leading-loose font-medium italic">
              "{t.hero.quote}"
            </p>
          </div>

          {/* ----- Dynamic ECAHO Sections ----- */}
          <div className="space-y-16 mb-20">
            {t.sections.map((section, idx) => (
              <div 
                key={section.id} 
                className={`flex flex-col lg:flex-row gap-12 items-stretch ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Text Content */}
                <div className="flex-1 bg-black/60 backdrop-blur-2xl border border-[#bc9b6a]/30 p-10 md:p-14 rounded-[2.5rem] shadow-xl hover:border-[#bc9b6a]/70 hover:shadow-[0_0_40px_rgba(188,155,106,0.15)] transition-all duration-500 relative overflow-hidden group">
                  <div className={`absolute -bottom-40 w-80 h-80 bg-[#bc9b6a] rounded-full blur-[140px] opacity-10 group-hover:opacity-20 transition-opacity ${lang === 'ar' ? '-right-40' : '-left-40'}`}></div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#bc9b6a] mb-6 flex items-center gap-4 relative z-10">
                    <span className="text-5xl drop-shadow-lg">{section.icon}</span> {section.title}
                  </h2>
                  <p className="text-gray-200 text-lg leading-loose relative z-10 mb-8 border-b border-white/10 pb-8">
                    {section.desc}
                  </p>
                  
                  <ul className="space-y-6 relative z-10">
                    {section.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#bc9b6a] shadow-[0_0_10px_#bc9b6a] shrink-0 mt-2"></div>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                          <strong className="text-white block sm:inline sm:mr-2 sm:ml-2">{pt.t}</strong> 
                          {pt.d}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative Visual Box */}
                <div className="hidden lg:flex w-1/3 relative rounded-[2.5rem] overflow-hidden border border-[#bc9b6a]/20 shadow-2xl items-center justify-center bg-gradient-to-br from-[#bc9b6a]/10 to-black/80">
                   <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover opacity-20 mix-blend-overlay"></div>
                   <span className="text-[10rem] opacity-20 drop-shadow-2xl">{section.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ----- Faults & Deductions Section (Expanded) ----- */}
          <div className="bg-gradient-to-br from-red-950/40 via-black/80 to-black border border-red-900/50 py-16 px-8 md:px-16 rounded-[3rem] mb-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600 rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
            
            <div className="mb-12 relative z-10 text-center md:text-start">
              <h2 className="text-3xl md:text-5xl font-extrabold text-red-400 mb-6 drop-shadow-xl">{t.faults.title}</h2>
              <p className="text-gray-200 text-xl leading-relaxed max-w-4xl">{t.faults.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {t.faults.items.map((fault, idx) => (
                <div key={idx} className="bg-black/50 border border-red-500/20 p-8 rounded-2xl hover:bg-red-950/30 hover:border-red-500/50 transition-all duration-300 flex items-start gap-5 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center font-bold text-2xl shrink-0 border border-red-500/30">✗</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{fault.t}</h3>
                    <p className="text-gray-300 leading-relaxed text-base">{fault.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ----- Scorecard Table Section ----- */}
          <div className="bg-gradient-to-br from-black to-[#1a1a1a] backdrop-blur-3xl border border-[#bc9b6a]/40 p-8 md:p-14 rounded-[3rem] relative overflow-hidden shadow-2xl mb-20">
            <div className={`absolute -bottom-40 w-[600px] h-[600px] bg-[#bc9b6a] rounded-full blur-[200px] opacity-10 pointer-events-none ${lang === 'ar' ? '-left-40' : '-right-40'}`}></div>
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#bc9b6a] mb-6 drop-shadow-lg">{t.table.title}</h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto">{t.table.desc}</p>
            </div>
            
            <div className="relative z-10 overflow-x-auto rounded-2xl border border-[#bc9b6a]/30 bg-black/60 shadow-2xl">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse min-w-[700px]`}>
                <thead>
                  <tr className="bg-gradient-to-r from-[#bc9b6a]/20 to-transparent border-b border-[#bc9b6a]/50">
                    {t.table.cols.map((col, i) => (
                      <th key={i} className={`p-6 text-[#bc9b6a] font-bold text-lg ${i === 1 ? 'text-center' : ''}`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {t.table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-[#bc9b6a]/10 transition-colors">
                      <td className="p-6 font-bold text-white text-lg">{row[0]}</td>
                      <td className="p-6 text-center font-bold text-[#bc9b6a] text-xl bg-black/30">{row[1]}</td>
                      <td className="p-6 text-base text-gray-300 leading-relaxed">{row[2]}</td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-[#bc9b6a]/30 to-[#bc9b6a]/5 border-t-2 border-[#bc9b6a]">
                    <td className="p-6 font-extrabold text-white text-xl uppercase tracking-wider">{t.table.total}</td>
                    <td className="p-6 text-center font-extrabold text-[#bc9b6a] text-2xl">100</td>
                    <td className="p-6"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ----- Footer ----- */}
          <footer className="mt-12 pt-8 pb-6 border-t border-[#bc9b6a]/20 flex flex-col items-center justify-center gap-4 relative z-10">
            <p className="text-[#bc9b6a]/70 text-sm font-light tracking-widest text-center uppercase">
              {t.footer}
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}
