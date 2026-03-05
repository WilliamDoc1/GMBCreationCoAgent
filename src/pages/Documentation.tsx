"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BookOpen, 
  Terminal, 
  Globe, 
  Zap,
  AlertCircle 
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
                  <CardDescription>Keep this running to maintain the tunnel.</CardDescription>
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
                  <CardDescription>Start n8n with the webhook URL.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-green-400 p-3 rounded text-[10px] font-mono break-all whitespace-pre-wrap">
                    export WEBHOOK_URL=https://advantageous-goatishly-tanya.ngrok-free.dev && n8n start
                  </pre>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="troubleshooting">
            <Card className="border-amber-100 bg-amber-50/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                  <div className="text-xs text-amber-800 space-y-2">
                    <p><strong>Seeing ERR_NGROK_3200?</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure Terminal 1 (ngrok) is active and showing "online".</li>
                      <li>Ensure you are using port <strong>5678</strong> in the ngrok command.</li>
                      <li>Check that your Google Cloud Console has the correct Redirect URI: <code>https://advantageous-goatishly-tanya.ngrok-free.dev/rest/oauth2-credential/callback</code></li>
                    </ul>
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