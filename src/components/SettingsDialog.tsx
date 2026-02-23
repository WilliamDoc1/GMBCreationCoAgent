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
import { Settings2 } from "lucide-react";
import { showSuccess } from '@/utils/toast';

const SettingsDialog = () => {
  const [industry, setIndustry] = useState('Service Provider');

  useEffect(() => {
    const saved = localStorage.getItem('outreach_industry');
    if (saved) setIndustry(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('outreach_industry', industry);
    showSuccess("Settings saved locally");
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
            <Input 
              id="industry" 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Plumber, Coffee Shop, Law Firm"
            />
            <p className="text-xs text-slate-500">
              This context is sent to Gemini to personalize the SMS tone.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;