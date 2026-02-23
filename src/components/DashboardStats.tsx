"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, CheckCircle, XCircle } from "lucide-react";

interface StatsProps {
  customers: any[];
}

const DashboardStats = ({ customers }: StatsProps) => {
  const total = customers.length;
  const contacted = customers.filter(c => c.status === 'contacted').length;
  const reviewed = customers.filter(c => c.status === 'reviewed').length;
  const optedOut = customers.filter(c => c.status === 'opted_out').length;

  const stats = [
    { title: "Total Customers", value: total, icon: Users, color: "text-blue-600" },
    { title: "Outreach Sent", value: contacted, icon: Send, color: "text-yellow-600" },
    { title: "Reviews Received", value: reviewed, icon: CheckCircle, color: "text-green-600" },
    { title: "Opted Out", value: optedOut, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
  );
};

export default DashboardStats;