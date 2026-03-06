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
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sage/20 blur-[120px]"
      />
      
      {/* Gold Orbit */}
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[100px]"
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-sage/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default MeshGradient;