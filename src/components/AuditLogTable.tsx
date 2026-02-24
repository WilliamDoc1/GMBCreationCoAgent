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

const AuditLogTable = () => {
  const { tenant } = useTenant();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center">Loading audit logs...</div>;

  return (
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
          {logs.map((log: any) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;