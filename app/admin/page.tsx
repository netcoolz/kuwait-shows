"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

const gold = "#bc9b6a";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#050B18", color: "#f4f4f4" }}
    >
      {/* Background glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-10"
        style={{ background: gold }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div
            className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center border"
            style={{
              borderColor: `${gold}55`,
              background: `${gold}12`,
            }}
          >
            <Lock size={28} style={{ color: gold }} />
          </div>

          <h1 className="text-3xl font-black mb-3">
            لوحة التحكم
          </h1>

          <p className="text-gray-400 text-sm">
            Kuwait Shows Administration
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl"
        >
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pr-12 pl-4 text-white outline-none transition focus:border-[#bc9b6a]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pr-12 pl-4 text-white outline-none transition focus:border-[#bc9b6a]"
              />
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-4 font-bold flex items-center justify-center gap-3 transition hover:scale-[1.01] disabled:opacity-50"
            style={{
              background: gold,
              color: "#050B18",
            }}
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول لوحة التحكم"}

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Kuwait Shows © 2026
        </p>
      </motion.div>
    </main>
  );
}