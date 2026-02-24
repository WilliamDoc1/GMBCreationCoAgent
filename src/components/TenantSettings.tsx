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
import { Building2, Link as LinkIcon, Phone, MessageSquareText } from 'lucide-react';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    gmb_review_link: '',
    twilio_number: '',
    message_template: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData({
        business_name: tenant.business_name || '',
        industry: tenant.industry || '',
        gmb_review_link: tenant.gmb_review_link || '',
        twilio_number: tenant.twilio_number || '',
        message_template: (tenant as any).message_template || ''
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
              className="min-h-[100px]"
              value={formData.message_template} 
              onChange={(e) => setFormData({...formData, message_template: e.target.value})}
              placeholder="e.g. Draft a short, friendly SMS. Mention their recent service and ask for a rating from 1 to 5."
            />
            <p className="text-xs text-slate-500">
              These instructions guide the AI when drafting messages for your customers.
            </p>
          </div>
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