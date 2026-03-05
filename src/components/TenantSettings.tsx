"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTenant } from '@/hooks/use-tenant';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Building2, Link as LinkIcon, Loader2, BookOpen, RotateCcw, Mail, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

const DRAFT_KEY = 'tenant_settings_draft';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    email: '',
    gmb_review_link: '',
    business_context: '',
    gmb_location_id: ''
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
          email: (tenant as any).email || '',
          gmb_review_link: tenant.gmb_review_link || '',
          business_context: tenant.business_context || '',
          gmb_location_id: (tenant as any).gmb_location_id || ''
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
          business_name: formData.business_name,
          industry: formData.industry,
          email: formData.email,
          gmb_review_link: formData.gmb_review_link,
          business_context: formData.business_context,
          gmb_location_id: formData.gmb_location_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenant.id);

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

  const handleConnectGMB = () => {
    // In a real app, this would redirect to the Google OAuth URL
    // For now, we'll simulate the connection process
    showSuccess("Redirecting to Google for authorization...");
    setTimeout(() => {
      showSuccess("GMB Account Linked Successfully!");
    }, 2000);
  };

  const handleReset = () => {
    if (!tenant) return;
    setFormData({
      business_name: tenant.business_name || '',
      industry: tenant.industry || '',
      email: (tenant as any).email || '',
      gmb_review_link: tenant.gmb_review_link || '',
      business_context: tenant.business_context || '',
      gmb_location_id: (tenant as any).gmb_location_id || ''
    });
    localStorage.removeItem(DRAFT_KEY);
    showSuccess("Draft cleared.");
  };

  const isGmbConnected = (tenant as any)?.gmb_status === 'connected' || !!(tenant as any)?.gmb_location_id;

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 bg-blue-50/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="text-blue-600" size={20} />
                Google Business Profile Integration
              </CardTitle>
              <CardDescription>Link your GMB account to enable automatic posting from the queue.</CardDescription>
            </div>
            {isGmbConnected ? (
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <CheckCircle2 size={14} />
                CONNECTED
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <AlertCircle size={14} />
                NOT LINKED
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isGmbConnected ? (
            <div className="p-6 border-2 border-dashed rounded-xl bg-white text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <Globe className="text-blue-600" size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Connect your Google Account</p>
                <p className="text-xs text-slate-500">We need permission to manage your business locations and publish posts.</p>
              </div>
              <Button onClick={handleConnectGMB} className="bg-blue-600 hover:bg-blue-700">
                Connect GMB Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>GMB Location ID</Label>
                <Input 
                  value={formData.gmb_location_id} 
                  onChange={(e) => updateField('gmb_location_id', e.target.value)}
                  placeholder="locations/123456789..."
                />
                <p className="text-[10px] text-slate-500">The unique identifier for your business location on Google.</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50">
                Disconnect GMB Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
            <Label className="flex items-center gap-2"><Mail size={14} /> Business Email</Label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="contact@yourbusiness.com"
            />
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

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90">
          {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Save Profile Changes
        </Button>
      </div>
    </div>
  );
};

export default TenantSettings;