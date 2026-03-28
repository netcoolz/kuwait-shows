import "./globals.css";
import Sidebar from "./sidebar";
import { Inter, Cairo } from "next/font/google";
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";


const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata = {
  title: {
    default: "Kuwait Shows",
    template: "%s | Kuwait Shows",
  },
  description: "Arabian Horse Championships & VIP Events | بطولات الخيل العربية والفعاليات",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cairo.className} bg-black text-white`}>

        <Sidebar />

        <main className="w-full md:mr-[190px] relative z-0">

  <AnimatePresence mode="wait">
    <PageTransition key={Math.random()}>
      {children}
    </PageTransition>
  </AnimatePresence>

</main>

      </body>
    </html>
  );
}