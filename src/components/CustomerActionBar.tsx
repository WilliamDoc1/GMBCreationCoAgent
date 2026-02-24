"use client";

import React from 'react';
import { Plus, Play, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddCustomerForm from './AddCustomerForm';
import BulkUpload from './BulkUpload';

interface CustomerActionBarProps {
  isBulkProcessing: boolean;
  newCustomersCount: number;
  onBulkProcess: () => void;
  onRefresh: () => void;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}

const CustomerActionBar = ({
  isBulkProcessing,
  newCustomersCount,
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