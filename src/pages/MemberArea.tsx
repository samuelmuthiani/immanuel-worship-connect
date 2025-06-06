
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MemberProfile } from '@/components/member/MemberProfile';
import { ProfileCompletion } from '@/components/member/ProfileCompletion';
import { AppreciationNotifications } from '@/components/member/AppreciationNotifications';
import { MemberDonationHistory } from '@/components/member/MemberDonationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { MobileDrawer } from '@/components/ui/MobileDrawer';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/utils/profileUtils';
import { User, Heart, Settings, Activity, CheckCircle, Menu } from 'lucide-react';

const MemberArea = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load profile data for completion component
  const { data: profileData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: !!user,
  });

  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
      shortLabel: 'Profile',
      icon: Settings,
      component: <MemberProfile />
    },
    {
      value: 'completion',
      label: 'Profile Completion',
      shortLabel: 'Progress',
      icon: CheckCircle,
      component: profileData ? <ProfileCompletion profileData={profileData} /> : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to unlock all features and connect better with the community.
          </p>
        </div>
      )
    },
    {
      value: 'appreciations',
      label: 'Thank You Messages',
      shortLabel: 'Messages',
      icon: Heart,
      component: <AppreciationNotifications />
    },
    {
      value: 'activity',
      label: 'Activity History',
      shortLabel: 'Activity',
      icon: Activity,
      component: <MemberDonationHistory />
    }
  ];

  const TabNavigation = ({ isMobile = false }) => (
    <TabsList className={`
      ${isMobile 
        ? 'flex flex-col w-full h-auto space-y-2 bg-transparent p-0' 
        : 'grid w-full grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }
    `}>
      {tabs.map((tab) => (
        <TabsTrigger 
          key={tab.value}
          value={tab.value} 
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className={`
            flex items-center gap-2 
            ${isMobile 
              ? 'w-full justify-start p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg' 
              : ''
            }
          `}
        >
          <tab.icon className="h-4 w-4" />
          <span className={isMobile ? '' : 'hidden sm:inline'}>
            {isMobile ? tab.label : tab.shortLabel}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <ProtectedRoute>
      <Layout>
        <ResponsiveContainer padding="lg">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-iwc-blue dark:text-iwc-orange" />
                  <span className="hidden sm:inline">Member Area</span>
                  <span className="sm:hidden">Dashboard</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <span className="hidden sm:inline">Welcome, {user?.email}. Manage your profile and view your activity.</span>
                  <span className="sm:hidden">Welcome back!</span>
                </p>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <MobileDrawer
                  title="Navigation"
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                  trigger={
                    <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <Menu className="h-5 w-5" />
                    </button>
                  }
                >
                  <div className="space-y-4">
                    <TabNavigation isMobile={true} />
                  </div>
                </MobileDrawer>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <TabNavigation />
            </div>

            {/* Tab Content */}
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6 focus-visible:outline-none">
                <div className="animate-fade-in">
                  {tab.component}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ResponsiveContainer>
      </Layout>
    </ProtectedRoute>
  );
};

export default MemberArea;
