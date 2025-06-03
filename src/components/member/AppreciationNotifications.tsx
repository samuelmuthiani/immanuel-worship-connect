
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, DollarSign, Check } from 'lucide-react';
import { getUserAppreciations, markAppreciationAsRead, type AppreciationWithDonation } from '@/utils/donationUtils';

export function AppreciationNotifications() {
  const [appreciations, setAppreciations] = useState<AppreciationWithDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppreciations();
  }, []);

  const fetchAppreciations = async () => {
    setLoading(true);
    const data = await getUserAppreciations();
    setAppreciations(data);
    setLoading(false);
  };

  const handleMarkAsRead = async (appreciationId: string) => {
    const result = await markAppreciationAsRead(appreciationId);
    if (result.success) {
      setAppreciations(prev => 
        prev.map(app => 
          app.id === appreciationId 
            ? { ...app, read_at: new Date().toISOString() }
            : app
        )
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = appreciations.filter(app => !app.read_at).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Appreciation Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Appreciation Messages
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appreciations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No appreciation messages yet</p>
            <p className="text-sm">Your generous donations will be acknowledged here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appreciations.map((appreciation) => (
              <div 
                key={appreciation.id} 
                className={`border rounded-lg p-4 transition-colors ${
                  !appreciation.read_at 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Thank You Message
                      </span>
                      {!appreciation.read_at && (
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {appreciation.message}
                    </p>
                    
                    {appreciation.donations && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3">
                        <h5 className="text-sm font-medium mb-1">Related Donation:</h5>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(appreciation.donations.amount)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(appreciation.donations.created_at)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Sent on {formatDate(appreciation.sent_at)}
                    </div>
                  </div>
                  
                  {!appreciation.read_at && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(appreciation.id)}
                      className="ml-4"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
