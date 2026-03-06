"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const DashboardHeader = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism rounded-2xl px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-sage rounded-lg flex items-center justify-center text-obsidian font-bold text-xl group-hover:scale-110 transition-transform">
            G
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            GMB Creation Co
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="flex items-center gap-2 border-white/10 hover:bg-white/5"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-gold to-sage text-obsidian font-bold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;