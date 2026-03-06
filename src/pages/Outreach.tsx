"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { Zap, Mail, MessageSquare, Plus } from "lucide-react";
import GlassCard from '@/components/landing/GlassCard';

const Outreach = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Zap className="text-primary" size={32} />
            <h1 className="text-4xl font-bold">Smart Outreach</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
            <Plus size={20} /> New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2" glowColor="sage">
            <h2 className="text-xl font-bold mb-6">Active Campaigns</h2>
            <div className="space-y-4">
              {[
                { name: "Post-Service Email", type: "Email", status: "Active", sent: 45 },
                { name: "SMS Follow-up", type: "SMS", status: "Paused", sent: 12 },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {campaign.type === "Email" ? <Mail size={20} className="text-primary" /> : <MessageSquare size={20} className="text-primary" />}
                    </div>
                    <div>
                      <p className="font-bold">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.sent} requests sent this month</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${campaign.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glowColor="amber">
            <h2 className="text-xl font-bold mb-6">Outreach Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Email Open Rate</span>
                  <span className="font-bold">68%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Review Conversion</span>
                  <span className="font-bold">24%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold w-[24%]" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Outreach;