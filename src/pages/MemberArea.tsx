
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { MemberProfile } from '@/components/member/MemberProfile';
import { ProfileCompletion } from '@/components/member/ProfileCompletion';
import { AppreciationNotifications } from '@/components/member/AppreciationNotifications';
import { MemberDonationHistory } from '@/components/member/MemberDonationHistory';
import { MemberEvents } from '@/components/member/MemberEvents';
import { DeleteAccountDialog } from '@/components/member/DeleteAccountDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/utils/profileUtils';
import { User, Heart, Settings, Activity, CheckCircle, Menu, Calendar } from 'lucide-react';

const MemberArea = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: !!user,
  });

  const tabs = [
    { value: 'profile', label: 'Profile', icon: Settings },
    { value: 'events', label: 'My Events', icon: Calendar },
    { value: 'completion', label: 'Progress', icon: CheckCircle },
    { value: 'appreciations', label: 'Messages', icon: Heart },
    { value: 'activity', label: 'Activity', icon: Activity },
    { value: 'settings', label: 'Account', icon: User },
  ];

  return (
    <Layout>
      <ResponsiveContainer padding="lg">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 flex items-center gap-3">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="hidden sm:inline">Member Area</span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                <span className="hidden sm:inline">Welcome, {user?.email}. Manage your profile and view your activity.</span>
                <span className="sm:hidden">Welcome back!</span>
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile menu button + sheet (INSIDE Tabs so TabsTrigger works) */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  {tabs.find(t => t.value === activeTab)?.label || 'Menu'}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
            <MemberProfile />
          </TabsContent>

          <TabsContent value="events" className="space-y-6 focus-visible:outline-none">
            <MemberEvents />
          </TabsContent>

          <TabsContent value="completion" className="space-y-6 focus-visible:outline-none">
            {profileData ? (
              <ProfileCompletion profileData={profileData} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Complete your profile to unlock all features and connect better with the community.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appreciations" className="space-y-6 focus-visible:outline-none">
            <AppreciationNotifications />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 focus-visible:outline-none">
            <MemberDonationHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
            <div className="space-y-6">
              <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5">
                <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <DeleteAccountDialog />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </Layout>
  );
};

export default MemberArea;
