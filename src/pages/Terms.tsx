"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle, ShieldCheck, Ban, Gavel, ArrowLeft, Clock, UserCheck, Info, CreditCard, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Terms = () => {
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
            <FileText className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          </div>
          
          <p className="text-slate-500 mb-8">Effective Date: 06/03/2026</p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info size={20} className="text-blue-500" /> 1. Transparency & Agency Disclosure
              </h2>
              <p className="mb-4">
                GMB Creation Co is a third-party management tool. In accordance with Google’s Third-Party Policies:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><CheckCircle2 size={14} /></div>
                  <span><strong>Service Nature:</strong> We hereby disclose that Google Business Profile is a free service provided by Google. The fees you pay to GMB Creation Co are for management, automation, and SEO services only.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><CheckCircle2 size={14} /></div>
                  <span><strong>No Guarantee:</strong> While we aim for a #1 ranking, we do not guarantee specific search placements, as Google’s ranking algorithms are proprietary and subject to change.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-blue-600"><CheckCircle2 size={14} /></div>
                  <span><strong>Ownership:</strong> You (the client) must retain primary ownership or co-ownership of your Google Business Profile at all times.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck size={20} className="text-green-600" /> 2. End-Client Authorization & Responsibility
              </h2>
              <p className="mb-4">If you use this platform to manage profiles for third-party clients, you warrant that:</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-green-600"><CheckCircle2 size={14} /></div>
                  <span>You have explicit written authorization from the end-client to publish content and respond to reviews.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-green-600"><CheckCircle2 size={14} /></div>
                  <span>You will notify end-clients of any material changes made to their profile by this automation within 48 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-amber-600"><AlertTriangle size={14} /></div>
                  <span><strong>Content Approval:</strong> You are solely responsible for reviewing AI-generated content. GMB Creation Co is not liable for any account suspensions resulting from content that violates Google’s Prohibited & Restricted Content policies.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={20} className="text-primary" /> 3. Data Retention & Google API Compliance
              </h2>
              <ul className="space-y-3 text-sm">
                <li><strong>30-Day Limit:</strong> In compliance with Google Business Profile API policies, we will not store content (posts, reviews, or insights) retrieved from the API for more than 30 calendar days.</li>
                <li><strong>Attribution:</strong> You shall not alter, obscure, or delete any Google Brand Features, logos, or attributions provided through the API.</li>
                <li><strong>Termination of Access:</strong> If you or your end-client choose to discontinue using our services, we will relinquish all API management permissions within 7 business days of receiving notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard size={20} className="text-amber-600" /> 4. Fees & South African Consumer Rights (CPA)
              </h2>
              <p className="mb-4">These terms are governed by the Republic of South Africa:</p>
              <ul className="space-y-3 text-sm">
                <li><strong>Cancellation:</strong> Under the Consumer Protection Act (CPA), you may cancel monthly services with 20 business days' written notice.</li>
                <li><strong>Cooling-Off Period:</strong> If you signed up via direct marketing, you have a 5-business-day cooling-off period to cancel without penalty.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500" /> 5. Security & Breach Notification
              </h2>
              <p>
                You must notify GMB Creation Co immediately at <strong>william@gmbcreationco.com</strong> of any unauthorized use of your Google Account, API keys, or any other breach of security.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                These terms are governed by the laws of the Republic of South Africa. Continued use of the service constitutes acceptance of these terms and Google's <a href="https://www.google.com/intl/en_za/help/terms_maps/" target="_blank" className="text-blue-600 underline">Additional Terms of Service</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const AlertTriangle = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default Terms;