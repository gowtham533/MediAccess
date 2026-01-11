import React from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#050816] via-[#020617] to-black text-white">
      {/* Subtle Orbit Rings */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full border border-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full border border-white/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* Center Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-10 text-center"
      >
        <h1 className="text-7xl font-extrabold tracking-tight mb-4">404</h1>
        <p className="text-slate-300 mb-8 leading-relaxed">
          This page is beyond our orbit. You’ve reached empty space.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors px-6 py-3 text-sm font-medium shadow-lg"
        >
          <Home className="w-4 h-4" />
          Back to Earth
        </motion.a>
      </motion.div>
    </div>
  );
}
