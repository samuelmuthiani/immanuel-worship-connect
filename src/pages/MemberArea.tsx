import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaGift, FaLock, FaFileAlt } from 'react-icons/fa';
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import GlobalLoadingScreen from '@/components/GlobalLoadingScreen';

// ProfileUpdateForm component
function ProfileUpdateForm({ user }: { user: any }) {
  const [form, setForm] = useState({
    name: user.user_metadata?.name || '',
    email: user.email || '',
    password: '',
    profilePic: null as File | null,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files) {
      setForm(f => ({ ...f, profilePic: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      // Mock update logic (replace with real API as needed)
      await new Promise(res => setTimeout(res, 1000));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Update Profile Form">
      <div>
        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          id="profilePic"
          name="profilePic"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold px-6 py-2 rounded-md w-full transition-colors focus:outline-none focus:ring-2 focus:ring-iwc-blue"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
      <div aria-live="polite" className="h-6">
        {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </div>
    </form>
  );
}

// Member Involvement Dashboard component
function MemberInvolvementDashboard({ user }: { user: any }) {
  const [donations, setDonations] = useState<any[]>([]);
  const [donationSort, setDonationSort] = useState<'date'|'amount'>('date');
  const [events, setEvents] = useState<any[]>([]);
  const [eventSort, setEventSort] = useState<'date'|'name'>('date');

  useEffect(() => {
    // Fetch donations for this user
    const fetchDonations = async () => {
      if (!user?.id) return;
      // If you don't have a donations table, skip this fetch
      try {
        const { data, error } = await supabase
          .from('donor_thank_yous') // fallback to donor_thank_yous if no donations table
          .select('*')
          .eq('name', user.user_metadata?.name || user.email)
          .order('submitted_at', { ascending: false });
        if (!error && data) setDonations(data);
        else setDonations([]);
      } catch {
        setDonations([]);
      }
    };
    // Fetch event registrations for this user
    const fetchEvents = async () => {
      if (!user?.email) return;
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('email', user.email)
          .order('registered_at', { ascending: false });
        if (!error && data) setEvents(data);
        else setEvents([]);
      } catch {
        setEvents([]);
      }
    };
    fetchDonations();
    fetchEvents();
  }, [user]);

  const sortedDonations = [...donations].sort((a, b) =>
    donationSort === 'date' ? (b.submitted_at || '').localeCompare(a.submitted_at || '') : (b.amount || 0) - (a.amount || 0)
  );
  const sortedEvents = [...events].sort((a, b) =>
    eventSort === 'name' ? (a.name||'').localeCompare(b.name||'') : 0
  );
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Donations */}
      <div>
        <h4 className="font-semibold mb-2">Recent Donations</h4>
        <div className="flex gap-2 mb-2">
          <label htmlFor="donationSort" className="text-sm">Sort by:</label>
          <select id="donationSort" value={donationSort} onChange={e => setDonationSort(e.target.value as any)} className="border rounded p-1">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        {sortedDonations.length === 0 ? (
          <div className="text-gray-500">No donations found.</div>
        ) : (
          <ul className="divide-y">
            {sortedDonations.map(d => (
              <li key={d.id} className="py-2 flex flex-col">
                <span className="font-mono text-sm">{d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : ''}</span>
                <span className="font-bold text-lg text-iwc-blue">{d.amount ? `KES ${d.amount.toLocaleString()}` : d.message}</span>
                <span className="text-xs">{d.org || d.note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Events */}
      <div>
        <h4 className="font-semibold mb-2">Event Participation</h4>
        <div className="flex gap-2 mb-2">
          <label htmlFor="eventSort" className="text-sm">Sort by:</label>
          <select id="eventSort" value={eventSort} onChange={e => setEventSort(e.target.value as any)} className="border rounded p-1">
            <option value="name">Event Name</option>
          </select>
        </div>
        {sortedEvents.length === 0 ? (
          <div className="text-gray-500">No events found.</div>
        ) : (
          <ul className="divide-y">
            {sortedEvents.map((e, idx) => (
              <li key={idx} className="py-2 flex flex-col">
                <span className="font-bold">{e.name || e.event_id}</span>
                <span className="text-xs font-mono">Event ID: {e.event_id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Exclusive Content Section component
function ExclusiveContentSection() {
  // Demo: list of exclusive resources
  const resources = [
    { id: 1, title: 'Monthly Devotional (PDF)', url: '/placeholder.svg' },
    { id: 2, title: 'Special Sermon Video', url: '/media' },
    { id: 3, title: 'Prayer Guide', url: '/placeholder.svg' },
  ];
  return (
    <ul className="list-disc pl-6">
      {resources.map(r => (
        <li key={r.id}>
          <a href={r.url} className="text-iwc-blue hover:underline" download={r.url.endsWith('.pdf') || r.url.endsWith('.svg')}>{r.title}</a>
        </li>
      ))}
    </ul>
  );
}

const MemberArea = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [resent, setResent] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Admin role state
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
      setIsAdmin(!!data?.find((r: any) => r.role === 'admin'));
    })();
  }, [user]);

  // Sidebar navigation items (admin link conditional)
  const navItems = [
    { key: 'profile', label: 'Profile', icon: <FaUserCircle className="inline mr-2" /> },
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="inline mr-2" /> },
    { key: 'resources', label: 'Resources', icon: <FaFileAlt className="inline mr-2" /> },
    { key: 'exclusive', label: 'Exclusive', icon: <FaLock className="inline mr-2" /> },
    ...(isAdmin ? [{ key: 'admin', label: 'Admin', icon: <FaGift className="inline mr-2" /> }] : [])
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/login');
        return;
      }
      setUser(data.user);
      // Check email confirmation
      if (!data.user.email_confirmed_at) {
        setShowResend(true);
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleResend = async () => {
    if (user) {
      await supabase.auth.resend({ type: 'signup', email: user.email });
      setResent(true);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><GlobalLoadingScreen /></div>;
  if (!user) return null;
  if (showResend) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Email Confirmation Required</h2>
          <p className="mb-6">Please confirm your email address to access the member area.</p>
          <button
            onClick={handleResend}
            className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-2 px-6 rounded mb-4"
            disabled={resent}
          >
            {resent ? 'Confirmation Email Sent!' : 'Resend Confirmation Email'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-iwc-orange hover:bg-iwc-red text-white font-bold py-2 px-6 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <>
      <div className="flex flex-col items-center md:mb-8 w-full">
        <div className="mb-2">
          <img src="/iwc-logo.png" alt="Immanuel Worship Centre Logo" className="w-20 h-20 object-contain rounded-full border-4 border-iwc-blue bg-white shadow" />
        </div>
        <div className="font-semibold text-lg text-iwc-blue">{user.user_metadata?.name || 'Member'}</div>
        <div className="text-xs text-gray-500 mb-2">{user.email}</div>
      </div>
      <nav className="flex md:flex-col flex-row gap-2 md:gap-4 w-full justify-center md:justify-start">
        {navItems.map(item => (
          <Button
            key={item.key}
            variant={activeSection === item.key ? 'default' : 'ghost'}
            className={`flex items-center px-4 py-2 rounded transition-colors w-full text-left font-medium focus:outline-none focus:ring-2 focus:ring-iwc-blue ${activeSection === item.key ? 'bg-iwc-blue text-white' : 'hover:bg-iwc-orange/20 text-iwc-blue'}`}
            onClick={() => {
              if (item.key === 'admin') {
                navigate('/admin-dashboard');
                return;
              }
              setActiveSection(item.key); setDrawerOpen(false);
            }}
            aria-current={activeSection === item.key ? 'page' : undefined}
          >
            {item.icon}{item.label}
          </Button>
        ))}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center px-4 py-2 rounded transition-colors w-full text-left font-medium text-iwc-orange hover:bg-iwc-orange/10 mt-2 md:mt-8"
        >
          <FaSignOutAlt className="inline mr-2" />Logout
        </Button>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Drawer Sidebar */}
      <div className="md:hidden w-full">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="m-4"><span className="sr-only">Open menu</span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg></Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">{SidebarContent}</DrawerContent>
        </Drawer>
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white shadow-md rounded-l-lg flex-shrink-0 flex-col items-stretch py-8 px-0 z-10">
        {SidebarContent}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 bg-gray-50 min-h-screen">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section aria-labelledby="profile-heading" className="mb-12">
            <h2 id="profile-heading" className="text-2xl font-bold mb-6 flex items-center"><FaUserCircle className="mr-2" />Profile</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Update Form */}
              <Card className="rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
                <ProfileUpdateForm user={user} />
              </Card>
              {/* Profile Info */}
              <Card className="rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Profile Info</h3>
                <div className="mb-2">Email: <span className="font-mono">{user.email}</span></div>
                <div className="mb-2">User ID: <span className="font-mono">{user.id}</span></div>
              </Card>
            </div>
          </section>
        )}
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <section aria-labelledby="dashboard-heading" className="mb-12">
            <h2 id="dashboard-heading" className="text-2xl font-bold mb-6 flex items-center"><FaTachometerAlt className="mr-2" />Involvement Dashboard</h2>
            <MemberInvolvementDashboard user={user} />
          </section>
        )}
        {/* Resources Section */}
        {activeSection === 'resources' && (
          <section aria-labelledby="resources-heading" className="mb-12">
            <h2 id="resources-heading" className="text-2xl font-bold mb-6 flex items-center"><FaFileAlt className="mr-2" />Member Resources</h2>
            <Card className="rounded-lg shadow p-6">
              <ul className="list-disc pl-6">
                <li><a href="/iwc-welcome-pack.pdf" download className="text-iwc-blue hover:underline">Download Welcome Pack (PDF)</a></li>
                <li><a href="/media" className="text-iwc-blue hover:underline">Access Media Gallery</a></li>
                <li><a href="/blog" className="text-iwc-blue hover:underline">Read Member Blog</a></li>
                <li><a href="/iwc-annual-report.pdf" download className="text-iwc-blue hover:underline">Annual Report (PDF)</a></li>
                <li><a href="/iwc-child-sponsorship.pdf" download className="text-iwc-blue hover:underline">Child Sponsorship Info (PDF)</a></li>
              </ul>
            </Card>
          </section>
        )}
        {/* Exclusive Content Section */}
        {activeSection === 'exclusive' && (
          <section aria-labelledby="exclusive-heading" className="mb-12">
            <h2 id="exclusive-heading" className="text-2xl font-bold mb-6 flex items-center"><FaLock className="mr-2" />Exclusive Member Content</h2>
            <Card className="rounded-lg shadow p-6">
              <ExclusiveContentSection />
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default MemberArea;
