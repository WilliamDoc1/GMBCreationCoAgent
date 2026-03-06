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
  AlertTriangle,
  Video
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
            Google Verification Checklist
          </h1>
          <p className="text-slate-500 mt-2">Follow these steps to pass the Google Cloud OAuth verification process.</p>
        </div>

        <div className="space-y-10">
          <section id="legal-compliance">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold">Legal & Transparency</h2>
            </div>
            <Card className="border-green-100 bg-green-50/20 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-700">Your legal documents have been updated to meet Google's strict requirements:</p>
                <ul className="list-disc ml-6 space-y-2 text-sm text-slate-600">
                  <li><strong>Privacy Policy:</strong> Now explicitly lists all OAuth scopes and sub-processor purposes.</li>
                  <li><strong>Terms of Service:</strong> Includes the mandatory 30-day data retention clause and end-client authorization mandate.</li>
                  <li><strong>In-Product Disclosure:</strong> A prominent data access notice has been added to the Business Profile settings page.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="demo-video">
            <div className="flex items-center gap-2 mb-4">
              <Video className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Mandatory Demo Video</h2>
            </div>
            <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-700">Google requires a video showing the end-to-end OAuth flow. Ensure your video includes:</p>
                <ul className="list-decimal ml-6 space-y-2 text-sm text-slate-600">
                  <li>The app's homepage and the navigation to the "Business Profile" settings.</li>
                  <li>The "Prominent Disclosure" text appearing before the connect button.</li>
                  <li>The full OAuth consent screen (ensure the URL bar is visible and shows your Client ID).</li>
                  <li>The successful redirection back to the dashboard and the "Connected" status.</li>
                </ul>
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
              </ul >
            </CardContent>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;