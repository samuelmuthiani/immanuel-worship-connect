
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile, UserProfile } from '@/utils/profileUtils';
import { ProfileDisplay } from './ProfileDisplay';
import { EnhancedProfileForm } from './EnhancedProfileForm';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function MemberProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile>({
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    avatar_url: '',
    bio: '',
    ministry: '',
    gender: '',
    age: undefined
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await getUserProfile();
      if (profile) {
        setProfileData(profile);
      } else {
        // Set default values if no profile exists
        setProfileData(prev => ({
          ...prev,
          id: user?.id || '',
          email: user?.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Reload profile to get updated data
    loadProfile();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    loadProfile();
  };

  const handleProfileUpdate = (updatedData: UserProfile) => {
    setProfileData(updatedData);
  };

  if (!user) {
    return (
      <ErrorMessage 
        title="Authentication Required"
        message="Please log in to view your profile."
      />
    );
  }

  if (isLoading) {
    return <LoadingIndicator message="Loading your profile..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Error Loading Profile"
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  return (
    <div className="space-y-6">
      {isEditing ? (
        <EnhancedProfileForm
          profileData={profileData}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <ProfileDisplay
          profileData={profileData}
          userEmail={user.email}
          memberSince={profileData.created_at || user.created_at}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
