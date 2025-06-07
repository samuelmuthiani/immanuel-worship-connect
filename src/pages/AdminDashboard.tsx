
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import EnhancedDataTable from '@/components/admin/EnhancedDataTable';
import { DonationManagement } from '@/components/admin/DonationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Shield, Users, Mail, Heart, BarChart3, Database, AlertCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getAllEventRegistrations } from '@/utils/eventUtils';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Profiles
  const [userProfiles, setUserProfiles] = useState([]);
  const profileColumns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'ministry', label: 'Ministry' },
    { key: 'gender', label: 'Gender' },
    { key: 'created_at', label: 'Member Since' }
  ];

  // Contact Submissions
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const contactColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'inquiry_type', label: 'Type' },
    { key: 'message', label: 'Message' },
    { key: 'submitted_at', label: 'Submitted At' }
  ];

  // Newsletter Subscribers
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const newsletterColumns = [
    { key: 'email', label: 'Email' },
    { key: 'subscribed_at', label: 'Subscribed At' }
  ];

  // Event Registrations
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const eventColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'event_title', label: 'Event' },
    { key: 'registered_at', label: 'Registered At' }
  ];

  const fetchUserProfiles = async () => {
    try {
      console.log('Fetching user profiles...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('User profiles fetched:', data?.length || 0, data);
      setUserProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profiles',
        variant: 'destructive'
      });
    }
  };

  const fetchContactSubmissions = async () => {
    try {
      console.log('Fetching contact submissions...');
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contact submissions:', error);
        throw error;
      }
      
      console.log('Contact submissions fetched:', data?.length || 0, data);
      setContactSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching contact submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contact submissions',
        variant: 'destructive'
      });
    }
  };

  const fetchNewsletterSubscribers = async () => {
    try {
      console.log('Fetching newsletter subscribers...');
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching newsletter subscribers:', error);
        throw error;
      }
      
      console.log('Newsletter subscribers fetched:', data?.length || 0, data);
      setNewsletterSubscribers(data || []);
    } catch (error: any) {
      console.error('Error fetching newsletter subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch newsletter subscribers',
        variant: 'destructive'
      });
    }
  };

  const fetchEventRegistrations = async () => {
    try {
      console.log('Fetching event registrations...');
      
      const registrations = await getAllEventRegistrations();
      
      // Transform data to include event title for display
      const transformedRegistrations = registrations.map((registration: any) => ({
        ...registration,
        event_title: registration.events?.title || 'Unknown Event'
      }));
      
      console.log('Event registrations fetched:', transformedRegistrations.length);
      setEventRegistrations(transformedRegistrations);
    } catch (error: any) {
      console.error('Error fetching event registrations:', error);
      setEventRegistrations([]);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchUserProfiles(),
        fetchContactSubmissions(),
        fetchNewsletterSubscribers(),
        fetchEventRegistrations()
      ]);
      
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllData();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Layout>
          <ResponsiveContainer>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iwc-blue mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
              </div>
            </div>
          </ResponsiveContainer>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute adminOnly>
        <Layout>
          <ResponsiveContainer>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dashboard Error</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button 
                  onClick={fetchAllData}
                  className="bg-iwc-blue hover:bg-iwc-orange text-white px-4 py-2 rounded-md transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          </ResponsiveContainer>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <ResponsiveContainer padding="lg">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Welcome back, {user?.email}. Manage your system from here.
            </p>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 text-xs sm:text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Members</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
                <span className="sm:hidden">Events</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2 text-xs sm:text-sm">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Donations</span>
                <span className="sm:hidden">Gifts</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 text-xs sm:text-sm">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
                <span className="sm:hidden">Data</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AdminAnalytics />
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <EnhancedDataTable
                title="Member Profiles"
                data={userProfiles}
                columns={profileColumns}
                tableName="profiles"
                onRefresh={fetchUserProfiles}
              />
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <EnhancedDataTable
                title="Event Registrations"
                data={eventRegistrations}
                columns={eventColumns}
                tableName="event_registrations"
                onRefresh={fetchEventRegistrations}
              />
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <DonationManagement />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <div className="grid gap-6">
                <EnhancedDataTable
                  title="Contact Submissions"
                  data={contactSubmissions}
                  columns={contactColumns}
                  tableName="contact_submissions"
                  onRefresh={fetchContactSubmissions}
                />
                <EnhancedDataTable
                  title="Newsletter Subscribers"
                  data={newsletterSubscribers}
                  columns={newsletterColumns}
                  tableName="newsletter_subscribers"
                  onRefresh={fetchNewsletterSubscribers}
                />
              </div>
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
