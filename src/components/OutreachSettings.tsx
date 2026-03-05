"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenant } from '@/hooks/use-tenant';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Zap, Phone, Mail, MessageSquare, RotateCcw, Sparkles, Link as LinkIcon, Info, ShieldCheck, Globe } from 'lucide-react';

const DRAFT_KEY = 'outreach_settings_draft';

const OutreachSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    twilio_number: '',
    email: '',
    from_email: '',
    outreach_method: 'email',
    email_provider: 'resend',
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
          from_email: (tenant as any).from_email || '',
          outreach_method: (tenant as any).outreach_method || 'email',
          email_provider: (tenant as any).email_provider || 'resend',
          message_template: (tenant as any).message_template || 'Hi [Customer Name], thank you for choosing [Business Name]! We would love to hear your feedback: [Review Link]',
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
          instructions: `Generate a high-converting ${formData.outreach_method} outreach template for requesting a Google review. Use placeholders like [Customer Name], [Business Name], and [Review Link]. Keep it under 300 characters.`
        }
      });

      if (error) throw error;
      if (data?.preview) {
        updateField('message_template', data.preview);
        showSuccess("AI template generated!");
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
          from_email: formData.from_email,
          outreach_method: formData.outreach_method,
          email_provider: formData.email_provider,
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
      from_email: (tenant as any).from_email || '',
      outreach_method: (tenant as any).outreach_method || 'email',
      email_provider: (tenant as any).email_provider || 'resend',
      message_template: (tenant as any).message_template || 'Hi [Customer Name], thank you for choosing [Business Name]! We would love to hear your feedback: [Review Link]',
      gmb_review_link: tenant.gmb_review_link || ''
    });
    localStorage.removeItem(DRAFT_KEY);
    showSuccess("Draft cleared.");
  };

  const isGmbConnected = (tenant as any)?.gmb_status === 'connected' || !!tenant.gmb_refresh_token;

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 bg-blue-50/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <Zap size={20} />
              Outreach Configuration
            </CardTitle>
            <CardDescription>Configure how you want to reach your customers.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-600">
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {formData.outreach_method === 'email' && (
            <div className="space-y-4 p-4 bg-white rounded-xl border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Email Provider</Label>
                  <Select 
                    value={formData.email_provider} 
                    onValueChange={(value) => updateField('email_provider', value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-blue-500" /> Gmail API
                        </div>
                      </SelectItem>
                      <SelectItem value="resend">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-slate-500" /> Resend (Custom Domain)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {formData.email_provider === 'gmail' ? 'Gmail Address' : 'From Email (Verified Domain)'}
                  </Label>
                  <Input 
                    type="email"
                    value={formData.from_email} 
                    onChange={(e) => updateField('from_email', e.target.value)}
                    placeholder={formData.email_provider === 'gmail' ? "william@gmbcreationco.com" : "outreach@yourdomain.com"}
                    className="bg-white"
                  />
                </div>
              </div>

              {formData.email_provider === 'gmail' && !isGmbConnected && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    <strong>Action Required:</strong> To use Gmail API, you must connect your Google account in the <strong>Business Profile</strong> tab first.
                  </p>
                </div>
              )}

              {formData.email_provider === 'resend' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                  <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Ensure your domain is verified in Resend. If not verified, emails will only send to your own account email.
                  </p>
                </div>
              )}
            </div>
          )}

          {formData.outreach_method === 'sms' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone size={14} /> Twilio Phone Number</Label>
              <Input 
                value={formData.twilio_number} 
                onChange={(e) => updateField('twilio_number', e.target.value)}
                placeholder="+27..."
                className="bg-white"
              />
            </div>
          )}
          
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
            <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-700 uppercase">Supported Placeholders:</p>
                <p className="text-[10px] text-slate-600">
                  Use <code className="bg-white px-1 rounded border">[Customer Name]</code>, 
                  <code className="bg-white px-1 rounded border">[Business Name]</code>, and 
                  <code className="bg-white px-1 rounded border">[Review Link]</code>. 
                  The AI will automatically replace these when sending.
                </p>
              </div>
            </div>
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