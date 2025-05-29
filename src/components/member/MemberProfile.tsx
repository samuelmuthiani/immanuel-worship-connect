
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/utils/storage';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
}

export function MemberProfile() {
  const [profile, setProfile] = useState<ProfileData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getUserProfile();
      if (profileData) {
        setProfile(profileData);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateUserProfile(profile);
    
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-iwc-blue" />
          <span>My Profile</span>
        </CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-iwc-blue to-iwc-orange text-white text-xl">
              {profile.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.first_name || profile.last_name 
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                : 'Member'
              }
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active Member
            </Badge>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            {isEditing ? (
              <Input
                id="first_name"
                value={profile.first_name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter your first name"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                {profile.first_name || 'Not provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditing ? (
              <Input
                id="last_name"
                value={profile.last_name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter your last name"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                {profile.last_name || 'Not provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profile.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="date_of_birth"
                type="date"
                value={profile.date_of_birth || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <Input
              id="address"
              value={profile.address || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter your address"
            />
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{profile.address || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          ) : (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm min-h-[60px]">
              {profile.bio || 'No bio provided'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
