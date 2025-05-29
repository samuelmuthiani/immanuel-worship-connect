
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageContainer } from '@/components/ui/page-container';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { MemberProfile } from '@/components/member/MemberProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Heart, 
  FileText, 
  Bell, 
  Award,
  Activity,
  Download,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserDonations } from '@/utils/storage';

const MemberArea = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const donationData = await getUserDonations();
      setDonations(donationData);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const memberStats = [
    {
      title: 'Events Attended',
      value: '12',
      icon: Calendar,
      color: 'text-iwc-blue',
      bgColor: 'bg-iwc-blue/10',
      change: '+3 this month'
    },
    {
      title: 'Total Donations',
      value: '$450',
      icon: Heart,
      color: 'text-iwc-orange',
      bgColor: 'bg-iwc-orange/10',
      change: '$50 this month'
    },
    {
      title: 'Resources Downloaded',
      value: '8',
      icon: FileText,
      color: 'text-iwc-gold',
      bgColor: 'bg-iwc-gold/10',
      change: '2 new this week'
    },
    {
      title: 'Member Since',
      value: '2023',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '1 year'
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Sunday Service',
      date: '2024-01-07',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      status: 'registered'
    },
    {
      id: '2',
      title: 'Bible Study Group',
      date: '2024-01-10',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      status: 'available'
    },
    {
      id: '3',
      title: 'Community Outreach',
      date: '2024-01-14',
      time: '9:00 AM',
      location: 'Community Center',
      status: 'available'
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Weekly Devotional Guide',
      type: 'PDF',
      size: '2.4 MB',
      downloadCount: 156
    },
    {
      id: '2',
      title: 'Prayer Request Guidelines',
      type: 'PDF',
      size: '1.2 MB',
      downloadCount: 89
    },
    {
      id: '3',
      title: 'Community Service Handbook',
      type: 'PDF',
      size: '3.1 MB',
      downloadCount: 234
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <PageContainer
          title="Member Area"
          description="Welcome back! Manage your profile, view your activity, and access exclusive resources."
          showBackButton={true}
          backTo="/"
          maxWidth="2xl"
        >
          <div className="space-y-8">
            {/* Welcome Section */}
            <EnhancedCard gradient={true} className="border-l-4 border-l-iwc-blue">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      Welcome back, {user?.email?.split('@')[0] || 'Member'}! 👋
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Here's what's happening in your church community.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active Member
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </EnhancedCard>

            {/* Member Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memberStats.map((stat, index) => (
                <EnhancedCard key={index} hover={true}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{stat.change}</p>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="giving" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Giving</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Upcoming Events */}
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-iwc-blue" />
                      <span>Upcoming Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{event.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.status === 'registered' ? 'default' : 'secondary'}>
                            {event.status === 'registered' ? 'Registered' : 'Available'}
                          </Badge>
                          {event.status === 'available' && (
                            <Button size="sm" variant="outline">Register</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="profile">
                <MemberProfile />
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle>Event Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      Your event registrations will appear here.
                    </p>
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="giving" className="space-y-6">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-iwc-orange" />
                      <span>Giving History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-center py-8">Loading giving history...</p>
                    ) : donations.length > 0 ? (
                      <div className="space-y-4">
                        {donations.map((donation: any, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">${donation.amount}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{donation.donation_type}</p>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(donation.donated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                        No giving history available yet.
                      </p>
                    )}
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-iwc-gold" />
                      <span>Exclusive Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resource.type} • {resource.size} • Downloaded {resource.downloadCount} times
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </EnhancedCard>
              </TabsContent>
            </Tabs>
          </div>
        </PageContainer>
      </Layout>
    </ProtectedRoute>
  );
};

export default MemberArea;
