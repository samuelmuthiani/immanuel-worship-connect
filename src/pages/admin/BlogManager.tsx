
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  author: string | null;
  category: string | null;
  created_at: string;
}

const BlogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      setCurrentPost(prev => ({ ...prev, image_url: data.publicUrl }));
      toast({ title: 'Image uploaded', description: 'Cover image set successfully' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Post[]) || [];
    }
  });

  const savePostMutation = useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const postData = {
        title: post.title,
        content: post.content || null,
        excerpt: post.excerpt || null,
        image_url: post.image_url || null,
        published: post.published || false,
        author: post.author || null,
        category: post.category || null,
        updated_at: new Date().toISOString(),
      };

      if (post.id) {
        const { error } = await supabase.from('posts').update(postData).eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('posts').insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      setIsEditing(false);
      setCurrentPost({});
      toast({ title: 'Success', description: 'Post saved' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({ title: 'Deleted', description: 'Post removed' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">{posts?.length || 0} posts</p>
        </div>
        {!isEditing && (
          <Button onClick={() => { setCurrentPost({ published: false }); setIsEditing(true); }} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentPost.id ? 'Edit Post' : 'New Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" value={currentPost.title || ''} onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })} placeholder="Post title" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="post-author">Author</Label>
                <Input id="post-author" value={currentPost.author || ''} onChange={e => setCurrentPost({ ...currentPost, author: e.target.value })} placeholder="Author name" />
              </div>
              <div>
                <Label htmlFor="post-category">Category</Label>
                <Input id="post-category" value={currentPost.category || ''} onChange={e => setCurrentPost({ ...currentPost, category: e.target.value })} placeholder="e.g. Devotional" />
              </div>
            </div>
            <div>
              <Label htmlFor="post-excerpt">Excerpt</Label>
              <Textarea id="post-excerpt" value={currentPost.excerpt || ''} onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })} rows={2} />
            </div>
            <div>
              <Label htmlFor="post-content">Content</Label>
              <Textarea id="post-content" value={currentPost.content || ''} onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })} rows={8} className="font-mono text-sm" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="post-published" checked={currentPost.published || false} onCheckedChange={checked => setCurrentPost({ ...currentPost, published: checked })} />
              <Label htmlFor="post-published">Published</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              <Button onClick={() => savePostMutation.mutate(currentPost)} disabled={!currentPost.title}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {posts?.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {post.author && <span>{post.author}</span>}
                    <Badge variant={post.published ? 'default' : 'outline'} className="text-xs">
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                    {post.category && <Badge variant="outline" className="text-xs">{post.category}</Badge>}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => { setCurrentPost(post); setIsEditing(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => {
                    if (confirm('Delete this post?')) deletePostMutation.mutate(post.id);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts?.length === 0 && <p className="text-center text-muted-foreground py-8">No posts yet.</p>}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
