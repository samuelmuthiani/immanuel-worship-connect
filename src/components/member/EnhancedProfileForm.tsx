
import React, { useState } from 'react';
import { User, Save, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, UserProfile } from '@/utils/profileUtils';
import { SecurityService } from '@/utils/security';

interface EnhancedProfileFormProps {
  profileData: UserProfile;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onProfileUpdate: (data: UserProfile) => void;
}

export const EnhancedProfileForm: React.FC<EnhancedProfileFormProps> = ({
  profileData,
  isEditing,
  onSave,
  onCancel,
  onProfileUpdate
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserProfile>(profileData);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.phone && !SecurityService.validatePhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.first_name && formData.first_name.length > 50) {
      errors.first_name = 'First name must be less than 50 characters';
    }
    
    if (formData.last_name && formData.last_name.length > 50) {
      errors.last_name = 'Last name must be less than 50 characters';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        errors.date_of_birth = 'Please enter a valid date of birth';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        onProfileUpdate(formData);
        onSave();
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      } else {
        throw new Error(result.error?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive'
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid image file.',
          variant: 'destructive'
        });
        return;
      }

      const url = URL.createObjectURL(file);
      handleInputChange('avatar_url', url);
      
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated.',
      });
    }
  };

  return (
    <EnhancedCard className="bg-white dark:bg-gray-800">
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {formData.avatar_url ? (
                <img 
                  src={formData.avatar_url} 
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
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput
            id="first_name"
            type="text"
            label="First Name"
            value={formData.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            error={formErrors.first_name}
            disabled={!isEditing}
          />

          <FloatingInput
            id="last_name"
            type="text"
            label="Last Name"
            value={formData.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            error={formErrors.last_name}
            disabled={!isEditing}
          />

          <FloatingInput
            id="phone"
            type="tel"
            label="Phone Number"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={formErrors.phone}
            disabled={!isEditing}
          />

          <FloatingInput
            id="date_of_birth"
            type="date"
            label="Date of Birth"
            value={formData.date_of_birth || ''}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            error={formErrors.date_of_birth}
            disabled={!isEditing}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            {isEditing ? (
              <Select 
                value={formData.gender || ''} 
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {formData.gender || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ministry
            </label>
            {isEditing ? (
              <Select 
                value={formData.ministry || ''} 
                onValueChange={(value) => handleInputChange('ministry', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select ministry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worship">Worship Ministry</SelectItem>
                  <SelectItem value="youth">Youth Ministry</SelectItem>
                  <SelectItem value="children">Children's Ministry</SelectItem>
                  <SelectItem value="evangelism">Evangelism</SelectItem>
                  <SelectItem value="prayer">Prayer Ministry</SelectItem>
                  <SelectItem value="media">Media Ministry</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                {formData.ministry || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        <FloatingInput
          id="address"
          type="text"
          label="Address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          disabled={!isEditing}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio / About Me
          </label>
          {isEditing ? (
            <Textarea
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={4}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <p className="text-gray-900 dark:text-white py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 min-h-[100px]">
              {formData.bio || 'No bio provided'}
            </p>
          )}
          {formErrors.bio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-2 pt-6">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};
