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
    try {
      const saved = localStorage.getItem(TENANT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchTenant = useCallback(async () => {
    if (!session?.user) {
      if (!authLoading) setLoading(false);
      return;
    }
    
    try {
      // Fetch tenant where owner_id matches the current user
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
        // Auto-create a default tenant if none exists for this user
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
  }, [session?.user?.id, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchTenant();
    }
  }, [authLoading, fetchTenant]);

  return (
    <div className="tenant-provider">
      <TenantContext.Provider value={{ tenant, loading, refreshTenant: fetchTenant }}>
        {children}
      </TenantContext.Provider>
    </div>
  );
};

export const useTenant = () => useContext(TenantContext);