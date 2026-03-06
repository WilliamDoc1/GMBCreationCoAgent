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
import { Loader2, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DRAFT_KEY = 'outreach_settings_draft';

const OutreachSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    twilio_number: '',
    email: '',
    from_email: '',
    outreach_method: 'email',
    email_provider: 'resend',
    message_template: '',
    gmb_review_link: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: ''
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
          message_template: (tenant as any).message_template || 'Hi [Customer Name], thank you for choosing [Business Name]! Please leave us a review: [Review Link]',
          gmb_review_link: tenant.gmb_review_link || '',
          smtp_host: (tenant as any).smtp_host || '',
          smtp_port: String((tenant as any).smtp_port || '587'),
          smtp_user: (tenant as any).smtp_user || '',
          smtp_pass: (tenant as any).smtp_pass || ''
        });
      }
    }
  }, [tenant]);

  const updateField = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
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
          smtp_host: formData.smtp_host,
          smtp_port: parseInt(formData.smtp_port),
          smtp_user: formData.smtp_user,
          smtp_pass: formData.smtp_pass,
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

  // All plans now have SMS support
  const canUseSMS = true;

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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Outreach Method</Label>
              <Select 
                value={formData.outreach_method} 
                onValueChange={(value) => updateField('outreach_method', value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS (Twilio)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Google Review Link</Label>
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
              <div className="space-y-2">
                <Label>Email Provider</Label>
                <Select 
                  value={formData.email_provider} 
                  onValueChange={(value) => updateField('email_provider', value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmail">Gmail API (OAuth)</SelectItem>
                    <SelectItem value="resend">Resend (Custom Domain)</SelectItem>
                    <SelectItem value="smtp">Custom SMTP (Personal Email)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.email_provider === 'smtp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input 
                      value={formData.smtp_host} 
                      onChange={(e) => updateField('smtp_host', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input 
                      value={formData.smtp_port} 
                      onChange={(e) => updateField('smtp_port', e.target.value)}
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input 
                      value={formData.smtp_user} 
                      onChange={(e) => updateField('smtp_user', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password / App Password</Label>
                    <Input 
                      type="password"
                      value={formData.smtp_pass} 
                      onChange={(e) => updateField('smtp_pass', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>From Email Address</Label>
                <Input 
                  type="email"
                  value={formData.from_email} 
                  onChange={(e) => updateField('from_email', e.target.value)}
                  placeholder="contact@yourbusiness.com"
                  className="bg-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>AI Message Template</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] gap-1"
                onClick={handleGenerateAI}
                disabled={generating}
              >
                {generating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                Generate with AI
              </Button>
            </div>
            <Textarea 
              value={formData.message_template} 
              onChange={(e) => updateField('message_template', e.target.value)}
              className="min-h-[120px] text-sm bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto px-8">
          {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Save Outreach Settings
        </Button>
      </div>
    </div>
  );
};

export default OutreachSettings;