"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FloatingShards = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
      <motion.div
        style={{ y: y1, rotate: r1 }}
        className="absolute top-[20%] left-[10%] w-32 h-32 glass-morphism rounded-xl opacity-20 rotate-12"
      />
      <motion.div
        style={{ y: y2, rotate: r2 }}
        className="absolute top-[60%] right-[15%] w-48 h-48 glass-morphism rounded-full opacity-10 -rotate-45"
      />
      <motion.div
        style={{ y: y1, rotate: r2 }}
        className="absolute bottom-[10%] left-[20%] w-24 h-24 glass-morphism rounded-tr-[3rem] opacity-15 rotate-90"
      />
    </div>
  );
};

export default FloatingShards;