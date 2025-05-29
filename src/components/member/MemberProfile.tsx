
import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    avatar_url: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile(); // Reset to original data
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a file storage service
      // For now, we'll just create a local URL for preview
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar_url: url }));
      
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated.',
      });
    }
  };

  if (!user) {
    return (
      <EnhancedCard>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </CardContent>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
          <User className="mr-3 h-6 w-6 text-iwc-blue" />
          My Profile
        </CardTitle>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-iwc-blue hover:bg-iwc-orange text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {profileData.avatar_url ? (
                <img 
                  src={profileData.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-iwc-blue hover:bg-iwc-orange text-white rounded-full p-2 cursor-pointer transition-colors">
                <Camera className="h-4 w-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  className="hidden" 
                />
              </label>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profileData.first_name || profileData.last_name 
                ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
                : user.email?.split('@')[0] || 'Member'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            {isEditing ? (
              <Input
                name="first_name"
                value={profileData.first_name || ''}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {profileData.first_name || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <Input
                name="last_name"
                value={profileData.last_name || ''}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {profileData.last_name || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                name="phone"
                type="tel"
                value={profileData.phone || ''}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {profileData.phone || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            {isEditing ? (
              <Input
                name="date_of_birth"
                type="date"
                value={profileData.date_of_birth || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {profileData.date_of_birth 
                  ? new Date(profileData.date_of_birth).toLocaleDateString()
                  : 'Not provided'
                }
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          {isEditing ? (
            <Input
              name="address"
              value={profileData.address || ''}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
              {profileData.address || 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio / About Me
          </label>
          {isEditing ? (
            <Textarea
              name="bio"
              value={profileData.bio || ''}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself..."
              rows={4}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 min-h-[100px]">
              {profileData.bio || 'No bio provided'}
            </p>
          )}
        </div>

        {/* Account Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Account Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </label>
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {user.created_at 
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'Not available'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </EnhancedCard>
  );
}
