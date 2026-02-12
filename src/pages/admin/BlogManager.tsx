
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Eye, Save, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Type definition for a Post
interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image: string | null;
    published: boolean;
    created_at: string;
}

const BlogManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<Post>>({});

    // Fetch Posts
    const { data: posts, isLoading } = useQuery({
        queryKey: ['admin-posts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Post[];
        }
    });

    // Create/Update Mutation
    const savePostMutation = useMutation({
        mutationFn: async (post: Partial<Post>) => {
            // Basic slug generation if missing
            const slug = post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'untitled';

            const postData = {
                ...post,
                slug, // Ensure slug is present
                updated_at: new Date().toISOString(),
            };

            if (post.id) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', post.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
            setIsEditing(false);
            setCurrentPost({});
            toast({ title: 'Success', description: 'Post saved successfully' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    // Delete Mutation
    const deletePostMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
            toast({ title: 'Success', description: 'Post deleted' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const handleEdit = (post: Post) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentPost({ published: false });
        setIsEditing(true);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Blog Management</h2>
                {!isEditing && (
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                )}
            </div>

            {isEditing ? (
                <EnhancedCard>
                    <CardHeader>
                        <CardTitle>{currentPost.id ? 'Edit Post' : 'Create New Post'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={currentPost.title || ''}
                                onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                                placeholder="Enter post title"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="slug">Slug (URL friendly)</Label>
                                <Input
                                    id="slug"
                                    value={currentPost.slug || ''}
                                    onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                    placeholder="my-new-post"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    id="published"
                                    checked={currentPost.published}
                                    onCheckedChange={checked => setCurrentPost({ ...currentPost, published: checked })}
                                />
                                <Label htmlFor="published">Published</Label>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="excerpt">Excerpt (Short summary)</Label>
                            <Textarea
                                id="excerpt"
                                value={currentPost.excerpt || ''}
                                onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="content">Content (Markdown supported)</Label>
                            <Textarea
                                id="content"
                                value={currentPost.content || ''}
                                onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                rows={10}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={() => savePostMutation.mutate(currentPost)}>
                                <Save className="mr-2 h-4 w-4" /> Save Post
                            </Button>
                        </div>
                    </CardContent>
                </EnhancedCard>
            ) : (
                <div className="grid gap-4">
                    {posts?.map(post => (
                        <EnhancedCard key={post.id} className="p-4 flex justify-between items-center bg-white/50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-sm text-gray-500">{post.slug} • {post.published ? 'Published' : 'Draft'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => {
                                    if (confirm('Are you sure you want to delete this post?')) deletePostMutation.mutate(post.id);
                                }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </EnhancedCard>
                    ))}
                    {posts?.length === 0 && <p className="text-center text-gray-500 py-8">No posts found. Create one to get started.</p>}
                </div>
            )}
        </div>
    );
};

export default BlogManager;
