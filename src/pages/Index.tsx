"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { TenantProvider, useTenant } from '@/hooks/use-tenant';
import { Loader2, LayoutDashboard, Settings, Users, ShieldCheck, History } from "lucide-react";
import CustomerTable from '@/components/CustomerTable';
import DashboardHeader from '@/components/DashboardHeader';
import CustomerActionBar from '@/components/CustomerActionBar';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import ReviewFeed from '@/components/ReviewFeed';
import TenantSettings from '@/components/TenantSettings';
import AdminTenantsTable from '@/components/AdminTenantsTable';
import AuditLogTable from '@/components/AuditLogTable';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from '@/utils/toast';

const DashboardContent = () => {
  const { session, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState('client');
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data) setUserRole(data.role);
    };
    fetchProfile();
  }, [session]);

  const fetchCustomers = async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setCustomers(data);
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      showError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenant) {
      fetchCustomers();

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers',
            filter: `tenant_id=eq.${tenant.id}`
          },
          () => {
            fetchCustomers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tenant]);

  const handleBulkProcess = async () => {
    const newCustomers = customers.filter((c: any) => c.status === 'new');
    if (newCustomers.length === 0) {
      showError("No new customers to process");
      return;
    }

    setIsBulkProcessing(true);
    try {
      const queueItems = newCustomers.map((c: any) => ({
        tenant_id: tenant?.id,
        customer_id: c.id,
        status: 'pending'
      }));

      const { error } = await supabase.from('outreach_queue').insert(queueItems);
      if (error) throw error;

      const functionUrl = 'https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/process-outreach';
      await supabase.functions.invoke(functionUrl);
      showSuccess(`Queued ${newCustomers.length} customers for outreach`);
    } catch (err) {
      showError("Failed to queue outreach");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!session) return null;

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
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <History size={16} /> Audit Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </TabsTrigger>
              {userRole === 'admin' && (
                <TabsTrigger value="admin" className="flex items-center gap-2 text-purple-600">
                  <ShieldCheck size={16} /> Admin
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <DashboardStats customers={customers} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ReviewFeed />
                  <ActivityFeed />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <OnboardingChecklist />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerActionBar 
              customers={customers}
              isBulkProcessing={isBulkProcessing}
              onBulkProcess={handleBulkProcess}
              onRefresh={fetchCustomers}
              isAddOpen={isAddOpen}
              setIsAddOpen={setIsAddOpen}
            />
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <CustomerTable customers={customers} onRefresh={fetchCustomers} />
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <AuditLogTable />
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <TenantSettings />
            </div>
          </TabsContent>

          {userRole === 'admin' && (
            <TabsContent value="admin">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">SaaS Administration</h2>
                <AdminTenantsTable />
              </div>
            </TabsContent>
          )}
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