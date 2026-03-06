"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Check
} from "lucide-react";
import Footer from "@/components/Footer";
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Landing = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Local Hero',
      price: 'R499',
      description: 'Perfect for single-location local shops.',
      features: ['1 GBP Location', '3x Weekly AI Posts', 'Email Review Outreach', 'Basic Analytics']
    },
    {
      id: 'growth',
      name: 'Market Leader',
      price: 'R1,299',
      description: 'For growing businesses with multiple branches.',
      features: ['Up to 5 Locations', 'Advanced AI SEO Insights', 'SMS & Email Outreach', 'Priority AI Processing'],
      popular: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: 'R3,499',
      description: 'For agencies managing multiple clients.',
      features: ['Unlimited Locations', 'Full Audit Logs', 'Bulk CSV Uploads', 'Dedicated Support']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-xs font-bold mb-8 uppercase tracking-wider border">
            <Zap size={14} />
            Local SEO Automation for South African Businesses
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            Dominate Local Search <br />
            <span className="opacity-50">With Efficiency</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            We enable you to efficiently manage reviews and schedule SEO-optimised posts to your Google Business Profile, keeping your business at the top of local search results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Button size="lg" onClick={() => navigate('/dashboard')} className="h-12 px-8 text-base">
                Go to Dashboard <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')} className="h-12 px-8 text-base">
                  Get Started Now <ArrowRight size={18} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="h-12 px-8 text-base">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30 px-4 border-y">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineered for Growth</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to outrank your local competition.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background">
                <CardHeader>
                  <MessageSquare className="text-foreground mb-4" size={32} />
                  <CardTitle>Smart Outreach</CardTitle>
                  <CardDescription>
                    Easily facilitate personalised review requests via email or SMS. Manage follow-ups to ensure you get the feedback you deserve.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-background">
                <CardHeader>
                  <Calendar className="text-foreground mb-4" size={32} />
                  <CardTitle>Weekly Scheduling</CardTitle>
                  <CardDescription>
                    Keep your profile active with scheduled posts that reference local landmarks and neighbourhoods, boosting your relevance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-background">
                <CardHeader>
                  <TrendingUp className="text-foreground mb-4" size={32} />
                  <CardTitle>SEO Insights</CardTitle>
                  <CardDescription>
                    AI-driven suggestions to rank higher on Google search results and monitor your local keyword performance.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.popular ? 'border-foreground shadow-lg relative' : ''}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="text-foreground shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} onClick={() => navigate(`/register?plan=${plan.id}`)}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;