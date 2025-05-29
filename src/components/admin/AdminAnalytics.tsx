
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, Mail, TrendingUp, DollarSign, Activity, Target } from 'lucide-react';
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

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', members: 45, events: 12, submissions: 28 },
    { month: 'Feb', members: 52, events: 15, submissions: 34 },
    { month: 'Mar', members: 61, events: 18, submissions: 42 },
    { month: 'Apr', members: 68, events: 20, submissions: 38 },
    { month: 'May', members: 75, events: 22, submissions: 45 },
    { month: 'Jun', members: 82, events: 25, submissions: 52 }
  ];

  const engagementData = [
    { name: 'Active Members', value: 65, color: '#2563EB' },
    { name: 'Event Participants', value: 48, color: '#F97316' },
    { name: 'Newsletter Subscribers', value: 35, color: '#FFC107' },
    { name: 'Volunteers', value: 22, color: '#22C55E' }
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
    {
      title: 'Total Members',
      value: analytics.totalMembers,
      icon: Users,
      color: 'text-iwc-blue',
      bgColor: 'bg-iwc-blue/10',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Events',
      value: analytics.totalEvents,
      icon: Calendar,
      color: 'text-iwc-orange',
      bgColor: 'bg-iwc-orange/10',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Contact Submissions',
      value: analytics.totalSubmissions,
      icon: MessageSquare,
      color: 'text-iwc-gold',
      bgColor: 'bg-iwc-gold/10',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Newsletter Subscribers',
      value: analytics.totalSubscribers,
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+23%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-iwc-blue dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      card.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-iwc-blue" />
              <span>Growth Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="members" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 4 }} />
                <Line type="monotone" dataKey="events" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-iwc-orange" />
              <span>Engagement Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
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
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 text-iwc-gold" />
            <span>Monthly Activity Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="submissions" fill="#FFC107" radius={[4, 4, 0, 0]} />
              <Bar dataKey="events" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
