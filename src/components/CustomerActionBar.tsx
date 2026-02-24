"use client";

import React from 'react';
import { Plus, Play, Loader2, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddCustomerForm from './AddCustomerForm';
import BulkUpload from './BulkUpload';
import Papa from 'papaparse';

interface CustomerActionBarProps {
  customers: any[];
  isBulkProcessing: boolean;
  onBulkProcess: () => void;
  onRefresh: () => void;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}

const CustomerActionBar = ({
  customers,
  isBulkProcessing,
  onBulkProcess,
  onRefresh,
  isAddOpen,
  setIsAddOpen
}: CustomerActionBarProps) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    const exportData = customers.map(c => ({
      Name: c.full_name,
      Phone: c.phone_number,
      Status: c.status,
      LastContacted: c.last_contacted_at ? new Date(c.last_contacted_at).toLocaleString() : 'Never'
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const newCustomersCount = customers.filter((c: any) => c.status === 'new').length;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Customer List</h2>
        <p className="text-slate-500">Manage your review requests and outreach status.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
        </Button>

        <Button 
          variant="outline" 
          onClick={handleExport}
          className="flex items-center gap-2"
          title="Export to CSV"
        >
          <Download size={16} />
          Export
        </Button>
        
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          onClick={onBulkProcess}
          disabled={isBulkProcessing || newCustomersCount === 0}
        >
          {isBulkProcessing ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          Process All New
        </Button>
        
        <BulkUpload onSuccess={onRefresh} />
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <AddCustomerForm onSuccess={() => {
              setIsAddOpen(false);
              onRefresh();
            }} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerActionBar;