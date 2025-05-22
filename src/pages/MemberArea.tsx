import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const MemberArea = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [resent, setResent] = useState(false);
  const [rsvpHistory, setRsvpHistory] = useState<any[]>([]);
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpPage, setRsvpPage] = useState(1);
  const navigate = useNavigate();
  const RSVPS_PER_PAGE = 5;

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

  if (loading) return null;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl flex justify-start mb-4">
        <a href="/" className="text-iwc-blue hover:text-iwc-orange font-semibold underline">&larr; Back to Church Site</a>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.email}</h2>
        <p className="mb-6 text-gray-600">This is your member dashboard. Enjoy exclusive content and features!</p>
        <div className="mb-8 text-left">
          <h3 className="text-xl font-semibold mb-2">Profile Info</h3>
          <div className="mb-2">Email: <span className="font-mono">{user.email}</span></div>
          <div className="mb-2">User ID: <span className="font-mono">{user.id}</span></div>
        </div>
        <div className="mb-8 text-left">
          <h3 className="text-xl font-semibold mb-2">Event RSVP History</h3>
          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Search events..."
              value={rsvpSearch}
              onChange={e => { setRsvpSearch(e.target.value); setRsvpPage(1); }}
              className="border rounded p-2 w-48"
            />
          </div>
          {rsvpHistory.length === 0 ? (
            <div className="text-gray-500">No event registrations found.</div>
          ) : (
            <>
              <ul className="list-disc pl-6">
                {rsvpHistory
                  .filter(rsvp =>
                    rsvp.eventId.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
                    (rsvp.name && rsvp.name.toLowerCase().includes(rsvpSearch.toLowerCase()))
                  )
                  .slice((rsvpPage-1)*RSVPS_PER_PAGE, rsvpPage*RSVPS_PER_PAGE)
                  .map((rsvp, idx) => (
                    <li key={idx} className="mb-1">Event ID: <span className="font-mono">{rsvp.eventId}</span> | Name: {rsvp.name}</li>
                  ))}
              </ul>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setRsvpPage(p => Math.max(1, p-1))} disabled={rsvpPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                <span>Page {rsvpPage}</span>
                <button onClick={() => setRsvpPage(p => p+1)}
                  disabled={rsvpPage * RSVPS_PER_PAGE >= rsvpHistory.filter(rsvp =>
                    rsvp.eventId.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
                    (rsvp.name && rsvp.name.toLowerCase().includes(rsvpSearch.toLowerCase()))
                  ).length}
                  className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </>
          )}
        </div>
        <div className="mb-8 text-left">
          <h3 className="text-xl font-semibold mb-2">Member Resources</h3>
          <ul className="list-disc pl-6">
            <li><a href="/public/placeholder.svg" download className="text-iwc-blue hover:underline">Download Welcome Pack (PDF)</a></li>
            <li><a href="/media" className="text-iwc-blue hover:underline">Access Media Gallery</a></li>
            <li><a href="/blog" className="text-iwc-blue hover:underline">Read Member Blog</a></li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-iwc-orange hover:bg-iwc-red text-white font-bold py-2 px-6 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MemberArea;
