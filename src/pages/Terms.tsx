"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle, ShieldCheck, Ban, Gavel, ArrowLeft, Clock, UserCheck } from 'lucide-react';
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
          
          <p className="text-slate-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" /> 1. Data Retention Policy
              </h2>
              <p>
                In compliance with Google Business Profile API policies, GMB Creation Co will <strong>not store content</strong> retrieved from the Google Business Profile API for more than <strong>30 calendar days</strong>. After this period, data is either refreshed or permanently purged from our active storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck size={20} className="text-green-600" /> 2. End-Client Authorization
              </h2>
              <p>
                If you are using this platform to manage business profiles on behalf of third-party clients (e.g., as an agency), you represent and warrant that you have obtained <strong>explicit written authorization</strong> from the end-client to manage their profile, respond to reviews, and publish content on their behalf.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" /> 3. Google Brand Features
              </h2>
              <p>
                Users shall not alter, obscure, or delete any Google Brand Features, logos, or attributions provided through the Google Business Profile API. All Google data must be displayed with the appropriate attributions as required by Google's terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" /> 4. Security Notification
              </h2>
              <p>
                You must notify GMB Creation Co immediately at <strong>william@gmbcreationco.com</strong> of any unauthorized use of your Google Account, API keys, or any other breach of security related to your integration with our platform.
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

export default Terms;