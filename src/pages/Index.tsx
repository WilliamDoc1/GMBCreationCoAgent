"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useTenant } from '@/hooks/use-tenant';
import { Loader2, LayoutDashboard, Settings, Users, ShieldCheck, History, TrendingUp, Calendar, Zap, MapPin, CreditCard } from "lucide-react";
import CustomerTable from '@/components/CustomerTable';
import DashboardHeader from '@/components/DashboardHeader';
import CustomerActionBar from '@/components/CustomerActionBar';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import ReviewFeed from '@/components/ReviewFeed';
import TenantSettings from '@/components/TenantSettings';
import OutreachSettings from '@/components/OutreachSettings';
import AdminTenantsTable from '@/components/AdminTenantsTable';
import AuditLogTable from '@/components/AuditLogTable';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import AgentMonitoring from '@/components/AgentMonitoring';
import SEOInsights from '@/components/SEOInsights';
import PostQueue from '@/components/PostQueue';
import AdminDiagnostics from '@/components/AdminDiagnostics';
import BranchManager from '@/components/BranchManager';
import SubscriptionManager from '@/components/SubscriptionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { showSuccess, showError } from '@/utils/toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const { session, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const activeTab = searchParams.get('tab') || 'overview';
  const [userRole, setUserRole] = useState('client');
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

  const { data: customers = [], refetch: fetchCustomers } = useQuery({
    queryKey: ['customers', tenant?.id],
    queryFn: async () => {
      if (!tenant) return [];
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!tenant,
  });

  useEffect(() => {
    if (tenant) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers', filter: `tenant_id=eq.${tenant.id}` },
          () => queryClient.invalidateQueries({ queryKey: ['customers', tenant.id] })
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [tenant, queryClient]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

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

      await supabase.functions.invoke('process-outreach');
      showSuccess(`Queued ${newCustomers.length} customers for outreach`);
      queryClient.invalidateQueries({ queryKey: ['customers', tenant?.id] });
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin size={16} /> Locations
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users size={16} /> Customers
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Calendar size={16} /> Content Queue
              </TabsTrigger>
              <TabsTrigger value="outreach" className="flex items-center gap-2">
                <Zap size={16} /> Outreach Settings
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2 text-blue-600">
                <CreditCard size={16} /> Subscription
              </TabsTrigger>
              {userRole === 'admin' && (
                <>
                  <TabsTrigger value="seo" className="flex items-center gap-2">
                    <TrendingUp size={16} /> SEO Insights
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <History size={16} /> Audit Logs
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} /> Business Profile
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
                <AgentMonitoring />
                <OnboardingChecklist />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <BranchManager />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionManager />
          </TabsContent>

          <TabsContent value="posts">
            <PostQueue />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerActionBar 
              customers={customers}
              isBulkProcessing={isBulkProcessing}
              onBulkProcess={handleBulkProcess}
              onRefresh={() => fetchCustomers()}
              isAddOpen={isAddOpen}
              setIsAddOpen={setIsAddOpen}
            />
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <CustomerTable customers={customers} onRefresh={() => fetchCustomers()} />
            </div>
          </TabsContent>

          <TabsContent value="outreach">
            <div className="max-w-2xl">
              <OutreachSettings />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <TenantSettings />
            </div>
          </TabsContent>

          {userRole === 'admin' && (
            <>
              <TabsContent value="seo">
                <div className="max-w-3xl">
                  <SEOInsights />
                </div>
              </TabsContent>
              <TabsContent value="logs">
                <AuditLogTable />
              </TabsContent>
              <TabsContent value="admin">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">SaaS Administration</h2>
                      <AdminTenantsTable />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Diagnostics</h2>
                      <AdminDiagnostics />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Index;