
import React from 'react';
import { User, Edit, Calendar, Phone, MapPin, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { UserProfile } from '@/utils/profileUtils';

interface ProfileDisplayProps {
  profileData: UserProfile;
  userEmail?: string;
  memberSince?: string;
  onEdit: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  profileData,
  userEmail,
  memberSince,
  onEdit
}) => {
  const getDisplayName = () => {
    if (profileData.first_name || profileData.last_name) {
      return `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
    }
    return userEmail?.split('@')[0] || 'Member';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const getMinistryIcon = () => {
    switch (profileData.ministry) {
      case 'worship': return '🎵';
      case 'youth': return '👥';
      case 'children': return '👶';
      case 'evangelism': return '📢';
      case 'prayer': return '🙏';
      case 'media': return '📹';
      case 'hospitality': return '🤝';
      default: return '⛪';
    }
  };

  return (
    <EnhancedCard className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
          <User className="mr-3 h-6 w-6 text-iwc-blue" />
          My Profile
        </CardTitle>
        <Button 
          onClick={onEdit}
          className="bg-iwc-blue hover:bg-iwc-orange text-white"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
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
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getDisplayName()}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
            {profileData.ministry && (
              <div className="flex items-center justify-center md:justify-start mt-2">
                <span className="mr-2">{getMinistryIcon()}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {profileData.ministry} Ministry
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <Calendar className="h-6 w-6 text-iwc-blue mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatDate(memberSince)}
            </p>
          </div>
          
          {profileData.phone && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <Phone className="h-6 w-6 text-iwc-blue mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profileData.phone}
              </p>
            </div>
          )}
          
          {profileData.date_of_birth && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <Heart className="h-6 w-6 text-iwc-blue mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Birthday</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(profileData.date_of_birth)}
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {profileData.gender || 'Not specified'}
                </span>
              </div>
              {profileData.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-1" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Address:</span>
                    <p className="text-gray-900 dark:text-white">{profileData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Ministry Involvement
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">Ministry:</span>
                <span className="ml-2 text-gray-900 dark:text-white capitalize">
                  {profileData.ministry || 'Not assigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {profileData.bio && (
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              About Me
            </h4>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {profileData.bio}
            </p>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};
