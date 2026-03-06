"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, ShieldCheck, Building2, Loader2, CreditCard } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const PLANS = [
  {
    id: 'starter',
    name: 'Local Hero',
    price: 'R499',
    description: 'Perfect for single-location local shops.',
    features: [
      '1 GBP Location',
      '3x Weekly AI Posts',
      'Email Review Outreach',
      'Basic Analytics'
    ],
    limit: 1
  },
  {
    id: 'growth',
    name: 'Market Leader',
    price: 'R1,299',
    description: 'For growing businesses with multiple branches.',
    features: [
      'Up to 5 Locations',
      'Advanced AI SEO Insights',
      'SMS & Email Outreach',
      'Priority AI Processing'
    ],
    limit: 5,
    popular: true
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 'R3,499',
    description: 'For agencies managing multiple clients.',
    features: [
      'Unlimited Locations',
      'Full Audit Logs',
      'Bulk CSV Uploads',
      'Dedicated Support'
    ],
    limit: 100
  }
];

const SubscriptionManager = () => {
  const { tenant, refreshTenant } = useTenant();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!tenant) return;
    setLoading(planId);
    
    try {
      // In a real app, this would call a Stripe/Paystack checkout session
      // For now, we'll simulate the update in the database
      const { error } = await supabase
        .from('tenants')
        .update({ 
          plan_type: planId,
          subscription_status: 'active'
        })
        .eq('id', tenant.id);

      if (error) throw error;
      
      showSuccess(`Successfully upgraded to the ${planId} plan!`);
      await refreshTenant();
    } catch (err: any) {
      showError("Failed to update subscription: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = tenant?.plan_type || 'starter';

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Choose Your Plan</h2>
        <p className="text-slate-500">Scale your local SEO presence with our tiered subscription options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-slate-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-white px-3 py-1">MOST POPULAR</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={currentPlan === plan.id ? "outline" : "default"}
                disabled={currentPlan === plan.id || !!loading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {loading === plan.id ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                {currentPlan === plan.id ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="text-primary" />
              Billing Information
            </h3>
            <p className="text-slate-400 text-sm">Manage your payment methods and view past invoices.</p>
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            Manage Billing Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;