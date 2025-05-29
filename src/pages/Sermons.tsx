
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Play, Download, Share2, Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  description?: string;
  video_url?: string;
  audio_url?: string;
  download_url?: string;
  series?: string;
  duration?: string;
  thumbnail?: string;
  tags?: string[];
}

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const sermonsPerPage = 6;

  useEffect(() => {
    fetchSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [sermons, searchTerm, selectedSeries]);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section', 'sermons')
        .maybeSingle();

      let sermonsData: Sermon[] = [];

      if (data && data.content) {
        sermonsData = JSON.parse(data.content);
      } else {
        // Fallback to placeholder data
        sermonsData = [
          {
            id: '1',
            title: 'Finding Peace in Troubled Times',
            speaker: 'Pastor John Thompson',
            date: '2024-05-20',
            description: 'In a world filled with uncertainty, discover how God\'s peace can guard your heart and mind.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            audio_url: '/sermons/audio/peace-troubled-times.mp3',
            download_url: '/sermons/downloads/peace-troubled-times.pdf',
            series: 'Faith for Today',
            duration: '38:24',
            thumbnail: 'https://images.unsplash.com/photo-1571275293295-43b3cb72e8a7?q=80&w=400',
            tags: ['Peace', 'Faith', 'Comfort']
          },
          {
            id: '2',
            title: 'The Power of Prayer',
            speaker: 'Pastor Mary Thompson',
            date: '2024-05-13',
            description: 'Understanding the transformative power of prayer in our daily lives.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            audio_url: '/sermons/audio/power-of-prayer.mp3',
            download_url: '/sermons/downloads/power-of-prayer.pdf',
            series: 'Spiritual Disciplines',
            duration: '42:15',
            thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=400',
            tags: ['Prayer', 'Spiritual Growth', 'Discipline']
          },
          {
            id: '3',
            title: 'Walking in God\'s Purpose',
            speaker: 'Pastor Michael Roberts',
            date: '2024-05-06',
            description: 'Discovering and fulfilling the unique purpose God has for your life.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            audio_url: '/sermons/audio/gods-purpose.mp3',
            download_url: '/sermons/downloads/gods-purpose.pdf',
            series: 'Destiny Series',
            duration: '45:30',
            thumbnail: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400',
            tags: ['Purpose', 'Calling', 'Destiny']
          },
          {
            id: '4',
            title: 'Love Without Limits',
            speaker: 'Pastor John Thompson',
            date: '2024-04-29',
            description: 'Exploring the boundless love of God and how it transforms our relationships.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            audio_url: '/sermons/audio/love-without-limits.mp3',
            download_url: '/sermons/downloads/love-without-limits.pdf',
            series: 'Faith for Today',
            duration: '40:12',
            thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400',
            tags: ['Love', 'Relationships', 'Grace']
          }
        ];
      }

      setSermons(sermonsData);
      setHasMore(sermonsData.length >= sermonsPerPage);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sermons. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSermons = () => {
    let filtered = sermons;

    if (searchTerm) {
      filtered = filtered.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.series?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSeries !== 'all') {
      filtered = filtered.filter(sermon => sermon.series === selectedSeries);
    }

    setFilteredSermons(filtered);
  };

  const handleWatchNow = (sermon: Sermon) => {
    if (sermon.video_url) {
      window.open(sermon.video_url, '_blank');
      toast({
        title: 'Opening Video',
        description: `Playing "${sermon.title}"`,
      });
    } else {
      toast({
        title: 'Video Unavailable',
        description: 'This sermon video is currently not available.',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = (sermon: Sermon) => {
    if (sermon.download_url) {
      const link = document.createElement('a');
      link.href = sermon.download_url;
      link.download = `${sermon.title}.pdf`;
      link.click();
      toast({
        title: 'Download Started',
        description: `Downloading "${sermon.title}"`,
      });
    } else if (sermon.audio_url) {
      const link = document.createElement('a');
      link.href = sermon.audio_url;
      link.download = `${sermon.title}.mp3`;
      link.click();
      toast({
        title: 'Download Started',
        description: `Downloading audio for "${sermon.title}"`,
      });
    } else {
      toast({
        title: 'Download Unavailable',
        description: 'No downloadable content available for this sermon.',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async (sermon: Sermon) => {
    const shareData = {
      title: sermon.title,
      text: `Check out this sermon: "${sermon.title}" by ${sermon.speaker}`,
      url: window.location.href + `#sermon-${sermon.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: 'Shared Successfully',
          description: `"${sermon.title}" has been shared.`,
        });
      } else {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        toast({
          title: 'Link Copied',
          description: 'Sermon link copied to clipboard!',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Share Failed',
        description: 'Unable to share this sermon.',
        variant: 'destructive'
      });
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      // Simulate loading more sermons
      const newSermons = sermons.slice(0, Math.min(sermons.length + sermonsPerPage, sermons.length));
      
      if (newSermons.length === sermons.length) {
        setHasMore(false);
        toast({
          title: 'All Sermons Loaded',
          description: 'You\'ve reached the end of our sermon collection.',
        });
      }
      
      setPage(page + 1);
    } catch (error) {
      console.error('Error loading more sermons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more sermons.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueSeries = Array.from(new Set(sermons.map(s => s.series).filter(Boolean)));

  const displayedSermons = filteredSermons.slice(0, page * sermonsPerPage);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-iwc-blue to-iwc-orange text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons & Messages</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Be inspired by God's Word through our weekly messages and sermon series
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search sermons, speakers, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Series</option>
                {uniqueSeries.map(series => (
                  <option key={series} value={series}>{series}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedSermons.map((sermon, index) => (
              <EnhancedCard 
                key={sermon.id} 
                className="overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                hover={true}
                gradient={false}
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={sermon.thumbnail} 
                    alt={sermon.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      onClick={() => handleWatchNow(sermon)}
                      className="bg-iwc-orange hover:bg-iwc-red text-white"
                    >
                      <Play className="mr-2 h-4 w-4" /> Watch Now
                    </Button>
                  </div>
                  {sermon.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {sermon.duration}
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    {sermon.series && (
                      <Badge variant="secondary" className="text-xs">
                        {sermon.series}
                      </Badge>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(sermon.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-white">
                    {sermon.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center mb-3 text-sm text-iwc-blue dark:text-iwc-orange">
                    <User className="h-4 w-4 mr-2" />
                    {sermon.speaker}
                  </div>
                  
                  {sermon.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {sermon.description}
                    </p>
                  )}
                  
                  {sermon.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {sermon.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleWatchNow(sermon)}
                      size="sm" 
                      className="bg-iwc-blue hover:bg-iwc-orange text-white flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" /> Watch
                    </Button>
                    <Button 
                      onClick={() => handleDownload(sermon)}
                      size="sm" 
                      variant="outline"
                      className="border-iwc-blue text-iwc-blue hover:bg-iwc-blue hover:text-white dark:border-iwc-orange dark:text-iwc-orange dark:hover:bg-iwc-orange"
                    >
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                    <Button 
                      onClick={() => handleShare(sermon)}
                      size="sm" 
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && displayedSermons.length < filteredSermons.length && (
            <div className="text-center">
              <Button 
                onClick={handleLoadMore}
                disabled={loading}
                size="lg"
                className="bg-iwc-orange hover:bg-iwc-red text-white"
              >
                {loading ? 'Loading...' : 'Load More Sermons'}
              </Button>
            </div>
          )}

          {filteredSermons.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No sermons found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sermons;
