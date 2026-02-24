"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone } from 'lucide-react';

const AdminTenantsTable = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTenants = async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setTenants(data);
      setLoading(false);
    };

    fetchAllTenants();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading all tenants...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Twilio Number</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((t: any) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                {t.business_name}
              </TableCell>
              <TableCell>{t.industry}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                {t.twilio_number || 'Not Set'}
              </TableCell>
              <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTenantsTable;