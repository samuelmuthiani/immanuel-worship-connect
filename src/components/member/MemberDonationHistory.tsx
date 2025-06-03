import React, { useEffect, useState, useRef } from 'react';
import { getUserDonations, type Donation } from '@/utils/donationUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useToast } from '@/hooks/use-toast';
import { Alert } from '@/components/ui/alert';
import { Heart, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MemberDonationHistory: React.FC<{ refreshSignal?: number }> = ({ refreshSignal }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const prevRefreshSignal = useRef<number | undefined>(undefined);
  const { user } = useAuth();

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserDonations();
      setDonations(data);
    } catch (err) {
      setError('Failed to load your donations. Please try again.');
      toast({
        title: 'Error',
        description: 'Could not fetch your donation history.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    if (!user) return;
    // Real-time subscription for this user's donations
    const channel = supabase.channel('user-donations')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'donations',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        // Prepend new donation to the list
        setDonations((prev) => [payload.new as Donation, ...prev]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (refreshSignal !== undefined && refreshSignal !== prevRefreshSignal.current) {
      fetchDonations();
      prevRefreshSignal.current = refreshSignal;
    }
  }, [refreshSignal]);

  if (loading) {
    return <LoadingIndicator label="Loading your donations..." />;
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-iwc-orange" />
          My Donation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Heart className="h-8 w-8 mx-auto mb-4 opacity-50" />
            <p>You have not recorded any donations yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(donation.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(donation.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{donation.donation_type}</span>
                      {donation.payment_method && <span>• {donation.payment_method}</span>}
                    </div>
                    {donation.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {donation.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
