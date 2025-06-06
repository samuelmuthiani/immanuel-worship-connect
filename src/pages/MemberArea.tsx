
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MemberProfile } from '@/components/member/MemberProfile';
import { ProfileCompletion } from '@/components/member/ProfileCompletion';
import { AppreciationNotifications } from '@/components/member/AppreciationNotifications';
import { MemberDonationHistory } from '@/components/member/MemberDonationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, Settings, Activity, CheckCircle } from 'lucide-react';

const MemberArea = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <User className="h-8 w-8 text-iwc-blue dark:text-iwc-orange" />
              Member Area
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user?.email}. Manage your profile and view your activity.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profile Settings</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="completion" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Completion</span>
                <span className="sm:hidden">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="appreciations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Thank You Messages</span>
                <span className="sm:hidden">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
                <span className="sm:hidden">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <MemberProfile />
            </TabsContent>

            <TabsContent value="completion" className="space-y-6">
              {/* Profile completion will be loaded dynamically */}
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your profile to unlock all features and connect better with the community.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="appreciations" className="space-y-6">
              <AppreciationNotifications />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <MemberDonationHistory />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default MemberArea;
