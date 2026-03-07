
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, Mail, TrendingUp, Activity, Target } from 'lucide-react';
import { getDashboardAnalytics } from '@/utils/adminUtils';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalMembers: number;
  totalEvents: number;
  totalSubmissions: number;
  totalSubscribers: number;
}

interface MonthlyRow {
  month: string;
  members: number;
  events: number;
  submissions: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthlyData(
  profiles: { created_at: string }[],
  events: { created_at: string }[],
  submissions: { submitted_at: string }[]
): MonthlyRow[] {
  const now = new Date();
  const months: MonthlyRow[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      month: MONTH_LABELS[d.getMonth()],
      members: profiles.filter(p => p.created_at.startsWith(key)).length,
      events: events.filter(e => e.created_at.startsWith(key)).length,
      submissions: submissions.filter(s => s.submitted_at.startsWith(key)).length,
    });
  }
  return months;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMembers: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    totalSubscribers: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>([]);
  const [engagementData, setEngagementData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const data = await getDashboardAnalytics();
      setAnalytics(data);

      // Fetch raw rows for monthly breakdown
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const since = sixMonthsAgo.toISOString();

      const [profilesRes, eventsRes, subsRes, regRes] = await Promise.all([
        supabase.from('profiles').select('created_at').gte('created_at', since),
        supabase.from('events').select('created_at').gte('created_at', since),
        supabase.from('contact_submissions').select('submitted_at').gte('submitted_at', since),
        supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
      ]);

      setMonthlyData(
        buildMonthlyData(
          profilesRes.data || [],
          eventsRes.data || [],
          subsRes.data || []
        )
      );

      const regCount = regRes.count || 0;
      setEngagementData([
        { name: 'Members', value: data.totalMembers, color: 'hsl(220, 70%, 45%)' },
        { name: 'Event Registrations', value: regCount, color: 'hsl(30, 80%, 55%)' },
        { name: 'Newsletter Subs', value: data.totalSubscribers, color: 'hsl(40, 90%, 50%)' },
        { name: 'Contact Forms', value: data.totalSubmissions, color: 'hsl(142, 70%, 45%)' },
      ]);

      setLoading(false);
    };
    fetchAll();
  }, []);

  const analyticsCards = [
    { title: 'Total Members', value: analytics.totalMembers, icon: Users, accent: 'text-primary bg-primary/10' },
    { title: 'Active Events', value: analytics.totalEvents, icon: Calendar, accent: 'text-secondary bg-secondary/10' },
    { title: 'Contact Forms', value: analytics.totalSubmissions, icon: MessageSquare, accent: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20' },
    { title: 'Subscribers', value: analytics.totalSubscribers, icon: Mail, accent: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20' }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-16 bg-muted rounded-lg animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.accent}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Growth Trends (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line type="monotone" dataKey="members" name="New Members" stroke="hsl(220, 70%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(220, 70%, 45%)', r: 3 }} />
                <Line type="monotone" dataKey="events" name="Events Created" stroke="hsl(30, 80%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(30, 80%, 55%)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4 text-secondary" />
              Engagement Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {engagementData.every(d => d.value === 0) ? (
              <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
                No engagement data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={engagementData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {engagementData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Activity className="h-4 w-4 text-amber-500" />
            Monthly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="submissions" name="Contact Forms" fill="hsl(40, 90%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="events" name="Events" fill="hsl(30, 80%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
