"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenant } from '@/hooks/use-tenant';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Zap, Phone, Mail, MessageSquare, RotateCcw, Sparkles, Link as LinkIcon } from 'lucide-react';

const DRAFT_KEY = 'outreach_settings_draft';

const OutreachSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    twilio_number: '',
    email: '',
    outreach_method: 'email',
    message_template: '',
    gmb_review_link: ''
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

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
          twilio_number: tenant.twilio_number || '',
          email: (tenant as any).email || '',
          outreach_method: (tenant as any).outreach_method || 'email',
          message_template: (tenant as any).message_template || 'Draft a short, friendly message. Mention their recent service and ask for a rating from 1 to 5.',
          gmb_review_link: tenant.gmb_review_link || ''
        });
      }
    }
  }, [tenant]);

  const updateField = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
  };

  const handleGenerateAI = async () => {
    if (!tenant) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-ai-prompt', {
        body: {
          businessName: tenant.business_name,
          industry: tenant.industry,
          context: tenant.business_context,
          instructions: `Generate a high-converting ${formData.outreach_method} outreach template for requesting a Google review. The template should be friendly, professional, and include placeholders like [Customer Name]. IMPORTANT: You MUST include this review link in the message: ${formData.gmb_review_link || 'YOUR_REVIEW_LINK_HERE'}. Keep it under 300 characters.`
        }
      });

      if (error) throw error;
      if (data?.preview) {
        updateField('message_template', data.preview);
        showSuccess("AI template generated with your review link!");
      }
    } catch (err: any) {
      showError("Failed to generate template: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!tenant?.id || !session?.user?.id) {
      showError("Authentication error: No active session.");
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          twilio_number: formData.twilio_number,
          email: formData.email,
          outreach_method: formData.outreach_method,
          message_template: formData.message_template,
          gmb_review_link: formData.gmb_review_link,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenant.id);

      if (error) throw error;
      
      showSuccess("Outreach settings updated successfully");
      localStorage.removeItem(DRAFT_KEY);
      await refreshTenant();
    } catch (err: any) {
      showError("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!tenant) return;
    setFormData({
      twilio_number: tenant.twilio_number || '',
      email: (tenant as any).email || '',
      outreach_method: (tenant as any).outreach_method || 'email',
      message_template: (tenant as any).message_template || 'Draft a short, friendly message. Mention their recent service and ask for a rating from 1 to 5.',
      gmb_review_link: tenant.gmb_review_link || ''
    });
    localStorage.removeItem(DRAFT_KEY);
    showSuccess("Draft cleared.");
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 bg-blue-50/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
            <Zap size={20} />
            Outreach Configuration
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-600">
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Outreach Method</Label>
              <Select 
                value={formData.outreach_method} 
                onValueChange={(value) => updateField('outreach_method', value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail size={14} /> Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone size={14} /> SMS (Twilio)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><LinkIcon size={14} /> Google Review Link</Label>
              <Input 
                value={formData.gmb_review_link} 
                onChange={(e) => updateField('gmb_review_link', e.target.value)}
                placeholder="https://g.page/r/..."
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            {formData.outreach_method === 'email' ? (
              <>
                <Label className="flex items-center gap-2"><Mail size={14} /> Business Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@yourbusiness.com"
                  className="bg-white"
                />
              </>
            ) : (
              <>
                <Label className="flex items-center gap-2"><Phone size={14} /> Twilio Phone Number</Label>
                <Input 
                  value={formData.twilio_number} 
                  onChange={(e) => updateField('twilio_number', e.target.value)}
                  placeholder="+27..."
                  className="bg-white"
                />
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2"><MessageSquare size={14} /> AI Message Template</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] gap-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleGenerateAI}
                disabled={generating || !tenant?.business_context}
              >
                {generating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                Generate with AI
              </Button>
            </div>
            <Textarea 
              value={formData.message_template} 
              onChange={(e) => updateField('message_template', e.target.value)}
              placeholder="Instructions for the AI to generate your outreach message..."
              className="min-h-[150px] text-sm bg-white"
            />
            <p className="text-[10px] text-slate-500 italic">
              Tip: The AI will automatically include your Google Review Link in the generated template.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90">
          {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Save Outreach Settings
        </Button>
      </div>
    </div>
  );
};

export default OutreachSettings;