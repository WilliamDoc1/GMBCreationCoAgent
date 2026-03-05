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
  Lock,
  CheckSquare,
  EyeOff,
  Mail
} from "lucide-react";
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from '@/utils/toast';

const Documentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  const n8nJson = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "email-outreach",
        "responseMode": "lastNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1
    },
    {
      "parameters": {
        "resource": "message",
        "to": "={{ $json.to }}",
        "subject": "={{ $json.subject }}",
        "text": "={{ $json.body }}"
      },
      "name": "Gmail",
      "type": "n8n-nodes-base.googleGmail",
      "typeVersion": 2
    },
    {
      "parameters": {},
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1
    }
  ]
}`;

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
          <section id="email-outreach">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Email Outreach Workflow</h2>
            </div>
            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-sm">n8n Setup (Copy & Paste)</CardTitle>
                <CardDescription>Create a new workflow in n8n and paste this JSON.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-[10px] overflow-x-auto max-h-[200px]">
                    {n8nJson}
                  </pre>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2 h-7 text-[10px]"
                    onClick={() => copyToClipboard(n8nJson)}
                  >
                    <Copy size={12} className="mr-1" /> Copy JSON
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Configuration:</p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc ml-4">
                    <li><strong>Webhook Path:</strong> <code>email-outreach</code></li>
                    <li><strong>HTTP Method:</strong> <code>POST</code></li>
                    <li><strong>Email Provider:</strong> Swap the Gmail node for Resend or Outlook if needed.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="hidden-api">
            <div className="flex items-center gap-2 mb-4">
              <EyeOff className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold">The "Hidden" API Problem</h2>
            </div>
            <Card className="border-purple-100 bg-purple-50/30">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-700">
                  The Google Business Profile API is <strong>restricted</strong>. If you can't find it in the library, you must request access first.
                </p>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Action Required:</h4>
                  <ol className="text-sm text-slate-700 space-y-2 list-decimal ml-4">
                    <li>Fill out the <a href="https://developers.google.com/my-business/content/basic-setup#request-access" target="_blank" className="text-blue-600 underline">API Request Form</a>.</li>
                    <li>Use Project ID: <code>934519389904</code>.</li>
                  </ol>
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