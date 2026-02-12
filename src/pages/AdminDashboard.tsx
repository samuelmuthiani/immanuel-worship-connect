
import React, { useEffect, useState, useCallback } from 'react';
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
import { adminService } from '@/services/admin.service';
import BlogManager from '@/pages/admin/BlogManager';
import SermonManager from '@/pages/admin/SermonManager';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  ministry?: string;
  gender?: string;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  inquiry_type: string;
  message: string;
  submitted_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

interface EventRegistration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  registered_at: string;
  events?: {
    title: string;
  };
  event_title?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);

  const profileColumns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'ministry', label: 'Ministry' },
    { key: 'gender', label: 'Gender' },
    { key: 'created_at', label: 'Member Since' }
  ];

  const contactColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'inquiry_type', label: 'Type' },
    { key: 'message', label: 'Message' },
    { key: 'submitted_at', label: 'Submitted At' }
  ];

  const newsletterColumns = [
    { key: 'email', label: 'Email' },
    { key: 'subscribed_at', label: 'Subscribed At' }
  ];

  const eventColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'event_title', label: 'Event' },
    { key: 'registered_at', label: 'Registered At' }
  ];

  const fetchUserProfiles = useCallback(async () => {
    try {
      const data = await adminService.getUserProfiles();
      setUserProfiles(data as UserProfile[]);
    } catch (err: unknown) {
      console.error('Error fetching profiles:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profiles',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const fetchContactSubmissions = useCallback(async () => {
    try {
      const data = await adminService.getContactSubmissions();
      setContactSubmissions(data);
    } catch (err: unknown) {
      console.error('Error fetching contact submissions:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch contact submissions',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const fetchNewsletterSubscribers = useCallback(async () => {
    try {
      const data = await adminService.getNewsletterSubscribers();
      setNewsletterSubscribers(data);
    } catch (err: unknown) {
      console.error('Error fetching newsletter subscribers:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch newsletter subscribers',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const fetchEventRegistrations = useCallback(async () => {
    try {
      const registrations = await adminService.getEventRegistrations();

      const transformedRegistrations = registrations.map((registration: EventRegistration) => ({
        ...registration,
        event_title: registration.events?.title || 'Unknown Event'
      }));

      setEventRegistrations(transformedRegistrations);
    } catch (err: unknown) {
      console.error('Error fetching event registrations:', err);
      setEventRegistrations([]);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchUserProfiles(),
        fetchContactSubmissions(),
        fetchNewsletterSubscribers(),
        fetchEventRegistrations()
      ]);

    } catch (err: unknown) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfiles, fetchContactSubmissions, fetchNewsletterSubscribers, fetchEventRegistrations]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllData();
    }
  }, [user, isAdmin, fetchAllData]);

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
          <ResponsiveContainer padding="lg">
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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-auto gap-1 p-1">
              <TabsTrigger value="analytics" className="flex items-center gap-2 py-2 text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 py-2 text-xs sm:text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Members</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="cms" className="flex items-center gap-2 py-2 text-xs sm:text-sm">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">CMS</span>
                <span className="sm:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 py-2 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
                <span className="sm:hidden">Events</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2 py-2 text-xs sm:text-sm">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Donations</span>
                <span className="sm:hidden">Gifts</span>
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

            <TabsContent value="cms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BlogManager />
                <SermonManager />
              </div>
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
