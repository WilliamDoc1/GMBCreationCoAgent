"use client";

import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

interface BulkUploadProps {
  onSuccess: () => void;
}

const BulkUpload = ({ onSuccess }: BulkUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const customers = results.data.map((row: any) => ({
          full_name: row.full_name || row.Name,
          phone_number: row.phone_number || row.Phone,
        })).filter(c => c.full_name && c.phone_number);

        if (customers.length === 0) {
          showError("No valid customer data found in CSV");
          return;
        }

        const { error } = await supabase
          .from('customers')
          .insert(customers);

        if (error) {
          showError("Failed to upload customers");
        } else {
          showSuccess(`Successfully uploaded ${customers.length} customers`);
          onSuccess();
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        showError("Error parsing CSV: " + error.message);
      }
    });
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
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload size={16} />
        Bulk Upload CSV
      </Button>
    </div>
  );
};

export default BulkUpload;