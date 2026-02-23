"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from "lucide-react";
import CustomerTable from '@/components/CustomerTable';
import DashboardHeader from '@/components/DashboardHeader';
import CustomerActionBar from '@/components/CustomerActionBar';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from '@/utils/toast';

const Index = () => {
  const { session, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  const fetchCustomers = async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchCustomers();

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers' },
          () => fetchCustomers()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const handleBulkProcess = async () => {
    const newCustomers = customers.filter(c => c.status === 'new');
    if (newCustomers.length === 0) {
      showError("No new customers to process");
      return;
    }

    setIsBulkProcessing(true);
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('industry')
        .eq('id', session?.user.id)
        .single();
      
      const industry = profile?.industry || 'Service Provider';

      for (const customer of newCustomers) {
        await supabase.functions.invoke('send-outreach', {
          body: { customerId: customer.id, industry }
        });
      }
      showSuccess(`Processed ${newCustomers.length} customers`);
      fetchCustomers();
    } catch (err) {
      showError("Bulk processing encountered errors");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  if (authLoading || !session) {
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-3">
            <DashboardStats customers={customers} />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed customers={customers} />
          </div>
        </div>

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
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;