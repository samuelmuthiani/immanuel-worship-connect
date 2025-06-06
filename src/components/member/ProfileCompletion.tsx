
import React from 'react';
import { CheckCircle, Circle, User, Target, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { UserProfile } from '@/utils/profileUtils';

interface ProfileCompletionProps {
  profileData: UserProfile;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ profileData }) => {
  const fields = [
    { key: 'first_name', label: 'First Name', required: true },
    { key: 'last_name', label: 'Last Name', required: true },
    { key: 'phone', label: 'Phone Number', required: false },
    { key: 'date_of_birth', label: 'Date of Birth', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'avatar_url', label: 'Profile Picture', required: false },
    { key: 'bio', label: 'Bio', required: false },
    { key: 'ministry', label: 'Ministry', required: false },
    { key: 'gender', label: 'Gender', required: false }
  ];

  const completedFields = fields.filter(field => {
    const value = profileData[field.key as keyof UserProfile];
    return value && value.toString().trim() !== '';
  });

  const completionPercentage = Math.round((completedFields.length / fields.length) * 100);

  const getCompletionColor = () => {
    if (completionPercentage >= 80) return 'text-green-600 dark:text-green-400';
    if (completionPercentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCompletionMessage = () => {
    if (completionPercentage === 100) return 'Your profile is complete! 🎉';
    if (completionPercentage >= 80) return 'Almost there! Just a few more details.';
    if (completionPercentage >= 50) return 'Great progress! Keep going.';
    return 'Let\'s complete your profile to get started.';
  };

  const getProgressBarColor = () => {
    if (completionPercentage >= 80) return 'bg-green-500';
    if (completionPercentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const missingFields = fields.filter(field => {
    const value = profileData[field.key as keyof UserProfile];
    return !value || value.toString().trim() === '';
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main completion card */}
      <EnhancedCard className="bg-gradient-to-r from-iwc-blue/10 to-iwc-orange/10 dark:from-iwc-blue/20 dark:to-iwc-orange/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-iwc-blue" />
            <span>Profile Completion</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Progress section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className={`text-lg sm:text-xl font-bold ${getCompletionColor()}`}>
                {completionPercentage}% Complete
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedFields.length} of {fields.length} fields completed
              </span>
            </div>
            
            <Progress value={completionPercentage} className="h-3" />
            
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
              {getCompletionMessage()}
            </p>
          </div>

          {/* Stats grid for larger screens */}
          <div className="hidden sm:grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-iwc-blue" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {fields.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Fields
              </div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {completedFields.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Completed
              </div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-iwc-orange" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Progress
              </div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      {/* Missing fields section */}
      {missingFields.length > 0 && (
        <EnhancedCard>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
              Missing Information ({missingFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {missingFields.slice(0, 8).map(field => (
                <div key={field.key} className="flex items-center text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <Circle className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{field.label}</span>
                </div>
              ))}
              {missingFields.length > 8 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic col-span-full text-center">
                  +{missingFields.length - 8} more fields...
                </div>
              )}
            </div>
          </CardContent>
        </EnhancedCard>
      )}

      {/* Completed fields section */}
      {completedFields.length > 0 && (
        <EnhancedCard>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
              Completed Information ({completedFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {completedFields.slice(0, 6).map(field => (
                <div key={field.key} className="flex items-center text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{field.label}</span>
                </div>
              ))}
              {completedFields.length > 6 && (
                <div className="text-sm text-green-600 dark:text-green-400 italic col-span-full text-center">
                  +{completedFields.length - 6} more completed...
                </div>
              )}
            </div>
          </CardContent>
        </EnhancedCard>
      )}
    </div>
  );
};
