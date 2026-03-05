"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

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
                <Eye size={20} className="text-blue-500" /> 1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when you create an account, such as your name, email address, and business details. When you connect your Google Business Profile or Gmail account, we access specific data required to automate your posts and outreach.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-green-500" /> 2. How We Use Google Data
              </h2>
              <p>
                Our application's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 underline">Google API Services User Data Policy</a>, including the Limited Use requirements. We only use this data to:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Publish posts to your Google Business Profile.</li>
                <li>Send review request emails via your Gmail account.</li>
                <li>Monitor review status to provide dashboard analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Lock size={20} className="text-purple-500" /> 3. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your data. Your OAuth tokens are encrypted and stored securely within our Supabase backend. We do not sell your personal or business data to third parties.
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