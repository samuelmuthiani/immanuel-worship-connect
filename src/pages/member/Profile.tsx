
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Save, Upload } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        bio: '',
        ministry: '',
        gender: '',
        avatar_url: ''
    });

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            if (!user) return;
            const profile = await authService.getProfile(user.id);
            if (profile) {
                setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    bio: profile.bio || '',
                    ministry: profile.ministry || '',
                    gender: profile.gender || '',
                    avatar_url: profile.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to load profile data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user, loadProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (!user) return;
            await authService.updateProfile(user.id, formData);
            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!user) throw new Error('Authentication required');
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));

            toast({ title: 'Success', description: 'Avatar uploaded!' });

        } catch (error: unknown) {
            toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Layout>
            <PageContainer title="My Profile" description="Manage your personal information">
                <EnhancedCard className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Edit Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <label htmlFor="avatar-upload" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3 flex items-center text-sm font-medium shadow-sm transition-colors">
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                        Change Avatar
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        id="gender"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ministry">Ministry</Label>
                                <Input
                                    id="ministry"
                                    value={formData.ministry}
                                    placeholder="e.g. Choir, Ushering, Media"
                                    onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Profile
                            </Button>

                        </form>
                    </CardContent>
                </EnhancedCard>
            </PageContainer>
        </Layout>
    );
};

export default Profile;
