
import React, { useState, useEffect, useCallback } from 'react';
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
  speaker: string | null;
  sermon_date: string | null;
  description: string | null;
  video_url: string | null;
  audio_url: string | null;
  series: string | null;
  scripture_reference: string | null;
  published: boolean | null;
}

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('published', true)
        .order('sermon_date', { ascending: false });

      if (error) throw error;
      setSermons((data as Sermon[]) || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sermons. Please try again.',
        variant: 'destructive'
      });
      setSermons([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterSermons = useCallback(() => {
    let filtered = sermons;
    if (searchTerm) {
      filtered = filtered.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.speaker || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.series || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(sermon => sermon.series === selectedSeries);
    }
    setFilteredSermons(filtered);
  }, [sermons, searchTerm, selectedSeries]);

  useEffect(() => { fetchSermons(); }, [fetchSermons]);
  useEffect(() => { filterSermons(); }, [filterSermons]);

  const handleWatchNow = (sermon: Sermon) => {
    if (sermon.video_url) {
      window.open(sermon.video_url, '_blank');
    } else {
      toast({ title: 'Video Unavailable', description: 'This sermon video is currently not available.', variant: 'destructive' });
    }
  };

  const handleDownload = (sermon: Sermon) => {
    if (sermon.audio_url) {
      window.open(sermon.audio_url, '_blank');
      toast({ title: 'Download Started', description: `Downloading audio for "${sermon.title}"` });
    } else {
      toast({ title: 'Download Unavailable', description: 'No downloadable content available.', variant: 'destructive' });
    }
  };

  const handleShare = async (sermon: Sermon) => {
    const shareData = {
      title: sermon.title,
      text: `Check out this sermon: "${sermon.title}" by ${sermon.speaker || 'IWC'}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        toast({ title: 'Link Copied', description: 'Sermon link copied to clipboard!' });
      }
    } catch {
      toast({ title: 'Share Failed', description: 'Unable to share this sermon.', variant: 'destructive' });
    }
  };

  const uniqueSeries = Array.from(new Set(sermons.map(s => s.series).filter(Boolean)));

  return (
    <Layout>
      <div className="min-h-screen bg-background transition-colors">
        <div className="bg-gradient-to-r from-iwc-blue to-iwc-orange text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons & Messages</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Be inspired by God's Word through our weekly messages and sermon series
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search sermons, speakers, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
              >
                <option value="all">All Series</option>
                {uniqueSeries.map(series => (
                  <option key={series} value={series!}>{series}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sermons...</div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No sermons found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredSermons.map((sermon, index) => (
                <EnhancedCard
                  key={sermon.id}
                  className="overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  hover={true}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-iwc-blue/20 to-iwc-orange/20 overflow-hidden flex items-center justify-center">
                    <div className="text-center p-4">
                      <Play className="h-10 w-10 text-primary mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">{sermon.scripture_reference || 'Sermon'}</p>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      {sermon.series && (
                        <Badge variant="secondary" className="text-xs">{sermon.series}</Badge>
                      )}
                      {sermon.sermon_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(sermon.sermon_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2 text-foreground">{sermon.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {sermon.speaker && (
                      <div className="flex items-center mb-3 text-sm text-primary">
                        <User className="h-4 w-4 mr-2" />
                        {sermon.speaker}
                      </div>
                    )}
                    {sermon.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{sermon.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleWatchNow(sermon)} size="sm" className="bg-iwc-blue hover:bg-iwc-orange text-white flex-1">
                        <Play className="h-3 w-3 mr-1" /> Watch
                      </Button>
                      <Button onClick={() => handleDownload(sermon)} size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                      <Button onClick={() => handleShare(sermon)} size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sermons;
