"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Activity } from "lucide-react";

const SystemStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('customers').select('id').limit(1);
        if (error && error.code !== 'PGRST116') throw error;
        setStatus('online');
      } catch (err) {
        console.error("Connection check failed:", err);
        setStatus('offline');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border shadow-sm">
      <Activity size={14} className={status === 'online' ? 'text-green-500' : 'text-red-500'} />
      <span className="text-xs font-medium text-slate-600">System:</span>
      {status === 'checking' ? (
        <Badge variant="outline" className="animate-pulse">Checking...</Badge>
      ) : status === 'online' ? (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex gap-1 items-center">
          <CheckCircle2 size={10} /> Online
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 flex gap-1 items-center">
          <XCircle size={10} /> Offline
        </Badge>
      )}
    </div>
  );
};

export default SystemStatus;