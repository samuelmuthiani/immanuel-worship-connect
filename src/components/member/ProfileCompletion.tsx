
import React from 'react';
import { CheckCircle, Circle, User } from 'lucide-react';
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
    if (completionPercentage >= 80) return 'text-green-600';
    if (completionPercentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionMessage = () => {
    if (completionPercentage === 100) return 'Your profile is complete! 🎉';
    if (completionPercentage >= 80) return 'Almost there! Just a few more details.';
    if (completionPercentage >= 50) return 'Great progress! Keep going.';
    return 'Let\'s complete your profile to get started.';
  };

  return (
    <EnhancedCard className="bg-gradient-to-r from-iwc-blue/10 to-iwc-orange/10 dark:from-iwc-blue/20 dark:to-iwc-orange/20">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
          <User className="mr-2 h-5 w-5 text-iwc-blue" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getCompletionColor()}`}>
            {completionPercentage}% Complete
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedFields.length} of {fields.length} fields
          </span>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {getCompletionMessage()}
        </p>

        {completionPercentage < 100 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Missing fields:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {fields
                .filter(field => {
                  const value = profileData[field.key as keyof UserProfile];
                  return !value || value.toString().trim() === '';
                })
                .slice(0, 6) // Show max 6 missing fields
                .map(field => (
                  <div key={field.key} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Circle className="h-3 w-3 mr-2" />
                    {field.label}
                  </div>
                ))}
            </div>
          </div>
        )}

        {completedFields.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completed:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {completedFields.slice(0, 4).map(field => (
                <div key={field.key} className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  {field.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};
