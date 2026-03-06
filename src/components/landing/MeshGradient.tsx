"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MeshGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      {/* Sage Orbit */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-sage/20 blur-[140px]"
      />
      
      {/* Amber Orbit */}
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-glow/10 blur-[120px]"
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-sage/5 blur-[160px] rounded-full" />
    </div>
  );
};

export default MeshGradient;