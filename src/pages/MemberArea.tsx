import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MemberProfile } from '@/components/member/MemberProfile';
import { AppreciationNotifications } from '@/components/member/AppreciationNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, Settings, Activity } from 'lucide-react';
import { MemberDonationHistory } from '@/components/member/MemberDonationHistory';

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
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Profile Settings
              </TabsTrigger>
              <TabsTrigger value="appreciations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Thank You Messages
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <MemberProfile />
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
