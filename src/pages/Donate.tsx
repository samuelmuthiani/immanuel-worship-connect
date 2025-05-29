
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, Shield, Users, Globe, Award, CreditCard, Smartphone, Building2, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Donate = () => {
  const [thankYouForm, setThankYouForm] = useState({ name: '', org: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleThanksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('donor_thank_yous')
        .insert([{
          name: thankYouForm.name,
          org: thankYouForm.org,
          message: thankYouForm.message,
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setThankYouForm({ name: '', org: '', message: '' });
      setSubmitted(true);
      toast({
        title: 'Thank You Message Sent!',
        description: 'Your gratitude has been shared with our team.',
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting thank you:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
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
      color: 'text-green-600',
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      details: [
        { label: 'Bank', value: 'Equity Bank' },
        { label: 'Branch', value: 'Nairobi West' },
        { label: 'Account Name', value: 'Immanuel Worship Centre' },
        { label: 'Account Number', value: '1234567890' },
        { label: 'SWIFT Code', value: 'EQBLKENA' }
      ],
      description: 'Traditional banking for larger donations'
    },
    {
      title: 'Online Card Payment',
      icon: CreditCard,
      color: 'text-purple-600',
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-iwc-blue via-iwc-orange to-iwc-gold bg-clip-text text-transparent">
              Support Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Your generous support empowers us to transform lives, strengthen communities, 
              and spread hope across the world. Every gift makes an eternal difference.
            </p>
            
            {/* Impact Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {impactStats.map((stat, index) => (
                <EnhancedCard key={stat.label} className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">
                      <stat.icon className="h-8 w-8 text-iwc-blue group-hover:text-iwc-orange transition-colors" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {paymentMethods.map((method, index) => (
              <EnhancedCard 
                key={method.title} 
                className={`${method.bgColor} ${method.borderColor} border-2 hover:shadow-xl transition-all duration-300 group`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg group-hover:scale-110 transition-transform`}>
                      <method.icon className={`h-8 w-8 ${method.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {method.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {method.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{detail.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg text-gray-900 dark:text-white">{detail.value}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(detail.value)}
                          className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {method.actionUrl && (
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-iwc-blue to-iwc-purple text-white hover:from-iwc-orange hover:to-iwc-red transition-all duration-300"
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

          {/* Trust and Security */}
          <EnhancedCard className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 mb-12">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Trusted Giving</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Your donations are processed through encrypted, secure channels. We are committed to financial 
                transparency and responsible stewardship of every gift we receive.
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bank Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>100% Transparent</span>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>

          {/* Admin Thank You Form */}
          <EnhancedCard className="bg-white dark:bg-gray-800 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-iwc-gold" />
                Send Appreciation (Admin Only)
                <Star className="h-6 w-6 text-iwc-gold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleThanksSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Donor Name (Optional)
                  </label>
                  <Input
                    id="name"
                    value={thankYouForm.name}
                    onChange={(e) => setThankYouForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter donor's name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="org" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization (Optional)
                  </label>
                  <Input
                    id="org"
                    value={thankYouForm.org}
                    onChange={(e) => setThankYouForm(prev => ({ ...prev, org: e.target.value }))}
                    placeholder="Organization or company name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thank You Message (Optional)
                  </label>
                  <Textarea
                    id="message"
                    value={thankYouForm.message}
                    onChange={(e) => setThankYouForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Write a personalized thank you message..."
                    rows={4}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red text-white font-semibold py-3"
                >
                  {submitted ? 'Thank You Sent!' : isSubmitting ? 'Sending...' : 'Send Thank You Message'}
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                This form is for administrators to send appreciation messages to donors. All submissions are secure and private.
              </p>
            </CardContent>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
