"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BookOpen, 
  Terminal, 
  Globe, 
  Zap,
  AlertCircle,
  ShieldAlert,
  Hash,
  Info,
  Copy
} from "lucide-react";
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="text-primary" />
            Master Manual: GBP Automator
          </h1>
          <p className="text-slate-500 mt-2">Everything you need to know to achieve 100% autonomous local SEO.</p>
        </div>

        <div className="space-y-10">
          <section id="quick-reference">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold">Your Quick Reference</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-100 bg-green-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">n8n Account ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm text-green-700 font-mono">accounts/5804573559</code>
                </CardContent>
              </Card>
              <Card className="border-green-100 bg-green-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">n8n Location ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm text-green-700 font-mono">locations/02346738413812334316</code>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="manual-ids">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold">Manual ID Cheat Sheet</h2>
            </div>
            <Card className="border-purple-100 bg-purple-50/30">
              <CardHeader>
                <CardDescription>Use these formats in n8n to bypass "Account Management" API restrictions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-purple-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Account Field</h4>
                    <code className="text-[11px] text-purple-700 font-mono">accounts/YOUR_ACCOUNT_ID</code>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Location Field</h4>
                    <code className="text-[11px] text-purple-700 font-mono">locations/YOUR_LOCATION_ID</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Documentation;