"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';

const OnboardingChecklist = () => {
  const { tenant } = useTenant();
  const [hasCustomers, setHasCustomers] = useState(false);

  useEffect(() => {
    const checkCustomers = async () => {
      if (!tenant) return;
      const { count } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id);
      
      setHasCustomers(!!count && count > 0);
    };

    checkCustomers();
  }, [tenant]);

  if (!tenant) return null;

  const steps = [
    {
      label: "Set Business Name",
      completed: !!tenant.business_name && tenant.business_name !== 'My Business',
      description: "Identify your brand to customers."
    },
    {
      label: "Configure Industry",
      completed: !!tenant.industry && tenant.industry !== 'Service Provider',
      description: "Helps Gemini personalize the tone."
    },
    {
      label: "Configure Review Link",
      completed: !!tenant.gmb_review_link,
      description: "Where customers will leave their reviews."
    },
    {
      label: "Twilio Number",
      completed: !!tenant.twilio_number,
      description: "The number your SMS will be sent from."
    },
    {
      label: "Add First Customer",
      completed: hasCustomers,
      description: "Upload a CSV or add manually."
    }
  ];

  const allCompleted = steps.every(s => s.completed);
  if (allCompleted) return null;

  return (
    <Card className="border-blue-100 bg-blue-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
          <AlertCircle size={16} />
          Setup Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            {step.completed ? (
              <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
            ) : (
              <Circle size={16} className="text-slate-300 mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-xs font-medium ${step.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                {step.label}
              </p>
              {!step.completed && (
                <p className="text-[10px] text-slate-500">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;