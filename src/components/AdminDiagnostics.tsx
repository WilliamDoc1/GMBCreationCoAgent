"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Loader2, ListTree, AlertCircle } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';

const AdminDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

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

  return (
    <Card className="border-amber-200 bg-amber-50/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="text-amber-600" size={20} />
          System Diagnostics
        </CardTitle>
        <CardDescription>Verify API connectivity and available AI models.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          onClick={checkModels} 
          disabled={loading}
          className="w-full flex items-center gap-2 bg-white"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ListTree size={16} />}
          Run ListModels Check
        </Button>

        {results && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Available Models:</p>
            <ScrollArea className="h-[200px] w-full rounded-md border bg-slate-900 p-4">
              <pre className="text-[10px] text-green-400 font-mono">
                {JSON.stringify(results, null, 2)}
              </pre>
            </ScrollArea>
            {results.models?.some((m: any) => m.name.includes('gemini-1.5-flash')) ? (
              <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <AlertCircle size={14} />
                gemini-1.5-flash is available for your key.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                <AlertCircle size={14} />
                gemini-1.5-flash NOT found in your model list.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDiagnostics;