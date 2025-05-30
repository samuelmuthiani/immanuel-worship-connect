
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { EnhancedDataTable } from '@/components/admin/EnhancedDataTable';
import { DonationManagement } from '@/components/admin/DonationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Mail, Heart, BarChart3, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
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
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Donations
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AdminAnalytics />
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <DonationManagement />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-6">
                <EnhancedDataTable 
                  title="Contact Submissions" 
                  type="contacts"
                  icon={Mail}
                />
                <EnhancedDataTable 
                  title="Newsletter Subscribers" 
                  type="newsletter"
                  icon={Mail}
                />
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <EnhancedDataTable 
                title="Event Registrations" 
                type="events"
                icon={Users}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
