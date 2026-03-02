
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  published: boolean | null;
  author: string | null;
  category: string | null;
  created_at: string;
}

const Blog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const postsPerPage = 6;

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({ title: 'Error', description: 'Failed to load blog posts.', variant: 'destructive' });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterPosts = useCallback(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchTerm]);

  useEffect(() => { fetchBlogPosts(); }, [fetchBlogPosts]);
  useEffect(() => { filterPosts(); }, [filterPosts]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown date';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Unknown date';
    }
  };

  const getExcerpt = (content: string | null, maxLength: number = 150) => {
    if (!content) return 'No content available.';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer title="Church Blog" description="Stay connected with our community" showBackButton={true} backTo="/" maxWidth="2xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer title="Church Blog" description="Stay connected with our community through inspiring articles and teachings" showBackButton={true} backTo="/" maxWidth="2xl">
        <div className="space-y-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <p className="text-muted-foreground text-center">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          </p>

          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, index) => (
                <EnhancedCard key={post.id} hover={true} gradient={true} className="overflow-hidden group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-iwc-blue to-iwc-orange">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {getExcerpt(post.excerpt || post.content)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author || 'Church Admin'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    {post.category && (
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    )}

                    <Button
                      className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red"
                      onClick={() => setSelectedPost(post)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)}>{page}</Button>
              ))}
              <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          )}
        </div>

        {/* Blog Post Detail Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedPost?.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                {selectedPost?.author && (
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{selectedPost.author}</span>
                )}
                {selectedPost?.created_at && (
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(selectedPost.created_at)}</span>
                )}
                {selectedPost?.category && <Badge variant="outline">{selectedPost.category}</Badge>}
              </div>
            </DialogHeader>
            <div className="prose prose-sm max-w-none dark:prose-invert mt-4 whitespace-pre-wrap">
              {selectedPost?.content || 'No content available.'}
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  );
};

export default Blog;
