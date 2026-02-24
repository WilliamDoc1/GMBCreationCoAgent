"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MessageSquare, User } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  customers: { full_name: string };
}

const ReviewFeed = () => {
  const { tenant } = useTenant();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!tenant) return;
      const { data, error } = await supabase
        .from('reviews')
        .select('*, customers(full_name)')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error && data) setReviews(data);
      setLoading(false);
    };

    fetchReviews();

    const channel = supabase
      .channel('reviews-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews', filter: `tenant_id=eq.${tenant?.id}` },
        () => fetchReviews()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenant]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
      />
    ));
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Star size={16} className="text-yellow-500" />
          Recent Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-500 text-center py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-xs text-slate-500">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white rounded-full border">
                        <User size={10} className="text-slate-400" />
                      </div>
                      <span className="text-xs font-semibold">{review.customers?.full_name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 text-right">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ReviewFeed;