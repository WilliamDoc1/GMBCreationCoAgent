"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { User, Settings, Shield, Bell } from "lucide-react";
import GlassCard from '@/components/landing/GlassCard';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <User className="text-primary" size={32} />
          <h1 className="text-4xl font-bold">Business Profile</h1>
        </div>

        <div className="space-y-8">
          <GlassCard glowColor="sage">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings size={20} /> General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors" placeholder="Precision Wealth" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Industry</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors" placeholder="Financial Services" />
              </div>
            </div>
          </GlassCard>

          <GlassCard glowColor="amber">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield size={20} /> Security
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Manage your account security and connected Google services.</p>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">
              Update Password
            </button>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;