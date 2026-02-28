"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const OnboardingChecklist = () => {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [hasCustomers, setHasCustomers] = useState(false);
  const [hasPosts, setHasPosts] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkStates = async () => {
      if (!tenant) return;
      
      // Check DB
      const { error: dbError } = await supabase.from('tenants').select('id').limit(1);
      setDbStatus(dbError ? 'error' : 'connected');

      // Check Customers
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id);
      setHasCustomers(!!customerCount && customerCount > 0);

      // Check Posts
      const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id);
      setHasPosts(!!postCount && postCount > 0);
    };

    checkStates();
  }, [tenant]);

  if (!tenant) return null;

  const steps = [
    {
      label: "Database Connection",
      completed: dbStatus === 'connected',
      description: "Verifying Supabase real-time sync.",
      action: null
    },
    {
      label: "Google Auth",
      completed: !!tenant.gmb_review_link, // Simplified check for now
      description: "Link your GBP account to enable posting.",
      action: () => navigate('/settings')
    },
    {
      label: "Business Identity",
      completed: !!tenant.business_context && tenant.business_name !== 'My Business',
      description: "Fill out services and description.",
      action: () => navigate('/settings')
    },
    {
      label: "Seed Content",
      completed: hasPosts,
      description: "Generate first 3 posts to verify AI.",
      action: async () => {
        await supabase.functions.invoke('process-outreach');
        window.location.reload();
      }
    }
  ];

  const allCompleted = steps.every(s => s.completed);
  if (allCompleted) return null;

  return (
    <Card className="border-blue-100 bg-blue-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
          <AlertCircle size={16} />
          Setup Wizard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-start gap-3">
              {step.completed ? (
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
              ) : (
                <Circle size={16} className="text-slate-300 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-xs font-medium ${step.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {step.label}
                </p>
                {!step.completed && (
                  <p className="text-[10px] text-slate-500">{step.description}</p>
                )}
              </div>
            </div>
            {!step.completed && step.action && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-7 text-[10px] bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={step.action}
              >
                Fix Now <ArrowRight size={10} className="ml-1" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;