import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LogOut, ExternalLink, BarChart3, Users, Calendar, Heart, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { PageContainer } from '@/components/ui/page-container';

// Reusable confirmation dialog component
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}
function ConfirmDialog({ open, title, description, onCancel, onConfirm, confirmLabel = "Delete", cancelLabel = "Cancel" }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 max-w-sm w-full">
        <h4 className="font-bold mb-2 text-gray-900 dark:text-white">{title}</h4>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{description}</p>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button size="sm" variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// TypeScript interfaces
interface AdminUser { user_id: string; role: string; }
interface AdminEvent { id: string; title: string; event_date: string; location: string; }
interface AdminDonation { id: string; name: string; org: string; message: string; submitted_at: string; }
interface AdminContact { id: string; name: string; email: string; subject: string; message: string; submitted_at: string; }
interface AdminNewsletter { id: string; email: string; subscribed_at: string; }

// --- Admin Management Table Components ---
function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string|null>(null);
  const [currentUserId, setCurrentUserId] = useState<string|null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID for self-deletion protection
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching users from user_roles table...');
      const { data, error } = await supabase.from('user_roles').select('user_id, role');
      console.log('User roles data:', { data, error });
      
      if (error) throw error;
      if (data) {
        setUsers(data);
        console.log(`Loaded ${data.length} users`);
      } else {
        console.log('No user data returned');
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(`Failed to fetch users: ${err.message}`);
      toast({ title: "Error", description: `Failed to fetch users: ${err.message}`, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      console.log('Updating role for user:', userId, 'to:', newRole);
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) throw error;
      toast({ title: "Role Updated", description: `User role changed to ${newRole}.` });
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating role:', err);
      toast({ title: "Error", description: `Failed to update user role: ${err.message}`, variant: "destructive" });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      console.log('Deleting user:', userId);
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (error) throw error;
      toast({ title: "Deleted", description: "User deleted successfully." });
      fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({ title: "Error", description: `Failed to delete user: ${err.message}`, variant: "destructive" });
    }
    setConfirmId(null);
  };

  if (loading) return <LoadingIndicator label="Loading users..." />;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Users ({users.length})</h3>
          <Button size="sm" onClick={fetchUsers} variant="outline">Refresh</Button>
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No users found in the system.</p>
            <p className="text-sm">Users will appear here once they register and are assigned roles.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 dark:border-gray-700" role="table">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-2 text-gray-900 dark:text-white">User ID</th>
                  <th scope="col" className="px-4 py-2 text-gray-900 dark:text-white">Role</th>
                  <th scope="col" className="px-4 py-2 text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300 font-mono text-sm">{u.user_id}</td>
                    <td className="px-4 py-2">
                      <select 
                        value={u.role} 
                        onChange={e => handleRoleChange(u.user_id, e.target.value)} 
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" 
                        aria-label="Change user role"
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        aria-label="Delete user" 
                        onClick={() => setConfirmId(u.user_id)} 
                        disabled={currentUserId && u.user_id === currentUserId}
                      >
                        Delete
                      </Button>
                      <ConfirmDialog
                        open={confirmId === u.user_id}
                        title="Confirm Deletion"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                        onCancel={() => setConfirmId(null)}
                        onConfirm={() => handleDelete(u.user_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminContactsTable() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching contact submissions...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      console.log('Contact submissions data:', { data, error });
      
      if (error) throw error;
      if (data) {
        setContacts(data);
        console.log(`Loaded ${data.length} contact submissions`);
      } else {
        setContacts([]);
      }
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setError(`Failed to fetch contact submissions: ${err.message}`);
    }
    setLoading(false);
  };

  if (loading) return <LoadingIndicator label="Loading contact submissions..." />;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Contact Submissions ({contacts.length})</h3>
          <Button size="sm" onClick={fetchContacts} variant="outline">Refresh</Button>
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No contact submissions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Name</th>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Email</th>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Subject</th>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{contact.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{contact.email}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{contact.subject || 'No subject'}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {contact.submitted_at ? new Date(contact.submitted_at).toLocaleDateString() : 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminNewsletterTable() {
  const [subscribers, setSubscribers] = useState<AdminNewsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching newsletter subscribers...');
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      console.log('Newsletter subscribers data:', { data, error });
      
      if (error) throw error;
      if (data) {
        setSubscribers(data);
        console.log(`Loaded ${data.length} newsletter subscribers`);
      } else {
        setSubscribers([]);
      }
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setError(`Failed to fetch newsletter subscribers: ${err.message}`);
    }
    setLoading(false);
  };

  if (loading) return <LoadingIndicator label="Loading newsletter subscribers..." />;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Newsletter Subscribers ({subscribers.length})</h3>
          <Button size="sm" onClick={fetchSubscribers} variant="outline">Refresh</Button>
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        {subscribers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No newsletter subscribers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Email</th>
                  <th className="px-4 py-2 text-gray-900 dark:text-white">Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{subscriber.email}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleDateString() : 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminEventsTable() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [adminUserId, setAdminUserId] = useState<string|null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      if (error) throw error;
      if (data) setEvents(data);
    } catch (err: any) {
      setError("Failed to fetch events.");
      toast({ title: "Error", description: "Failed to fetch events.", variant: "destructive" });
    }
    setLoading(false);
  };
  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminUserId(data.user?.id || null);
    });
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Event deleted successfully." });
      // Audit log
      if (adminUserId) await logAudit(adminUserId, 'delete_event', undefined, id);
      fetchEvents();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" });
    }
    setConfirmId(null);
  };

  // Filtering and pagination
  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.location && e.location.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Events</h3>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border rounded p-2 w-48"
            aria-label="Search events"
          />
        </div>
        {error && <ErrorMessage message={error} />}
        {loading ? <LoadingIndicator label="Loading events..." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border" role="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Location</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e, i) => (
                <tr key={i}>
                  <td>{e.title}</td>
                  <td>{e.event_date ? new Date(e.event_date).toLocaleDateString() : ''}</td>
                  <td>{e.location}</td>
                  <td>
                    <Button size="sm" variant="destructive" aria-label="Delete event" onClick={() => setConfirmId(e.id)}>
                      Delete
                    </Button>
                    <ConfirmDialog
                      open={confirmId === e.id}
                      title="Confirm Deletion"
                      description="Are you sure you want to delete this event? This action cannot be undone."
                      onCancel={() => setConfirmId(null)}
                      onConfirm={() => handleDelete(e.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Previous page">Prev</button>
            <span aria-live="polite">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Next page">Next</button>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
function AdminDonationsTable() {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [adminUserId, setAdminUserId] = useState<string|null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('donor_thank_yous').select('*').order('submitted_at', { ascending: false });
      if (error) throw error;
      if (data) setDonations(data);
    } catch (err: any) {
      setError("Failed to fetch donations.");
      toast({ title: "Error", description: "Failed to fetch donations.", variant: "destructive" });
    }
    setLoading(false);
  };
  useEffect(() => { fetchDonations(); }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminUserId(data.user?.id || null);
    });
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('donor_thank_yous').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Donation deleted successfully." });
      // Audit log
      if (adminUserId) await logAudit(adminUserId, 'delete_donation', undefined, id);
      fetchDonations();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete donation.", variant: "destructive" });
    }
    setConfirmId(null);
  };

  // Filtering and pagination
  const filtered = donations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.org && d.org.toLowerCase().includes(search.toLowerCase())) ||
    (d.message && d.message.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Donations (Thank Yous)</h3>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="Search donations..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border rounded p-2 w-48"
            aria-label="Search donations"
          />
        </div>
        {error && <ErrorMessage message={error} />}
        {loading ? <LoadingIndicator label="Loading donations..." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border" role="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Org</th>
                <th scope="col">Message</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.org}</td>
                  <td>{d.message}</td>
                  <td>{d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : ''}</td>
                  <td>
                    <Button size="sm" variant="destructive" aria-label="Delete donation" onClick={() => setConfirmId(d.id)}>
                      Delete
                    </Button>
                    <ConfirmDialog
                      open={confirmId === d.id}
                      title="Confirm Deletion"
                      description="Are you sure you want to delete this donation? This action cannot be undone."
                      onCancel={() => setConfirmId(null)}
                      onConfirm={() => handleDelete(d.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Previous page">Prev</button>
            <span aria-live="polite">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Next page">Next</button>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive"
      });
    }
  };
  
  const viewSite = () => {
    window.open('/', '_blank');
  };
  
  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <PageContainer maxWidth="full">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <div className="p-2 bg-gradient-to-br from-iwc-blue to-iwc-orange rounded-lg">
                    <SettingsIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your church community</p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  <Button 
                    variant="outline" 
                    onClick={viewSite} 
                    className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ExternalLink size={18} />
                    View Site
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Newsletter</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Donations</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <AdminUsersTable />
            </TabsContent>
            
            <TabsContent value="contacts">
              <AdminContactsTable />
            </TabsContent>
            
            <TabsContent value="newsletter">
              <AdminNewsletterTable />
            </TabsContent>
            
            <TabsContent value="donations">
              <AdminDonationsTable />
            </TabsContent>
          </Tabs>
        </PageContainer>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
