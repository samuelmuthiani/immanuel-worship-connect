
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, Mail, TrendingUp } from 'lucide-react';
import { getDashboardAnalytics } from '@/utils/adminUtils';

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
      bgColor: 'bg-iwc-blue/10'
    },
    {
      title: 'Total Events',
      value: analytics.totalEvents,
      icon: Calendar,
      color: 'text-iwc-orange',
      bgColor: 'bg-iwc-orange/10'
    },
    {
      title: 'Contact Submissions',
      value: analytics.totalSubmissions,
      icon: MessageSquare,
      color: 'text-iwc-gold',
      bgColor: 'bg-iwc-gold/10'
    },
    {
      title: 'Newsletter Subscribers',
      value: analytics.totalSubscribers,
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {analyticsCards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminAnalytics;
