
import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import EnhancedDataTable from '@/components/admin/EnhancedDataTable';
import { DonationManagement } from '@/components/admin/DonationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Mail, Heart, BarChart3, Calendar, ShieldPlus, MessageSquare, Newspaper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/admin.service';
import BlogManager from '@/pages/admin/BlogManager';
import SermonManager from '@/pages/admin/SermonManager';
import EventManager from '@/pages/admin/EventManager';
import { AdminRegisterAdmin } from '@/components/admin/AdminRegisterAdmin';
import MediaManager from '@/pages/admin/MediaManager';

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

interface PolicyAcceptance {
  id: string;
  user_id: string;
  policy_type: string;
  accepted_at: string;
  user_email?: string;
}

interface EventRegistration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  registered_at: string;
  events?: { title: string };
  event_title?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [policyAcceptances, setPolicyAcceptances] = useState<PolicyAcceptance[]>([]);

  const profileColumns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'ministry', label: 'Ministry' },
    { key: 'gender', label: 'Gender' },
    { key: 'profile_completion', label: 'Completion' },
    { key: 'created_at', label: 'Member Since' }
  ];

  const contactColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'inquiry_type', label: 'Type' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message' },
    { key: 'submitted_at', label: 'Submitted' }
  ];

  const newsletterColumns = [
    { key: 'email', label: 'Email' },
    { key: 'subscribed_at', label: 'Subscribed' }
  ];

  const eventRegColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'event_title', label: 'Event' },
    { key: 'registered_at', label: 'Registered' }
  ];

  const policyColumns = [
    { key: 'user_email', label: 'User Email' },
    { key: 'policy_type', label: 'Policy' },
    { key: 'accepted_at', label: 'Accepted At' }
  ];

  const fetchUserProfiles = useCallback(async () => {
    try {
      const data = await adminService.getUserProfiles();
      const profileFields = ['first_name', 'last_name', 'phone', 'date_of_birth', 'address', 'avatar_url', 'bio', 'ministry', 'gender'];
      const enrichedData = (data as UserProfile[]).map(profile => {
        const completed = profileFields.filter(f => {
          const val = (profile as any)[f];
          return val && String(val).trim() !== '';
        }).length;
        return { ...profile, profile_completion: `${Math.round((completed / profileFields.length) * 100)}%` };
      });
      setUserProfiles(enrichedData);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }, []);

  const fetchContactSubmissions = useCallback(async () => {
    try {
      const data = await adminService.getContactSubmissions();
      setContactSubmissions(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  }, []);

  const fetchNewsletterSubscribers = useCallback(async () => {
    try {
      const data = await adminService.getNewsletterSubscribers();
      setNewsletterSubscribers(data);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    }
  }, []);

  const fetchEventRegistrations = useCallback(async () => {
    try {
      const registrations = await adminService.getEventRegistrations();
      const transformed = registrations.map((r: EventRegistration) => ({
        ...r,
        event_title: r.events?.title || 'Unknown Event'
      }));
      setEventRegistrations(transformed);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setEventRegistrations([]);
    }
  }, []);

  const fetchPolicyAcceptances = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('policy_acceptances')
        .select('*')
        .order('accepted_at', { ascending: false });
      if (error) throw error;
      
      // Enrich with user emails from profiles
      const enriched = await Promise.all((data || []).map(async (acceptance: any) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('user_id', acceptance.user_id)
          .maybeSingle();
        return { ...acceptance, user_email: profile?.email || acceptance.user_id };
      }));
      setPolicyAcceptances(enriched);
    } catch (err) {
      console.error('Error fetching policy acceptances:', err);
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
        fetchEventRegistrations(),
        fetchPolicyAcceptances()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfiles, fetchContactSubmissions, fetchNewsletterSubscribers, fetchEventRegistrations, fetchPolicyAcceptances]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllData();
    }
  }, [user, isAdmin, fetchAllData]);

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground text-sm">Loading dashboard...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute adminOnly>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <button
                onClick={fetchAllData}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <section className="py-12 sm:py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="flex flex-wrap gap-1 bg-card border border-border rounded-xl p-1 h-auto">
                <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Members</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="cms" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="donations" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Donations</span>
                </TabsTrigger>
                <TabsTrigger value="communications" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Comms</span>
                </TabsTrigger>
                <TabsTrigger value="admin-mgmt" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2">
                  <ShieldPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
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

              <TabsContent value="events" className="space-y-8">
                <EventManager />
                <EnhancedDataTable
                  title="Event Registrations"
                  data={eventRegistrations}
                  columns={eventRegColumns}
                  tableName="event_registrations"
                  onRefresh={fetchEventRegistrations}
                />
              </TabsContent>

              <TabsContent value="cms" className="space-y-8">
                <BlogManager />
                <SermonManager />
                <MediaManager />
              </TabsContent>

              <TabsContent value="donations" className="space-y-6">
                <DonationManagement />
              </TabsContent>

              <TabsContent value="communications" className="space-y-6">
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
                <EnhancedDataTable
                  title="Terms and Policy Acceptances"
                  data={policyAcceptances}
                  columns={policyColumns}
                  tableName="policy_acceptances"
                  onRefresh={fetchPolicyAcceptances}
                />
              </TabsContent>

              <TabsContent value="admin-mgmt" className="space-y-6">
                <div className="max-w-md">
                  <AdminRegisterAdmin />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
