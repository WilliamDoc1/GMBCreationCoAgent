"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, Database, ShieldAlert, Globe, Trash2, ArrowLeft } from 'lucide-react';
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
                <ShieldAlert size={20} className="text-red-500" /> 1. Zero-Trust Data Isolation
              </h2>
              <p>
                We employ a strict <strong>Zero-Trust Architecture</strong>. Your business data is protected by Row Level Security (RLS) at the database level. This ensures that your information is logically isolated and completely inaccessible to any other tenant or user on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Eye size={20} className="text-blue-500" /> 2. Information We Collect
              </h2>
              <div className="space-y-3">
                <p><strong>Personal Data:</strong> Name, email address, and contact details provided during registration.</p>
                <p><strong>Business Data:</strong> Business name, industry, location, and service descriptions used to train the AI agent.</p>
                <p><strong>Google API Data:</strong> When you link your Google Business Profile, we access your business location ID and post history to automate content delivery and review management.</p>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-blue-600" /> 3. Google API Limited Use Disclosure
              </h2>
              <p className="text-sm">
                GMB Creation Co's use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" className="text-blue-600 font-bold underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-2 text-sm">
                <li>We do not use Google user data to serve advertisements.</li>
                <li>We do not sell Google user data to third parties.</li>
                <li>We only use Google user data to provide or improve the features of our application (e.g., automating GBP posts and review responses).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Globe size={20} className="text-amber-500" /> 4. Third-Party Processing
              </h2>
              <p>To provide our services, we share specific data with the following sub-processors:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Supabase:</strong> Database hosting and authentication.</li>
                <li><strong>Google AI (Gemini):</strong> Content generation (data is not used for model training).</li>
                <li><strong>Twilio:</strong> SMS delivery for review requests.</li>
                <li><strong>n8n:</strong> Workflow automation and webhook processing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Trash2 size={20} className="text-slate-500" /> 5. Data Retention & Deletion
              </h2>
              <p>
                We retain your data only as long as your account is active. Upon account termination, all business context, customer lists, and scheduled posts are permanently deleted from our production databases within 30 days.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                If you have questions about this policy or wish to exercise your data rights under POPIA or GDPR, please contact us at <strong>william@gmbcreationco.com</strong>
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