import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4">
      <h2 className="text-6xl font-bold text-[#D4AF37] mb-4">404</h2>
      <p className="text-xl mb-8">عفواً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link href="/" className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-white transition-colors">
        العودة للصفحة الرئيسية
      </Link>
    </div>
  )
}