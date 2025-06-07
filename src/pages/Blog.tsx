
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Search, Tag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getAllBlogPosts, BlogPost } from '@/utils/blogUtils';

const Blog = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, posts]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const blogPosts = await getAllBlogPosts();
      
      if (blogPosts.length === 0) {
        // Use fallback data if no posts in database
        const fallbackPosts = [
          {
            id: 'fallback-1',
            title: 'Finding Hope in Difficult Times',
            content: 'Life often presents us with challenges that test our faith and resilience. In these moments, we must remember that hope is not lost...',
            author_id: 'fallback-author',
            published_at: '2024-01-15T10:00:00Z',
            author_email: 'pastor@iwc.com'
          },
          {
            id: 'fallback-2', 
            title: 'The Power of Community Prayer',
            content: 'When we come together in prayer, something miraculous happens. Our individual voices unite to create a powerful chorus...',
            author_id: 'fallback-author',
            published_at: '2024-01-10T14:30:00Z',
            author_email: 'minister@iwc.com'
          }
        ];
        setPosts(fallbackPosts);
      } else {
        setPosts(blogPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getAuthorName = (post: BlogPost) => {
    return post.author_email?.split('@')[0] || 'Church Admin';
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer
          title="Church Blog"
          description="Stay connected with our community through inspiring articles and teachings"
          showBackButton={true}
          backTo="/"
          maxWidth="2xl"
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iwc-blue mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
            </div>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer
        title="Church Blog"
        description="Stay connected with our community through inspiring articles, teachings, and updates"
        showBackButton={true}
        backTo="/"
        maxWidth="2xl"
      >
        <div className="space-y-8">
          {/* Header with admin actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {isAdmin && (
              <Button
                className="bg-iwc-blue hover:bg-iwc-orange text-white"
                onClick={() => toast({
                  title: 'Coming Soon',
                  description: 'Blog post creation will be available soon.'
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Blog Posts Grid */}
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, index) => (
                <EnhancedCard
                  key={post.id}
                  hover={true}
                  gradient={true}
                  className="overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-iwc-blue to-iwc-orange">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-iwc-blue dark:group-hover:text-iwc-orange transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {getExcerpt(post.content)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{getAuthorName(post)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red"
                      onClick={() => toast({
                        title: 'Coming Soon',
                        description: 'Individual blog post pages will be available soon.'
                      })}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or check back later for new posts.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-iwc-blue hover:bg-iwc-blue/90" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Blog;
