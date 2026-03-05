"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Trash2, Building, Link as LinkIcon, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';
import { showSuccess, showError } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Branch {
  id: string;
  name: string;
  location_address: string;
  gmb_review_link: string;
}

const BranchManager = () => {
  const { tenant } = useTenant();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', address: '', link: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    if (!tenant) return;
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('name', { ascending: true });
    
    if (!error && data) setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, [tenant]);

  const handleAddBranch = async () => {
    if (!tenant || !newBranch.name) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('branches')
        .insert([{
          tenant_id: tenant.id,
          name: newBranch.name,
          location_address: newBranch.address,
          gmb_review_link: newBranch.link
        }]);

      if (error) throw error;
      showSuccess("Branch added successfully");
      setIsAddOpen(false);
      setNewBranch({ name: '', address: '', link: '' });
      fetchBranches();
    } catch (err: any) {
      showError("Failed to add branch");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBranch = async (id: string) => {
    const { error } = await supabase.from('branches').delete().eq('id', id);
    if (error) {
      showError("Cannot delete branch with active data");
    } else {
      showSuccess("Branch removed");
      fetchBranches();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Location Management</h2>
          <p className="text-sm text-slate-500">Manage multiple branches for {tenant?.business_name}</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input 
                  placeholder="e.g. Sandton Branch" 
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input 
                  placeholder="123 Main St, Sandton" 
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Branch GMB Review Link</Label>
                <Input 
                  placeholder="https://g.page/r/..." 
                  value={newBranch.link}
                  onChange={(e) => setNewBranch({...newBranch, link: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={handleAddBranch} disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Create Branch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-8 text-center text-slate-400">Loading locations...</div>
        ) : branches.length === 0 ? (
          <Card className="col-span-full border-dashed py-12 text-center">
            <CardContent>
              <Building size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500">No branches configured yet.</p>
            </CardContent>
          </Card>
        ) : (
          branches.map((branch) => (
            <Card key={branch.id} className="hover:border-primary/20 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building size={16} className="text-primary" />
                    {branch.name}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                    onClick={() => deleteBranch(branch.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>{branch.location_address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600 truncate">
                  <LinkIcon size={14} className="shrink-0" />
                  <span className="truncate">{branch.gmb_review_link || 'No link set'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BranchManager;