
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, DollarSign, Calendar, User, MessageSquare } from 'lucide-react';
import { getAllDonations, sendAppreciation, type DonationWithEmail } from '@/utils/donationUtils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function DonationManagement() {
  const [donations, setDonations] = useState<DonationWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<DonationWithEmail | null>(null);
  const [appreciationMessage, setAppreciationMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const data = await getAllDonations();
    setDonations(data);
    setLoading(false);
  };

  const handleSendAppreciation = async () => {
    if (!selectedDonation || !appreciationMessage.trim()) return;

    setSending(true);
    const result = await sendAppreciation(selectedDonation.id, appreciationMessage);
    
    if (result.success) {
      toast({
        title: 'Appreciation Sent!',
        description: `Thank you message sent to ${selectedDonation.user_email}`,
      });
      setAppreciationMessage('');
      setSelectedDonation(null);
    } else {
      toast({
        title: 'Failed to Send',
        description: 'Could not send appreciation message. Please try again.',
        variant: 'destructive'
      });
    }
    setSending(false);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Donation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          Donation Management
          <Badge variant="secondary">{donations.length} donations</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No donations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {donation.user_email || 'Unknown User'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(donation.amount)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(donation.created_at)}
                      </div>
                      <Badge variant="outline">{donation.donation_type}</Badge>
                      {donation.payment_method && (
                        <Badge variant="outline">{donation.payment_method}</Badge>
                      )}
                    </div>
                    
                    {donation.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {donation.notes}
                      </p>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedDonation(donation)}
                        size="sm"
                        className="ml-4"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Thanks
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Appreciation Message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Donation Details:</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Donor:</strong> {donation.user_email || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Amount:</strong> {formatCurrency(donation.amount)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Date:</strong> {formatDate(donation.created_at)}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Appreciation Message
                          </label>
                          <Textarea
                            value={appreciationMessage}
                            onChange={(e) => setAppreciationMessage(e.target.value)}
                            placeholder="Write a heartfelt thank you message..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAppreciationMessage('');
                              setSelectedDonation(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSendAppreciation}
                            disabled={!appreciationMessage.trim() || sending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {sending ? 'Sending...' : 'Send Appreciation'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
