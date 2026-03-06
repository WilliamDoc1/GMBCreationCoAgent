"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { LayoutDashboard, Users, Calendar, Zap, TrendingUp } from "lucide-react";
import GlassCard from '@/components/landing/GlassCard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard className="text-primary" size={32} />
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Reviews", value: "128", icon: Users, color: "sage" },
            { label: "Scheduled Posts", value: "12", icon: Calendar, color: "amber" },
            { label: "Active Campaigns", value: "4", icon: Zap, color: "sage" },
            { label: "SEO Score", value: "92/100", icon: TrendingUp, color: "amber" },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-6" glowColor={stat.color as 'sage' | 'amber'}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className="text-muted-foreground" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2" glowColor="sage">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New review request sent to John Doe</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard glowColor="amber">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                Create New Post
              </button>
              <button className="w-full p-4 rounded-xl glass-morphism font-bold hover:bg-white/10 transition-colors">
                Import Customers
              </button>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;