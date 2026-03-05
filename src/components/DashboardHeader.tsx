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
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          <Link to={session ? "/dashboard" : "/"} className="flex items-center h-full">
            <img 
              src="/logo.jpg" 
              alt="GMB Creation Co." 
              className="h-14 w-auto object-contain block"
            />
          </Link>
          {session && !isLandingPage && (
            <div className="hidden md:block">
              <SystemStatus />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/documentation">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 hover:bg-slate-50">
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Help</span>
            </Button>
          </Link>
          
          {session ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:bg-slate-50">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" className="flex items-center gap-2 px-6">
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