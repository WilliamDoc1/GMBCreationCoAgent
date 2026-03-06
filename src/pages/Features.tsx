"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import MeshGradient from '@/components/landing/MeshGradient';
import GlassCard from '@/components/landing/GlassCard';
import FloatingShards from '@/components/landing/FloatingShards';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, TrendingUp, Image as ImageIcon, Zap } from 'lucide-react';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <MeshGradient />
      <DashboardHeader />
      
      <main className="relative pt-32 pb-20 px-4">
        <FloatingShards />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Powerful Features for <br />
              <span className="text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-sage">
                Local Dominance
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to automate your Google Business Profile and outrank the competition.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[350px]"
          >
            {/* Pillar 1: Google Post Automation */}
            <GlassCard className="md:col-span-8 flex flex-col justify-end" glowColor="sage">
              <div className="w-14 h-14 glass-morphism rounded-2xl flex items-center justify-center mb-8">
                <Calendar size={28} className="text-gold" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Google Post Automation</h3>
              <p className="text-slate-400 text-base leading-relaxed max-w-xl">
                3x Weekly SEO-optimized updates to keep your profile "Fresh" in Google's eyes. We handle the content, keywords, and scheduling so you stay relevant.
              </p>
            </GlassCard>

            {/* Pillar 2: Smart Review Management */}
            <GlassCard className="md:col-span-4 flex flex-col justify-center text-center" glowColor="amber">
              <div className="w-16 h-16 glass-morphism rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageSquare size={32} className="text-sage" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Review Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated review solicitation via professional SMS/Email with AI-drafted responses to boost your rating.
              </p>
            </GlassCard>

            {/* Pillar 3: Local SEO Insights */}
            <GlassCard className="md:col-span-5 flex flex-col justify-center" glowColor="amber">
              <div className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Local SEO Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monthly performance reports tracking "Near Me" search rankings and call volume. Know exactly where you stand.
              </p>
            </GlassCard>

            {/* Pillar 4: Photo & Logo Optimization */}
            <GlassCard className="md:col-span-7 flex flex-col justify-end" glowColor="sage">
              <div className="w-14 h-14 glass-morphism rounded-2xl flex items-center justify-center mb-8">
                <ImageIcon size={28} className="text-sage" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Photo & Logo Optimization</h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Metadata-rich image uploads to boost visual engagement and trust. We ensure your photos are geotagged and optimized for search.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;