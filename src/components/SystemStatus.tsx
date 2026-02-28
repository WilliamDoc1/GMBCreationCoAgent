"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Activity, AlertTriangle, Loader2 } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';

const SystemStatus = () => {
  const { tenant } = useTenant();
  const [status, setStatus] = useState<'checking' | 'online' | 'alert' | 'offline'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      if (!tenant) return;
      
      try {
        // Check database connection
        const { error: dbError } = await supabase.from('customers').select('id').limit(1);
        if (dbError && dbError.code !== 'PGRST116') throw dbError;

        // Check configuration
        if (!tenant.twilio_number || !tenant.gmb_review_link) {
          setStatus('alert');
          setDetails('Config Missing');
          return;
        }

        // Check for recent errors in audit logs
        const { data: logs } = await supabase
          .from('audit_log')
          .select('action, status')
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const hasErrors = logs?.some(log => log.status === 'error' || log.action.includes('failed'));
        
        if (hasErrors) {
          setStatus('alert');
          setDetails('Recent Errors');
        } else {
          setStatus('online');
          setDetails('Optimal');
        }
      } catch (err) {
        console.error("Health check failed:", err);
        setStatus('offline');
        setDetails('Offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [tenant]);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border shadow-sm">
      <Activity size={14} className={status === 'online' ? 'text-green-500' : status === 'alert' ? 'text-yellow-500' : 'text-red-500'} />
      <span className="text-xs font-medium text-slate-600">Agent Health:</span>
      {status === 'checking' ? (
        <Badge variant="outline" className="animate-pulse h-5 text-[10px]">Checking...</Badge>
      ) : (
        <Badge 
          variant="outline" 
          className={`h-5 text-[10px] flex gap-1 items-center ${
            status === 'online' ? 'text-green-600 border-green-200 bg-green-50' : 
            status === 'alert' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 
            'text-red-600 border-red-200 bg-red-50'
          }`}
        >
          {status === 'online' ? <CheckCircle2 size={10} /> : status === 'alert' ? <AlertTriangle size={10} /> : <XCircle size={10} />}
          {details}
        </Badge>
      )}
    </div>
  );
};

export default SystemStatus;