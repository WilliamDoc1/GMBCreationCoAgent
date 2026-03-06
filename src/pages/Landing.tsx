"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen selection:bg-gold/30 selection:text-gold-light">
      <MeshGradient />
      <DashboardHeader />
      
      <main className="relative">
        <FloatingShards />

        {/* Hero Section: Floating Command Center */}
        <section className="relative pt-32 pb-24 px-4 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism text-gold text-xs font-bold mb-12 uppercase tracking-[0.2em]"
          >
            <Zap size={14} className="fill-gold" />
            Professional Local SEO Management for South African Businesses
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[0.9]"
          >
            Dominate Local Search <br />
            <span className="text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-sage">
              With Efficiency
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We enable you to efficiently manage reviews and schedule SEO-optimised posts to your Google Business Profile, keeping your business at the top of local search results.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
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

        {/* Bento Grid: Engineered for Growth */}
        <section className="py-32 px-4 max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Engineered for Growth
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 text-lg max-w-2xl mx-auto">
              Everything you need to outrank your local competition.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {/* Smart Outreach - Large */}
            <GlassCard className="md:col-span-8 flex flex-col justify-end">
              <div className="w-14 h-14 glass-morphism rounded-2xl flex items-center justify-center text-sage mb-8 border-sage/20">
                <MessageSquare size={28} className="stroke-sage fill-sage/10" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Smart Outreach</h3>
              <p className="text-slate-400 leading-relaxed max-w-xl">
                Easily facilitate personalised review requests via email or SMS. Our platform helps you manage follow-ups to ensure you get the feedback you deserve.
              </p>
            </GlassCard>

            {/* Weekly Scheduling - Tall */}
            <GlassCard className="md:col-span-4 md:row-span-2 flex flex-col justify-center text-center">
              <div className="w-20 h-20 glass-morphism rounded-full flex items-center justify-center text-gold mx-auto mb-12 border-gold/20">
                <Calendar size={36} className="stroke-gold fill-gold/10" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Weekly Scheduling</h3>
              <p className="text-slate-400 leading-relaxed">
                Keep your profile active with scheduled posts that reference local landmarks and neighbourhoods, boosting your relevance in local searches.
              </p>
            </GlassCard>

            {/* Secure Isolation - Small */}
            <GlassCard className="md:col-span-4 flex flex-col justify-center">
              <div className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center text-sage mb-6 border-sage/20">
                <ShieldCheck size={24} className="stroke-sage fill-sage/10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure Isolation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your business data is protected by enterprise-grade Row Level Security.
              </p>
            </GlassCard>

            {/* SEO Insights - Small */}
            <GlassCard className="md:col-span-4 flex flex-col justify-center">
              <div className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center text-gold mb-6 border-gold/20">
                <TrendingUp size={24} className="stroke-gold fill-gold/10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">SEO Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-driven suggestions to rank higher on Google search results.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-32 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex-1 space-y-10"
            >
              <h2 className="text-5xl font-bold text-white leading-[1.1]">Optimise Your Local Presence With Ease</h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Google rewards active, highly-rated profiles. By consistently scheduling posts and receiving fresh reviews, your business climbs the "Local Pack" rankings.
              </p>
              <div className="space-y-6">
                {[
                  "Increase your average star rating with smart tools",
                  "Rank higher for \"near me\" searches in your area",
                  "Convert more profile views into phone calls and visits"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 font-semibold text-lg">
                    <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center border border-sage/30">
                      <CheckCircle2 size={14} className="text-sage-light" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex-1 w-full"
            >
              <GlassCard className="p-12 bg-obsidian/40 border-white/5">
                <div className="space-y-8">
                  <div className="p-6 glass-morphism rounded-2xl border-blue-500/20">
                    <p className="text-xs font-mono text-blue-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      SYSTEM_STATUS: READY
                    </p>
                    <p className="text-slate-200 font-medium">Assisting with weekly SEO content for Precision Wealth...</p>
                  </div>
                  <div className="p-6 glass-morphism rounded-2xl border-green-500/20">
                    <p className="text-xs font-mono text-green-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      OUTREACH_LOG: READY
                    </p>
                    <p className="text-slate-200 font-medium">Review request prepared for 12 new customers via email.</p>
                  </div>
                  <div className="p-6 glass-morphism rounded-2xl border-purple-500/20">
                    <p className="text-xs font-mono text-purple-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                      SEO_INSIGHT: OPTIMAL
                    </p>
                    <p className="text-slate-200 font-medium">Local keyword density increased by 24% this month.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Google Integration Section */}
        <section className="py-32 px-4 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-3 text-gold font-bold text-2xl">
              <Globe size={32} />
              Verified Google Business Integration
            </div>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              GMB Creation Co integrates directly with the Google Business Profile API and Gmail API to provide a seamless management experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <GlassCard className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 glass-morphism rounded-2xl text-gold border-gold/20"><Globe size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Profile Management</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">We use the <code>business.manage</code> scope to help you schedule weekly posts and track review status directly on your profile.</p>
              </GlassCard>
              <GlassCard className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 glass-morphism rounded-2xl text-sage border-sage/20"><Mail size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Smart Outreach</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">We use the <code>gmail.send</code> scope to facilitate review requests from your own business email, ensuring high trust and conversion.</p>
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