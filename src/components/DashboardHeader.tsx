"use client";

import React from 'react';
import { LogOut, HelpCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import SystemStatus from './SystemStatus';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  
  const isLandingPage = location.pathname === '/';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={session ? "/dashboard" : "/"} className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="GMB Creation Co." 
              className="h-10 w-auto object-contain"
            />
          </Link>
          {session && !isLandingPage && <SystemStatus />}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/documentation">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600">
              <HelpCircle size={16} />
              Help
            </Button>
          </Link>
          
          {session ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LogIn size={16} />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;