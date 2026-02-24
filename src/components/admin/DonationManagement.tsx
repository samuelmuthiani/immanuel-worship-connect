
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, Calendar, User, MessageSquare } from 'lucide-react';
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
      toast({ title: 'Sent!', description: `Thank you message sent to ${selectedDonation.user_email}` });
      setAppreciationMessage('');
      setSelectedDonation(null);
    } else {
      toast({ title: 'Failed', description: 'Could not send appreciation.', variant: 'destructive' });
    }
    setSending(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5 text-destructive" />
            Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Heart className="h-5 w-5 text-destructive" />
          Donations
          <Badge variant="secondary" className="text-xs">{donations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No donations found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((donation) => (
              <div key={donation.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {donation.user_email || 'Unknown'}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(donation.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(donation.created_at)}
                      </span>
                      {donation.donation_type && <Badge variant="outline" className="text-xs">{donation.donation_type}</Badge>}
                      {donation.payment_method && <Badge variant="outline" className="text-xs">{donation.payment_method}</Badge>}
                    </div>
                    {donation.notes && (
                      <p className="text-xs text-muted-foreground mt-1.5 italic">{donation.notes}</p>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedDonation(donation)}
                        size="sm"
                        variant="outline"
                        className="ml-3 shrink-0"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Thanks
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Appreciation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p><strong>Donor:</strong> {donation.user_email || 'Unknown'}</p>
                          <p><strong>Amount:</strong> {formatCurrency(donation.amount)}</p>
                          <p><strong>Date:</strong> {formatDate(donation.created_at)}</p>
                        </div>
                        <Textarea
                          value={appreciationMessage}
                          onChange={(e) => setAppreciationMessage(e.target.value)}
                          placeholder="Write a heartfelt thank you..."
                          rows={4}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => { setAppreciationMessage(''); setSelectedDonation(null); }}>
                            Cancel
                          </Button>
                          <Button onClick={handleSendAppreciation} disabled={!appreciationMessage.trim() || sending}>
                            <Send className="h-4 w-4 mr-2" />
                            {sending ? 'Sending...' : 'Send'}
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
