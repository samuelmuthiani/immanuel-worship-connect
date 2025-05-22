import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getContactSubmissions } from '@/utils/storage';
import type { Database } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { FiEdit, FiTrash2, FiEye, FiDownload, FiMail, FiUserCheck, FiUserX } from 'react-icons/fi';
import RSVPAdminTable from './RSVPAdminTable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { logAudit } from '@/lib/audit';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Database['public']['Tables']['events']['Row'][]>([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventForm, setEventForm] = useState<any>({ title: '', event_date: '', location: '', description: '', category: '', image_url: '' });
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add state for search/filter/pagination
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const EVENTS_PER_PAGE = 5;

  const [messageSearch, setMessageSearch] = useState('');
  const [messagePage, setMessagePage] = useState(1);
  const MESSAGES_PER_PAGE = 5;

  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 5;

  // Bulk selection state
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Modals and confirmation dialog
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalEvent, setModalEvent] = useState<any>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
  const [confirmText, setConfirmText] = useState('');

  // Stats
  const eventCount = events.length;
  const messageCount = messages.length;
  const userCount = users.length;

  // Donor Thank You Messages (admin only)
  const [donorThanks, setDonorThanks] = useState<any[]>([]);

  // Site content state for multi-section editing
  const SITE_SECTIONS = [
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
    { key: 'services', label: 'Services' },
    { key: 'home', label: 'Home' },
  ];
  const [selectedSection, setSelectedSection] = useState('about');
  const [siteContent, setSiteContent] = useState<{ [key: string]: string }>({});
  const [siteContentLoading, setSiteContentLoading] = useState(false);
  const [siteContentEditMode, setSiteContentEditMode] = useState(false);
  const [siteContentDraft, setSiteContentDraft] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Newsletter Subscribers (admin only)
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);

  // User Roles Management (Admin Only)
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleEditUser, setRoleEditUser] = useState<string | null>(null);
  const [roleEditValue, setRoleEditValue] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/login');
        return;
      }
      setUser(data.user);
      // Check user_roles table for admin role
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
      if (!roles || !roles.some(r => r.role === 'admin')) {
        navigate('/member');
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      setEventLoading(true);
      try {
        const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setEvents([]);
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Fetch messages from Supabase (was localStorage)
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('submitted_at', { ascending: false });
        if (!error && data) setMessages(data);
        else setMessages([]);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        setUsers(data?.users || []);
      } catch (err) {
        setUsers([]);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch donor thank yous from Supabase (was localStorage)
    const fetchDonorThanks = async () => {
      try {
        const { data, error } = await supabase
          .from('donor_thank_yous')
          .select('*')
          .order('submitted_at', { ascending: false });
        if (!error && data) setDonorThanks(data);
        else setDonorThanks([]);
      } catch {
        setDonorThanks([]);
      }
    };
    fetchDonorThanks();
  }, []);

  // Fetch About content from Supabase
  useEffect(() => {
    const fetchSiteContent = async () => {
      setSiteContentLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from('site_content')
          .select('section, content');
        if (!error && data) {
          const contentMap: { [key: string]: string } = {};
          data.forEach((row: any) => { contentMap[row.section] = row.content; });
          setSiteContent(contentMap);
        }
      } finally {
        setSiteContentLoading(false);
      }
    };
    fetchSiteContent();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    // Fetch newsletter subscribers from Supabase
    const fetchSubscribers = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false });
        if (!error && data) setNewsletterSubscribers(data);
      } catch {}
    };
    fetchSubscribers();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const { data, error } = await supabase.from('user_roles').select('*');
        if (!error && data) setRoles(data);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, [isAdmin]);

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  // Handle image upload for event
  const handleEventImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await handleImageUpload(file);
      if (url) {
        setEventForm(f => ({ ...f, image_url: url }));
      }
    }
  };
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventLoading(true);
    try {
      if (editingEvent) {
        const { error } = await supabase.from('events').update(eventForm).eq('id', editingEvent.id);
        if (error) throw error;
        toast({ title: 'Event updated' });
      } else {
        const { error } = await supabase.from('events').insert([eventForm]);
        if (error) throw error;
        toast({ title: 'Event created' });
      }
      setEventForm({ title: '', event_date: '', location: '', description: '', category: '', image_url: '' });
      setEditingEvent(null);
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      setEvents(data || []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setEventLoading(false);
    }
  };
  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventForm(event);
  };
  const handleDeleteEvent = async (id: string) => {
    setEventLoading(true);
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Event deleted' });
      if (user && user.id) {
        await logAudit(user.id, 'delete_event', `Deleted event ${id}`);
      }
      setEvents(events.filter(e => e.id !== id));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setEventLoading(false);
    }
  };

  // CSV export helpers
  function arrayToCSV(rows: any[], headers: string[]): string {
    const escape = (v: any) => '"' + String(v).replace(/"/g, '""') + '"';
    return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h] ?? '')).join(','))].join('\r\n');
  }
  function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Table ARIA props for accessibility
  const tableAriaProps = {
    role: 'table',
    'aria-label': 'Events management table',
  };
  const thAriaProps = {
    scope: 'col',
  };

  // Focus management for modals (trap focus)
  const firstModalButtonRef = React.useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (showEventModal || showMessageModal || showUserModal || showConfirm) {
      setTimeout(() => {
        firstModalButtonRef.current?.focus();
      }, 100);
    }
  }, [showEventModal, showMessageModal, showUserModal, showConfirm]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('site-content-images').upload(fileName, file);
    if (error) return null;
    const { data: publicUrlData } = supabase.storage.from('site-content-images').getPublicUrl(fileName);
    return publicUrlData?.publicUrl || null;
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: function () {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = async () => {
            if (input.files && input.files[0]) {
              const url = await handleImageUpload(input.files[0]);
              if (url) {
                const quill = this.quill;
                const range = quill.getSelection();
                quill.insertEmbed(range ? range.index : 0, 'image', url);
              }
            }
          };
        },
      },
    },
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user || !isAdmin) {
    return <div className="p-8 text-red-600">Access denied. Admins only.<br/>Allowed admin emails: <b>admin@iwc.com</b>, <b>samuel.watho@gmail.com</b><br/>Password: <b>W@th@13548</b></div>;
  }

  // Utility: Check if user has a specific role
  const hasRole = (role: string) => {
    if (!user) return false;
    const userRole = roles.find((r: any) => r.user_id === user.id)?.role;
    return userRole === role;
  };

  // Handle role change for user_roles management
  const handleRoleChange = async (userId: string, newRole: string) => {
    await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
    // Audit log
    if (user && user.id) {
      await logAudit(user.id, 'role_change', `Changed role for user ${userId} to ${newRole}`);
    }
    // Refresh roles
    const { data } = await supabase.from('user_roles').select('*');
    setRoles(data || []);
    setRoleEditUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 flex items-center gap-4">
          <FiEye className="text-iwc-blue text-2xl" />
          <div>
            <div className="text-lg font-bold">{eventCount}</div>
            <div className="text-gray-500">Events</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 flex items-center gap-4">
          <FiMail className="text-iwc-blue text-2xl" />
          <div>
            <div className="text-lg font-bold">{messageCount}</div>
            <div className="text-gray-500">Messages</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 flex items-center gap-4">
          <FiUserCheck className="text-iwc-blue text-2xl" />
          <div>
            <div className="text-lg font-bold">{userCount}</div>
            <div className="text-gray-500">Users</div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-6 overflow-x-auto">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          {hasRole('admin') || hasRole('editor') ? <TabsTrigger value="users">Users</TabsTrigger> : null}
          {hasRole('admin') || hasRole('finance') ? <TabsTrigger value="donors">Donor Thank Yous</TabsTrigger> : null}
          <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
          <TabsTrigger value="sitecontent">Site Content</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter Subscribers</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-2">Events</h2>
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <input
                type="text"
                placeholder="Search events..."
                value={eventSearch}
                onChange={e => { setEventSearch(e.target.value); setEventPage(1); }}
                className="border rounded p-2 w-48"
                aria-label="Search events"
              />
              <select
                value={eventCategory}
                onChange={e => { setEventCategory(e.target.value); setEventPage(1); }}
                className="border rounded p-2"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {[...new Set(events.map(ev => ev.category).filter(Boolean))].map(cat => (
                  <option key={cat} value={cat as string}>{cat}</option>
                ))}
              </select>
              <button
                className="bg-iwc-blue text-white rounded px-3 py-1 text-sm"
                onClick={() => {
                  const filtered = events
                    .filter(ev => (!eventCategory || ev.category === eventCategory))
                    .filter(ev =>
                      ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                      (ev.location && ev.location.toLowerCase().includes(eventSearch.toLowerCase())) ||
                      (ev.category && ev.category.toLowerCase().includes(eventSearch.toLowerCase()))
                    );
                  const csv = arrayToCSV(filtered, ['title','event_date','location','category','description']);
                  downloadCSV('events.csv', csv);
                }}
                aria-label="Export events as CSV"
              >Export CSV</button>
              {selectedEvents.length > 0 && (
                <button
                  className="bg-red-600 text-white rounded px-3 py-1 text-sm"
                  onClick={() => {
                    setConfirmText('Delete selected events?');
                    setConfirmAction(() => async () => {
                      setEventLoading(true);
                      for (const id of selectedEvents) {
                        await supabase.from('events').delete().eq('id', id);
                      }
                      setEvents(events.filter(e => !selectedEvents.includes(e.id)));
                      setSelectedEvents([]);
                      setEventLoading(false);
                      toast({ title: 'Selected events deleted' });
                    });
                    setShowConfirm(true);
                  }}
                  aria-label="Delete selected events"
                >Delete Selected</button>
              )}
            </div>
            <form onSubmit={handleEventSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Add or edit event form">
              <input name="title" value={eventForm.title} onChange={handleEventFormChange} placeholder="Title" className="border rounded p-2" required aria-label="Event title" />
              <input name="event_date" value={eventForm.event_date} onChange={handleEventFormChange} placeholder="Date (YYYY-MM-DD)" className="border rounded p-2" required aria-label="Event date" />
              <input name="location" value={eventForm.location} onChange={handleEventFormChange} placeholder="Location" className="border rounded p-2" required aria-label="Event location" />
              <input name="category" value={eventForm.category} onChange={handleEventFormChange} placeholder="Category" className="border rounded p-2" aria-label="Event category" />
              <textarea name="description" value={eventForm.description} onChange={handleEventFormChange} placeholder="Description" className="border rounded p-2 md:col-span-2" required aria-label="Event description" />
              <div className="md:col-span-2 flex flex-col gap-2">
                <label htmlFor="event-image-upload" className="font-medium">Event Image</label>
                <input id="event-image-upload" name="image" type="file" accept="image/*" onChange={handleEventImageChange} className="border rounded p-2" aria-label="Event image upload" />
                {eventForm.image_url && (
                  <img src={eventForm.image_url} alt="Event preview" className="h-32 w-auto rounded mt-2 border" />
                )}
              </div>
              <button type="submit" className="bg-iwc-blue text-white rounded px-4 py-2 md:col-span-2">{editingEvent ? 'Update' : 'Add'} Event</button>
            </form>
            {eventLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <img src="/lovable-uploads/ce6f3188-56d4-40eb-9194-1abca3f6a4db.png" alt="Loading" className="w-12 h-12 mb-2 animate-spin-slow" style={{ animationDuration: '2s' }} />
                <span className="text-iwc-blue font-semibold">Loading events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No events found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-t min-w-[600px]" {...tableAriaProps}>
                  <thead>
                    <tr>
                      <th {...thAriaProps}><input type="checkbox" checked={selectedEvents.length === events.length && events.length > 0} onChange={e => setSelectedEvents(e.target.checked ? events.map(ev => ev.id) : [])} aria-label="Select all events" /></th>
                      <th className="py-2" {...thAriaProps}>Title</th>
                      <th {...thAriaProps}>Date</th>
                      <th {...thAriaProps}>Location</th>
                      <th {...thAriaProps}>Category</th>
                      <th {...thAriaProps}>Image</th>
                      <th {...thAriaProps}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter(ev => (!eventCategory || ev.category === eventCategory))
                      .filter(ev =>
                        ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                        (ev.location && ev.location.toLowerCase().includes(eventSearch.toLowerCase())) ||
                        (ev.category && ev.category.toLowerCase().includes(eventSearch.toLowerCase()))
                      )
                      .slice((eventPage-1)*EVENTS_PER_PAGE, eventPage*EVENTS_PER_PAGE)
                      .map(ev => (
                        <tr key={ev.id} className="border-t hover:bg-gray-100">
                          <td><input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={e => setSelectedEvents(e.target.checked ? [...selectedEvents, ev.id] : selectedEvents.filter(id => id !== ev.id))} aria-label={`Select event ${ev.title}`} /></td>
                          <td className="py-2">{ev.title}</td>
                          <td>{ev.event_date}</td>
                          <td>{ev.location}</td>
                          <td>{ev.category}</td>
                          <td>{ev.image_url ? <img src={ev.image_url} alt="Event" className="h-12 w-auto rounded" /> : <span className="text-gray-400">No image</span>}</td>
                          <td className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="View details" onClick={() => { setModalEvent(ev); setShowEventModal(true); }} className="text-iwc-blue"><FiEye /></button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="Edit event" onClick={() => handleEditEvent(ev)} className="text-green-700"><FiEdit /></button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="Delete event" onClick={() => { setConfirmText('Delete this event?'); setConfirmAction(() => () => handleDeleteEvent(ev.id)); setShowConfirm(true); }} className="text-red-600"><FiTrash2 /></button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="messages">
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-2">Messages</h2>
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <input
                type="text"
                placeholder="Search messages..."
                value={messageSearch}
                onChange={e => { setMessageSearch(e.target.value); setMessagePage(1); }}
                className="border rounded p-2 w-48"
              />
              <button
                className="bg-iwc-blue text-white rounded px-3 py-1 text-sm"
                onClick={() => {
                  const filtered = messages
                    .filter(msg =>
                      msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      (msg.subject && msg.subject.toLowerCase().includes(messageSearch.toLowerCase())) ||
                      msg.message.toLowerCase().includes(messageSearch.toLowerCase())
                    );
                  const csv = arrayToCSV(filtered, ['name','email','subject','message']);
                  downloadCSV('messages.csv', csv);
                }}
              >Export CSV</button>
              {selectedMessages.length > 0 && (
                <button
                  className="bg-red-600 text-white rounded px-3 py-1 text-sm"
                  onClick={async () => {
                    // Delete selected messages from Supabase
                    for (const i of selectedMessages) {
                      const msg = messages[i];
                      if (msg && msg.id) {
                        await supabase.from('contact_submissions').delete().eq('id', msg.id);
                      }
                    }
                    setMessages(messages.filter((_, i) => !selectedMessages.includes(i)));
                    setSelectedMessages([]);
                    toast({ title: 'Selected messages deleted' });
                  }}
                >Delete Selected</button>
              )}
            </div>
            {messages.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No messages found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-t min-w-[600px]" {...tableAriaProps}>
                  <thead>
                    <tr>
                      <th {...thAriaProps}><input type="checkbox" checked={selectedMessages.length === messages.length && messages.length > 0} onChange={e => setSelectedMessages(e.target.checked ? messages.map((_, i) => i) : [])} aria-label="Select all messages" /></th>
                      <th className="py-2" {...thAriaProps}>Name</th>
                      <th {...thAriaProps}>Email</th>
                      <th {...thAriaProps}>Subject</th>
                      <th {...thAriaProps}>Message</th>
                      <th {...thAriaProps}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? <tr><td colSpan={6}>No messages found.</td></tr> : messages
                      .filter(msg =>
                        msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                        msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                        (msg.subject && msg.subject.toLowerCase().includes(messageSearch.toLowerCase())) ||
                        msg.message.toLowerCase().includes(messageSearch.toLowerCase())
                      )
                      .slice((messagePage-1)*MESSAGES_PER_PAGE, messagePage*MESSAGES_PER_PAGE)
                      .map((msg, i) => (
                        <tr key={i} className="border-t hover:bg-gray-100">
                          <td><input type="checkbox" checked={selectedMessages.includes(i)} onChange={e => setSelectedMessages(e.target.checked ? [...selectedMessages, i] : selectedMessages.filter(idx => idx !== i))} aria-label={`Select message ${msg.subject}`} /></td>
                          <td className="py-2">{msg.name}</td>
                          <td>{msg.email}</td>
                          <td>{msg.subject}</td>
                          <td className="truncate max-w-xs">{msg.message}</td>
                          <td className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="View message" onClick={() => { setModalMessage(msg); setShowMessageModal(true); }} className="text-iwc-blue"><FiEye /></button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a aria-label="Reply" href={`mailto:${msg.email}`} className="text-green-700"><FiMail /></a>
                              </TooltipTrigger>
                              <TooltipContent>Reply</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="Delete message" onClick={() => { setConfirmText('Delete this message?'); setConfirmAction(() => () => { setMessages(messages.filter((_, idx) => idx !== i)); setSelectedMessages(selectedMessages.filter(idx => idx !== i)); toast({ title: 'Message deleted (local only)' }); }); setShowConfirm(true); }} className="text-red-600"><FiTrash2 /></button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination for messages */}
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setMessagePage(p => Math.max(1, p-1))} disabled={messagePage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {messagePage}</span>
              <button onClick={() => setMessagePage(p => p+1)}
                disabled={messagePage * MESSAGES_PER_PAGE >= messages.filter(msg =>
                  msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                  msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                  (msg.subject && msg.subject.toLowerCase().includes(messageSearch.toLowerCase())) ||
                  msg.message.toLowerCase().includes(messageSearch.toLowerCase())
                ).length}
                className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
            {/* TODO: Switch to Supabase when contact_submissions table is available */}
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-2">Users</h2>
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                className="border rounded p-2 w-48"
              />
              <button
                className="bg-iwc-blue text-white rounded px-3 py-1 text-sm"
                onClick={() => {
                  const filtered = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()));
                  const csv = arrayToCSV(filtered, ['email','created_at']);
                  downloadCSV('users.csv', csv);
                }}
              >Export CSV</button>
              {selectedUsers.length > 0 && (
                <button
                  className="bg-red-600 text-white rounded px-3 py-1 text-sm"
                  onClick={() => {
                    setUsers(users.filter(u => !selectedUsers.includes(u.id)));
                    setSelectedUsers([]);
                    toast({ title: 'Selected users removed (local only)' });
                  }}
                >Remove Selected</button>
              )}
            </div>
            {userLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <img src="/lovable-uploads/ce6f3188-56d4-40eb-9194-1abca3f6a4db.png" alt="Loading" className="w-12 h-12 mb-2 animate-spin-slow" style={{ animationDuration: '2s' }} />
                <span className="text-iwc-blue font-semibold">Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-t min-w-[600px]" {...tableAriaProps}>
                  <thead>
                    <tr>
                      <th {...thAriaProps}><input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={e => setSelectedUsers(e.target.checked ? users.map(u => u.id) : [])} aria-label="Select all users" /></th>
                      <th className="py-2" {...thAriaProps}>Email</th>
                      <th {...thAriaProps}>Role</th>
                      <th {...thAriaProps}>Created</th>
                      <th {...thAriaProps}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? <tr><td colSpan={5}>No users found.</td></tr> : users
                      .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .slice((userPage-1)*USERS_PER_PAGE, userPage*USERS_PER_PAGE)
                      .map((u, i) => (
                        <tr key={i} className="border-t hover:bg-gray-100">
                          <td><input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={e => setSelectedUsers(e.target.checked ? [...selectedUsers, u.id] : selectedUsers.filter(id => id !== u.id))} /></td>
                          <td className="py-2">{u.email}</td>
                          <td>{u.role || (['admin@iwc.com','samuel.watho@gmail.com'].includes(u.email) ? 'admin' : 'member')}</td>
                          <td>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</td>
                          <td className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="View user" onClick={() => { setModalUser(u); setShowUserModal(true); }} className="text-iwc-blue"><FiEye /></button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                            {/* Promote/Demote role buttons (UI only, Supabase TODO) */}
                            {(['admin@iwc.com','samuel.watho@gmail.com'].includes(u.email)) ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button aria-label="Demote to member" disabled className="text-gray-400 cursor-not-allowed"><FiUserX /></button>
                                </TooltipTrigger>
                                <TooltipContent>Admin (cannot demote)</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button aria-label="Promote to admin" onClick={() => toast({ title: 'TODO: Promote to admin (Supabase integration needed)' })} className="text-green-700"><FiUserCheck /></button>
                                </TooltipTrigger>
                                <TooltipContent>Promote to admin</TooltipContent>
                              </Tooltip>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button aria-label="Remove user" onClick={() => { setConfirmText('Remove this user?'); setConfirmAction(() => () => { setUsers(users.filter(user => user.id !== u.id)); setSelectedUsers(selectedUsers.filter(id => id !== u.id)); toast({ title: 'User removed (local only)' }); }); setShowConfirm(true); }} className="text-red-600"><FiUserX /></button>
                              </TooltipTrigger>
                              <TooltipContent>Remove</TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination for users */}
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setUserPage(p => Math.max(1, p-1))} disabled={userPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {userPage}</span>
              <button onClick={() => setUserPage(p => p+1)}
                disabled={userPage * USERS_PER_PAGE >= users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())).length}
                className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
            <h3 className="text-xl font-bold mb-4 mt-8">User Roles Management</h3>
            {rolesLoading ? (
              <div>Loading roles...</div>
            ) : (
              <table className="w-full border rounded mb-8">
                <thead>
                  <tr>
                    <th className="p-2 border">User ID</th>
                    <th className="p-2 border">Role</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role: any) => (
                    <tr key={role.user_id}>
                      <td className="p-2 border font-mono">{role.user_id}</td>
                      <td className="p-2 border">
                        {roleEditUser === role.user_id ? (
                          <select
                            value={roleEditValue}
                            onChange={e => setRoleEditValue(e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                            <option value="editor">editor</option>
                            <option value="moderator">moderator</option>
                            <option value="finance">finance</option>
                          </select>
                        ) : (
                          <span>{role.role}</span>
                        )}
                      </td>
                      <td className="p-2 border">
                        {roleEditUser === role.user_id ? (
                          <>
                            <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleRoleChange(role.user_id, roleEditValue)}>Save</button>
                            <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setRoleEditUser(null)}>Cancel</button>
                          </>
                        ) : (
                          <button className="bg-iwc-blue text-white px-2 py-1 rounded" onClick={() => { setRoleEditUser(role.user_id); setRoleEditValue(role.role); }}>Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
        <TabsContent value="donors">
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-2">Donor Thank You Messages</h2>
            {donorThanks.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No donor messages yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-t min-w-[600px]" role="table" aria-label="Donor Thank Yous">
                  <thead>
                    <tr>
                      <th scope="col" className="py-2">Name</th>
                      <th scope="col">Organization</th>
                      <th scope="col">Message</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donorThanks.slice().reverse().map((t, idx) => (
                      <tr key={t.id || idx} className="border-t hover:bg-gray-100">
                        <td className="py-2">{t.name}</td>
                        <td>{t.org}</td>
                        <td>{t.message}</td>
                        <td>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={async () => {
                              if (t.id) {
                                await supabase.from('donor_thank_yous').delete().eq('id', t.id);
                                setDonorThanks(donorThanks.filter(d => d.id !== t.id));
                                toast({ title: 'Donor thank you deleted' });
                              }
                            }}
                            aria-label="Delete donor thank you"
                          >Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="rsvps">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">RSVPs</h2>
            <RSVPAdminTable />
          </div>
        </TabsContent>
        <TabsContent value="sitecontent">
          <div className="bg-white rounded shadow p-4 max-w-3xl mx-auto">
            <h2 className="font-semibold mb-4">Edit Site Content</h2>
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <label htmlFor="section-select" className="font-medium">Section:</label>
              <select
                id="section-select"
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="border rounded p-2"
                aria-label="Select site section"
              >
                {SITE_SECTIONS.map(sec => (
                  <option key={sec.key} value={sec.key}>{sec.label}</option>
                ))}
              </select>
            </div>
            {siteContentLoading ? (
              <div className="flex items-center gap-2">Loading...</div>
            ) : siteContentEditMode ? (
              <div>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className={`rounded px-4 py-2 ${showPreview ? 'bg-gray-200' : 'bg-iwc-blue text-white'}`}
                    onClick={() => setShowPreview(false)}
                    aria-pressed={!showPreview}
                  >Edit</button>
                  <button
                    type="button"
                    className={`rounded px-4 py-2 ${showPreview ? 'bg-iwc-blue text-white' : 'bg-gray-200'}`}
                    onClick={() => setShowPreview(true)}
                    aria-pressed={showPreview}
                  >Preview</button>
                </div>
                {showPreview ? (
                  <div className="prose max-w-none border rounded p-4 bg-gray-50 mb-4" dangerouslySetInnerHTML={{ __html: siteContentDraft || '<em>No content to preview.</em>' }} />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={siteContentDraft}
                    onChange={setSiteContentDraft}
                    modules={quillModules}
                    className="bg-white"
                  />
                )}
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    setSiteContentLoading(true);
                    const { error } = await (supabase as any)
                      .from('site_content')
                      .upsert({ section: selectedSection, content: siteContentDraft });
                    if (!error) {
                      setSiteContent((prev) => ({ ...prev, [selectedSection]: siteContentDraft }));
                      setSiteContentEditMode(false);
                      setShowPreview(false);
                      toast({ title: `${SITE_SECTIONS.find(s => s.key === selectedSection)?.label} page updated!` });
                    } else {
                      toast({ title: 'Error', description: error.message, variant: 'destructive' });
                    }
                    setSiteContentLoading(false);
                  }}
                  className="space-y-4 mt-4"
                >
                  <div className="flex gap-2">
                    <button type="submit" className="bg-iwc-blue text-white rounded px-4 py-2">Save</button>
                    <button type="button" className="bg-gray-200 rounded px-4 py-2" onClick={() => { setSiteContentEditMode(false); setShowPreview(false); }}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: siteContent[selectedSection] || '<em>No content set for this section.</em>' }} />
                <button className="bg-iwc-blue text-white rounded px-4 py-2" onClick={() => { setSiteContentDraft(siteContent[selectedSection] || ''); setSiteContentEditMode(true); }}>Edit</button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="newsletter">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Newsletter Subscribers</h2>
            <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {newsletterSubscribers.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4">No subscribers yet.</td></tr>
                ) : (
                  newsletterSubscribers.map((sub, i) => (
                    <tr key={i}>
                      <td className="py-2 px-4 border-b">{sub.email}</td>
                      <td className="py-2 px-4 border-b">{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleString() : ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal} aria-modal="true" aria-labelledby="event-modal-title">
        <DialogContent>
          <DialogHeader>
            <DialogTitle id="event-modal-title">Event Details</DialogTitle>
          </DialogHeader>
          {modalEvent && (
            <div className="space-y-2">
              <div><b>Title:</b> {modalEvent.title}</div>
              <div><b>Date:</b> {modalEvent.event_date}</div>
              <div><b>Location:</b> {modalEvent.location}</div>
              <div><b>Category:</b> {modalEvent.category}</div>
              <div><b>Description:</b> {modalEvent.description}</div>
            </div>
          )}
          <DialogFooter>
            <button ref={firstModalButtonRef} className="bg-iwc-blue text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iwc-blue" onClick={() => setShowEventModal(false)}>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Message Details Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal} aria-modal="true" aria-labelledby="message-modal-title">
        <DialogContent>
          <DialogHeader>
            <DialogTitle id="message-modal-title">Message Details</DialogTitle>
          </DialogHeader>
          {modalMessage && (
            <div className="space-y-2">
              <div><b>Name:</b> {modalMessage.name}</div>
              <div><b>Email:</b> <a href={`mailto:${modalMessage.email}`} className="text-iwc-blue underline">{modalMessage.email}</a></div>
              <div><b>Subject:</b> {modalMessage.subject}</div>
              <div><b>Message:</b> {modalMessage.message}</div>
            </div>
          )}
          <DialogFooter>
            <button ref={firstModalButtonRef} className="bg-iwc-blue text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iwc-blue" onClick={() => setShowMessageModal(false)}>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal} aria-modal="true" aria-labelledby="user-modal-title">
        <DialogContent>
          <DialogHeader>
            <DialogTitle id="user-modal-title">User Details</DialogTitle>
          </DialogHeader>
          {modalUser && (
            <div className="space-y-2">
              <div><b>Email:</b> {modalUser.email}</div>
              <div><b>Created:</b> {modalUser.created_at ? new Date(modalUser.created_at).toLocaleString() : ''}</div>
              <div><b>ID:</b> {modalUser.id}</div>
            </div>
          )}
          <DialogFooter>
            <button ref={firstModalButtonRef} className="bg-iwc-blue text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iwc-blue" onClick={() => setShowUserModal(false)}>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm} aria-modal="true" aria-labelledby="confirm-modal-title">
        <DialogContent>
          <DialogHeader>
            <DialogTitle id="confirm-modal-title">Are you sure?</DialogTitle>
          </DialogHeader>
          <div>{confirmText}</div>
          <DialogFooter>
            <button ref={firstModalButtonRef} className="bg-gray-200 rounded px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-iwc-blue" onClick={() => setShowConfirm(false)}>Cancel</button>
            <button className="bg-red-600 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600" onClick={() => { setShowConfirm(false); confirmAction && confirmAction(); }}>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Focus-visible style for action buttons */}
      <style>{`
        button:focus-visible, a:focus-visible {
          outline: 2px solid #F97316;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px #2563EB33;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
