"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, Database, ShieldAlert, Globe, Trash2, ArrowLeft, Key, RefreshCw, Info, UserCheck, Zap, Scale } from 'lucide-react';
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
          
          <p className="text-slate-500 mb-8 font-medium">Last Updated: 06/03/2026</p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info size={20} className="text-primary" /> 1. Introduction
              </h2>
              <p>
                GMB Creation Co (“we,” “us,” or “our”) provides a local SEO and reputation management platform. This Privacy Policy describes how we collect, use, and handle your information when you use our application and services. By using GMB Creation Co, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Scale size={20} className="text-green-600" /> 2. POPIA Compliance (South Africa)
              </h2>
              <p className="text-sm mb-4">
                As a South African entity, GMB Creation Co is committed to the <strong>Protection of Personal Information Act (POPIA)</strong>. We process personal information lawfully and in a reasonable manner that does not infringe on the privacy of our users.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-green-600"><ShieldCheck size={14} /></div>
                  <span><strong>Purpose Specification:</strong> We only collect data for the specific purpose of facilitating Google Business Profile management and customer outreach.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-green-600"><ShieldCheck size={14} /></div>
                  <span><strong>Processing Limitation:</strong> Data processing is limited to what is necessary for the functionality of the platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-green-600"><ShieldCheck size={14} /></div>
                  <span><strong>Information Officer:</strong> Our designated Information Officer ensures ongoing compliance with POPIA regulations.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Key size={20} className="text-primary" /> 3. Google OAuth Scopes & Data Usage
              </h2>
              <p className="mb-4">
                GMB Creation Co’s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-blue-600 underline font-medium">Google API Services User Data Policy</a>, including the Limited Use requirements. We request the following scopes:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="p-4 bg-slate-50 rounded-lg border">
                  <strong className="text-slate-900">https://www.googleapis.com/auth/business.manage (Sensitive)</strong>
                  <p className="text-slate-600 mt-1">We use this to retrieve your Business Location ID, help you schedule local posts, and track review status. This is essential for the core functionality of managing your Google Business Profile (GBP) engagement.</p>
                </li>
                <li className="p-4 bg-slate-50 rounded-lg border">
                  <strong className="text-slate-900">https://www.googleapis.com/auth/gmail.send (Restricted)</strong>
                  <p className="text-slate-600 mt-1">We use this exclusively to facilitate review request emails to your customers from your authorized business email. We do not read, store, or analyze your personal emails.</p>
                </li>
                <li className="p-4 bg-slate-50 rounded-lg border">
                  <strong className="text-slate-900">https://www.googleapis.com/auth/userinfo.email</strong>
                  <p className="text-slate-600 mt-1">Used to identify your account and ensure secure multi-tenant isolation within our platform.</p>
                </li>
              </ul>
            </section>

            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert size={20} className="text-blue-600" /> 4. Limited Use Disclosure
              </h2>
              <p className="text-sm mb-4 font-medium">Our app strictly complies with Google’s Limited Use requirements:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><Lock size={14} /></div>
                  <span><strong>No Advertising:</strong> We do not use Google user data to serve, personalize, or even retarget advertisements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><Eye size={14} /></div>
                  <span><strong>No Human Reading:</strong> No humans at GMB Creation Co are permitted to read your Google user data unless you provide explicit consent for troubleshooting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><Ban size={14} /></div>
                  <span><strong>No Sale of Data:</strong> We do not sell Google user data to any third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><Zap size={14} /></div>
                  <span><strong>Functional Use Only:</strong> We only use data to provide or improve user-facing features prominent in the application.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-blue-600" /> 5. Data Storage & Hosting
              </h2>
              <ul className="space-y-3 text-sm">
                <li><strong>Isolation:</strong> All user data is stored in encrypted Supabase databases and protected by Row Level Security (RLS) to ensure complete tenant isolation.</li>
                <li><strong>Retention:</strong> In compliance with Google Business Profile API policies, we do not store content retrieved from the API for more than 30 calendar days.</li>
                <li><strong>Location:</strong> Our primary infrastructure is hosted on AWS/GCP regions optimized for performance and security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Globe size={20} className="text-amber-500" /> 6. Sub-processors
              </h2>
              <p className="text-sm mb-3">We share specific data with the following third parties to provide our services:</p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-3 border rounded-lg"><strong>Supabase:</strong> Secure database hosting and authentication.</div>
                <div className="p-3 border rounded-lg"><strong>Twilio:</strong> Delivery of SMS review requests.</div>
                <div className="p-3 border rounded-lg"><strong>Google AI (Gemini):</strong> Assisting in the generation of SEO-optimized posts (Data is not used to train global AI models).</div>
              </div>
            </section>

            <section className="pt-8 border-t">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck size={20} className="text-green-600" /> 7. User Controls & Deletion
              </h2>
              <ul className="space-y-4 text-sm">
                <li>
                  <strong>Revocation:</strong> You can revoke access to GMB Creation Co at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" className="text-blue-600 font-bold underline">Google Security Settings</a>.
                </li>
                <li>
                  <strong>Deletion:</strong> You may request the immediate deletion of your account and all associated data by emailing <strong>william@gmbcreationco.com</strong>. We will purge all record of your data from our production systems within 48 hours.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Ban = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
  </svg>
);

export default Privacy;