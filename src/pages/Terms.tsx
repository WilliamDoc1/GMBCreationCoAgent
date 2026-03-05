"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { FileText, Scale, AlertCircle, ShieldCheck, Ban, Gavel } from 'lucide-react';

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

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-600" /> 1. Data Integrity & Isolation
              </h2>
              <p>
                GMB Creation Co guarantees strict multi-tenant isolation. Any attempt to bypass security protocols, perform SQL injection, or access data belonging to another business is a material breach of these terms and will result in immediate account termination and potential legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" /> 2. AI Content Responsibility
              </h2>
              <p>
                Our service provides AI-generated content for Google Business Profiles. While we strive for accuracy, <strong>you are solely responsible</strong> for reviewing all content before it is published. GMB Creation Co is not liable for any account suspensions, SEO penalties, or reputational damage resulting from AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Ban size={20} className="text-red-500" /> 3. Prohibited Activities
              </h2>
              <p>You agree not to use the service to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Generate spam or deceptive content.</li>
                <li>Harass customers through excessive outreach.</li>
                <li>Reverse engineer the agent's logic or API.</li>
                <li>Upload PII (Personally Identifiable Information) without customer consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Scale size={20} className="text-blue-500" /> 4. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, GMB Creation Co shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunities arising from the use of our automation tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Gavel size={20} className="text-slate-900" /> 5. Governing Law
              </h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the <strong>Republic of South Africa</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in South Africa.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                For legal inquiries or to report a security vulnerability, please contact william@gmbcreationco.com
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