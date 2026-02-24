"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showSuccess } from '@/utils/toast';
import { MessageSquareHeart, CheckCircle2 } from 'lucide-react';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get('name') || 'Valued Customer';
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd save this to a 'feedback' table
    console.log("Feedback submitted:", feedback);
    setSubmitted(true);
    showSuccess("Thank you for your feedback!");
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
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Feedback;