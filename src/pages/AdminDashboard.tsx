
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import EnhancedDataTable from '@/components/admin/EnhancedDataTable';
import { DonationManagement } from '@/components/admin/DonationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Mail, Heart, BarChart3, Database } from 'lucide-react';
import {
  getAllContactSubmissions,
  getAllNewsletterSubscribers,
} from '@/utils/storage';
import { getAllProfiles } from '@/utils/profileUtils';
import { getAllEventRegistrations } from '@/utils/eventUtils';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

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
  const fetchUserProfiles = async () => {
    setUserProfiles(await getAllProfiles());
  };

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
  const fetchContactSubmissions = async () => {
    setContactSubmissions(await getAllContactSubmissions());
  };

  // Newsletter Subscribers
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const newsletterColumns = [
    { key: 'email', label: 'Email' },
    { key: 'subscribed_at', label: 'Subscribed At' }
  ];
  const fetchNewsletterSubscribers = async () => {
    setNewsletterSubscribers(await getAllNewsletterSubscribers());
  };

  // Event Registrations
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const eventColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'event_id', label: 'Event ID' },
    { key: 'registered_at', label: 'Registered At' }
  ];
  const fetchEventRegistrations = async () => {
    setEventRegistrations(await getAllEventRegistrations());
  };

  useEffect(() => {
    fetchUserProfiles();
    fetchContactSubmissions();
    fetchNewsletterSubscribers();
    fetchEventRegistrations();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.email}. Manage your system from here.
            </p>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Donations
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AdminAnalytics />
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="grid gap-6">
                <EnhancedDataTable
                  title="Member Profiles"
                  data={userProfiles}
                  columns={profileColumns}
                  tableName="profiles"
                  onRefresh={fetchUserProfiles}
                />
                <EnhancedDataTable
                  title="Event Registrations"
                  data={eventRegistrations}
                  columns={eventColumns}
                  tableName="event_registrations"
                  onRefresh={fetchEventRegistrations}
                />
              </div>
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
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
