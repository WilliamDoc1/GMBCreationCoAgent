"use client";

import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Lock } from "lucide-react";
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface BulkUploadProps {
  onSuccess: () => void;
}

const BulkUpload = ({ onSuccess }: BulkUploadProps) => {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const currentPlan = (tenant as any)?.plan_type || 'starter';
  const canBulkUpload = currentPlan === 'agency';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !tenant) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const customers = results.data.map((row: any) => ({
          full_name: row.full_name || row.Name || row.name,
          email: row.email || row.Email || row.mail,
          phone_number: row.phone_number || row.Phone || row.phone || 'N/A',
          tenant_id: tenant.id,
          status: 'new'
        })).filter(c => c.full_name && c.email);

        if (customers.length === 0) {
          showError("No valid customer data found. Ensure columns are named 'name' and 'email'.");
          setUploading(false);
          return;
        }

        const { error } = await supabase
          .from('customers')
          .insert(customers);

        if (error) {
          showError("Failed to upload customers: " + error.message);
        } else {
          showSuccess(`Successfully uploaded ${customers.length} customers for email outreach`);
          onSuccess();
        }
        
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        showError("Error parsing CSV: " + error.message);
        setUploading(false);
      }
    });
  };

  const handleClick = () => {
    if (!canBulkUpload) {
      showError("Bulk CSV Upload is an Agency-only feature.");
      navigate('/dashboard?tab=subscription');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <Button 
        variant="outline" 
        onClick={handleClick}
        disabled={uploading || !tenant}
        className="flex items-center gap-2"
      >
        {uploading ? <Loader2 className="animate-spin" size={16} /> : canBulkUpload ? <Upload size={16} /> : <Lock size={16} className="text-slate-400" />}
        Bulk Upload CSV
      </Button>
    </div>
  );
};

export default BulkUpload;