
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, User, Tag, Play, Download, Share2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  thumbnail: string;
  duration: string;
  series: string;
  video_url?: string;
  audio_url?: string;
  topic?: string;
}

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    speaker: '',
    series: '',
    topic: '',
    date: ''
  });
  
  // Get unique values for filter dropdowns
  const speakers = [...new Set(sermons.map(sermon => sermon.speaker))];
  const series = [...new Set(sermons.map(sermon => sermon.series))];
  const topics = [...new Set(sermons.map(sermon => sermon.topic))];
  
  // Sample sermon data (replace with actual DB data when available)
  const sampleSermons: Sermon[] = [
    {
      id: '1',
      title: 'Finding Peace in Troubled Times',
      speaker: 'Pastor John Thompson',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      thumbnail: 'https://images.unsplash.com/photo-1571275293295-43b3cb72e8a7?q=80&w=400',
      duration: '38:24',
      series: 'Faith for Today',
      topic: 'Peace'
    },
    {
      id: '2',
      title: 'The Power of Prayer',
      speaker: 'Pastor Mary Thompson',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=400',
      duration: '42:15',
      series: 'Spiritual Disciplines',
      topic: 'Prayer'
    },
    {
      id: '3',
      title: 'Walking in God\'s Purpose',
      speaker: 'Pastor Michael Roberts',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
      thumbnail: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400',
      duration: '45:30',
      series: 'Destiny Series',
      topic: 'Purpose'
    },
    {
      id: '4',
      title: 'Grace Abounds',
      speaker: 'Pastor John Thompson',
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 4 weeks ago
      thumbnail: 'https://images.unsplash.com/photo-1494531835360-80e9790838b8?q=80&w=400',
      duration: '36:15',
      series: 'Grace Series',
      topic: 'Grace'
    },
    {
      id: '5',
      title: 'Living a Life of Worship',
      speaker: 'Pastor Mary Thompson',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 5 weeks ago
      thumbnail: 'https://images.unsplash.com/photo-1511448957602-417c5a0cb0e9?q=80&w=400',
      duration: '39:45',
      series: 'Spiritual Disciplines',
      topic: 'Worship'
    },
    {
      id: '6',
      title: 'Faith That Moves Mountains',
      speaker: 'Pastor Michael Roberts',
      date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(), // 6 weeks ago
      thumbnail: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=400',
      duration: '41:18',
      series: 'Faith for Today',
      topic: 'Faith'
    }
  ];

  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      try {
        // Try to fetch sermons from database
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false });
          
        if (data && data.length > 0) {
          setSermons(data);
        } else {
          // Use sample data if no sermons in database
          setSermons(sampleSermons);
        }
      } catch (error) {
        console.error('Error fetching sermons:', error);
        // Fallback to sample data
        setSermons(sampleSermons);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSermons();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...sermons];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(searchLower) ||
        sermon.speaker.toLowerCase().includes(searchLower) ||
        (sermon.series && sermon.series.toLowerCase().includes(searchLower)) ||
        (sermon.topic && sermon.topic.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply filters
    if (filters.speaker) {
      result = result.filter(sermon => sermon.speaker === filters.speaker);
    }
    
    if (filters.series) {
      result = result.filter(sermon => sermon.series === filters.series);
    }
    
    if (filters.topic) {
      result = result.filter(sermon => sermon.topic === filters.topic);
    }
    
    if (filters.date) {
      // Example: Simple date filtering logic - can be enhanced
      const now = new Date();
      switch (filters.date) {
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          result = result.filter(sermon => new Date(sermon.date) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          result = result.filter(sermon => new Date(sermon.date) >= monthAgo);
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          result = result.filter(sermon => new Date(sermon.date) >= yearAgo);
          break;
        default:
          break;
      }
    }
    
    setFilteredSermons(result);
  }, [sermons, searchTerm, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      speaker: '',
      series: '',
      topic: '',
      date: ''
    });
    setSearchTerm('');
  };
  
  const shareSermon = (id: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: `${window.location.origin}/sermons/${id}`
      }).catch(error => console.error('Error sharing:', error));
    } else {
      // Fallback
      const url = `${window.location.origin}/sermons/${id}`;
      navigator.clipboard.writeText(url);
      alert('Sermon link copied to clipboard!');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Sermons</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of messages that inspire growth, faith, and transformation.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search sermons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                className="md:hidden flex items-center justify-center"
                onClick={() => document.getElementById('filter-collapse')?.classList.toggle('hidden')}
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
            
            <div id="filter-collapse" className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                  <select
                    value={filters.speaker}
                    onChange={(e) => handleFilterChange('speaker', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="">All Speakers</option>
                    {speakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                  <select
                    value={filters.series}
                    onChange={(e) => handleFilterChange('series', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="">All Series</option>
                    {series.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <select
                    value={filters.topic}
                    onChange={(e) => handleFilterChange('topic', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="">All Topics</option>
                    {topics.map(topic => topic && (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <select
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sermons Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-iwc-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading sermons...</p>
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg mb-4">No sermons found matching your filters.</p>
              <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon) => (
                <div key={sermon.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={sermon.thumbnail} 
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="default" size="sm" className="bg-iwc-orange hover:bg-iwc-red">
                        <Play className="mr-2 h-4 w-4" /> Watch Now
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {sermon.duration}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{sermon.title}</h3>
                    
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 text-iwc-blue mr-2" />
                      <span className="text-gray-700">{sermon.speaker}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-iwc-blue mr-2" />
                      <span className="text-gray-700">
                        {new Date(sermon.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {sermon.series && (
                      <div className="flex items-center mb-4">
                        <Tag className="h-4 w-4 text-iwc-blue mr-2" />
                        <span className="text-gray-700">{sermon.series}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => shareSermon(sermon.id, sermon.title)}
                      >
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredSermons.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Sermons
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sermons;
