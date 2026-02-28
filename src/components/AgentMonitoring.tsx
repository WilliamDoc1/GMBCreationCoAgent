"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, ShieldCheck, Activity, RefreshCw, MessageSquare, Calendar, Play } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from '@/utils/toast';

const AgentMonitoring = () => {
  const { tenant } = useTenant();
  const [queueCount, setQueueCount] = useState(0);
  const [pendingPosts, setPendingPosts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [tenant]);

  const handleRunAgent = async () => {
    setIsRunning(true);
    try {
      const { error } = await supabase.functions.invoke('process-outreach');
      if (error) throw error;
      showSuccess("Agent loop triggered successfully");
      await fetchStats();
    } catch (err: any) {
      showError("Failed to trigger agent: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="border-purple-100 bg-purple-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between text-purple-900">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-purple-600" />
            Agent Intelligence
          </div>
          <RefreshCw size={12} className={isRunning ? "animate-spin text-purple-400" : "text-purple-300"} />
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
        
        <div className="p-2 bg-slate-900 rounded-lg min-h-[60px]">
          <p className="text-[9px] font-mono text-green-400 mb-1">
            {">"} AGENT_LOG: {isRunning ? "Executing autonomous loop..." : queueCount > 0 ? `Processing ${queueCount} outreach items...` : 'Scanning for new customers...'}
          </p>
          <p className="text-[9px] font-mono text-slate-400">
            {">"} Status: {pendingPosts < 2 ? 'Low content detected. Ready to generate.' : 'Content queue healthy.'}
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-8 text-[10px] border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
          onClick={handleRunAgent}
          disabled={isRunning}
        >
          {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
          Run Autonomous Loop Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentMonitoring;