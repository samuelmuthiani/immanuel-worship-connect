import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, Video, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Sermon {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  audio_url: string | null;
  speaker: string | null;
  series: string | null;
  scripture_reference: string | null;
  sermon_date: string | null;
  published: boolean;
  created_at: string;
}

const SermonSkeleton = () => (
  <Card>
    <CardContent className="p-4 flex justify-between items-center">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const SermonManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSermon, setCurrentSermon] = useState<Partial<Sermon>>({});

  const { data: sermons, isLoading } = useQuery({
    queryKey: ['admin-sermons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false });
      if (error) throw error;
      return (data as Sermon[]) || [];
    }
  });

  const saveSermonMutation = useMutation({
    mutationFn: async (sermon: Partial<Sermon>) => {
      const sermonData = {
        title: sermon.title,
        description: sermon.description || null,
        video_url: sermon.video_url || null,
        audio_url: sermon.audio_url || null,
        speaker: sermon.speaker || null,
        series: sermon.series || null,
        scripture_reference: sermon.scripture_reference || null,
        sermon_date: sermon.sermon_date || null,
        published: sermon.published || false,
        updated_at: new Date().toISOString(),
      };

      if (sermon.id) {
        const { error } = await supabase.from('sermons').update(sermonData).eq('id', sermon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sermons').insert([sermonData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
      setIsEditing(false);
      setCurrentSermon({});
      toast({ title: 'Success', description: 'Sermon saved' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteSermonMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sermons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
      toast({ title: 'Deleted', description: 'Sermon removed' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Sermons</h2>
          <p className="text-sm text-muted-foreground">{sermons?.length || 0} sermons</p>
        </div>
        {!isEditing && (
          <Button onClick={() => { setCurrentSermon({ published: false, sermon_date: new Date().toISOString().split('T')[0] }); setIsEditing(true); }} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Sermon
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">{currentSermon.id ? 'Edit Sermon' : 'New Sermon'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sermon-title">Title</Label>
              <Input id="sermon-title" value={currentSermon.title || ''} onChange={e => setCurrentSermon({ ...currentSermon, title: e.target.value })} placeholder="Sermon title" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sermon-speaker">Speaker</Label>
                <Input id="sermon-speaker" value={currentSermon.speaker || ''} onChange={e => setCurrentSermon({ ...currentSermon, speaker: e.target.value })} placeholder="Pastor Name" />
              </div>
              <div>
                <Label htmlFor="sermon-date">Date</Label>
                <Input id="sermon-date" type="date" value={currentSermon.sermon_date || ''} onChange={e => setCurrentSermon({ ...currentSermon, sermon_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sermon-video">Video URL</Label>
                <Input id="sermon-video" value={currentSermon.video_url || ''} onChange={e => setCurrentSermon({ ...currentSermon, video_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label htmlFor="sermon-audio">Audio URL</Label>
                <Input id="sermon-audio" value={currentSermon.audio_url || ''} onChange={e => setCurrentSermon({ ...currentSermon, audio_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sermon-series">Series</Label>
                <Input id="sermon-series" value={currentSermon.series || ''} onChange={e => setCurrentSermon({ ...currentSermon, series: e.target.value })} placeholder="e.g. Book of Romans" />
              </div>
              <div>
                <Label htmlFor="sermon-scripture">Scripture Reference</Label>
                <Input id="sermon-scripture" value={currentSermon.scripture_reference || ''} onChange={e => setCurrentSermon({ ...currentSermon, scripture_reference: e.target.value })} placeholder="e.g. Romans 8:28" />
              </div>
            </div>
            <div>
              <Label htmlFor="sermon-desc">Description</Label>
              <Textarea id="sermon-desc" value={currentSermon.description || ''} onChange={e => setCurrentSermon({ ...currentSermon, description: e.target.value })} rows={4} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sermon-published" checked={currentSermon.published || false} onCheckedChange={checked => setCurrentSermon({ ...currentSermon, published: checked })} />
              <Label htmlFor="sermon-published">Published</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              <Button onClick={() => saveSermonMutation.mutate(currentSermon)} disabled={!currentSermon.title}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {isLoading ? (
            [1, 2, 3].map(n => <SermonSkeleton key={n} />)
          ) : sermons?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sermons yet.</p>
          ) : (
            sermons?.map(sermon => (
              <Card key={sermon.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{sermon.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      {sermon.speaker && <span>{sermon.speaker}</span>}
                      {sermon.sermon_date && <span>• {new Date(sermon.sermon_date).toLocaleDateString()}</span>}
                      {sermon.series && <Badge variant="outline" className="text-xs">{sermon.series}</Badge>}
                      <Badge variant={sermon.published ? 'default' : 'outline'} className="text-xs">
                        {sermon.published ? 'Published' : 'Draft'}
                      </Badge>
                      <div className="flex gap-1">
                        {sermon.video_url && <Video className="h-3.5 w-3.5 text-primary" />}
                        {sermon.audio_url && <Mic className="h-3.5 w-3.5 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentSermon(sermon); setIsEditing(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => {
                      if (confirm('Delete this sermon?')) deleteSermonMutation.mutate(sermon.id);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SermonManager;
