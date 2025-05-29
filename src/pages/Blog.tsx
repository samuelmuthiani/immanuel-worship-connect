
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock blog posts data - in a real app, this would come from Supabase
const mockPosts = [
  {
    id: '1',
    title: 'Finding Hope in Difficult Times',
    excerpt: 'Life often presents us with challenges that test our faith and resilience. In these moments, we must remember that hope is not lost...',
    content: 'Full article content here...',
    author: 'Pastor John Smith',
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'Faith',
    tags: ['hope', 'faith', 'encouragement'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'The Power of Community Prayer',
    excerpt: 'When we come together in prayer, something miraculous happens. Our individual voices unite to create a powerful chorus...',
    content: 'Full article content here...',
    author: 'Minister Sarah Johnson',
    publishedAt: '2024-01-10T14:30:00Z',
    category: 'Prayer',
    tags: ['prayer', 'community', 'unity'],
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Lessons from the Sermon on the Mount',
    excerpt: 'The teachings of Jesus in Matthew 5-7 continue to guide and challenge us today. Let us explore the timeless wisdom...',
    content: 'Full article content here...',
    author: 'Pastor John Smith',
    publishedAt: '2024-01-05T09:15:00Z',
    category: 'Teaching',
    tags: ['sermon', 'teaching', 'matthew'],
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=400&fit=crop'
  },
  {
    id: '4',
    title: 'Youth Ministry Updates',
    excerpt: 'Our youth ministry continues to grow and thrive. Here are some exciting updates about our recent activities...',
    content: 'Full article content here...',
    author: 'Youth Pastor Mike Wilson',
    publishedAt: '2024-01-01T16:00:00Z',
    category: 'Youth',
    tags: ['youth', 'ministry', 'updates'],
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=400&fit=crop'
  }
];

const categories = ['All', 'Faith', 'Prayer', 'Teaching', 'Youth', 'Events'];

const Blog = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, posts]);

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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Faith': 'bg-iwc-blue',
      'Prayer': 'bg-iwc-orange',
      'Teaching': 'bg-iwc-gold',
      'Youth': 'bg-iwc-red',
      'Events': 'bg-green-500'
    };
    return colors[category] || 'bg-gray-500';
  };

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
          {/* Search and Filter Section */}
          <EnhancedCard gradient={true} className="border-l-4 border-l-iwc-blue">
            <CardContent className="p-6">
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
                
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </EnhancedCard>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
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
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(post.category)} text-white`}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-iwc-blue dark:group-hover:text-iwc-orange transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red"
                    >
                      <Link to={`/blog/${post.id}`}>
                        Read More
                      </Link>
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
                Try adjusting your search terms or category filter.
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
