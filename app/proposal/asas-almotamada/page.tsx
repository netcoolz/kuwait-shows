"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import { Tajawal } from 'next/font/google';
import { 
  ArrowLeft, Check, ChevronDown, MoveRight, ArrowUpRight,
  Globe, Camera, Search, Target, PenTool, Users, LayoutTemplate, LineChart,
  Monitor, LayoutGrid, Zap, Shield, Star, Hexagon, Crosshair,
  Building2, AlertCircle, CheckCircle2
} from 'lucide-react';

const tajawal = Tajawal({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '500', '700', '800', '900'],
  display: 'swap',
});

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = 16;
      const step = (end - start) / (duration / incrementTime);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [value, inView]);

  return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
};

const BlurReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const LuxuryDivider = () => (
  <div className="w-full h-px relative flex items-center justify-center py-24">
    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="absolute w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
  </div>
);

const NAV_LINKS = [
  { name: 'الرئيسية', href: '#hero' },
  { name: 'الملخص', href: '#executive-summary' },
  { name: 'التحول الرقمي', href: '#dashboard' },
  { name: 'التدقيق', href: '#audit' },
  { name: 'SWOT', href: '#swot' },
  { name: 'المنافسون', href: '#competitors' },
  { name: 'الاستراتيجية', href: '#strategy' },
  { name: 'الباقات', href: '#packages' },
];

const DASHBOARD_METRICS = [
  { title: 'الموقع الإلكتروني', current: 60, target: 98, color: '#F97316', status: 'يحتاج إلى تحسين', icon: Globe },
  { title: 'Instagram', current: 55, target: 95, color: '#F97316', status: 'يحتاج إلى تحسين', icon: Camera },
  { title: 'SEO', current: 35, target: 90, color: '#EF4444', status: 'أولوية قصوى', icon: Search },
  { title: 'الإعلانات المدفوعة', current: 30, target: 90, color: '#EF4444', status: 'أولوية قصوى', icon: Target },
  { title: 'الهوية البصرية', current: 85, target: 98, color: '#22C55E', status: 'قوي', icon: PenTool },
  { title: 'توليد العملاء', current: 40, target: 95, color: '#EF4444', status: 'أولوية قصوى', icon: Users },
  { title: 'جودة المحتوى', current: 65, target: 95, color: '#F97316', status: 'يحتاج إلى تحسين', icon: LayoutTemplate },
  { title: 'ترتيب Google', current: 35, target: 90, color: '#EF4444', status: 'أولوية قصوى', icon: LineChart },
];

const WEB_AUDIT = [
  { element: 'واجهة المستخدم (UI)', current: 70, target: 95, icon: Monitor, desc: 'تصميم يفتقر للحداثة ولا يعكس الفخامة المطلوبة.' },
  { element: 'تجربة المستخدم (UX)', current: 65, target: 95, icon: LayoutGrid, desc: 'مسارات تصفح غير واضحة تزيد من تشتت العميل.' },
  { element: 'محركات البحث (SEO)', current: 35, target: 90, icon: Search, desc: 'ضعف الأرشفة وغياب الكلمات المفتاحية الاستراتيجية.' },
  { element: 'سرعة الموقع', current: 72, target: 95, icon: Zap, desc: 'بطء في تحميل صور المشاريع عالية الدقة.' },
  { element: 'ثقة العملاء', current: 85, target: 98, icon: Shield, desc: 'إرث قوي يحتاج إلى إبراز رقمي أكثر احترافية.' },
  { element: 'توليد العملاء', current: 40, target: 95, icon: Target, desc: 'غياب مسارات التحويل ونماذج الطلب الذكية.' },
];

const INSTA_AUDIT = [
  { element: 'الهوية البصرية', rating: 4, desc: 'أساس جيد يحتاج لتوحيد النمط.' },
  { element: 'Reels', rating: 2, desc: 'استغلال ضعيف لأقوى أدوات الانتشار.' },
  { element: 'Stories', rating: 2, desc: 'غياب التوثيق اليومي للمشاريع.' },
  { element: 'جودة المحتوى', rating: 3, desc: 'محتوى هندسي يفتقد للمسة السينمائية.' },
  { element: 'النمط البصري', rating: 3, desc: 'عدم تناسق التغذية البصرية (Grid).' },
  { element: 'رسائل CTA', rating: 2, desc: 'غياب التوجيه الواضح لاتخاذ قرار.' },
];

