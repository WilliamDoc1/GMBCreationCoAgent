"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, Database, ShieldAlert, Globe, Trash2, ArrowLeft, Key, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <DashboardHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          </div>
          
          <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Key size={20} className="text-primary" /> 1. Google OAuth Scopes & Data Usage
              </h2>
              <p className="mb-4">GMB Creation Co requests the following specific permissions to provide our automation services:</p>
              <ul className="space-y-3 text-sm">
                <li className="p-3 bg-slate-50 rounded-lg border">
                  <strong>https://www.googleapis.com/auth/business.manage</strong>
                  <p className="text-slate-500 mt-1">Used to retrieve your Business Location ID, manage local posts, and track review status. We do not access personal Google account data beyond what is necessary for business profile management.</p>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg border">
                  <strong>https://www.googleapis.com/auth/gmail.send</strong>
                  <p className="text-slate-500 mt-1">Used exclusively to send review request emails to your customers from your authorized business email address.</p>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg border">
                  <strong>https://www.googleapis.com/auth/userinfo.email</strong>
                  <p className="text-slate-500 mt-1">Used to identify your account and ensure secure multi-tenant isolation.</p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-blue-600" /> 2. Data Storage & Hosting
              </h2>
              <p>
                All user data is stored in <strong>encrypted Supabase databases</strong> hosted on AWS/GCP infrastructure. Data is logically isolated using Row Level Security (RLS). We do not store content retrieved from the Google Business Profile API for more than <strong>30 calendar days</strong>, in strict compliance with Google's data policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Globe size={20} className="text-amber-500" /> 3. Sub-processors & Purpose
              </h2>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 border rounded-lg">
                  <strong>Supabase:</strong> Secure database hosting and user authentication.
                </div>
                <div className="p-3 border rounded-lg">
                  <strong>Twilio:</strong> Delivery of SMS review requests to customers.
                </div>
                <div className="p-3 border rounded-lg">
                  <strong>n8n:</strong> Processing of webhooks and automated workflow logic.
                </div>
                <div className="p-3 border rounded-lg">
                  <strong>Google AI (Gemini):</strong> Assisting in the generation of SEO-optimised business posts.
                </div>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-600" /> 4. User Controls & Revocation
              </h2>
              <p className="text-sm mb-4">
                You have full control over your data and Google account access:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li><strong>Revoke Access:</strong> You can revoke our app's access at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" className="text-blue-600 font-bold underline">Google Security Settings</a>.</li>
                <li><strong>Data Deletion:</strong> You may request the immediate deletion of your account and all associated business data by emailing <strong>william@gmbcreationco.com</strong>. We will process all deletion requests within 48 hours.</li>
              </ul>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                GMB Creation Co's use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" className="text-blue-600 font-bold underline">Google API Services User Data Policy</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;