"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, Zap, ShieldCheck, Star, ArrowRight, MessageSquare, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/components/AuthProvider';

const Landing = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      
      {/* Hero Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-8 uppercase tracking-wider">
          <Zap size={14} />
          Streamlined Local SEO for South African Businesses
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
          Dominate Local Search <br />
          <span className="text-primary">With Efficiency</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          We enable you to efficiently collect reviews and schedule SEO optimised posts to your Google Business Profile, keeping your business at the top of local search results.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link to="/dashboard">
              <Button size="lg" className="px-10 h-16 text-lg gap-2 shadow-lg shadow-primary/20">
                Go to Dashboard <ArrowRight size={20} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="lg" className="px-10 h-16 text-lg gap-2 shadow-lg shadow-primary/20">
                  Get Started Now <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-10 h-16 text-lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900">Engineered for Growth</h2>
            <p className="text-slate-500 mt-4 text-lg">Everything you need to outrank your local competition.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Outreach</h3>
              <p className="text-slate-600 leading-relaxed">
                Easily send personalised review requests via email or SMS. Our platform helps you manage follow-ups to ensure you get the feedback you deserve.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                <Calendar size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Weekly Scheduling</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep your profile active with AI-assisted posts that reference local landmarks and neighbourhoods, boosting your relevance in local searches.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-8">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Isolation</h3>
              <p className="text-slate-600 leading-relaxed">
                Your business data is protected by enterprise-grade Row Level Security. Your business context is isolated and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">Optimise Your Local Presence With Ease</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Google rewards active, highly-rated profiles. By consistently scheduling posts and receiving fresh reviews, your business climbs the "Local Pack" rankings, putting you in front of more customers exactly when they need you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 size={20} className="text-green-500" /> 
                Increase your average star rating with smart tools
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 size={20} className="text-green-500" /> 
                Rank higher for "near me" searches in your area
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 size={20} className="text-green-500" /> 
                Convert more profile views into phone calls and visits
              </div>
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="space-y-6 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-mono text-blue-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  SYSTEM_STATUS: READY
                </p>
                <p className="text-slate-200">Assisting with weekly SEO content for Precision Wealth...</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-mono text-green-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  OUTREACH_LOG: READY
                </p>
                <p className="text-slate-200">Review request prepared for 12 new customers via email.</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-mono text-purple-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  SEO_INSIGHT: OPTIMAL
                </p>
                <p className="text-slate-200">Local keyword density increased by 24% this month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;