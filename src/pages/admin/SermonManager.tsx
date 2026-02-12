
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, Video, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Sermon {
    id: string;
    title: string;
    description: string;
    video_url: string | null;
    audio_url: string | null;
    speaker: string;
    series: string | null;
    date_preached: string;
    created_at: string;
}

const SermonManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [currentSermon, setCurrentSermon] = useState<Partial<Sermon>>({});

    // Fetch Sermons
    const { data: sermons, isLoading } = useQuery({
        queryKey: ['admin-sermons'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('sermons')
                .select('*')
                .order('date_preached', { ascending: false });

            if (error) throw error;
            return data as Sermon[];
        }
    });

    // Create/Update Mutation
    const saveSermonMutation = useMutation({
        mutationFn: async (sermon: Partial<Sermon>) => {
            const sermonData = {
                ...sermon,
                updated_at: new Date().toISOString(),
            };

            if (sermon.id) {
                const { error } = await supabase
                    .from('sermons')
                    .update(sermonData)
                    .eq('id', sermon.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('sermons')
                    .insert([sermonData]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
            setIsEditing(false);
            setCurrentSermon({});
            toast({ title: 'Success', description: 'Sermon saved successfully' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    // Delete Mutation
    const deleteSermonMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('sermons').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
            toast({ title: 'Success', description: 'Sermon deleted' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const handleEdit = (sermon: Sermon) => {
        setCurrentSermon(sermon);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentSermon({ date_preached: new Date().toISOString().split('T')[0] });
        setIsEditing(true);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sermon Management</h2>
                {!isEditing && (
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> New Sermon
                    </Button>
                )}
            </div>

            {isEditing ? (
                <EnhancedCard>
                    <CardHeader>
                        <CardTitle>{currentSermon.id ? 'Edit Sermon' : 'Add New Sermon'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={currentSermon.title || ''}
                                onChange={e => setCurrentSermon({ ...currentSermon, title: e.target.value })}
                                placeholder="Sermon title"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="speaker">Speaker</Label>
                                <Input
                                    id="speaker"
                                    value={currentSermon.speaker || ''}
                                    onChange={e => setCurrentSermon({ ...currentSermon, speaker: e.target.value })}
                                    placeholder="Pastor Name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="date">Date Preached</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={currentSermon.date_preached || ''}
                                    onChange={e => setCurrentSermon({ ...currentSermon, date_preached: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="video">Video URL (YouTube/Vimeo)</Label>
                                <Input
                                    id="video"
                                    value={currentSermon.video_url || ''}
                                    onChange={e => setCurrentSermon({ ...currentSermon, video_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="audio">Audio URL (Podcast)</Label>
                                <Input
                                    id="audio"
                                    value={currentSermon.audio_url || ''}
                                    onChange={e => setCurrentSermon({ ...currentSermon, audio_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="series">Series (Optional)</Label>
                            <Input
                                id="series"
                                value={currentSermon.series || ''}
                                onChange={e => setCurrentSermon({ ...currentSermon, series: e.target.value })}
                                placeholder="e.g. The Book of Romans"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={currentSermon.description || ''}
                                onChange={e => setCurrentSermon({ ...currentSermon, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={() => saveSermonMutation.mutate(currentSermon)}>
                                <Save className="mr-2 h-4 w-4" /> Save Sermon
                            </Button>
                        </div>
                    </CardContent>
                </EnhancedCard>
            ) : (
                <div className="grid gap-4">
                    {sermons?.map(sermon => (
                        <EnhancedCard key={sermon.id} className="p-4 flex justify-between items-center bg-white/50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="font-semibold text-lg">{sermon.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {sermon.speaker} • {new Date(sermon.date_preached).toLocaleDateString()}
                                    {sermon.series && ` • Series: ${sermon.series}`}
                                </p>
                                <div className="flex gap-2 mt-1">
                                    {sermon.video_url && <Video className="h-4 w-4 text-blue-500" />}
                                    {sermon.audio_url && <Mic className="h-4 w-4 text-green-500" />}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(sermon)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => {
                                    if (confirm('Are you sure you want to delete this sermon?')) deleteSermonMutation.mutate(sermon.id);
                                }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </EnhancedCard>
                    ))}
                    {sermons?.length === 0 && <p className="text-center text-gray-500 py-8">No sermons found. Add one to get started.</p>}
                </div>
            )}
        </div>
    );
};

export default SermonManager;
