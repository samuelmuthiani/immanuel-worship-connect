
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPost {
  id: string;
  title: string;
  published_at: string;
  excerpt: string;
  content: string;
  author_id?: string;
}

const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to Our Blog',
    published_at: '2023-01-01',
    excerpt: 'This is the first post on our new blog. Stay tuned for more updates and inspiring content from our community.',
    content: '<p>We are excited to launch our blog where we will share the latest news, updates, and inspiring stories from our church community.</p>',
  },
  {
    id: '2',
    title: 'Building Community Through Faith',
    published_at: '2023-01-02',
    excerpt: 'Discover how our church community comes together to support one another through shared faith and fellowship.',
    content: '<p>Community is at the heart of everything we do. Through faith, fellowship, and service, we build lasting relationships that strengthen us all.</p>',
  },
  {
    id: '3',
    title: 'Upcoming Events and Activities',
    published_at: '2023-01-03',
    excerpt: 'Learn about the exciting events and activities planned for our community this month.',
    content: '<p>We have many wonderful events planned that will bring our community together in worship, fellowship, and service.</p>',
  },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(placeholderPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setPosts(data.map(post => ({
            ...post,
            excerpt: post.content.substring(0, 150) + '...'
          })));
        }
      } catch (err: any) {
        setError('Could not load blog posts.');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Layout>
      <PageContainer
        title="Blog & News"
        description="Stay updated with the latest news, stories, and insights from our church community."
        showBackButton={true}
        backTo="/"
        maxWidth="2xl"
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EnhancedCard key={i} className="h-64">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </EnhancedCard>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">
              {error}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We're showing some sample posts instead.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <EnhancedCard 
                key={post.id} 
                className="group cursor-pointer"
                hover={true}
                gradient={true}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-iwc-blue/10 text-iwc-blue dark:bg-iwc-orange/10 dark:text-iwc-orange">
                      Article
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-iwc-blue dark:group-hover:text-iwc-orange transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>Church Admin</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>2 min read</span>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400 text-lg">
              No blog posts available yet.
            </div>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Check back soon for updates from our community!
            </p>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Blog;
