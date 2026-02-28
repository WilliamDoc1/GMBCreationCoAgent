"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import { useTenant } from '@/hooks/use-tenant';

const AgentMonitoring = () => {
  const { tenant } = useTenant();

  const healthMetrics = [
    { label: "Cognitive Engine", status: "Active", icon: Brain, color: "text-purple-500" },
    { label: "GBP API Sync", status: "Connected", icon: ShieldCheck, color: "text-green-500" },
    { label: "Outreach Loop", status: "Monitoring", icon: Zap, color: "text-yellow-500" },
  ];

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
          {healthMetrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-50 shadow-sm">
              <div className="flex items-center gap-2">
                <m.icon size={14} className={m.color} />
                <span className="text-[11px] font-medium text-slate-700">{m.label}</span>
              </div>
              <Badge variant="outline" className="text-[9px] h-5 bg-green-50 text-green-700 border-green-100">
                {m.status}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="p-2 bg-slate-900 rounded-lg">
          <p className="text-[9px] font-mono text-green-400 mb-1">{">"} AGENT_LOG: Scanning queue...</p>
          <p className="text-[9px] font-mono text-slate-400">{">"} Status: Autonomous loops operational.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMonitoring;