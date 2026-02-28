"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from '@/utils/toast';
import { MessageSquareHeart, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get('name') || 'Valued Customer';
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    // In a real scenario, we'd pass a secure token, but for this demo we'll look up by name
    const findCustomer = async () => {
      const { data } = await supabase
        .from('customers')
        .select('id, tenant_id')
        .ilike('full_name', customerName)
        .limit(1)
        .single();
      
      if (data) {
        setCustomerId(data.id);
        setTenantId(data.tenant_id);
      }
    };
    findCustomer();
  }, [customerName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          tenant_id: tenantId,
          customer_id: customerId,
          content: feedback
        }]);

      if (error) throw error;

      setSubmitted(true);
      showSuccess("Thank you for your feedback!");
    } catch (err: any) {
      showError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <CardTitle>Thank You!</CardTitle>
            <p className="text-slate-600">
              We've received your feedback and will use it to improve our service.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquareHeart className="text-primary" size={24} />
            <CardTitle>We Value Your Feedback</CardTitle>
          </div>
          <CardDescription>
            Hi {customerName}, we're sorry we didn't meet your expectations. Please let us know how we can make it right.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Comments</Label>
              <Textarea 
                id="feedback"
                placeholder="Tell us what happened..."
                className="min-h-[120px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Submit Feedback
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Feedback;