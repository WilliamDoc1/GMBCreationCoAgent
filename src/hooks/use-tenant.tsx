"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface Tenant {
  id: string;
  business_name: string;
  industry: string;
  gmb_review_link: string;
  twilio_number: string;
  message_template?: string;
  business_context?: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true, refreshTenant: async () => {} });

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenant = useCallback(async (isInitial = false) => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    
    if (isInitial) setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('owner_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;

      if (data) {
        setTenant(data);
      } else {
        const { data: newTenant, error: createError } = await supabase
          .from('tenants')
          .insert([{ 
            owner_id: session.user.id, 
            business_name: 'My Business', 
            industry: 'Service Provider' 
          }])
          .select()
          .single();
        
        if (!createError && newTenant) setTenant(newTenant);
      }
    } catch (err) {
      console.error("Error in useTenant:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!authLoading) {
      fetchTenant(true);
    }
  }, [authLoading, fetchTenant]);

  return (
    <TenantContext.Provider value={{ tenant, loading, refreshTenant: () => fetchTenant(false) }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);