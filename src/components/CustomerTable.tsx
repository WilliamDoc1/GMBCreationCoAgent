"use client";

import React, { useState, useEffect } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Send, Loader2, Trash2, Search, Filter, Info } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import MessageHistoryDialog from './MessageHistoryDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync state with URL
  const searchTerm = searchParams.get('search') || "";
  const statusFilter = searchParams.get('status') || "all";

  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.phone_number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const triggerOutreach = async (customer: Customer) => {
    setLoadingId(customer.id);
    try {
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

  const deleteCustomer = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      showError("Failed to delete customer");
    } else {
      showSuccess("Customer deleted");
      onRefresh();
    }
    setDeletingId(null);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50/50 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search by name or phone..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <Select value={statusFilter} onValueChange={(v) => updateFilters({ status: v })}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="opted_out">Opted Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border mx-4 mb-4">
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
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No matching customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.full_name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.last_contacted_at 
                      ? new Date(customer.last_contacted_at).toLocaleDateString() 
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <MessageHistoryDialog customerId={customer.id} customerName={customer.full_name} />
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={loadingId === customer.id || customer.status === 'opted_out'}
                        onClick={() => triggerOutreach(customer)}
                      >
                        {loadingId === customer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete {customer.full_name}?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCustomer(customer.id)} className="bg-red-600">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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