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
  Clock
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
          <section id="api-quota-fix">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold">Fixing '429 Quota Exceeded'</h2>
            </div>
            <Card className="border-amber-100 bg-amber-50/30">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                  <Clock className="text-amber-600 shrink-0 mt-1" size={18} />
                  <div className="text-xs text-slate-700">
                    <strong>Wait 2 Minutes:</strong> Google resets "Requests per minute" every 60 seconds. Stop clicking the dropdown to let the quota clear.
                  </div>
                </div>
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

          <section id="terminal-setup">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Side-by-Side Terminal Setup</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    Terminal 1: ngrok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-green-400 p-3 rounded text-[10px] font-mono break-all whitespace-pre-wrap">
                    ngrok http 5678 --domain=advantageous-goatishly-tanya.ngrok-free.dev
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-purple-50/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap size={16} className="text-purple-600" />
                    Terminal 2: n8n
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-green-400 p-3 rounded text-[10px] font-mono break-all whitespace-pre-wrap">
                    export WEBHOOK_URL=https://advantageous-goatishly-tanya.ngrok-free.dev && n8n start
                  </pre>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Documentation;