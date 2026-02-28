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

const TENANT_STORAGE_KEY = 'outreach_agent_active_tenant';

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem(TENANT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchTenant = useCallback(async (isInitial = false) => {
    if (!session?.user) {
      if (!authLoading) setLoading(false);
      return;
    }
    
    if (isInitial && !tenant) setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('owner_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;

      if (data) {
        setTenant(data);
        localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(data));
      } else {
        // Only create if we are sure no tenant exists
        const { data: newTenant, error: createError } = await supabase
          .from('tenants')
          .insert([{ 
            owner_id: session.user.id, 
            business_name: 'My Business', 
            industry: 'Service Provider' 
          }])
          .select()
          .single();
        
        if (!createError && newTenant) {
          setTenant(newTenant);
          localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(newTenant));
        }
      }
    } catch (err) {
      console.error("Error in useTenant:", err);
    } finally {
      setLoading(false);
    }
  }, [session, authLoading, tenant]);

  useEffect(() => {
    if (!authLoading) {
      fetchTenant(true);
    }
  }, [authLoading, fetchTenant]);

  return (
    <div id="tenant-provider-root">
      <TenantContext.Provider value={{ tenant, loading, refreshTenant: () => fetchTenant(false) }}>
        {children}
      </TenantContext.Provider>
    </div>
  );
};

export const useTenant = () => useContext(TenantContext);