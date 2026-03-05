"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { FileText, Scale, AlertCircle, ShieldCheck } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <DashboardHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          </div>
          
          <p className="text-slate-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-600" /> 1. Data Integrity & Isolation
              </h2>
              <p>
                GMB Creation Co guarantees strict multi-tenant isolation. Any attempt to bypass security protocols or access data belonging to another business is a material breach of these terms and will result in immediate account termination and potential legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Scale size={20} className="text-blue-500" /> 2. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the GMB Creation Co platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" /> 3. Use of Automation
              </h2>
              <p>
                Our service provides AI-generated content for Google Business Profiles. You are responsible for reviewing all content before it is published. We are not liable for any account suspensions resulting from content that violates Google's community guidelines.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                For legal inquiries, please contact william@gmbcreationco.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Terms;