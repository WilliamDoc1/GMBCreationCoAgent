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
  Info
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
                    <p className="text-[10px] text-slate-500 mt-2">Found in: Business Profile Settings {">"} Advanced Settings</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Location Field</h4>
                    <code className="text-[11px] text-purple-700 font-mono">locations/YOUR_LOCATION_ID</code>
                    <p className="text-[10px] text-slate-500 mt-2">Found in: Business Profile Settings {">"} Advanced Settings (Business Profile ID)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-blue-800">
                    <strong>Note:</strong> If you have the "Google Business Profile Management API" enabled, manual entry will work even while awaiting Agency approval for the Account Management API.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="api-quota-fix">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold">Fixing '429 Quota Exceeded'</h2>
            </div>
            <Card className="border-amber-100 bg-amber-50/30">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold">Required APIs (Enable all 3):</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    <li>Google Business Profile Management API</li>
                    <li>My Business Account Management API</li>
                    <li>My Business Business Information API</li>
                  </ul>
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