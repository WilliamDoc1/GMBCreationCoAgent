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
import { Building2, Link as LinkIcon, Loader2, BookOpen, RotateCcw, Mail, Globe, CheckCircle2, AlertCircle, Key, MapPin, Search, Info, ShieldCheck } from 'lucide-react';

const DRAFT_KEY = 'tenant_settings_draft';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    email: '',
    website_url: '',
    gmb_review_link: '',
    business_context: '',
    gmb_location_id: '',
    gmb_account_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<any[]>([]);

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
          website_url: (tenant as any).website_url || '',
          gmb_review_link: tenant.gmb_review_link || '',
          business_context: tenant.business_context || '',
          gmb_location_id: (tenant as any).gmb_location_id || '',
          gmb_account_id: (tenant as any).gmb_account_id || ''
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
    if (!tenant?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          business_name: formData.business_name,
          industry: formData.industry,
          email: formData.email,
          website_url: formData.website_url,
          gmb_review_link: formData.gmb_review_link,
          business_context: formData.business_context,
          gmb_location_id: formData.gmb_location_id,
          gmb_account_id: formData.gmb_account_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenant.id);

      if (error) throw error;
      showSuccess("Business profile updated");
      localStorage.removeItem(DRAFT_KEY);
      await refreshTenant();
    } catch (err: any) {
      showError("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGMB = async () => {
    if (!tenant) return;
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth-gmb', {
        body: { tenantId: tenant.id, origin: window.location.origin }
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      showError("Connection failed: " + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const fetchLocations = async () => {
    if (!tenant) return;
    setFetchingLocations(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-gmb-locations', {
        body: { tenantId: tenant.id }
      });
      if (error) throw error;
      setAvailableLocations(data.locations || []);
      if (data.accountId) updateField('gmb_account_id', data.accountId);
      showSuccess(`Found ${data.locations?.length || 0} locations`);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setFetchingLocations(false);
    }
  };

  const isGmbConnected = (tenant as any)?.gmb_status === 'connected';

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
              <CardDescription>Link your account to automate posts and review tracking.</CardDescription>
            </div>
            {isGmbConnected ? (
              <Badge className="bg-green-50 text-green-700 border-green-100">CONNECTED</Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-100">NOT LINKED</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGmbConnected ? (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <ShieldCheck size={18} />
                  Prominent Disclosure: Data Access
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  By connecting your Google account, GMB Creation Co will access your <strong>Business Profile locations, post history, and email address</strong>. 
                  We use this data exclusively to schedule local posts and send review requests on your behalf. 
                  We do not store Google API content for more than 30 days. You can revoke access at any time in your Google Security Settings.
                </p>
              </div>

              <div className="p-8 border-2 border-dashed rounded-xl bg-white text-center space-y-4">
                <Globe className="text-blue-200 mx-auto" size={48} />
                <div className="space-y-1">
                  <p className="text-sm font-bold">Connect your Google Account</p>
                  <p className="text-xs text-slate-500">Grant access to manage your business profile and posts.</p>
                </div>
                <Button onClick={handleConnectGMB} disabled={connecting} className="bg-blue-600 hover:bg-blue-700">
                  {connecting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                  Connect Google Business
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><CheckCircle2 className="text-blue-600" size={20} /></div>
                  <div>
                    <p className="text-sm font-bold">Google Account Linked</p>
                    <p className="text-xs text-slate-500">Your account is ready for automation.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleConnectGMB}>Reconnect</Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase text-slate-500">Select Business Location</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] gap-1" 
                    onClick={fetchLocations}
                    disabled={fetchingLocations}
                  >
                    {fetchingLocations ? <Loader2 size={10} className="animate-spin" /> : <Search size={10} />}
                    Refresh Locations
                  </Button>
                </div>

                {availableLocations.length > 0 ? (
                  <Select 
                    value={formData.gmb_location_id} 
                    onValueChange={(val) => updateField('gmb_location_id', val)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose your business profile..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map((loc) => (
                        <SelectItem key={loc.name} value={loc.name}>{loc.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg border border-dashed text-center">
                    <p className="text-xs text-slate-500">Click "Refresh Locations" to see your profiles.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 size={20} /> Business Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input value={formData.business_name} onChange={(e) => updateField('business_name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={formData.industry} onChange={(e) => updateField('industry', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Business Context (for AI)</Label>
            <Textarea 
              value={formData.business_context} 
              onChange={(e) => updateField('business_context', e.target.value)}
              placeholder="Describe your services and location for better AI content..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Manual GMB Review Link</Label>
            <Input value={formData.gmb_review_link} onChange={(e) => updateField('gmb_review_link', e.target.value)} placeholder="https://g.page/r/..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const Badge = ({ children, className, variant = "default" }: any) => (
  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${className}`}>
    {children}
  </span>
);

export default TenantSettings;