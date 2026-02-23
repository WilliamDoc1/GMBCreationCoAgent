"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, CheckCircle, XCircle, TrendingUp } from "lucide-react";
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
  const contacted = customers.filter(c => c.status === 'contacted').length;
  const reviewed = customers.filter(c => c.status === 'reviewed').length;
  const optedOut = customers.filter(c => c.status === 'opted_out').length;
  const newCount = customers.filter(c => c.status === 'new').length;

  const stats = [
    { title: "Total Customers", value: total, icon: Users, color: "text-blue-600" },
    { title: "Outreach Sent", value: contacted, icon: Send, color: "text-yellow-600" },
    { title: "Reviews Received", value: reviewed, icon: CheckCircle, color: "text-green-600" },
    { title: "Opted Out", value: optedOut, icon: XCircle, color: "text-red-600" },
  ];

  const chartData = [
    { name: 'New', value: newCount, color: '#3b82f6' },
    { name: 'Contacted', value: contacted, color: '#eab308' },
    { name: 'Reviewed', value: reviewed, color: '#22c55e' },
    { name: 'Opted Out', value: optedOut, color: '#ef4444' },
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

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
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