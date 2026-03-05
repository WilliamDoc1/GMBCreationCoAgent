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
  Mail,
  ShieldCheck
} from "lucide-react";
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from '@/utils/toast';

const Documentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  const currentUrl = window.location.origin;

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
          <section id="google-verification">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold">Google OAuth Verification</h2>
            </div>
            <Card className="border-green-100 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-sm">Branding Information</CardTitle>
                <CardDescription>Copy these values into your Google Cloud Console "OAuth Consent Screen" tab.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Application Home Page</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs flex-1">{currentUrl}/</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${currentUrl}/`)}><Copy size={12} /></Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Privacy Policy Link</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs flex-1">{currentUrl}/privacy</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${currentUrl}/privacy`)}><Copy size={12} /></Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Terms of Service Link</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs flex-1">{currentUrl}/terms</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${currentUrl}/terms`)}><Copy size={12} /></Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Authorized Domain</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs flex-1">{window.location.hostname}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(window.location.hostname)}><Copy size={12} /></Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-green-100">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2">
                    <Info size={14} /> Pro Tip for Verification
                  </h4>
                  <p className="text-xs text-slate-600">
                    Google requires these links to be on the <strong>same domain</strong> as your application. By using the links above, you satisfy their "Branding" requirements immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ... rest of existing documentation */}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Documentation;