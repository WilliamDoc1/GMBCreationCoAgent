"use client";

import React from 'react';
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
import { Send, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  status: string;
  last_contacted_at: string | null;
}

interface CustomerTableProps {
  customers: Customer[];
  onRefresh: () => void;
}

const CustomerTable = ({ customers, onRefresh }: CustomerTableProps) => {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const triggerOutreach = async (customer: Customer) => {
    setLoadingId(customer.id);
    try {
      // 1. Insert into queue
      const { error: queueError } = await supabase
        .from('outbound_queue')
        .insert([{
          customer_id: customer.id,
          payload: { 
            name: customer.full_name, 
            phone: customer.phone_number,
            industry: "Service Provider" // This could be dynamic
          }
        }]);

      if (queueError) throw queueError;

      // 2. Trigger Edge Function
      const { error: funcError } = await supabase.functions.invoke('send-outreach', {
        body: { customerId: customer.id }
      });

      if (funcError) throw funcError;

      showSuccess(`Outreach triggered for ${customer.full_name}`);
      onRefresh();
    } catch (error: any) {
      showError(error.message || "Failed to trigger outreach");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'opted_out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Contacted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No customers found. Add some to get started!
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.full_name}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {customer.last_contacted_at 
                    ? new Date(customer.last_contacted_at).toLocaleDateString() 
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={loadingId === customer.id || customer.status === 'opted_out'}
                    onClick={() => triggerOutreach(customer)}
                  >
                    {loadingId === customer.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="ml-2">Send Request</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;