"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Rocket, 
  Zap, 
  Users, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  Info,
  Terminal,
  Globe
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
          {/* Local Environment Setup */}
          <section id="local-setup">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold">Local Environment Setup</h2>
            </div>
            <Card className="border-purple-100 bg-purple-50/30">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  To enable the AI to post to Google, you must run n8n and ngrok on your local machine.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <Globe size={14} /> 1. Start ngrok (Terminal 1)
                    </h4>
                    <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono">
                      ngrok http 5678
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <Zap size={14} /> 2. Start n8n (Terminal 2)
                    </h4>
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-medium">Mac / Linux:</p>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono">
                        export N8N_PROXY_HOPS=1 && n8n start
                      </pre>
                      <p className="text-[10px] text-slate-500 font-medium">Windows (PowerShell):</p>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono">
                        $env:N8N_PROXY_HOPS=1; n8n start
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Getting Started */}
          <section id="getting-started">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Getting Started</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  To begin, you must connect your Google Business Profile. This allows the agent to post updates and respond to reviews on your behalf.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-2">OAuth Flow:</h4>
                  <ol className="list-decimal list-inside text-xs text-blue-800 space-y-2">
                    <li>Navigate to <strong>Settings</strong>.</li>
                    <li>Click <strong>Connect Google Account</strong>.</li>
                    <li>Select the specific location/business you wish to automate.</li>
                    <li>Grant permissions for 'Manage Business Profile' and 'See Reviews'.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* The Content Engine */}
          <section id="content-engine">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold">The Content Engine</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  The agent uses Gemini AI to generate posts. For the best results, you must define your business identity clearly.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Tone of Voice</h4>
                    <p className="text-xs text-slate-600">Set this in Settings. Examples: "Professional & Authoritative" or "Friendly & Local".</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Industry Keywords</h4>
                    <p className="text-xs text-slate-600">The agent automatically injects these into posts to boost your local search ranking.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Review Automation */}
          <section id="review-automation">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold">Review Automation</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reviews are the #1 ranking factor for local SEO. The agent automates the entire request-and-reply lifecycle.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold">Bulk Upload:</span> Use the CSV uploader in the Customers tab to add hundreds of clients at once.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold">Smart Delay:</span> The agent waits 24 hours after a service is completed before sending the SMS request.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* The Golden Rules */}
          <section id="golden-rules">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-red-500" size={24} />
              <h2 className="text-xl font-semibold">The 'Golden Rules'</h2>
            </div>
            <Card className="border-red-100 bg-red-50/30">
              <CardHeader>
                <CardTitle className="text-sm text-red-900">Compliance & Safety</CardTitle>
                <CardDescription className="text-red-700">Follow these to avoid profile suspension by Google.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-100">
                  <Info size={16} className="text-red-500 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block mb-1">No Keyword Stuffing</span>
                    Don't force keywords into your business name. The agent handles SEO naturally within post content.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-100">
                  <Info size={16} className="text-red-500 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block mb-1">Real Business Names Only</span>
                    Ensure your business name matches your physical signage and legal documents.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-100">
                  <Info size={16} className="text-red-500 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block mb-1">Accurate Categories</span>
                    Choose the most specific primary category for your industry.
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