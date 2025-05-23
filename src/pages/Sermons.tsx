
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, User, Tag, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Sermon {
  id: string;
  title: string;
  description?: string;
  speaker: string;
  date: string;
  series?: string;
  topic?: string;
  audio_url?: string;
  video_url?: string;
  notes_url?: string;
}

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    speaker: 'all',
    series: 'all',
    topic: 'all',
  });

  // Sample data - would be replaced by actual data from Supabase
  const sampleSermons: Sermon[] = [
    {
      id: '1',
      title: 'Living With Purpose',
      description: 'Discovering God\'s purpose for your life and fulfilling your divine destiny.',
      speaker: 'Pastor John Thompson',
      date: '2023-05-21',
      series: 'Purpose Driven Life',
      topic: 'Purpose',
      audio_url: 'https://example.com/sermons/living-with-purpose.mp3',
      video_url: 'https://www.youtube.com/watch?v=example1',
      notes_url: 'https://example.com/sermons/living-with-purpose.pdf',
    },
    {
      id: '2',
      title: 'Faith That Moves Mountains',
      description: 'How to build and grow your faith to overcome life\'s challenges.',
      speaker: 'Pastor Mary Thompson',
      date: '2023-05-14',
      series: 'Faith Series',
      topic: 'Faith',
      audio_url: 'https://example.com/sermons/faith-moves-mountains.mp3',
      video_url: 'https://www.youtube.com/watch?v=example2',
    },
    {
      id: '3',
      title: 'The Power of Prayer',
      description: 'Understanding the transformative power of prayer in your daily walk with God.',
      speaker: 'Pastor Michael Roberts',
      date: '2023-05-07',
      series: 'Prayer Warriors',
      topic: 'Prayer',
      audio_url: 'https://example.com/sermons/power-of-prayer.mp3',
      video_url: 'https://www.youtube.com/watch?v=example3',
      notes_url: 'https://example.com/sermons/power-of-prayer.pdf',
    },
  ];

  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('sermons')
        //   .select('*')
        //   .order('date', { ascending: false });
        
        // if (error) throw error;
        // setSermons(data || []);

        // For now, we'll use sample data
        setTimeout(() => {
          setSermons(sampleSermons);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching sermons:', err);
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  // Filter sermons based on search term and filters
  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = 
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpeaker = filters.speaker === 'all' || sermon.speaker === filters.speaker;
    const matchesSeries = filters.series === 'all' || sermon.series === filters.series;
    const matchesTopic = filters.topic === 'all' || sermon.topic === filters.topic;
    
    return matchesSearch && matchesSpeaker && matchesSeries && matchesTopic;
  });

  // Extract unique values for filters
  const speakers = ['all', ...new Set(sermons.map(sermon => sermon.speaker))];
  const series = ['all', ...new Set(sermons.filter(sermon => sermon.series).map(sermon => sermon.series as string))];
  const topics = ['all', ...new Set(sermons.filter(sermon => sermon.topic).map(sermon => sermon.topic as string))];

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Sermons & Resources</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our library of sermons, teachings, and resources to grow in your faith journey.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search sermons by title, description, or speaker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filters.speaker}
                onChange={(e) => setFilters({...filters, speaker: e.target.value})}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">All Speakers</option>
                {speakers.filter(s => s !== 'all').map(speaker => (
                  <option key={speaker} value={speaker}>{speaker}</option>
                ))}
              </select>
              
              <select
                value={filters.series}
                onChange={(e) => setFilters({...filters, series: e.target.value})}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">All Series</option>
                {series.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              
              <select
                value={filters.topic}
                onChange={(e) => setFilters({...filters, topic: e.target.value})}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">All Topics</option>
                {topics.filter(t => t !== 'all').map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sermons List */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iwc-blue"></div>
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No sermons found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {sermon.video_url ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe 
                        src={sermon.video_url.replace('watch?v=', 'embed/')} 
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-48 object-cover"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="h-48 bg-iwc-blue/10 flex items-center justify-center">
                      <span className="text-iwc-blue text-5xl">📚</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{sermon.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <Calendar size={16} className="mr-2 text-iwc-orange" />
                      <span>{new Date(sermon.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <User size={16} className="mr-2 text-iwc-orange" />
                      <span>{sermon.speaker}</span>
                    </div>
                    
                    {sermon.series && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <Tag size={16} className="mr-2 text-iwc-orange" />
                        <span>{sermon.series}</span>
                      </div>
                    )}
                    
                    {sermon.description && (
                      <p className="text-gray-600 mb-5 line-clamp-3">{sermon.description}</p>
                    )}
                    
                    <div className="flex space-x-3 mt-4">
                      {sermon.audio_url && (
                        <a 
                          href={sermon.audio_url} 
                          download
                          className="flex items-center bg-iwc-blue/10 hover:bg-iwc-blue/20 text-iwc-blue px-3 py-1 rounded-md transition-colors"
                        >
                          <Download size={16} className="mr-1" />
                          Audio
                        </a>
                      )}
                      
                      {sermon.notes_url && (
                        <a 
                          href={sermon.notes_url} 
                          download
                          className="flex items-center bg-iwc-orange/10 hover:bg-iwc-orange/20 text-iwc-orange px-3 py-1 rounded-md transition-colors"
                        >
                          <Download size={16} className="mr-1" />
                          Notes
                        </a>
                      )}
                      
                      <button
                        onClick={() => {
                          navigator.share({
                            title: sermon.title,
                            text: sermon.description,
                            url: window.location.href
                          }).catch(err => console.error('Error sharing:', err));
                        }}
                        className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors ml-auto"
                      >
                        <Share2 size={16} className="mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bible Study Resources */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Additional Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-iwc-blue">Bible Study Materials</h3>
                <p className="text-gray-600 mb-4">
                  Access our collection of Bible study guides, devotionals, and small group materials to deepen your understanding of God's Word.
                </p>
                <Button className="bg-iwc-blue hover:bg-iwc-orange">
                  Browse Bible Studies
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-iwc-orange">Online Bible</h3>
                <p className="text-gray-600 mb-4">
                  Read and study the Bible online in multiple translations. Feature includes search, notes, and highlighting tools.
                </p>
                <Button className="bg-iwc-orange hover:bg-iwc-blue">
                  Open Bible
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sermons;
