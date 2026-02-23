"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const SettingsDialog = () => {
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('industry')
          .eq('id', user.id)
          .single();
        
        if (data) setIndustry(data.industry || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ industry, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        showError("Failed to save settings");
      } else {
        showSuccess("Settings saved to profile");
      }
    }
    setSaving(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Outreach Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Business Industry</Label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : (
              <Input 
                id="industry" 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Plumber, Coffee Shop, Law Firm"
              />
            )}
            <p className="text-xs text-slate-500">
              This context is sent to Gemini to personalize the SMS tone.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;