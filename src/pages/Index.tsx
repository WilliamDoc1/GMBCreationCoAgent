"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddCustomerForm from '@/components/AddCustomerForm';
import BulkUpload from '@/components/BulkUpload';
import CustomerTable from '@/components/CustomerTable';
import SystemStatus from '@/components/SystemStatus';
import SettingsDialog from '@/components/SettingsDialog';
import DashboardStats from '@/components/DashboardStats';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchCustomers();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="text-primary h-6 w-6" />
              <h1 className="text-xl font-bold">Outreach Agent</h1>
            </div>
            <SystemStatus />
          </div>
          <div className="flex items-center gap-2">
            <SettingsDialog />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats customers={customers} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Customer List</h2>
            <p className="text-slate-500">Manage your review requests and outreach status.</p>
          </div>
          <div className="flex items-center gap-3">
            <BulkUpload onSuccess={fetchCustomers} />
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
                  fetchCustomers();
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
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