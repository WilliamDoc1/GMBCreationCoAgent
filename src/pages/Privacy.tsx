"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ShieldCheck, Lock, Eye, Database, ShieldAlert } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <DashboardHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          </div>
          
          <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500" /> 1. Zero-Trust Data Isolation
              </h2>
              <p>
                We employ a strict <strong>Zero-Trust Architecture</strong>. Your business data is protected by Row Level Security (RLS) at the database level, ensuring that your information is logically isolated and completely untouchable by any other tenant or user on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Eye size={20} className="text-blue-500" /> 2. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when you create an account, such as your name, email address, and business details. When you connect your Google Business Profile or Gmail account, we access specific data required to automate your posts and outreach.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-green-500" /> 3. How We Use Google Data
              </h2>
              <p>
                Our application's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Lock size={20} className="text-purple-500" /> 4. Identity Verification
              </h2>
              <p>
                Every action performed within the app is verified using cryptographically signed JSON Web Tokens (JWT). This ensures that only you can trigger automations or view data associated with your business.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                If you have questions about this policy, please contact us at william@gmbcreationco.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Privacy;