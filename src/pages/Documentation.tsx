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
  Copy,
  Lock
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

          <section id="troubleshooting">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-red-500" size={24} />
              <h2 className="text-xl font-semibold">Fixing "403 Forbidden"</h2>
            </div>
            <Card className="border-red-100 bg-red-50/30">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <p className="text-sm text-slate-700"><strong>Try "accounts/primary":</strong> If your specific Account ID fails, use <code>accounts/primary</code> in the Account field. This uses the main account of the logged-in user.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <p className="text-sm text-slate-700"><strong>Check OAuth Scopes:</strong> Reconnect your Google credentials in n8n and ensure the "Manage your business listings" checkbox is ticked.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <p className="text-sm text-slate-700"><strong>Verify Location ID:</strong> Ensure the Location ID is exactly <code>locations/02346738413812334316</code> (no extra spaces).</p>
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