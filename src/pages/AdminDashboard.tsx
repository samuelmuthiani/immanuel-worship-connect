import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { logAudit } from '@/lib/audit';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

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
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
        <h4 className="font-bold mb-2">{title}</h4>
        <p className="mb-4">{description}</p>
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

// --- Admin Management Table Components ---
function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string|null>(null);
  const [currentUserId, setCurrentUserId] = useState<string|null>(null);
  const [adminUserId, setAdminUserId] = useState<string|null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID for self-deletion protection
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
      setAdminUserId(data.user?.id || null);
    });
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('user_roles').select('user_id, role');
      if (error) throw error;
      if (data) setUsers(data);
    } catch (err: any) {
      setError("Failed to fetch users.");
      toast({ title: "Error", description: "Failed to fetch users.", variant: "destructive" });
    }
    setLoading(false);
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) throw error;
      toast({ title: "Role Updated", description: `User role changed to ${newRole}.` });
      // Audit log
      if (adminUserId) await logAudit(adminUserId, 'change_role', { newRole }, userId);
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
    }
  };
  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (error) throw error;
      toast({ title: "Deleted", description: "User deleted successfully." });
      // Audit log
      if (adminUserId) await logAudit(adminUserId, 'delete_user', undefined, userId);
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    }
    setConfirmId(null);
  };
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Users</h3>
        {error && <ErrorMessage message={error} />}
        {loading ? <LoadingIndicator label="Loading users..." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border" role="table">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.user_id}</td>
                  <td>
                    <select value={u.role} onChange={e => handleRoleChange(u.user_id, e.target.value)} className="border rounded px-2 py-1" aria-label="Change user role">
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <Button size="sm" variant="destructive" aria-label="Delete user" onClick={() => setConfirmId(u.user_id)} disabled={currentUserId && u.user_id === currentUserId}>
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
              
              <div className="flex gap-2 items-center mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={viewSite} 
                  className="flex items-center gap-2"
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
        
        <div className="container mx-auto mt-8">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <AdminUsersTable />
            </TabsContent>
            <TabsContent value="events">
              <AdminEventsTable />
            </TabsContent>
            <TabsContent value="donations">
              <AdminDonationsTable />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Rest of dashboard content */}
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
