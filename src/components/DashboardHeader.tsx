"use client";

import React from 'react';
import { Users, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SystemStatus from './SystemStatus';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Users className="text-primary h-6 w-6" />
            <h1 className="text-xl font-bold">Outreach Agent</h1>
          </Link>
          <SystemStatus />
        </div>
        <div className="flex items-center gap-4">
          <Link to="/documentation">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600">
              <HelpCircle size={16} />
              Help
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;