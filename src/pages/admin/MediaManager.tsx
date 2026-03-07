
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, Image, Video, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaPhoto {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

interface MediaVideo {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

const MediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<MediaPhoto>>({});
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<MediaVideo>>({});
  const [uploading, setUploading] = useState(false);

  const { data: photos, isLoading: loadingPhotos, isError: isErrorPhotos, error: errorPhotos } = useQuery({
    queryKey: ['admin-photos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('media_photos').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }
      return (data as MediaPhoto[]) || [];
    }
  });

  const { data: videos, isLoading: loadingVideos, isError: isErrorVideos, error: errorVideos } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('media_videos').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      return (data as MediaVideo[]) || [];
    }
  });

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast({ title: 'Invalid file', description: `${file.name} is not an image`, variant: 'destructive' });
          continue;
        }
        const url = await uploadFile(file, 'photos');
        const { error } = await supabase.from('media_photos').insert([{
          url,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: null,
          description: null,
        }]);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      toast({ title: 'Success', description: `${files.length} photo(s) uploaded` });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const savePhotoMutation = useMutation({
    mutationFn: async (photo: Partial<MediaPhoto>) => {
      const photoData = { url: photo.url!, title: photo.title || null, description: photo.description || null, category: photo.category || null };
      if (photo.id) {
        const { error } = await supabase.from('media_photos').update(photoData).eq('id', photo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('media_photos').insert([photoData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      setIsEditingPhoto(false);
      setCurrentPhoto({});
      toast({ title: 'Success', description: 'Photo saved successfully' });
    },
    onError: (error: Error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media_photos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      toast({ title: 'Deleted', description: 'Photo removed' });
    },
    onError: (error: Error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  const saveVideoMutation = useMutation({
    mutationFn: async (video: Partial<MediaVideo>) => {
      const videoData = { url: video.url!, title: video.title || null, description: video.description || null, category: video.category || null };
      if (video.id) {
        const { error } = await supabase.from('media_videos').update(videoData).eq('id', video.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('media_videos').insert([videoData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setIsEditingVideo(false);
      setCurrentVideo({});
      toast({ title: 'Success', description: 'Video saved successfully' });
    },
    onError: (error: Error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({ title: 'Deleted', description: 'Video removed' });
    },
    onError: (error: Error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  if (isErrorPhotos || isErrorVideos) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-6 text-center">
          <p className="text-destructive font-medium mb-4">Failed to load media assets</p>
          <p className="text-sm text-muted-foreground mb-4">{(errorPhotos || errorVideos as any)?.message}</p>
          <Button variant="outline" size="sm" onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
            queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
          }}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loadingPhotos || loadingVideos) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Media Gallery</h2>
      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoFileSelect} />

      <Tabs defaultValue="photos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="photos" className="flex items-center gap-2"><Image className="h-4 w-4" /> Photos ({photos?.length || 0})</TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2"><Video className="h-4 w-4" /> Videos ({videos?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={() => photoInputRef.current?.click()} size="sm" variant="outline" disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
            {!isEditingPhoto && (
              <Button onClick={() => { setCurrentPhoto({}); setIsEditingPhoto(true); }} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add by URL
              </Button>
            )}
          </div>

          {isEditingPhoto ? (
            <Card>
              <CardHeader><CardTitle className="text-lg">{currentPhoto.id ? 'Edit Photo' : 'Add Photo'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Image URL</Label><Input value={currentPhoto.url || ''} onChange={e => setCurrentPhoto({ ...currentPhoto, url: e.target.value })} placeholder="https://..." /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Title</Label><Input value={currentPhoto.title || ''} onChange={e => setCurrentPhoto({ ...currentPhoto, title: e.target.value })} /></div>
                  <div><Label>Category</Label><Input value={currentPhoto.category || ''} onChange={e => setCurrentPhoto({ ...currentPhoto, category: e.target.value })} placeholder="e.g. Worship" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={currentPhoto.description || ''} onChange={e => setCurrentPhoto({ ...currentPhoto, description: e.target.value })} rows={2} /></div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditingPhoto(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                  <Button onClick={() => savePhotoMutation.mutate(currentPhoto)} disabled={!currentPhoto.url}><Save className="mr-2 h-4 w-4" /> Save</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {photos?.map(photo => (
                <Card key={photo.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={photo.url} alt={photo.title || 'Photo'} className="w-12 h-12 rounded object-cover border border-border" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{photo.title || 'Untitled'}</h3>
                        <p className="text-xs text-muted-foreground">{photo.category || 'No category'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon" onClick={() => { setCurrentPhoto(photo); setIsEditingPhoto(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if (confirm('Delete?')) deletePhotoMutation.mutate(photo.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {photos?.length === 0 && <p className="text-center text-muted-foreground py-8">No photos yet. Upload some!</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-end">
            {!isEditingVideo && (
              <Button onClick={() => { setCurrentVideo({}); setIsEditingVideo(true); }} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            )}
          </div>

          {isEditingVideo ? (
            <Card>
              <CardHeader><CardTitle className="text-lg">{currentVideo.id ? 'Edit Video' : 'Add Video'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Video URL (YouTube/Vimeo embed URL)</Label><Input value={currentVideo.url || ''} onChange={e => setCurrentVideo({ ...currentVideo, url: e.target.value })} placeholder="https://www.youtube.com/embed/..." /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Title</Label><Input value={currentVideo.title || ''} onChange={e => setCurrentVideo({ ...currentVideo, title: e.target.value })} /></div>
                  <div><Label>Category</Label><Input value={currentVideo.category || ''} onChange={e => setCurrentVideo({ ...currentVideo, category: e.target.value })} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={currentVideo.description || ''} onChange={e => setCurrentVideo({ ...currentVideo, description: e.target.value })} rows={2} /></div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditingVideo(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                  <Button onClick={() => saveVideoMutation.mutate(currentVideo)} disabled={!currentVideo.url}><Save className="mr-2 h-4 w-4" /> Save</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {videos?.map(video => (
                <Card key={video.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center border border-border"><Video className="h-5 w-5 text-muted-foreground" /></div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{video.title || 'Untitled'}</h3>
                        <p className="text-xs text-muted-foreground">{video.category || 'No category'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon" onClick={() => { setCurrentVideo(video); setIsEditingVideo(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if (confirm('Delete?')) deleteVideoMutation.mutate(video.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {videos?.length === 0 && <p className="text-center text-muted-foreground py-8">No videos yet.</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManager;
