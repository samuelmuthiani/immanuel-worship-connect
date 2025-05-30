
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, Shield, Users, Globe, Award, CreditCard, Smartphone, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { saveDonation } from '@/utils/donationUtils';

const Donate = () => {
  const [donationForm, setDonationForm] = useState({
    amount: '',
    donationType: 'general',
    paymentMethod: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Please Login',
        description: 'You need to be logged in to make a donation record.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveDonation({
        amount: parseFloat(donationForm.amount),
        donation_type: donationForm.donationType,
        payment_method: donationForm.paymentMethod,
        notes: donationForm.notes
      });

      if (result.success) {
        toast({
          title: 'Donation Recorded!',
          description: 'Thank you for your generous contribution. Your donation has been recorded.',
        });
        setDonationForm({ amount: '', donationType: 'general', paymentMethod: '', notes: '' });
      } else {
        throw new Error('Failed to record donation');
      }
    } catch (error) {
      console.error('Error recording donation:', error);
      toast({
        title: 'Recording Failed',
        description: 'Could not record your donation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${text} copied to clipboard`,
    });
  };

  const impactStats = [
    { number: '500+', label: 'Lives Transformed', icon: Heart },
    { number: '25+', label: 'Years of Service', icon: Award },
    { number: '50+', label: 'Community Programs', icon: Users },
    { number: '12', label: 'Countries Reached', icon: Globe }
  ];

  const paymentMethods = [
    {
      title: 'M-Pesa Mobile Money',
      icon: Smartphone,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      details: [
        { label: 'Paybill Number', value: '247247' },
        { label: 'Account Number', value: '200470' }
      ],
      description: 'Quick and secure mobile payments'
    },
    {
      title: 'Bank Transfer',
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      details: [
        { label: 'Bank', value: 'Equity Bank' },
        { label: 'Branch', value: 'Nairobi West' },
        { label: 'Account Name', value: 'Immanuel Worship Centre' },
        { label: 'Account Number', value: '1234567890' }
      ],
      description: 'Traditional banking for larger donations'
    },
    {
      title: 'Online Card Payment',
      icon: CreditCard,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      details: [],
      description: 'Secure online payments via Stripe',
      actionUrl: 'https://donate.stripe.com/test_00g7uQ0wQ0wQ0wQ0wQ'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-iwc-blue via-iwc-orange to-iwc-gold bg-clip-text text-transparent leading-tight">
              Support Our Mission
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Your generous support empowers us to transform lives, strengthen communities, 
              and spread hope across the world. Every gift makes an eternal difference.
            </p>
            
            {/* Impact Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {impactStats.map((stat, index) => (
                <EnhancedCard key={stat.label} className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-center mb-3">
                      <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-iwc-blue dark:text-iwc-orange group-hover:text-iwc-orange dark:group-hover:text-iwc-blue transition-colors" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {paymentMethods.map((method, index) => (
              <EnhancedCard 
                key={method.title} 
                className={`${method.bgColor} ${method.borderColor} border-2 hover:shadow-xl transition-all duration-300 group`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 md:p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg group-hover:scale-110 transition-transform`}>
                      <method.icon className={`h-6 w-6 md:h-8 md:w-8 ${method.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {method.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {method.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{detail.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm md:text-base text-gray-900 dark:text-white">{detail.value}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(detail.value)}
                          className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        >
                          <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {method.actionUrl && (
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-iwc-blue to-iwc-purple text-white hover:from-iwc-orange hover:to-iwc-red transition-all duration-300 font-semibold"
                    >
                      <a href={method.actionUrl} target="_blank" rel="noopener noreferrer">
                        Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          {/* Donation Recording Form */}
          {user && (
            <EnhancedCard className="bg-white dark:bg-gray-800 max-w-2xl mx-auto mb-12 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 md:h-6 md:w-6 text-iwc-orange" />
                  Record Your Donation
                </CardTitle>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                  After making your donation, please record it here for our records
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Donation Amount (KES)
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="1"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="donationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Donation Type
                      </label>
                      <select
                        id="donationType"
                        value={donationForm.donationType}
                        onChange={(e) => setDonationForm(prev => ({ ...prev, donationType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="general">General Offering</option>
                        <option value="tithe">Tithe</option>
                        <option value="building">Building Fund</option>
                        <option value="missions">Missions</option>
                        <option value="special">Special Offering</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      value={donationForm.paymentMethod}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select payment method</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      value={donationForm.notes}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes about your donation..."
                      rows={3}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !donationForm.amount}
                    className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red text-white font-semibold py-3 transition-all duration-300"
                  >
                    {isSubmitting ? 'Recording...' : 'Record Donation'}
                  </Button>
                </form>
              </CardContent>
            </EnhancedCard>
          )}

          {/* Trust and Security */}
          <EnhancedCard className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Trusted Giving</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Your donations are processed through encrypted, secure channels. We are committed to financial 
                transparency and responsible stewardship of every gift we receive.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>Bank Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>100% Transparent</span>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
