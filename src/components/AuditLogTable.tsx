"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const AuditLogTable = () => {
  const { tenant } = useTenant();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      if (!tenant) return;
      const { data, error } = await supabase
        .from('audit_log')
        .select('*, customers(full_name)')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, [tenant]);

  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = log.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.message_content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  if (loading) return <div className="p-8 text-center">Loading audit logs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50/50 border rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search logs by customer or content..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filter Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="manual_outreach_sent">Manual Outreach</SelectItem>
              <SelectItem value="initial_outreach_sent">Auto Outreach</SelectItem>
              <SelectItem value="sentiment_reply_sent">Sentiment Reply</SelectItem>
              <SelectItem value="customer_opted_out">Opt-Outs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No matching logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.customers?.full_name}</TableCell>
                  <TableCell className="text-xs uppercase tracking-wider text-slate-500">
                    {log.action.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-slate-600">
                    {log.message_content}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogTable;