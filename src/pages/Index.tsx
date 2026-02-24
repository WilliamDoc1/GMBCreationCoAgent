"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { TenantProvider, useTenant } from '@/hooks/use-tenant';
import { Loader2, LayoutDashboard, Settings, Users } from "lucide-react";
import CustomerTable from '@/components/CustomerTable';
import DashboardHeader from '@/components/DashboardHeader';
import CustomerActionBar from '@/components/CustomerActionBar';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import TenantSettings from '@/components/TenantSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from '@/utils/toast';

const DashboardContent = () => {
  const { session } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const fetchCustomers = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (tenant) {
      fetchCustomers();
    }
  }, [tenant]);

  const handleBulkProcess = async () => {
    const newCustomers = customers.filter(c => c.status === 'new');
    if (newCustomers.length === 0) {
      showError("No new customers to process");
      return;
    }

    setIsBulkProcessing(true);
    try {
      // Add to queue
      const queueItems = newCustomers.map(c => ({
        tenant_id: tenant?.id,
        customer_id: c.id,
        status: 'pending'
      }));

      const { error } = await supabase.from('outreach_queue').insert(queueItems);
      if (error) throw error;

      // Trigger edge function
      await supabase.functions.invoke('process-outreach');
      
      showSuccess(`Queued ${newCustomers.length} customers for outreach`);
      fetchCustomers();
    } catch (err) {
      showError("Failed to queue outreach");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users size={16} /> Customers
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <DashboardStats customers={customers} />
              </div>
              <div className="lg:col-span-1">
                <ActivityFeed customers={customers} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerActionBar 
              isBulkProcessing={isBulkProcessing}
              newCustomersCount={customers.filter(c => c.status === 'new').length}
              onBulkProcess={handleBulkProcess}
              onRefresh={fetchCustomers}
              isAddOpen={isAddOpen}
              setIsAddOpen={setIsAddOpen}
            />
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading && customers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">Loading customers...</div>
              ) : (
                <CustomerTable customers={customers} onRefresh={fetchCustomers} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <TenantSettings />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
};

const Index = () => (
  <TenantProvider>
    <DashboardContent />
  </TenantProvider>
);

export default Index;