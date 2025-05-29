
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { MapPin, Phone, Mail, Clock, User, Calendar, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { saveContactSubmission } from '@/utils/storage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await saveContactSubmission(formData);
      
      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We\'ll get back to you soon.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiry_type: 'general'
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const staffMembers = [
    {
      name: 'Pastor John Thompson',
      role: 'Senior Pastor',
      email: 'pastor.john@iwc.org',
      phone: '(555) 123-4567',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300'
    },
    {
      name: 'Pastor Mary Thompson',
      role: 'Associate Pastor',
      email: 'pastor.mary@iwc.org',
      phone: '(555) 123-4568',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=300'
    },
    {
      name: 'Michael Roberts',
      role: 'Youth Pastor',
      email: 'youth@iwc.org',
      phone: '(555) 123-4569',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300'
    },
    {
      name: 'Sarah Johnson',
      role: 'Worship Leader',
      email: 'worship@iwc.org',
      phone: '(555) 123-4570',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300'
    }
  ];

  const serviceTimes = [
    { day: 'Sunday', times: ['9:00 AM - Main Service', '11:00 AM - Contemporary Service'], location: 'Main Sanctuary' },
    { day: 'Wednesday', times: ['7:00 PM - Bible Study'], location: 'Fellowship Hall' },
    { day: 'Friday', times: ['7:00 PM - Youth Group'], location: 'Youth Center' },
    { day: 'Saturday', times: ['10:00 AM - Prayer Meeting'], location: 'Prayer Room' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <BackButton to="/" />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with any questions, prayer requests, or 
              if you'd like to learn more about our community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <EnhancedCard className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="mr-3 h-6 w-6 text-iwc-blue" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiry_type"
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="prayer">Prayer Request</option>
                        <option value="ministry">Ministry Information</option>
                        <option value="event">Event Question</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="Please share your message, question, or prayer request..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-iwc-blue hover:bg-iwc-orange text-white font-semibold py-3 transition-colors"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </EnhancedCard>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Info */}
              <EnhancedCard className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-iwc-blue mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Faith Street<br />
                        Cityville, ST 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-iwc-blue mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href="tel:+15551234567" className="hover:text-iwc-blue transition-colors">
                          (555) 123-4567
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-iwc-blue mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href="mailto:info@iwc.org" className="hover:text-iwc-blue transition-colors">
                          info@iwc.org
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              {/* Map Placeholder */}
              <EnhancedCard className="bg-white dark:bg-gray-800">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <MapPin className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Interactive Map</p>
                      <p className="text-sm">Map integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </div>

          {/* Service Times */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Service Times
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceTimes.map((service, index) => (
                <EnhancedCard key={service.day} className="text-center bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <Clock className="h-8 w-8 text-iwc-orange mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.day}</h3>
                    <div className="space-y-2">
                      {service.times.map((time, timeIndex) => (
                        <p key={timeIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                          {time}
                        </p>
                      ))}
                    </div>
                    <p className="text-iwc-blue dark:text-iwc-orange text-sm mt-3 font-medium">
                      {service.location}
                    </p>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Staff Directory */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {staffMembers.map((staff, index) => (
                <EnhancedCard key={staff.name} className="text-center bg-white dark:bg-gray-800 group">
                  <CardContent className="p-6">
                    <div className="relative mb-4 mx-auto w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={staff.image}
                        alt={staff.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{staff.name}</h3>
                    <p className="text-iwc-blue dark:text-iwc-orange text-sm font-medium mb-3">{staff.role}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href={`mailto:${staff.email}`} className="hover:text-iwc-blue transition-colors">
                          {staff.email}
                        </a>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href={`tel:${staff.phone}`} className="hover:text-iwc-blue transition-colors">
                          {staff.phone}
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
