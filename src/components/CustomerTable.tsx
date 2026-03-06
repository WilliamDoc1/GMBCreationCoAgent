"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Search, History } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import MessageHistoryDialog from './MessageHistoryDialog';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  status: string;
  last_contacted_at: string | null;
}

interface CustomerTableProps {
  customers: Customer[];
  onRefresh: () => void;
}

const CustomerTable = ({ customers, onRefresh }: CustomerTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const searchTerm = searchParams.get('search') || "";
  const statusFilter = searchParams.get('status') || "all";

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const triggerOutreach = async (customer: Customer) => {
    setLoadingId(customer.id);
    try {
      console.log(`Triggering outreach for customer: ${customer.id}`);
      
      const { data, error } = await supabase.functions.invoke('send-outreach', {
        body: { customerId: customer.id }
      });

      if (error) {
        // Handle function invocation errors (e.g., 400, 500)
        console.error("Edge Function Error:", error);
        let errorMessage = "Failed to trigger outreach.";
        
        // Try to extract the error message from the response
        try {
          const errorBody = await error.context?.json();
          if (errorBody?.error) errorMessage = errorBody.error;
        } catch (e) {
          errorMessage = error.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      if (data?.error) {
        // Handle errors returned in the response body
        throw new Error(data.error);
      }

      showSuccess(`Email outreach sent to ${customer.full_name}`);
      onRefresh();
    } catch (error: any) {
      console.error("Outreach trigger failed:", error);
      showError(error.message || "Failed to trigger outreach. Check Supabase logs.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex p-4 bg-slate-50/50 border-b gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchParams({ search: e.target.value, status: statusFilter })}
          />
        </div>
      </div>

      <div className="rounded-md border mx-4 mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contacted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.full_name}</TableCell>
                  <TableCell className="text-slate-500">{customer.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      customer.status === 'reviewed' ? 'bg-green-100 text-green-800' : 
                      customer.status === 'contacted' ? 'bg-blue-100 text-blue-800' : ''
                    }>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {customer.last_contacted_at ? new Date(customer.last_contacted_at).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <MessageHistoryDialog customerId={customer.id} customerName={customer.full_name} />
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={loadingId === customer.id}
                        onClick={() => triggerOutreach(customer)}
                        title="Send Review Request"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        {loadingId === customer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      </Button>
                    </div>
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

export default CustomerTable;