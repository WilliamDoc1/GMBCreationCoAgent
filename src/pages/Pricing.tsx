"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import MeshGradient from '@/components/landing/MeshGradient';
import GlassCard from '@/components/landing/GlassCard';
import MagneticButton from '@/components/landing/MagneticButton';
import FloatingShards from '@/components/landing/FloatingShards';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'R950',
      description: 'Essential local SEO for small businesses.',
      features: [
        '1x Weekly Post',
        'Basic Review Tracking',
        'Monthly Performance Report',
        'Email Support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'R2,450',
      description: 'Advanced automation for growing brands.',
      features: [
        '3x Weekly Posts',
        'Automated Review Requests',
        'Keyword Tracking',
        'SMS Integration',
        'Priority AI Processing'
      ],
      popular: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: 'Custom',
      description: 'Bulk management for 5+ locations.',
      features: [
        'Unlimited Locations',
        'Custom Strategy',
        'Priority Support',
        'White-label Reports',
        'Dedicated Account Manager'
      ]
    }
  ];

  const faqs = [
    {
      q: "How long until I see results?",
      a: "Most clients see an increase in profile views and engagement within the first 30-45 days of consistent posting and review management."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes! We believe in our results, so we don't lock you into long-term contracts. You can cancel your subscription at any time."
    },
    {
      q: "Do you manage multiple locations?",
      a: "Absolutely. Our Agency plan is specifically designed for multi-location businesses and franchises."
    }
  ];

  return (
    <div className="min-h-screen">
      <MeshGradient />
      <DashboardHeader />
      
      <main className="relative pt-32 pb-20 px-4">
        <FloatingShards />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Simple Plans for <br />
              <span className="text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-sage">
                Serious Growth
              </span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism text-gold text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> No Long-Term Contracts
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, i) => (
              <GlassCard 
                key={plan.id} 
                className={`flex flex-col ${plan.popular ? 'border-gold/30' : ''}`} 
                glowColor={plan.popular ? 'amber' : 'sage'}
                delay={i * 0.1}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-400 text-sm">/month</span>}
                  </div>
                  <p className="text-slate-400 text-sm mt-4">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-gold shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <MagneticButton 
                  variant={plan.popular ? 'primary' : 'ghost'} 
                  className="w-full"
                  onClick={() => plan.price === 'Custom' ? window.location.href = 'mailto:support@gmbcreationco.com' : navigate(`/register?plan=${plan.id}`)}
                >
                  {plan.price === 'Custom' ? 'Contact Us' : 'Get Started'}
                </MagneticButton>
              </GlassCard>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <HelpCircle className="text-gold" /> Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <GlassCard key={i} className="p-8" glowColor="sage">
                  <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;