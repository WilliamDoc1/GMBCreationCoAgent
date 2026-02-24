"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';

interface Activity {
  id: string;
  action: string;
  message_content: string;
  created_at: string;
  customers?: { full_name: string };
}

const ActivityFeed = () => {
  const { tenant } = useTenant();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!tenant) return;
      const { data, error } = await supabase
        .from('audit_log')
        .select('*, customers(full_name)')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) setActivities(data);
      setLoading(false);
    };

    fetchActivities();

    // Subscribe to new logs
    const channel = supabase
      .channel('audit-logs-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log', filter: `tenant_id=eq.${tenant?.id}` },
        () => fetchActivities()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenant]);

  const getIcon = (action: string) => {
    if (action.includes('sent')) return <Send size={14} className="text-blue-500" />;
    if (action.includes('reply')) return <MessageSquare size={14} className="text-green-500" />;
    if (action.includes('error')) return <AlertCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-slate-400" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock size={16} />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-500 text-center py-4">Loading activity...</p>
            ) : activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start border-l-2 border-slate-100 pl-3 pb-1">
                  <div className="mt-0.5 p-1 bg-white rounded-full border shadow-sm">
                    {getIcon(activity.action)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold leading-none">
                      {activity.customers?.full_name || 'System'}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {activity.message_content}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;