const SWOT = [
  { title: 'نقاط القوة', items: ['تاريخ ممتد في الكويت منذ 1977.', 'ملاءة مالية وقدرة تنفيذية عالية.', 'تصنيف معتمد لدى الجهات الحكومية.', 'جودة تشطيبات وإنجاز فعلي مثبت.'], color: 'border-[#22C55E]/30 text-[#22C55E]' },
  { title: 'نقاط الضعف', items: ['الموقع لا يعكس حجم وتاريخ الشركة.', 'غياب التوثيق المرئي الاحترافي.', 'انعدام الحملات الإعلانية الموجهة.', 'ضعف استغلال تقنيات SEO.'], color: 'border-[#EF4444]/30 text-[#EF4444]' },
  { title: 'الفرص', items: ['الطلب المتنامي لبناء القسائم السكنية.', 'قلة المنافسين ذوي التواجد الرقمي الاحترافي.', 'السيطرة على الكلمات العقارية في Google.', 'توظيف المحتوى التعليمي الهندسي.'], color: 'border-[#3B82F6]/30 text-[#3B82F6]' },
  { title: 'التهديدات', items: ['استثمار الشركات الحديثة في التسويق العدواني.', 'ارتفاع تكلفة النقرات الإعلانية.', 'اعتماد العملاء على التقييمات الرقمية.', 'التحديثات المستمرة لخوارزميات المنصات.'], color: 'border-[#F97316]/30 text-[#F97316]' },
];

const FUNNEL = [
  { stage: 'الوعي بالعلامة التجارية', desc: 'استقطاب الانتباه عبر Reels وإعلانات الانتشار.' },
  { stage: 'الاهتمام بخدمات الشركة', desc: 'إبراز جودة المشاريع والمحتوى الهندسي.' },
  { stage: 'التفكير والمقارنة', desc: 'حملات إعادة الاستهداف ومراجعات العملاء.' },
  { stage: 'توليد العميل المحتمل', desc: 'استقبال الطلبات عبر الموقع ونماذج Leads.' },
  { stage: 'تقديم عرض السعر', desc: 'تواصل المبيعات المباشر عبر WhatsApp.' },
  { stage: 'توقيع العقد', desc: 'إغلاق الصفقة وبدء تنفيذ المشروع.' },
];

const RESULTS = [
  { metric: 'زيارات الموقع الإلكتروني', target: 'حتى +300%' },
  { metric: 'الوصول إلى العلامة التجارية', target: 'حتى +250%' },
  { metric: 'العملاء المحتملون المؤهلون', target: 'حتى +180%' },
  { metric: 'استفسارات WhatsApp', target: 'حتى +120%' },
  { metric: 'ثقة العملاء', target: 'حتى +90%' },
  { metric: 'الزيارات العضوية من Google', target: 'حتى +60%' },
];

const PACKAGES = [
  {
    name: 'الانطلاقة',
    price: '450 د.ك',
    period: '/ شهرياً',
    idealFor: 'تأسيس التواجد الرقمي وبناء المصداقية الأساسية.',
    features: ['إدارة وتطوير منصات التواصل', 'محتوى أساسي', 'تصميم الصور ومونتاج مقاطع الفيديو', 'ادارة الحملات الاعلانيه وزياده المشاهدات والتواصل من الفئة المستهدفة'],
    featured: false,
    badge: ''
  },
  {
    name: 'النمو',
    badge: 'الأكثر ترشيحاً',
    price: '550 د.ك',
    period: '/ شهرياً',
    idealFor: 'تسريع عجلة النمو وتوسيع قاعدة العملاء المحتملين.',
    features: ['كل ما سبق، بالإضافة إلى:', 'محتوى متقدم وإنتاج Reels', 'إدارة الحملات الإعلانية', 'تحسين محركات البحث (SEO)', 'اجتماعات استراتيجية'],
    featured: true
  },
  {
    name: 'التوسع',
    price: '650 د.ك',
    period: '/ شهرياً',
    idealFor: 'تعزيز الهيمنة السوقية ومزاحمة كبرى الشركات.',
    features: ['كل ما سبق، بالإضافة إلى:', 'محتوى مكثف ومخصص', 'تصوير درون واحترافي', 'ميزانيات إعلانية ضخمة الإدارة', 'ترسيخ ولاء العملاء'],
    featured: false,
    badge: ''
  },
  {
    name: 'الشراكة الاستراتيجية',
    price: 'حسب المشروع',
    period: '',
    idealFor: 'بناء منظومة أعمال رقمية متكاملة ومستدامة.',
    features: ['تخصيص كامل للخدمات', 'أتمتة مسارات المبيعات', 'توظيف أنظمة CRM', 'بناء تجربة عميل استثنائية', 'فرق ميدانية مخصصة'],
    featured: false,
    badge: ''
  }
];

const LOGOS = [
  { src: '/tradex.png', alt: 'Tradex' },
  { src: '/kuwaitshows.png', alt: 'Kuwait Shows' },
  { src: '/marbatx.jpg', alt: 'MarbatX' },
  { src: '/cargox.png', alt: 'Cargo X' },
  { src: '/24flights.png', alt: '24 Flights' },
  { src: '/halal.png', alt: 'Halal' },
  { src: '/routina.png', alt: 'Routina Beauty' },
  { src: '/baitalarab.png', alt: 'Bait Al Arab' },
];

const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-16 md:mb-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
        {title}
      </h2>
      <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent mx-auto rounded-full mb-6" />
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  </div>
);

const CircularProgress = ({ value, target, color, icon: Icon }: any) => {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="56" cy="56" r="50" fill="none" stroke="#222" strokeWidth="6" />
        <motion.circle
          cx="56"
          cy="56"
          r="50"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 1000" }}
          whileInView={{ strokeDasharray: `${(value / 100) * 314} 1000` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold">{value}%</span>
      </div>
    </div>
  );
};

export default function PremiumProposal() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.replace('#', ''));
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <div dir="rtl" className={`${tajawal.className} bg-[#070707] min-h-screen text-[#F5F5F5] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden font-light`}>
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#FDE08B] z-50 origin-right shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>

      <nav className="fixed top-0 w-full z-40 bg-[#070707]/60 backdrop-blur-2xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <BlurReveal>
            <div className="flex items-center gap-6 cursor-pointer" onClick={() => scrollTo('#hero')}>
              <span className="text-xl font-bold tracking-widest uppercase">Tradex<span className="text-[#D4AF37]">.</span></span>
            </div>
          </BlurReveal>
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          <BlurReveal delay={0.2}>
            <button onClick={() => scrollTo('#cta')} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all backdrop-blur-md">
              تواصل معنا
            </button>
          </BlurReveal>
        </div>
      </nav>

      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1541888086225-ee5315f67a2d?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Architecture" 
            fill 
            className="object-cover opacity-40 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/30 via-[#070707]/80 to-[#070707]" />
        </motion.div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-20 flex flex-col items-center text-center">
          <BlurReveal delay={0.2} className="flex items-center gap-8 mb-12">
            <div className="relative w-32 h-32 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.1)] p-6">
              <Image src="/asas logo.png" alt="Asas Logo" fill className="object-contain p-4 filter drop-shadow-lg" />
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            <div className="relative w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 p-5">
              <Image src="/tradex.png" alt="Tradex Logo" fill className="object-contain p-4 filter drop-shadow-lg opacity-90" />
            </div>
          </BlurReveal>

          <BlurReveal delay={0.4}>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium tracking-widest mb-8">
              المقترح الاستراتيجي للتسويق الرقمي
            </div>
          </BlurReveal>

          <BlurReveal delay={0.6}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[1.1] mb-8">
              خارطة النمو <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FDE08B] to-[#D4AF37]">الرقمي 2026</span>
            </h1>
          </BlurReveal>

          <BlurReveal delay={0.8} className="space-y-4">
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase">تم الإعداد حصرياً لصالح</p>
            <h2 className="text-3xl text-white font-medium">شركة أساس المعتمدة للمقاولات</h2>
          </BlurReveal>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 cursor-pointer hover:text-white transition-colors"
          onClick={() => scrollTo('#about')}
        >
          <span className="text-xs uppercase tracking-widest">اكتشف</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      <section id="about" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <BlurReveal>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">من نحن</h2>
              <p className="text-xl text-gray-400 leading-relaxed font-light mb-10">
                Tradex هي شركة متخصصة في التسويق الرقمي، بناء الهوية البصرية، وتطوير البرمجيات. نفخر بكوننا إحدى شركات <strong className="text-white font-medium">AIC Holding</strong>.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500">المقر الرئيسي</span>
                  <span className="text-white text-left">The Peninsula<br/>صباح السالم، الكويت</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500">الخدمات الأساسية</span>
                  <span className="text-white text-left w-1/2">التسويق الرقمي، الهوية البصرية، تطوير البرمجيات، تسويق الأداء</span>
                </div>
              </div>
            </BlurReveal>
          </div>
          <div className="lg:w-1/2 w-full order-1 lg:order-2 relative">
            <BlurReveal delay={0.2}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10">
                <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" alt="Consulting" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#070707] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D4AF37]/20 blur-3xl rounded-full" />
            </BlurReveal>
          </div>
        </div>
      </section>

      <LuxuryDivider />

      <section id="executive-summary" className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <BlurReveal>
            <p className="text-[#D4AF37] tracking-widest text-sm mb-4">الملخص التنفيذي</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">التقييم الرقمي العام</h2>
            <p className="text-xl text-gray-400 font-light mb-24 max-w-3xl mx-auto leading-relaxed">
              تقف "أساس المعتمدة" اليوم على إرث عريق وموثوقية عالية، إلا أن حضورها الرقمي لا يعكس حجم هذه الإنجازات الميدانية. نسعى لتحويل هذا الإرث إلى منظومة رقمية متكاملة.
            </p>
          </BlurReveal>

          <BlurReveal delay={0.3} className="relative flex justify-center items-center h-96">
            <div className="absolute w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[80px]" />
            <svg className="w-80 h-80 transform -rotate-90 relative z-10 drop-shadow-2xl">
              <circle cx="160" cy="160" r="140" fill="none" stroke="#1a1a1a" strokeWidth="4" />
              <motion.circle
                cx="160" cy="160" r="140" fill="none"
                stroke="url(#goldGradient)" strokeWidth="8" strokeLinecap="round"
                initial={{ strokeDasharray: "0 1000" }}
                whileInView={{ strokeDasharray: `${(63 / 100) * 879} 1000` }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#FDE08B" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className="text-8xl font-black text-white tracking-tighter"><AnimatedCounter value={63} /></span>
              <span className="text-gray-500 tracking-widest mt-2">من 100</span>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.6} className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 mt-24">
            {[
              { label: 'قوة العلامة التجارية', status: 'قوي', color: 'text-[#22C55E]' },
              { label: 'الموقع الإلكتروني', status: 'يحتاج إلى تحسين', color: 'text-[#F97316]' },
              { label: 'Instagram', status: 'يحتاج إلى تحسين', color: 'text-[#F97316]' },
              { label: 'توليد العملاء', status: 'أولوية قصوى', color: 'text-[#EF4444]' },
              { label: 'SEO', status: 'أولوية قصوى', color: 'text-[#EF4444]' },
              { label: 'الإعلانات المدفوعة', status: 'أولوية قصوى', color: 'text-[#EF4444]' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-sm font-bold mb-3 ${item.color}`}>{item.status}</span>
                <span className="text-lg text-white font-medium">{item.label}</span>
                <div className="w-12 h-px bg-white/10 mt-4" />
              </div>
            ))}
          </BlurReveal>
        </div>
      </section>

      <section id="dashboard" className="py-32 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <BlurReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">أهم الملاحظات التنفيذية</h2>
                <p className="text-xl text-gray-400 font-light max-w-2xl">نقاط ارتكاز استراتيجية لتعزيز المكانة الرقمية للشركة بما يخدم أهدافها التجارية.</p>
              </div>
              <div className="w-32 h-px bg-[#D4AF37] hidden md:block" />
            </div>
          </BlurReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[
              { title: 'الموثوقية العالية', desc: 'إرثكم الممتد يمثل أصلكم الأقوى؛ ومن المتوقع أن يساهم التواجد الرقمي الفعال في إبراز هذه المكانة أمام شريحة أكبر.' },
              { title: 'فجوة المنافسة', desc: 'يتفوق المنافسون بالظهور المرئي، مما يتيح فرصة لاقتناص الحصة السوقية بمجرد توظيف خبرتكم الميدانية رقمياً.' },
              { title: 'فرصة النمو', desc: 'يسهم التواجد في نتائج بحث Google في ربط خدماتكم مباشرة بالعملاء الباحثين بنشاط عن مقاولين معتمدين.' },
              { title: 'محرك الجذب', desc: 'يساعد توثيق مواقع العمل عبر مقاطع Reels في بناء ثقة فورية تساند قرار العميل للتعاقد.' },
              { title: 'التحول الرقمي', desc: 'يدعم تطوير واجهة المستخدم في الموقع الإلكتروني رحلة العميل، مما يعزز من معدلات التحويل وجودة الطلبات.' }
            ].map((insight, i) => (
              <BlurReveal key={i} delay={i * 0.1} className={`bg-[#070707] p-12 hover:bg-[#111] transition-colors ${i === 4 ? 'md:col-span-2 text-center' : ''}`}>
                <div className={`text-[#D4AF37] font-black text-6xl mb-6 opacity-20 ${i === 4 ? 'mx-auto' : ''}`}>0{i+1}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{insight.title}</h3>
                <p className={`text-gray-400 leading-relaxed font-light ${i === 4 ? 'max-w-3xl mx-auto' : ''}`}>{insight.desc}</p>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="audit" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-40">
          
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 w-full">
              <BlurReveal>
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10">
                  <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Corporate Building" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent" />
                </div>
              </BlurReveal>
            </div>
            <div className="lg:w-1/2 w-full">
              <BlurReveal>
                <p className="text-[#D4AF37] tracking-widest text-sm mb-4">التحليل التقني</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">تحليل الموقع الإلكتروني</h2>
                <p className="text-gray-400 font-light mb-12">تقييم شامل للبنية التحتية الرقمية الحالية وتحديد فجوات الأداء المؤثرة على تجربة العميل.</p>
                
                <div className="space-y-8">
                  {[
                    { label: 'ثقة العملاء', status: 'قوي', color: 'text-[#22C55E]' },
                    { label: 'واجهة المستخدم', status: 'يحتاج إلى تحسين', color: 'text-[#F97316]' },
                    { label: 'تجربة المستخدم', status: 'يحتاج إلى تحسين', color: 'text-[#F97316]' },
                    { label: 'توليد العملاء', status: 'أولوية قصوى', color: 'text-[#EF4444]' },
                    { label: 'SEO', status: 'أولوية قصوى', color: 'text-[#EF4444]' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-xl text-white font-medium">{item.label}</span>
                      <span className={`text-sm font-bold tracking-wide ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </BlurReveal>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
            <div className="lg:w-1/2 w-full">
              <BlurReveal>
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 p-8 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-white/5 rounded-xl border border-white/10" />
                    <div className="bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20" />
                    <div className="col-span-2 bg-white/5 rounded-xl border border-white/10" />
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />
                </div>
              </BlurReveal>
            </div>
            <div className="lg:w-1/2 w-full">
              <BlurReveal>
                <p className="text-[#D4AF37] tracking-widest text-sm mb-4">التحليل البصري</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">تحليل حساب إنستغرام</h2>
                <p className="text-gray-400 font-light mb-12">تقييم الحضور الرقمي على منصة التواصل الأهم في السوق الكويتي وتحديد فرص التميز.</p>
                
                <div className="space-y-6">
                  {[
                    'توحيد النمط البصري لتعزيز احترافية العلامة التجارية.',
                    'التركيز بنسبة 80% على مقاطع Reels لدعم معدلات الوصول العضوي.',
                    'صياغة نصوص حركية وجمل خطافية لزيادة تفاعل المتابعين.',
                    'تفعيل رابط مخصص لتسهيل انتقال العملاء إلى الواتساب.',
                    'نشر Stories يومية من المواقع الإنشائية لترسيخ الموثوقية.'
                  ].map((rec, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2.5 shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      <p className="text-lg text-gray-300 font-light leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </BlurReveal>
            </div>
          </div>
        </div>
      </section>

      <LuxuryDivider />

      <section id="swot" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <BlurReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">التحليل الاستراتيجي (SWOT)</h2>
            <p className="text-xl text-gray-400 font-light text-center mb-20">نظرة فاحصة للموقع التنافسي للشركة لتعظيم الفرص وتقليل المخاطر.</p>
          </BlurReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'نقاط القوة', data: ['تاريخ ممتد في الكويت منذ 1977.', 'ملاءة مالية وقدرة تنفيذية عالية.', 'تصنيف معتمد لدى الجهات الحكومية.', 'جودة تشطيبات وإنجاز فعلي مثبت.'] },
              { title: 'نقاط الضعف', data: ['الموقع الإلكتروني لا يعكس حجم وتاريخ الشركة.', 'غياب التوثيق المرئي الاحترافي.', 'انعدام الحملات الإعلانية الموجهة.', 'ضعف استغلال SEO.'] },
              { title: 'الفرص', data: ['الطلب المتنامي لبناء القسائم السكنية الجديدة.', 'قلة المنافسين ذوي التواجد الرقمي الاحترافي.', 'السيطرة على الكلمات العقارية في نتائج Google.', 'توظيف المحتوى التعليمي الهندسي لخدمة العملاء.'] },
              { title: 'التهديدات', data: ['الاستثمار المرتفع للشركات الحديثة في التسويق العدواني.', 'ارتفاع تكلفة النقرات الإعلانية مع تزايد المنافسة.', 'اعتماد العملاء بشكل متزايد على التقييمات الرقمية.', 'التحديثات المستمرة لخوارزميات المنصات.'] }
            ].map((block, i) => (
              <BlurReveal key={i} delay={i * 0.1}>
                <div className="h-full p-12 bg-white/5 border border-white/5 hover:border-white/20 transition-all rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 select-none pointer-events-none">0{i+1}</div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-8">{block.title}</h3>
                  <div className="space-y-6">
                    {block.data.map((item, j) => (
                      <div key={j} className="flex gap-4">
                        <div className="w-6 h-px bg-white/20 mt-3 shrink-0" />
                        <p className="text-gray-300 font-light leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="competitors" className="py-32 px-6 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')] mix-blend-luminosity bg-fixed bg-cover" />
        <div className="absolute inset-0 bg-[#070707]/90 backdrop-blur-sm" />

        <div className="max-w-7xl mx-auto relative z-10">
          <BlurReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">تحليل المنافسين</h2>
            <p className="text-xl text-gray-400 font-light mb-20 max-w-2xl">مقارنة أدائية تسلط الضوء على الفرص غير المستغلة في السوق المحلي.</p>
          </BlurReveal>

          <BlurReveal delay={0.2} className="overflow-x-auto pb-10">
            <div className="min-w-[800px] border border-white/10 rounded-3xl overflow-hidden bg-[#070707]/50 backdrop-blur-xl">
              <div className="grid grid-cols-4 bg-white/5 border-b border-white/10 p-6">
                <div className="text-gray-400 text-sm font-medium">المعيار</div>
                <div className="text-[#D4AF37] text-lg font-bold">أساس المعتمدة</div>
                <div className="text-white text-lg font-medium">شركات كبرى</div>
                <div className="text-white text-lg font-medium">شركات ناشئة</div>
              </div>
              {[
                { name: 'الخبرة', a: 'عالي جداً', b: 'عالي جداً', c: 'منخفض' },
                { name: 'جودة المحتوى', a: 'متوسط', b: 'متوسط', c: 'عالي جداً' },
                { name: 'الموقع الإلكتروني', a: 'متوسط', b: 'قوي', c: 'ممتاز' },
                { name: 'SEO', a: 'ضعيف', b: 'قوي', c: 'متوسط' },
                { name: 'الإعلانات المدفوعة', a: 'غائب', b: 'مستمر', c: 'مكثف جداً' },
                { name: 'توليد العملاء المحتملين', a: 'معقد', b: 'معقد', c: 'سريع جداً' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
                  <div className="text-gray-300 font-medium">{row.name}</div>
                  <div className="text-white font-bold bg-[#D4AF37]/10 px-4 py-2 rounded-lg inline-block w-max border border-[#D4AF37]/20">{row.a}</div>
                  <div className="text-gray-400">{row.b}</div>
                  <div className="text-gray-400">{row.c}</div>
                </div>
              ))}
            </div>
          </BlurReveal>

          <BlurReveal delay={0.4} className="mt-12 bg-white/5 border border-[#D4AF37]/30 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
             <Crosshair className="w-12 h-12 text-[#D4AF37] shrink-0" />
             <div>
                <h4 className="text-xl font-bold text-white mb-2">الميزة التنافسية لأساس</h4>
                <p className="text-gray-400 leading-relaxed">
                  دمج الإرث الممتد منذ 1977 مع الحلول الرقمية الحديثة لخلق ميزة تنافسية مستدامة. توظيف المحتوى الهندسي الموثوق وتفعيل تقنيات SEO لضمان استقطاب الزيارات عالية القيمة وتوجيهها نحو المبيعات بقوة لا تملكها الشركات الناشئة.
                </p>
             </div>
          </BlurReveal>
        </div>
      </section>

      <section id="strategy" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <BlurReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">رحلة العميل</h2>
            <p className="text-xl text-gray-400 font-light text-center mb-24">تطوير المسار من مرحلة الاستكشاف والبحث إلى توقيع العقد.</p>
          </BlurReveal>

          <div className="space-y-16 relative">
            <div className="absolute right-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#D4AF37] via-white/10 to-transparent" />
            {[
              { title: 'الوضع الحالي', items: ['بحث', 'الموقع الإلكتروني', 'تشتت', 'مغادرة'], color: 'text-gray-500' },
              { title: 'الوضع المستهدف', items: ['إعلان مدفوع', 'صفحة هبوط', 'استعراض المشاريع', 'WhatsApp', 'عرض سعر', 'توقيع العقد'], color: 'text-[#D4AF37]' }
            ].map((scenario, i) => (
              <BlurReveal key={i} delay={i * 0.2} className="relative pr-16">
                <div className={`absolute right-0 top-1.5 w-10 h-10 rounded-full border-4 border-[#070707] ${i === 1 ? 'bg-[#D4AF37]' : 'bg-gray-700'} flex items-center justify-center z-10 shadow-lg`} />
                <h3 className={`text-2xl font-bold mb-8 ${scenario.color}`}>{scenario.title}</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {scenario.items.map((step, j) => (
                    <React.Fragment key={j}>
                      <div className={`px-6 py-3 rounded-full border ${i === 1 ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                        {step}
                      </div>
                      {j < scenario.items.length - 1 && <MoveRight className={`w-5 h-5 ${i === 1 ? 'text-[#D4AF37]' : 'text-gray-600'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <LuxuryDivider />

      <section className="py-32 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto space-y-40">
          
          <div className="text-center">
            <BlurReveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">النتائج المستهدفة</h2>
              <p className="text-xl text-gray-400 font-light mb-24 max-w-3xl mx-auto">توقعات النمو الاستراتيجي التي تدعمها جهودنا خلال 12 شهراً.</p>
            </BlurReveal>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
              {[
                { val: 300, label: 'زيارات الموقع الإلكتروني' },
                { val: 250, label: 'الوصول إلى العلامة التجارية' },
                { val: 180, label: 'العملاء المحتملون المؤهلون' },
                { val: 120, label: 'استفسارات WhatsApp' },
                { val: 90, label: 'ثقة العملاء' },
                { val: 60, label: 'الزيارات العضوية من Google' }
              ].map((item, i) => (
                <BlurReveal key={i} delay={i * 0.1} className="flex flex-col items-center">
                  <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6">
                    <AnimatedCounter value={item.val} prefix="+" suffix="%" />
                  </div>
                  <div className="h-px w-12 bg-[#D4AF37] mb-6" />
                  <h4 className="text-lg md:text-xl text-gray-300 font-medium">{item.label}</h4>
                  <span className="text-xs text-gray-600 tracking-widest mt-2 uppercase">المستهدف الاستراتيجي</span>
                </BlurReveal>
              ))}
            </div>
            <BlurReveal delay={0.6}>
              <p className="text-gray-600 text-sm mt-24 max-w-4xl mx-auto italic">
                “تمثل هذه المستهدفات الاستراتيجية نتائج متوقعة بناءً على التنفيذ الناجح للاستراتيجية المقترحة. تعتمد النتائج الفعلية على جودة التنفيذ، حجم الاستثمار الإعلاني، ظروف السوق، والتحسين المستمر.”
              </p>
            </BlurReveal>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <BlurReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">منهجية العمل</h2>
            <p className="text-xl text-gray-400 font-light mb-20 max-w-2xl">خطوات تنفيذ المشروع المصممة لضمان أعلى معايير الجودة والكفاءة.</p>
          </BlurReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { t: 'التحليل', d: 'نبدأ بفهم أهدافكم التشغيلية والتجارية.' },
              { t: 'التخطيط', d: 'رسم استراتيجية رقمية متوائمة مع طموحاتكم.' },
              { t: 'التصميم', d: 'ابتكار تجربة رقمية فريدة تليق بالعملاء.' },
              { t: 'التنفيذ', d: 'بناء المنصات والحلول التقنية بكفاءة.' },
              { t: 'القياس', d: 'رصد وتحليل البيانات وأداء الحملات بدقة.' },
              { t: 'التحسين المستمر', d: 'تطوير النتائج دورياً لضمان استدامة النمو.' }
            ].map((step, i) => (
              <BlurReveal key={i} delay={i * 0.1}>
                <div className="p-10 border border-white/5 bg-[#070707] rounded-[2rem] hover:border-[#D4AF37]/30 transition-all group">
                  <div className="text-[#D4AF37] font-bold text-xl mb-4">0{i+1}.</div>
                  <h3 className="text-2xl text-white font-bold mb-4">{step.t}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{step.d}</p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="py-32 px-6 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1)_0%,transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <BlurReveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">الباقات الاستثمارية</h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
              تم تصميم هذه الباقات لتناسب احتياجات الشركات باختلاف مراحل نموها، مع إمكانية تخصيص أي باقة وفق متطلبات المشروع.
            </p>
          </BlurReveal>

          <BlurReveal delay={0.2} className="overflow-x-auto mb-20 hidden md:block">
            <div className="min-w-[900px] border border-white/10 rounded-[2rem] bg-[#070707]/80 backdrop-blur-xl overflow-hidden p-8">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/10 text-gray-500 font-medium">الخدمة</th>
                    <th className="p-4 border-b border-white/10 text-white font-bold text-xl text-center">الانطلاقة</th>
                    <th className="p-4 border-b-2 border-[#D4AF37] text-[#D4AF37] font-bold text-xl text-center bg-[#D4AF37]/5 rounded-t-xl relative">
                      النمو <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-[#D4AF37] text-black px-2 py-0.5 rounded-full whitespace-nowrap">الأكثر ترشيحاً</span>
                    </th>
                    <th className="p-4 border-b border-white/10 text-white font-bold text-xl text-center">التوسع</th>
                    <th className="p-4 border-b border-white/10 text-white font-bold text-xl text-center">الشراكة الاستراتيجية</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { n: 'إدارة منصات التواصل', v: ['✓', '✓', '✓', '✓'] },
                    { n: 'صناعة المحتوى', v: ['محتوى أساسي', 'محتوى متقدم', 'محتوى مكثف', 'مخصص بالكامل'] },
                    { n: 'إنتاج مقاطع Reels', v: ['-', '✓', '✓', '✓'] },
                    { n: 'إدارة الحملات الإعلانية', v: ['-', '✓', '✓', '✓'] },
                    { n: 'تحسين محركات البحث (SEO)', v: ['-', '✓', '✓', '✓'] },
                    { n: 'الدعم التقني للموقع', v: ['✓', '✓', '✓', '✓'] },
                    { n: 'التقارير الشهرية', v: ['✓', '✓', '✓', '✓'] },
                    { n: 'الاجتماعات الاستراتيجية', v: ['-', '✓', '✓', '✓'] },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 border-b border-white/5 text-gray-300 font-medium">{row.n}</td>
                      <td className="p-6 border-b border-white/5 text-gray-400 text-center">{row.v[0]}</td>
                      <td className="p-6 border-b border-white/5 text-white font-bold text-center bg-[#D4AF37]/5">{row.v[1]}</td>
                      <td className="p-6 border-b border-white/5 text-gray-400 text-center">{row.v[2]}</td>
                      <td className="p-6 border-b border-white/5 text-gray-400 text-center">{row.v[3]}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-6 text-gray-500 font-medium">الاستثمار الشهري</td>
                    <td className="p-6 text-white font-bold text-xl text-center">250 د.ك</td>
                    <td className="p-6 text-[#D4AF37] font-black text-2xl text-center bg-[#D4AF37]/5 rounded-b-xl">450 د.ك</td>
                    <td className="p-6 text-white font-bold text-xl text-center">700 د.ك</td>
                    <td className="p-6 text-white font-bold text-sm text-center">حسب المشروع</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BlurReveal>

          <div className="md:hidden space-y-6 mb-20">
             {PACKAGES.map((pkg, i) => (
                <div key={i} className={`p-8 rounded-3xl border ${pkg.featured ? 'border-[#D4AF37] bg-gradient-to-b from-[#1a1a1a] to-[#070707] shadow-[0_0_20px_rgba(212,175,55,0.15)] relative' : 'border-white/10 bg-white/5'}`}>
                   {pkg.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-xs font-bold px-4 py-1 rounded-full">الأكثر ترشيحاً</div>}
                   <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                   <div className="text-3xl font-bold text-[#D4AF37] mb-6">{pkg.price}</div>
                   <ul className="space-y-3 mb-8">
                     {pkg.features.map((f, j) => (
                       <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> {f}
                       </li>
                     ))}
                   </ul>
                </div>
             ))}
          </div>

          <BlurReveal delay={0.4}>
            <p className="text-center text-gray-500 text-sm max-w-3xl mx-auto leading-relaxed border border-white/10 p-6 rounded-2xl bg-[#070707]">
              <strong className="text-white">إخلاء مسؤولية:</strong> تكاليف الحملات الإعلانية على Google وMeta وSnapchat وTikTok وYouTube لا تدخل ضمن رسوم الإدارة الشهرية، ويتم تحديد ميزانية الإعلانات بشكل منفصل حسب أهداف وميزانية شركة أساس المعتمدة.
            </p>
          </BlurReveal>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 w-full">
            <BlurReveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">لماذا Tradex؟</h2>
              <p className="text-xl text-gray-400 font-light mb-12 leading-relaxed">
                لا نكتفي بتقديم الخدمات، بل نبني شراكات استراتيجية متكاملة تضمن تفوقكم الرقمي من خلال خبرة مؤسسية موثوقة.
              </p>
              
              <div className="space-y-8">
                {[
                  'فريق متعدد التخصصات.',
                  'حلول رقمية متكاملة من جهة واحدة.',
                  'خبرة في التسويق والتطوير البرمجي.',
                  'تقارير أداء واضحة وقابلة للقياس.',
                  'متابعة مستمرة وتحسين دائم.',
                  'إحدى شركات AIC Holding.'
                ].map((adv, i) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="w-12 h-px bg-[#D4AF37] shrink-0" />
                    <p className="text-2xl text-white font-light">{adv}</p>
                  </div>
                ))}
              </div>
            </BlurReveal>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <BlurReveal delay={0.2}>
               <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10">
                 <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" alt="Luxury Meeting" fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent" />
               </div>
            </BlurReveal>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto text-center">
          <BlurReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">عملاؤنا ومشاريعنا</h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto mb-20 leading-relaxed">
              نفخر بتنفيذ وإدارة مجموعة من المشاريع والمنصات الرقمية في قطاعات متعددة، مما يعكس تنوع خبراتنا وقدرتنا على تقديم حلول متكاملة.
            </p>
          </BlurReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {LOGOS.map((logo, i) => (
              <BlurReveal key={i} delay={i * 0.05}>
                <div className="aspect-[16/9] relative bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center p-8 group hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden cursor-pointer">
                   <div className="relative w-full h-full filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
                     <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                   </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
          <BlurReveal>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
              جاهزون لبناء <br/>المستقبل معاً؟
            </h2>
          </BlurReveal>
          
          <BlurReveal delay={0.2}>
            <div className="text-2xl md:text-3xl font-light text-[#D4AF37] mb-8">
              شراكتنا تبدأ بخطة… وتستمر بنتائج.
            </div>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              نؤمن أن التحول الرقمي الحقيقي لا يقاس بعدد المنشورات أو الحملات، بل بقدرته على تحقيق نمو مستدام، وتعزيز ثقة العملاء، وتحويل الفرص إلى نتائج قابلة للقياس.
            </p>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto mt-6">
              نتطلع لأن تكون Tradex شريككم الاستراتيجي في بناء حضور رقمي يوازي جودة مشاريعكم وخبرتكم الممتدة منذ عام 1977.
            </p>
          </BlurReveal>

          <BlurReveal delay={0.4} className="pt-10">
            <button className="px-12 py-5 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              ابدأ مشروعك الآن
            </button>
          </BlurReveal>
        </div>
      </section>

      <footer className="bg-[#070707] pt-24 pb-12 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-8">
               <div className="relative w-16 h-16 bg-white/5 rounded-xl border border-white/10 p-3">
                 <Image src="/tradex.png" alt="Tradex" fill className="object-contain p-2" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Tradex</h3>
                 <p className="text-[#D4AF37] text-sm">إحدى شركات AIC Holding</p>
               </div>
            </div>
            <p className="text-gray-400 font-light leading-relaxed max-w-sm">
              شريكك الاستراتيجي للنمو الرقمي المتكامل. متخصصون في صياغة التجارب الرقمية الفاخرة للعلامات التجارية الرائدة.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-8">معلومات التواصل</h4>
            <div className="space-y-4 text-gray-400 font-light">
              <p>The Peninsula</p>
              <p>صباح السالم، الكويت</p>
              <p className="pt-4 flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ArrowUpRight className="w-4 h-4" /> الهاتف: [يحدد لاحقاً]</p>
              <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ArrowUpRight className="w-4 h-4" /> البريد: [يحدد لاحقاً]</p>
              <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ArrowUpRight className="w-4 h-4" /> إنستغرام: [يحدد لاحقاً]</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h4 className="text-[#D4AF37] font-bold mb-4">إخلاء مسؤولية مهني</h4>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              تم إعداد هذا المقترح حصرياً لصالح شركة أساس المعتمدة للمقاولات. الاستراتيجيات، التوقعات، والتوصيات الواردة تمثل آراء استشارية مهنية. أرقام النمو المتوقعة هي مستهدفات استراتيجية ولا ينبغي تفسيرها كضمانات تجارية مطلقة. هذا المستند سري وموجه حصرياً للجهة المستلمة.
            </p>
          </div>
          
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-600 font-light">
          <p>© 2026 Tradex. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</span>
            <span className="hover:text-white transition-colors cursor-pointer">الشروط والأحكام</span>
          </div>
        </div>
      </footer>

    </div>
  );
}