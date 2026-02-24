
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, Mail, TrendingUp, Activity, Target } from 'lucide-react';
import { getDashboardAnalytics } from '@/utils/adminUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalMembers: number;
  totalEvents: number;
  totalSubmissions: number;
  totalSubscribers: number;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMembers: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    totalSubscribers: 0
  });
  const [loading, setLoading] = useState(true);

  const monthlyData = [
    { month: 'Jan', members: 45, events: 12, submissions: 28 },
    { month: 'Feb', members: 52, events: 15, submissions: 34 },
    { month: 'Mar', members: 61, events: 18, submissions: 42 },
    { month: 'Apr', members: 68, events: 20, submissions: 38 },
    { month: 'May', members: 75, events: 22, submissions: 45 },
    { month: 'Jun', members: 82, events: 25, submissions: 52 }
  ];

  const engagementData = [
    { name: 'Active Members', value: 65, color: 'hsl(220, 70%, 45%)' },
    { name: 'Event Participants', value: 48, color: 'hsl(30, 80%, 55%)' },
    { name: 'Newsletter Subs', value: 35, color: 'hsl(40, 90%, 50%)' },
    { name: 'Volunteers', value: 22, color: 'hsl(142, 70%, 45%)' }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getDashboardAnalytics();
      setAnalytics(data);
      setLoading(false);
    };
    fetchAnalytics();
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
              Growth Trends
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
                <Line type="monotone" dataKey="members" stroke="hsl(220, 70%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(220, 70%, 45%)', r: 3 }} />
                <Line type="monotone" dataKey="events" stroke="hsl(30, 80%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(30, 80%, 55%)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4 text-secondary" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
              <Bar dataKey="submissions" fill="hsl(40, 90%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="events" fill="hsl(30, 80%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
