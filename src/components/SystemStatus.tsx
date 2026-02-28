"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Activity, AlertTriangle } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';

const SystemStatus = () => {
  const { tenant } = useTenant();
  const [status, setStatus] = useState<'checking' | 'online' | 'alert' | 'offline'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      if (!tenant) return;
      
      try {
        // Check database connection
        const { error: dbError } = await supabase.from('customers').select('id').limit(1);
        if (dbError && dbError.code !== 'PGRST116') throw dbError;

        // Check for recent errors or negative sentiment in audit logs
        const { data: logs } = await supabase
          .from('audit_log')
          .select('action')
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const hasAlerts = logs?.some(log => log.action.includes('negative') || log.action.includes('error'));
        
        setStatus(hasAlerts ? 'alert' : 'online');
      } catch (err) {
        console.error("Health check failed:", err);
        setStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [tenant]);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border shadow-sm">
      <Activity size={14} className={status === 'online' ? 'text-green-500' : status === 'alert' ? 'text-yellow-500' : 'text-red-500'} />
      <span className="text-xs font-medium text-slate-600">Agent Health:</span>
      {status === 'checking' ? (
        <Badge variant="outline" className="animate-pulse">Checking...</Badge>
      ) : status === 'online' ? (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex gap-1 items-center">
          <CheckCircle2 size={10} /> Optimal
        </Badge>
      ) : status === 'alert' ? (
        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 flex gap-1 items-center">
          <AlertTriangle size={10} /> Action Required
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