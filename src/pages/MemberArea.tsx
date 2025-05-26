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
function MemberInvolvementDashboard({ rsvpHistory }: { rsvpHistory: any[] }) {
  // Mock donation data
  const [donations] = useState([
    { id: 'd1', date: '2024-12-01', amount: 2000, method: 'M-Pesa', note: 'Tithe' },
    { id: 'd2', date: '2025-01-15', amount: 1500, method: 'Bank', note: 'Offering' },
    { id: 'd3', date: '2025-03-10', amount: 5000, method: 'M-Pesa', note: 'Building Fund' },
  ]);
  const [donationSort, setDonationSort] = useState<'date'|'amount'>('date');
  const [eventSort, setEventSort] = useState<'date'|'name'>('date');
  // For demo, RSVP history has no date, so just sort by name
  const sortedDonations = [...donations].sort((a, b) =>
    donationSort === 'date' ? b.date.localeCompare(a.date) : b.amount - a.amount
  );
  const sortedEvents = [...rsvpHistory].sort((a, b) =>
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
                <span className="font-mono text-sm">{d.date}</span>
                <span className="font-bold text-lg text-iwc-blue">KES {d.amount.toLocaleString()}</span>
                <span className="text-xs">{d.method} &ndash; {d.note}</span>
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
                <span className="font-bold">{e.name || e.eventId}</span>
                <span className="text-xs font-mono">Event ID: {e.eventId}</span>
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
    { id: 1, title: 'Monthly Devotional (PDF)', url: '/public/placeholder.svg' },
    { id: 2, title: 'Special Sermon Video', url: '/media' },
    { id: 3, title: 'Prayer Guide', url: '/public/placeholder.svg' },
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
  const [rsvpHistory, setRsvpHistory] = useState<any[]>([]);
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpPage, setRsvpPage] = useState(1);
  const [activeSection, setActiveSection] = useState('profile');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const RSVPS_PER_PAGE = 5;

  // Sidebar navigation items
  const navItems = [
    { key: 'profile', label: 'Profile', icon: <FaUserCircle className="inline mr-2" /> },
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="inline mr-2" /> },
    { key: 'resources', label: 'Resources', icon: <FaFileAlt className="inline mr-2" /> },
    { key: 'exclusive', label: 'Exclusive', icon: <FaLock className="inline mr-2" /> },
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
    // Load RSVP history from localStorage (for now)
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '{}');
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email;
      if (email) {
        const history = Object.entries(registrations)
          .filter(([_, reg]: any) => reg.email === email)
          .map(([eventId, reg]: any) => ({ eventId, ...reg }));
        setRsvpHistory(history);
      }
    });
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
          <Avatar className="w-16 h-16 border-2 border-iwc-blue">
            {user.user_metadata?.avatar_url ? (
              <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
            ) : (
              <AvatarFallback><FaUserCircle className="w-12 h-12 text-iwc-blue" /></AvatarFallback>
            )}
          </Avatar>
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
            onClick={() => { setActiveSection(item.key); setDrawerOpen(false); }}
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
            <MemberInvolvementDashboard rsvpHistory={rsvpHistory} />
          </section>
        )}
        {/* Resources Section */}
        {activeSection === 'resources' && (
          <section aria-labelledby="resources-heading" className="mb-12">
            <h2 id="resources-heading" className="text-2xl font-bold mb-6 flex items-center"><FaFileAlt className="mr-2" />Member Resources</h2>
            <Card className="rounded-lg shadow p-6">
              <ul className="list-disc pl-6">
                <li><a href="/public/placeholder.svg" download className="text-iwc-blue hover:underline">Download Welcome Pack (PDF)</a></li>
                <li><a href="/media" className="text-iwc-blue hover:underline">Access Media Gallery</a></li>
                <li><a href="/blog" className="text-iwc-blue hover:underline">Read Member Blog</a></li>
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
