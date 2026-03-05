"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { showError, showSuccess } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Logged in successfully");
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Check your email for the confirmation link");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 relative">
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mb-16">
        <img 
          src="/logo.png" 
          alt="GMB Creation Co." 
          className="h-64 w-auto object-contain mx-auto"
        />
      </div>
      <Card className="w-full max-w-md shadow-2xl border-slate-200">
        <CardHeader className="space-y-3 text-center pb-10">
          <CardTitle className="text-4xl font-extrabold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-lg">Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="email@example.com" 
                className="h-14 text-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                className="h-14 text-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-8">
            <Button type="submit" className="w-full h-14 text-xl font-bold" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </Button>
            <Button type="button" variant="outline" className="w-full h-14 text-xl font-semibold" onClick={handleSignUp} disabled={loading}>
              Create New Account
            </Button>
          </CardFooter>
        </form>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Login;