"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MeshGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      {/* Sage Orbit - Increased opacity */}
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
        className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] rounded-full bg-sage/25 blur-[120px]"
      />
      
      {/* Amber Orbit - Increased opacity */}
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
        className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-amber-glow/15 blur-[100px]"
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-sage/10 blur-[140px] rounded-full" />
    </div>
  );
};

export default MeshGradient;