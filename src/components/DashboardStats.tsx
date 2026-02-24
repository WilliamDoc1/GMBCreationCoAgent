"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, CheckCircle, TrendingUp, Percent } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface StatsProps {
  customers: any[];
}

const DashboardStats = ({ customers }: StatsProps) => {
  const total = customers.length;
  const contacted = customers.filter(c => c.status === 'contacted' || c.status === 'reviewed').length;
  const reviewed = customers.filter(c => c.status === 'reviewed').length;
  
  const conversionRate = contacted > 0 ? ((reviewed / contacted) * 100).toFixed(1) : "0";

  const stats = [
    { title: "Total Customers", value: total, icon: Users, color: "text-blue-600" },
    { title: "Outreach Sent", value: contacted, icon: Send, color: "text-yellow-600" },
    { title: "Reviews Received", value: reviewed, icon: CheckCircle, color: "text-green-600" },
    { title: "Conversion Rate", value: `${conversionRate}%`, icon: Percent, color: "text-purple-600" },
  ];

  const chartData = [
    { name: 'New', value: customers.filter(c => c.status === 'new').length, color: '#3b82f6' },
    { name: 'Contacted', value: customers.filter(c => c.status === 'contacted').length, color: '#eab308' },
    { name: 'Reviewed', value: reviewed, color: '#22c55e' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Outreach Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;