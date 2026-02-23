"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Loader2, MessageSquare } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  created_at: string;
  status: string;
}

interface MessageHistoryDialogProps {
  customerId: string;
  customerName: string;
}

const MessageHistoryDialog = ({ customerId, customerName }: MessageHistoryDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchHistory()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="View History">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            History for {customerName}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No messages sent to this customer yet.
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageHistoryDialog;