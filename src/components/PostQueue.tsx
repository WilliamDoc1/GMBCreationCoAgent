"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Sparkles, 
  Trash2,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';
import { showSuccess, showError } from '@/utils/toast';

interface Post {
  id: string;
  content: string;
  status: string;
  scheduled_for: string;
  published_at: string | null;
  media_url: string | null;
}

const PostQueue = () => {
  const { tenant } = useTenant();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPosts = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('scheduled_for', { ascending: false });
    
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [tenant]);

  const handleGeneratePost = async () => {
    if (!tenant) return;
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke('gbp-content-generator', {
        body: { tenantId: tenant.id }
      });
      if (error) throw error;
      showSuccess("AI is generating 3 weekly posts...");
      setTimeout(fetchPosts, 3000);
    } catch (err: any) {
      showError("Failed to trigger post generation");
    } finally {
      setGenerating(false);
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      showError("Failed to delete post");
    } else {
      showSuccess("Post removed from queue");
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Content Queue</h2>
          <p className="text-slate-500">3x Weekly GBP posts for {tenant?.business_name || 'GMB Creation Co.'}</p>
        </div>
        <Button 
          onClick={handleGeneratePost} 
          disabled={generating}
          className="flex items-center gap-2 bg-primary"
        >
          {generating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          Generate Weekly Posts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <Loader2 className="animate-spin mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500">Loading your content queue...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="col-span-full border-dashed py-12 text-center">
            <CardContent>
              <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No posts scheduled</h3>
              <p className="text-slate-500 mb-6">Click generate to create your weekly SEO content.</p>
              <Button variant="outline" onClick={handleGeneratePost}>Generate First Batch</Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }>
                    {post.status === 'published' ? 'Published' : 'Scheduled'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <CardDescription className="text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.scheduled_for).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{post.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PostQueue;