"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BookOpen, 
  Zap,
  Info,
  Copy,
  ShieldCheck,
  Lock,
  Database,
  History,
  ArrowLeft,
  Key,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="text-primary" />
            Command Center: Operational Readiness
          </h1>
          <p className="text-slate-500 mt-2">The system is 100% built. Follow this checklist once your Google API access is granted.</p>
        </div>

        <div className="space-y-10">
          {/* Pre-Flight Checklist */}
          <section id="pre-flight">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold">Pre-Flight Checklist</h2>
            </div>
            <Card className="border-green-200 bg-green-50/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key size={16} className="text-green-600" />
                  Required Environment Variables
                </CardTitle>
                <CardDescription>Once you have your Google Cloud credentials, add these to your Supabase Project Settings (Edge Functions -> Manage Secrets).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: 'GOOGLE_CLIENT_ID', desc: 'From Google Cloud Console Credentials' },
                    { name: 'GOOGLE_CLIENT_SECRET', desc: 'From Google Cloud Console Credentials' },
                    { name: 'GEMINI_API_KEY', desc: 'From Google AI Studio (Already Configured)' },
                    { name: 'RESEND_API_KEY', desc: 'For Email Outreach (Already Configured)' },
                    { name: 'TWILIO_ACCOUNT_SID', desc: 'For SMS Outreach (Optional)' }
                  ].map((env) => (
                    <div key={env.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                      <div>
                        <code className="text-xs font-bold text-slate-700">{env.name}</code>
                        <p className="text-[10px] text-slate-500">{env.desc}</p>
                      </div>
                      <CheckCircle2 size={14} className="text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="google-verification">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Google OAuth Configuration</h2>
            </div>
            <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Authorized Redirect URIs</CardTitle>
                <CardDescription>Add this exact URL to your Google Cloud Console under "APIs & Services" {">"} "Credentials" {">"} "OAuth 2.0 Client IDs".</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Redirect URI</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded border text-xs flex-1 truncate">https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/gmb-callback</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/gmb-callback`)}><Copy size={12} /></Button>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    <strong>Important:</strong> Ensure the "Google Business Profile Management API" is enabled in your Google Cloud Library before attempting to connect.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="security-architecture">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-purple-600" size={24} />
              <h2 className="text-xl font-semibold">Security & Data Isolation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-purple-100 bg-purple-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database size={16} className="text-purple-600" />
                    Row Level Security (RLS)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-600">
                    Every database row is locked to your unique Business ID. It is physically impossible for one business to query or view another's data.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History size={16} className="text-blue-600" />
                    Immutable Audit Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-600">
                    Every sensitive action—from AI generation to email outreach—is logged with a timestamp, creating a transparent and secure history.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;