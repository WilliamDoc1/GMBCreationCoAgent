"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Simple Plans for <br />
              <span className="text-primary">Serious Growth</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> No Long-Term Contracts
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, i) => (
              <Card key={plan.id} className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground text-sm">/month</span>}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check size={18} className="text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={plan.popular ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => plan.price === 'Custom' ? window.location.href = 'mailto:support@gmbcreationco.com' : navigate(`/register?plan=${plan.id}`)}
                  >
                    {plan.price === 'Custom' ? 'Contact Us' : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <HelpCircle className="text-primary" /> Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
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