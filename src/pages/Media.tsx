import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Media = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchMedia = async () => {
      try {
        const { data: photoData } = await (supabase as any).from('media_photos').select('*').order('created_at', { ascending: false });
        const { data: videoData } = await (supabase as any).from('media_videos').select('*').order('created_at', { ascending: false });
        // Optionally add sermons table if available
        setPhotos(photoData || []);
        setVideos(videoData || []);
      } catch (err: any) {
        setError('Could not load media.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Media Gallery</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <section aria-labelledby="photos-heading" className="mb-12">
            <h2 id="photos-heading" className="text-2xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.url || photo.src}
                  alt={photo.alt || `Photo ${idx+1}`}
                  className="rounded shadow object-cover w-full h-40"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
          <section aria-labelledby="videos-heading" className="mb-12">
            <h2 id="videos-heading" className="text-2xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, idx) => (
                <div key={idx} className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={video.url || video.src}
                    title={video.title || `Video ${idx+1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 rounded shadow"
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Media;
