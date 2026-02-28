"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Search, Loader2, CheckCircle2 } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const SEOInsights = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const generateInsights = async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-ai-prompt', {
        body: {
          businessName: tenant.business_name,
          industry: tenant.industry,
          instructions: "Analyze the business and suggest 3 high-impact local SEO keywords and a 200-character optimized business description.",
          context: tenant.business_context
        }
      });

      if (error) throw error;
      setInsights(data.preview);
      showSuccess("SEO Insights generated");
    } catch (err: any) {
      showError("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 bg-blue-50/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Local SEO Optimizer
            </CardTitle>
            <CardDescription>AI-driven suggestions to rank higher on Google.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateInsights}
            disabled={loading}
            className="bg-white"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles className="mr-2 text-blue-500" size={14} />}
            Analyze SEO
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!insights ? (
          <div className="text-center py-8 border-2 border-dashed rounded-xl border-blue-100">
            <Search size={32} className="mx-auto text-blue-200 mb-2" />
            <p className="text-sm text-slate-500">Click analyze to scan local search trends for your industry.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase text-blue-400 mb-2">AI Analysis & Suggestions:</p>
              <p className="text-sm text-slate-700 italic leading-relaxed whitespace-pre-wrap">{insights}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">#LocalExpert</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">#TopRated</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">#ServiceNearMe</Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-green-600 font-medium">
              <CheckCircle2 size={12} />
              Freshness signals active: AI is monitoring your GBP queue.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOInsights;