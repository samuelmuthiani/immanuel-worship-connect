
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Image, Play } from 'lucide-react';

interface MediaPhoto { id?: string; url?: string; src?: string; alt?: string; created_at?: string; }
interface MediaVideo { id?: string; url?: string; src?: string; title?: string; created_at?: string; }

const Media = () => {
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data: photoData } = await supabase.from('media_photos').select('*').order('created_at', { ascending: false });
        const { data: videoData } = await supabase.from('media_videos').select('*').order('created_at', { ascending: false });
        setPhotos(photoData || []);
        setVideos(videoData || []);
      } catch { }
      finally { setLoading(false); }
    };
    fetchMedia();
  }, []);

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Gallery</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Media Gallery</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Photos and videos from our services, events, and community life.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading media...</div>
          ) : (
            <>
              {photos.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-border aspect-square group">
                        <img src={photo.url || photo.src} alt={photo.alt || `Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-border">
                        <iframe src={video.url || video.src} title={video.title || `Video ${idx + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-64" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {photos.length === 0 && videos.length === 0 && (
                <div className="text-center py-16">
                  <Image className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>No media yet</h3>
                  <p className="text-muted-foreground">Check back soon for photos and videos.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Media;
