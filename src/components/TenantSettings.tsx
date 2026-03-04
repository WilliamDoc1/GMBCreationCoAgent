"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useTenant } from '@/hooks/use-tenant';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Building2, Link as LinkIcon, Loader2, BookOpen, RotateCcw, Phone, ShieldCheck } from 'lucide-react';

const DRAFT_KEY = 'tenant_settings_draft';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [userRole, setUserRole] = useState('client');
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    gmb_review_link: '',
    business_context: '',
    twilio_number: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data) setUserRole(data.role);
    };
    fetchProfile();
  }, [session]);

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
          business_context: tenant.business_context || '',
          twilio_number: tenant.twilio_number || ''
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
        .upsert({
          id: tenant.id,
          owner_id: session.user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      showSuccess("Business profile updated successfully");
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
      business_name: tenant.business_name || '',
      industry: tenant.industry || '',
      gmb_review_link: tenant.gmb_review_link || '',
      business_context: tenant.business_context || '',
      twilio_number: tenant.twilio_number || ''
    });
    localStorage.removeItem(DRAFT_KEY);
    showSuccess("Draft cleared.");
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
              placeholder="Describe your services, location, and unique selling points for the AI..."
              className="min-h-[120px] text-sm"
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
        </CardContent>
      </Card>

      {userRole === 'admin' && (
        <Card className="border-amber-100 bg-amber-50/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <ShieldCheck size={20} />
              Technical Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone size={14} /> Twilio Phone Number</Label>
              <Input 
                value={formData.twilio_number} 
                onChange={(e) => updateField('twilio_number', e.target.value)}
                placeholder="+27..."
                className="bg-white"
              />
              <p className="text-[10px] text-slate-500">This number is used to send automated review requests via SMS.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90">
          {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default TenantSettings;