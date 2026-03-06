"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { Calendar, Clock, Sparkles, Send } from "lucide-react";
import GlassCard from '@/components/landing/GlassCard';

const Scheduling = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Calendar className="text-primary" size={32} />
            <h1 className="text-4xl font-bold">Content Queue</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-sage text-obsidian font-bold hover:opacity-90 transition-opacity">
            <Sparkles size={20} /> AI Generate Posts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { date: "Oct 24, 2023", time: "10:00 AM", content: "Optimising your wealth starts with a clear plan. Our team in Sandton is ready to help you navigate the markets." },
            { date: "Oct 26, 2023", time: "02:30 PM", content: "Did you know that local businesses in Johannesburg are seeing a 30% increase in engagement through consistent GBP updates?" },
            { date: "Oct 28, 2023", time: "09:15 AM", content: "Professional financial advice tailored for the South African market. Visit our office near Nelson Mandela Square." },
          ].map((post, i) => (
            <GlassCard key={i} glowColor={i % 2 === 0 ? "sage" : "amber"}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  {post.date} at {post.time}
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Send size={14} className="text-primary" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 italic mb-8">
                "{post.content}"
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors">
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Scheduling;