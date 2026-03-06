"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Globe, 
  Mail,
  TrendingUp
} from "lucide-react";
import Footer from "@/components/Footer";
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/components/AuthProvider';
import MeshGradient from '@/components/landing/MeshGradient';
import GlassCard from '@/components/landing/GlassCard';
import MagneticButton from '@/components/landing/MagneticButton';
import FloatingShards from '@/components/landing/FloatingShards';
import { motion } from 'framer-motion';

const Landing = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20
      } 
    }
  };

  return (
    <div className="min-h-screen selection:bg-gold/30 selection:text-gold-light">
      <MeshGradient />
      <DashboardHeader />
      
      {/* SVG Gradient Definition for Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="sage-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5D4E" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>

      <main className="relative">
        <FloatingShards />

        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-4 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-morphism text-gold text-xs font-bold mb-14 uppercase tracking-[0.25em]"
          >
            <Zap size={14} className="fill-gold" />
            Professional Local SEO Management for South African Businesses
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="text-7xl md:text-9xl font-extrabold text-white mb-10 tracking-tighter leading-[0.85]"
          >
            Dominate Local Search <br />
            <span className="text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-sage">
              With Efficiency
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-2xl text-slate-400 mb-20 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            We enable you to efficiently manage reviews and schedule SEO-optimised posts to your Google Business Profile, keeping your business at the top of local search results.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {session ? (
              <MagneticButton onClick={() => navigate('/dashboard')}>
                Go to Dashboard <ArrowRight size={20} />
              </MagneticButton>
            ) : (
              <>
                <MagneticButton onClick={() => navigate('/register')}>
                  Get Started Now <ArrowRight size={20} />
                </MagneticButton>
                <MagneticButton variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </MagneticButton>
              </>
            )}
          </motion.div>
        </section>

        {/* Bento Grid Section */}
        <section className="py-40 px-4 max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-32"
          >
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Engineered for Growth
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 text-xl max-w-3xl mx-auto">
              Everything you need to outrank your local competition.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[350px]">
            {/* Smart Outreach - Large (2/3 width) */}
            <GlassCard className="md:col-span-8 flex flex-col justify-end" glowColor="sage">
              <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center mb-10">
                <MessageSquare size={32} className="icon-gradient" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-5">Smart Outreach</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                Easily facilitate personalised review requests via email or SMS. Our platform helps you manage follow-ups to ensure you get the feedback you deserve.
              </p>
            </GlassCard>

            {/* Weekly Scheduling - Tall (1/3 width, 2 rows) */}
            <GlassCard className="md:col-span-4 md:row-span-2 flex flex-col justify-center text-center" glowColor="amber">
              <div className="w-24 h-24 glass-morphism rounded-full flex items-center justify-center mx-auto mb-14">
                <Calendar size={44} className="icon-gradient" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-8">Weekly Scheduling</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Keep your profile active with scheduled posts that reference local landmarks and neighbourhoods, boosting your relevance in local searches.
              </p>
            </GlassCard>

            {/* Secure Isolation - Small (1/3 width) */}
            <GlassCard className="md:col-span-4 flex flex-col justify-center" glowColor="sage">
              <div className="w-14 h-14 glass-morphism rounded-xl flex items-center justify-center mb-8">
                <ShieldCheck size={28} className="icon-gradient" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure Isolation</h3>
              <p className="text-slate-400 leading-relaxed">
                Your business data is protected by enterprise-grade Row Level Security.
              </p>
            </GlassCard>

            {/* SEO Insights - Small (1/3 width) */}
            <GlassCard className="md:col-span-4 flex flex-col justify-center" glowColor="amber">
              <div className="w-14 h-14 glass-morphism rounded-xl flex items-center justify-center mb-8">
                <TrendingUp size={28} className="icon-gradient" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">SEO Insights</h3>
              <p className="text-slate-400 leading-relaxed">
                AI-driven suggestions to rank higher on Google search results.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-40 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, type: "spring" }}
              className="flex-1 space-y-12"
            >
              <h2 className="text-6xl font-bold text-white leading-[1.05] tracking-tight">Optimise Your Local Presence With Ease</h2>
              <p className="text-2xl text-slate-400 leading-relaxed">
                Google rewards active, highly-rated profiles. By consistently scheduling posts and receiving fresh reviews, your business climbs the "Local Pack" rankings.
              </p>
              <div className="space-y-8">
                {[
                  "Increase your average star rating with smart tools",
                  "Rank higher for \"near me\" searches in your area",
                  "Convert more profile views into phone calls and visits"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-5 text-slate-300 font-semibold text-xl">
                    <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center border border-sage/30">
                      <CheckCircle2 size={16} className="text-sage-light" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, type: "spring" }}
              className="flex-1 w-full"
            >
              <GlassCard className="p-14 bg-obsidian/60 border-white/5" glowColor="amber">
                <div className="space-y-10">
                  <div className="p-8 glass-morphism rounded-3xl border-blue-500/20">
                    <p className="text-sm font-mono text-blue-400 mb-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                      SYSTEM_STATUS: READY
                    </p>
                    <p className="text-xl text-slate-200 font-medium">Assisting with weekly SEO content for Precision Wealth...</p>
                  </div>
                  <div className="p-8 glass-morphism rounded-3xl border-green-500/20">
                    <p className="text-sm font-mono text-green-400 mb-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                      OUTREACH_LOG: READY
                    </p>
                    <p className="text-xl text-slate-200 font-medium">Review request prepared for 12 new customers via email.</p>
                  </div>
                  <div className="p-8 glass-morphism rounded-3xl border-purple-500/20">
                    <p className="text-sm font-mono text-purple-400 mb-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></span>
                      SEO_INSIGHT: OPTIMAL
                    </p>
                    <p className="text-xl text-slate-200 font-medium">Local keyword density increased by 24% this month.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Google Integration Section */}
        <section className="py-40 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="space-y-16"
          >
            <div className="inline-flex items-center gap-4 text-gold font-bold text-3xl">
              <Globe size={40} className="icon-gradient" />
              Verified Google Business Integration
            </div>
            <p className="text-slate-400 text-2xl max-w-3xl mx-auto leading-relaxed">
              GMB Creation Co integrates directly with the Google Business Profile API and Gmail API to provide a seamless management experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
              <GlassCard className="p-12" glowColor="sage">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 glass-morphism rounded-2xl"><Globe size={28} className="icon-gradient" /></div>
                  <h3 className="text-2xl font-bold text-white">Profile Management</h3>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed">We use the <code>business.manage</code> scope to help you schedule weekly posts and track review status directly on your profile.</p>
              </GlassCard>
              <GlassCard className="p-12" glowColor="amber">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 glass-morphism rounded-2xl"><Mail size={28} className="icon-gradient" /></div>
                  <h3 className="text-2xl font-bold text-white">Smart Outreach</h3>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed">We use the <code>gmail.send</code> scope to facilitate review requests from your own business email, ensuring high trust and conversion.</p>
              </GlassCard>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;