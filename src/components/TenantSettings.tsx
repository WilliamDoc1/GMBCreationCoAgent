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

const DRAFT_KEY = 'tenant_settings_draft';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (tenant && !isInitialized) {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
        } else {
          setFormData({
            business_name: tenant.business_name || '',
            industry: tenant.industry || '',
            gmb_review_link: tenant.gmb_review_link || '',
            twilio_number: tenant.twilio_number || '',
            message_template: tenant.message_template || '',
            business_context: tenant.business_context || ''
          });
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
      setIsInitialized(true);
    }
  }, [tenant, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, isInitialized]);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update(formData)
        .eq('id', tenant.id);

      if (error) throw error;
      
      showSuccess("Business settings updated");
      localStorage.removeItem(DRAFT_KEY);
      await refreshTenant();
    } catch (err: any) {
      showError("Failed to update settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAI = async () => {
    setTesting(true);
    setPreview('');
    try {
      const { data, error } = await supabase.functions.invoke('test-ai-prompt', {
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
              placeholder="e.g. We are a family-owned plumbing business in Cape Town since 1995."
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