"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, Zap, ShieldCheck, Star, ArrowRight, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import DashboardHeader from '@/components/DashboardHeader';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6 uppercase tracking-wider">
          <Zap size={14} />
          Autonomous Local SEO for South African Businesses
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Automate Your Google <br />
          <span className="text-primary">Business Reviews & Posts</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The Outreach Agent helps you collect 5-star reviews and publishes 3x weekly SEO-optimised posts to your Google Business Profile—completely on autopilot.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="px-8 h-14 text-lg gap-2">
              Register Now <ArrowRight size={20} />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Built for Growth</h2>
            <p className="text-slate-500 mt-2">Everything you need to dominate local search results.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Outreach</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically send personalised review requests via email or SMS. Our AI handles the follow-ups so you don't have to.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">3x Weekly Posting</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Keep your profile fresh with AI-generated posts that reference local landmarks and neighbourhoods to boost SEO.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Isolation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your data is protected by enterprise-grade Row Level Security. Your business context is yours and yours alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Optimise Your Local Presence</h2>
            <p className="text-slate-600 leading-relaxed">
              Google rewards active profiles. By consistently posting and receiving fresh reviews, your business climbs the "Local Pack" rankings, putting you in front of more customers in your area.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Star size={16} className="text-yellow-500 fill-yellow-500" /> 
                Increase your average star rating
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <TrendingUp size={16} className="text-blue-500" /> 
                Rank higher for "near me" searches
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Users size={16} className="text-green-500" /> 
                Convert more profile views into calls
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <p className="text-xs font-mono text-blue-400 mb-1">{">"} AGENT_STATUS: ACTIVE</p>
                <p className="text-sm">Generating weekly SEO content for Precision Wealth...</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <p className="text-xs font-mono text-green-400 mb-1">{">"} OUTREACH_LOG: SENT</p>
                <p className="text-sm">Review request delivered to 12 new customers.</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <p className="text-xs font-mono text-purple-400 mb-1">{">"} SEO_INSIGHT: OPTIMAL</p>
                <p className="text-sm">Local keyword density increased by 24% this month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Landing;