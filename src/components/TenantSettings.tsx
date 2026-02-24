"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Building2, Link as LinkIcon, Phone, MessageSquareText, Sparkles, Loader2, Info, BookOpen } from 'lucide-react';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    gmb_review_link: '',
    twilio_number: '',
    message_template: '',
    business_context: ''
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (tenant) {
      setFormData({
        business_name: tenant.business_name || '',
        industry: tenant.industry || '',
        gmb_review_link: tenant.gmb_review_link || '',
        twilio_number: tenant.twilio_number || '',
        message_template: (tenant as any).message_template || '',
        business_context: (tenant as any).business_context || ''
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    const { error } = await supabase
      .from('tenants')
      .update(formData)
      .eq('id', tenant.id);

    if (error) {
      showError("Failed to update settings");
    } else {
      showSuccess("Business settings updated");
      refreshTenant();
    }
    setSaving(false);
  };

  const handleTestAI = async () => {
    setTesting(true);
    setPreview('');
    try {
      const functionUrl = 'https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/test-ai-prompt';
      const { data, error } = await supabase.functions.invoke(functionUrl, {
        body: {
          businessName: formData.business_name,
          industry: formData.industry,
          instructions: formData.message_template,
          context: formData.business_context
        }
      });

      if (error) throw error;
      setPreview(data.preview);
    } catch (err: any) {
      showError("Failed to generate preview: " + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 size={20} />
            Business Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input 
                value={formData.business_name} 
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input 
                value={formData.industry} 
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><BookOpen size={14} /> Business Context (Optional)</Label>
            <Textarea 
              value={formData.business_context} 
              onChange={(e) => setFormData({...formData, business_context: e.target.value})}
              placeholder="e.g. We are a family-owned plumbing business in Cape Town since 1995. We pride ourselves on 24/7 emergency service."
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon size={14} /> GMB Review Link</Label>
            <Input 
              value={formData.gmb_review_link} 
              onChange={(e) => setFormData({...formData, gmb_review_link: e.target.value})}
              placeholder="https://g.page/r/..."
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone size={14} /> Twilio Number</Label>
            <Input 
              value={formData.twilio_number} 
              onChange={(e) => setFormData({...formData, twilio_number: e.target.value})}
              placeholder="+27..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquareText size={20} />
            AI Outreach Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Instructions for Gemini</Label>
            <Textarea 
              className="min-h-[120px]"
              value={formData.message_template} 
              onChange={(e) => setFormData({...formData, message_template: e.target.value})}
              placeholder="e.g. Draft a short, friendly SMS. Mention their recent service and ask for a rating from 1 to 5."
            />
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-100">
              <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-700">
                <strong>Pro Tip:</strong> You can tell Gemini to use the customer's name. The system automatically provides the name and business context to the AI.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleTestAI}
              disabled={testing}
            >
              {testing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              Preview AI Message
            </Button>
          </div>

          {preview && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Sample Preview:</p>
              <p className="text-sm text-slate-700 italic">"{preview}"</p>
              <p className="text-[10px] text-slate-400 mt-2 text-right">{preview.length}/160 characters</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TenantSettings;