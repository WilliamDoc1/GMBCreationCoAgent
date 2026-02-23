"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Send, UserPlus, CheckCircle2 } from "lucide-react";

interface Activity {
  id: string;
  type: 'outreach' | 'signup' | 'review';
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  customers: any[];
}

const ActivityFeed = ({ customers }: ActivityFeedProps) => {
  // Derive activity from customer data for now
  const activities: Activity[] = customers
    .filter(c => c.last_contacted_at || c.created_at)
    .map(c => {
      if (c.status === 'contacted') {
        return {
          id: `outreach-${c.id}`,
          type: 'outreach',
          message: `Outreach sent to ${c.full_name}`,
          timestamp: c.last_contacted_at
        };
      }
      return {
        id: `signup-${c.id}`,
        type: 'signup',
        message: `New customer ${c.full_name} added`,
        timestamp: c.created_at
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const getIcon = (type: string) => {
    switch (type) {
      case 'outreach': return <Send size={14} className="text-yellow-500" />;
      case 'signup': return <UserPlus size={14} className="text-blue-500" />;
      case 'review': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock size={16} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div className="mt-1 p-1 bg-slate-50 rounded-full border">
                    {getIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium leading-none">{activity.message}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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