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
import { Building2, Link as LinkIcon, Phone, MessageSquareText, Sparkles, Loader2, BookOpen, RotateCcw } from 'lucide-react';

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

  // Initialize form data when tenant loads or changes
  useEffect(() => {
    if (tenant) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
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
    }
  }, [tenant]);

  // Save draft to localStorage as user types
  const updateField = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
  };

  const handleSave = async () => {
    if (!tenant?.id) {
      showError("No active business profile found to update.");
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update(formData)
        .eq('id', tenant.id);

      if (error) throw error;
      
      showSuccess("Settings permanently saved to database");
      localStorage.removeItem(DRAFT_KEY);
      await refreshTenant();
    } catch (err: any) {
      console.error("Save error:", err);
      showError("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!tenant) return;
    setFormData({
      business_name: tenant.business_name || '',
      industry: tenant.industry || '',
      gmb_review_link: tenant.gmb_review_link || '',
      twilio_number: tenant.twilio_number || '',
      message_template: tenant.message_template || '',
      business_context: tenant.business_context || ''
    });
    localStorage.removeItem(DRAFT_KEY);
    showSuccess("Draft cleared. Reverted to saved settings.");
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
      if (data.error) throw new Error(data.error);
      
      setPreview(data.preview);
      showSuccess("AI Preview generated");
    } catch (err: any) {
      console.error("AI Preview error:", err);
      showError("AI Preview failed: " + (err.message || "Check your Gemini API key"));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 size={20} />
            Business Profile
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-600">
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input 
                value={formData.business_name} 
                onChange={(e) => updateField('business_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input 
                value={formData.industry} 
                onChange={(e) => updateField('industry', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><BookOpen size={14} /> Business Context</Label>
            <Textarea 
              value={formData.business_context} 
              onChange={(e) => updateField('business_context', e.target.value)}
              placeholder="Describe your services, location, and unique selling points..."
              className="min-h-[80px] text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon size={14} /> GMB Review Link</Label>
            <Input 
              value={formData.gmb_review_link} 
              onChange={(e) => updateField('gmb_review_link', e.target.value)}
              placeholder="https://g.page/r/..."
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone size={14} /> Twilio Number</Label>
            <Input 
              value={formData.twilio_number} 
              onChange={(e) => updateField('twilio_number', e.target.value)}
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
              onChange={(e) => updateField('message_template', e.target.value)}
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
          <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Save All Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TenantSettings;