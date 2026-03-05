"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Loader2, ListTree, AlertCircle, Globe, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';

const AdminDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [pingLoading, setPingLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const checkModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-models');
      if (error) throw error;
      setResults(data);
    } catch (err: any) {
      showError("Failed to fetch models: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testTunnel = async () => {
    setPingLoading(true);
    setPingStatus('idle');
    try {
      const { data, error } = await supabase.functions.invoke('test-n8n-ping');
      if (error) throw error;
      
      if (data.ok) {
        setPingStatus('success');
        showSuccess("n8n Tunnel is ONLINE");
      } else {
        throw new Error(`n8n returned status ${data.status}`);
      }
    } catch (err: any) {
      setPingStatus('error');
      showError("Tunnel Check Failed: " + err.message);
    } finally {
      setPingLoading(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="text-amber-600" size={20} />
          System Diagnostics
        </CardTitle>
        <CardDescription>Verify API connectivity and available AI models.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase">Connectivity Tests</p>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              onClick={testTunnel} 
              disabled={pingLoading}
              className="w-full flex items-center justify-between bg-white"
            >
              <div className="flex items-center gap-2">
                {pingLoading ? <Loader2 className="animate-spin" size={16} /> : <Globe size={16} className="text-blue-500" />}
                Test n8n Tunnel
              </div>
              {pingStatus === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
              {pingStatus === 'error' && <XCircle size={16} className="text-red-500" />}
            </Button>

            <Button 
              variant="outline" 
              onClick={checkModels} 
              disabled={loading}
              className="w-full flex items-center gap-2 bg-white"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <ListTree size={16} className="text-amber-500" />}
              Check Gemini Models
            </Button>
          </div>
        </div>

        {results && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Available Models:</p>
            <ScrollArea className="h-[150px] w-full rounded-md border bg-slate-900 p-4">
              <pre className="text-[10px] text-green-400 font-mono">
                {JSON.stringify(results, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDiagnostics;