"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, ShieldCheck, Activity, RefreshCw, MessageSquare, Calendar } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';

const AgentMonitoring = () => {
  const { tenant } = useTenant();
  const [queueCount, setQueueCount] = useState(0);
  const [pendingPosts, setPendingPosts] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!tenant) return;
      
      const { count: qCount } = await supabase
        .from('outreach_queue')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
        .eq('status', 'pending');
      
      const { count: pCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
        .eq('status', 'pending');

      setQueueCount(qCount || 0);
      setPendingPosts(pCount || 0);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [tenant]);

  return (
    <Card className="border-purple-100 bg-purple-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between text-purple-900">
          <div className="flex items-center gap-2">
            <Activity size={16} />
            Live Agent Monitoring
          </div>
          <RefreshCw size={12} className="animate-spin text-purple-300" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-50 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-blue-500" />
              <span className="text-[11px] font-medium text-slate-700">Outreach Queue</span>
            </div>
            <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-100">
              {queueCount} Pending
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-50 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-purple-500" />
              <span className="text-[11px] font-medium text-slate-700">Scheduled Posts</span>
            </div>
            <Badge variant="outline" className="text-[10px] h-5 bg-purple-50 text-purple-700 border-purple-100">
              {pendingPosts} Active
            </Badge>
          </div>
        </div>
        
        <div className="p-2 bg-slate-900 rounded-lg">
          <p className="text-[9px] font-mono text-green-400 mb-1">
            {">"} AGENT_LOG: {queueCount > 0 ? `Processing ${queueCount} outreach items...` : 'Scanning for new customers...'}
          </p>
          <p className="text-[9px] font-mono text-slate-400">
            {">"} Status: {pendingPosts < 2 ? 'Low content detected. Generating posts...' : 'Content queue healthy.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMonitoring;