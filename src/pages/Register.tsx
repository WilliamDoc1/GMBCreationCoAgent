"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, ArrowRight, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';
import { initializeYocoCheckout } from '@/utils/yoco';

const PLANS = [
  {
    id: 'starter',
    name: 'Local Hero',
    price: 'R2,500',
    priceInCents: 250000,
    description: 'Essential automation for local businesses.',
    features: ['1 x GBP Location', '3x Weekly Posts', 'Email & SMS Review Requests', 'Basic Analytics', 'SEO Insights']
  },
  {
    id: 'growth',
    name: 'Market Leader',
    price: 'R5,000',
    priceInCents: 500000,
    description: 'Advanced scaling for growing brands.',
    features: ['5 x GBP Location', '3x Weekly Posts', 'Email & SMS Review Requests', 'SEO Insights', 'Audit Log'],
    popular: true
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 'Custom Price',
    priceInCents: 0,
    description: 'Tailored solutions for multi-location management.',
    features: ['5 x GBP Location', '3x Weekly Posts', 'Email & SMS Review Requests', 'SEO Insights', 'Audit Log']
  }
];

const DRAFT_REG_KEY = 'pending_registration_data';

const Register = () => {
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: ''
  });

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const planId = searchParams.get('plan');
    
    if (paymentStatus === 'success' && planId) {
      const completeRegistration = async () => {
        const savedData = localStorage.getItem(DRAFT_REG_KEY);
        if (!savedData) return;

        try {
          const { email, password, businessName } = JSON.parse(savedData);
          
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                plan_type: planId,
                business_name: businessName
              }
            }
          });

          if (error) throw error;

          showSuccess("Account created! Please check your email for confirmation.");
          localStorage.removeItem(DRAFT_REG_KEY);
          navigate('/login');
        } catch (err: any) {
          showError("Failed to complete registration: " + err.message);
        }
      };
      completeRegistration();
    }
  }, [searchParams, navigate]);

  const handlePlanSelect = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setStep('details');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlan.id === 'agency') {
      window.location.href = 'mailto:william@gmbcreationco.com?subject=Agency Plan Inquiry';
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem(DRAFT_REG_KEY, JSON.stringify({
        ...formData,
        planId: selectedPlan.id
      }));

      await initializeYocoCheckout(
        selectedPlan.priceInCents,
        `Initial Subscription: ${selectedPlan.name}`,
        selectedPlan.id
      );
    } catch (err: any) {
      showError(err.message || err);
      setLoading(false);
    }
  };

  if (step === 'plan') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4">
              <ArrowLeft size={16} /> Back to Login
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900">Choose Your Growth Plan</h1>
            <p className="text-xl text-slate-500">Select the best option for your business to start dominating local search.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {PLANS.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col cursor-pointer transition-all hover:shadow-xl ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-slate-200'}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-3 py-1">MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.id !== 'agency' && <span className="text-slate-500 text-sm">/month</span>}
                  </div>
                  <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <Check size={18} className="text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 text-lg" variant={plan.popular ? "default" : "outline"}>
                    {plan.id === 'agency' ? 'Contact Us' : `Select ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => setStep('plan')} className="w-fit gap-2 text-slate-500">
            <ArrowLeft size={16} /> Change Plan
          </Button>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">Account Details</CardTitle>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 h-6">
              {selectedPlan.name} Plan
            </Badge>
          </div>
          <CardDescription>Enter your business details to proceed.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" /> Business Identity
              </h3>
              <div className="space-y-2">
                <Input 
                  placeholder="Business Name" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Create Password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>
            
            {selectedPlan.id !== 'agency' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                <CreditCard className="text-blue-600 mt-1" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900">Secure Yoco Payment</p>
                  <p className="text-[10px] text-blue-700">
                    Clicking the button below will redirect you to Yoco's secure payment page to process your {selectedPlan.price} subscription.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t p-6">
            <Button type="submit" className="w-full h-14 text-xl font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
              {selectedPlan.id === 'agency' ? 'Contact Support' : 'Pay & Activate Account'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;