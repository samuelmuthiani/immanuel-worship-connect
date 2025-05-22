import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to Our Blog',
    date: '2023-01-01',
    excerpt: 'This is the first post on our new blog. Stay tuned for more updates.',
    content: '<p>We are excited to launch our blog where we will share the latest news and updates.</p>',
  },
  {
    id: '2',
    title: 'Another Blog Post',
    date: '2023-01-02',
    excerpt: 'Here is another post to keep you updated.',
    content: '<p>More content will be added soon. Stay tuned!</p>',
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
        const { data, error } = await (supabase as any)
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError('Could not load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog & News</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded shadow p-6" aria-labelledby={`post-title-${post.id}`}> 
              <header>
                <h2 id={`post-title-${post.id}`} className="text-2xl font-semibold mb-2">{post.title}</h2>
                <time className="block text-sm text-gray-500 mb-2" dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
              </header>
              <div className="prose max-w-none text-gray-900" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
