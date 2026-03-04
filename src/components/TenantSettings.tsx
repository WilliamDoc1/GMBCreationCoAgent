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
import { Building2, Link as LinkIcon, Loader2, BookOpen, RotateCcw } from 'lucide-react';

const DRAFT_KEY = 'tenant_settings_draft';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    gmb_review_link: '',
    business_context: ''
  });
  const [saving, setSaving] = useState(false);

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
          business_context: tenant.business_context || ''
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
      business_context: tenant.business_context || ''
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
        <CardFooter>
          <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Save Profile Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TenantSettings;