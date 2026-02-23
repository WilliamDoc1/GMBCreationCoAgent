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
import { Settings2, Loader2, Link as LinkIcon } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const SettingsDialog = () => {
  const [industry, setIndustry] = useState('');
  const [reviewLink, setReviewLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('industry, review_link')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setIndustry(data.industry || '');
          setReviewLink(data.review_link || '');
        }
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
        .update({ 
          industry, 
          review_link: reviewLink,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) {
        showError("Failed to save settings");
      } else {
        showSuccess("Settings saved successfully");
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
              Helps Gemini personalize the SMS tone for your specific business.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewLink" className="flex items-center gap-2">
              <LinkIcon size={14} /> Review Link
            </Label>
            <Input 
              id="reviewLink" 
              value={reviewLink} 
              onChange={(e) => setReviewLink(e.target.value)}
              placeholder="https://g.page/r/your-business/review"
            />
            <p className="text-xs text-slate-500">
              The link included in the SMS for customers to click.
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