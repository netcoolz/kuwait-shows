"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);

    const audio = new Audio("/intro.mp3");
    audio.volume = 0.5;

    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("scroll", startAudio);
    };

    window.addEventListener("touchstart", startAudio);
    window.addEventListener("scroll", startAudio);

    return () => clearTimeout(timer);
  }, []);

  const positions = [
    { x: -400, y: -300 },
    { x: 400, y: -300 },
    { x: -500, y: 200 },
    { x: 500, y: 200 },
    { x: -300, y: 400 },
    { x: 300, y: 400 },
    { x: -600, y: 0 },
    { x: 600, y: 0 },
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      
      {/* ✨ الحذوات */}
      {positions.map((pos, i) => (
        <motion.img
          key={i}
          src="/horseshoe.png"
          className="absolute w-10"
          initial={{
            x: pos.x,
            y: pos.y,
            opacity: 0,
            scale: 0.3,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 🐎 اللوقو */}
      <motion.img
        src="/logo.png"
        className="w-40 z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.6,
        }}
      />
    </div>
  );
}