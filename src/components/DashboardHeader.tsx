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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-32 flex items-center justify-between">
        <div className="flex items-center gap-10 h-full">
          <Link to={session ? "/dashboard" : "/"} className="flex items-center h-full py-4">
            <img 
              src="/logo.jpg" 
              alt="GMB Creation Co." 
              className="h-24 w-auto object-contain block"
            />
          </Link>
          {session && !isLandingPage && (
            <div className="hidden md:block">
              <SystemStatus />
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <Link to="/documentation">
            <Button variant="ghost" size="lg" className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 h-12 px-5">
              <HelpCircle size={22} />
              <span className="hidden sm:inline font-semibold">Help Center</span>
            </Button>
          </Link>
          
          {session ? (
            <Button variant="ghost" size="lg" onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 h-12 px-5">
              <LogOut size={22} />
              <span className="hidden sm:inline font-semibold">Logout</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="default" size="lg" className="flex items-center gap-2 px-10 h-14 text-lg shadow-md">
                <LogIn size={22} />
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