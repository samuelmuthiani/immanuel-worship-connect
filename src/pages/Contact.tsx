
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Mail, Phone, Map, Send, Mail as MailIcon, ArrowRight, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [activeTab, setActiveTab] = useState<string>("contact");
  const [generalFormData, setGeneralFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [prayerFormData, setPrayerFormData] = useState({
    name: '',
    email: '',
    prayerRequest: '',
    isPublic: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrayerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrayerCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrayerFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: generalFormData.name,
          email: generalFormData.email,
          subject: generalFormData.subject,
          message: generalFormData.message
        }]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      // Reset form
      setGeneralFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: prayerFormData.name,
          email: prayerFormData.email,
          subject: 'Prayer Request',
          message: prayerFormData.prayerRequest,
          is_public_prayer: prayerFormData.isPublic
        }]);

      if (error) throw error;

      toast({
        title: "Prayer Request Sent",
        description: "Thank you for sharing your prayer request. Our team will be praying for you.",
      });

      // Reset form
      setPrayerFormData({
        name: '',
        email: '',
        prayerRequest: '',
        isPublic: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was an error sending your prayer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with questions, prayer requests, or to get involved in our community.
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="bg-iwc-blue/10 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-iwc-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">Available Monday through Friday, 9 AM - 5 PM</p>
              <p className="font-medium">0721 923213 / 0719838046</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="bg-iwc-orange/10 p-4 rounded-full mb-4">
                <MailIcon className="h-8 w-8 text-iwc-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-3">We'll respond to your email within 24 hours</p>
              <p className="font-medium">info@immanuelworship.org</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="bg-iwc-gold/10 p-4 rounded-full mb-4">
                <Map className="h-8 w-8 text-iwc-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-3">9VC3+4R4, Next To Equity Bank</p>
              <p className="font-medium">Off Hospital Road, Kilifi Town</p>
            </div>
          </div>

          {/* Two-column layout: Form and Map/Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form with Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Tabs defaultValue="contact" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="contact" className="rounded-none py-4 data-[state=active]:border-b-2 data-[state=active]:border-iwc-blue">
                      Contact Us
                    </TabsTrigger>
                    <TabsTrigger value="prayer" className="rounded-none py-4 data-[state=active]:border-b-2 data-[state=active]:border-iwc-blue">
                      Prayer Request
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="contact" className="p-8">
                  <form onSubmit={handleGeneralSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={generalFormData.name}
                          onChange={handleGeneralInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={generalFormData.email}
                          onChange={handleGeneralInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={generalFormData.subject}
                        onChange={handleGeneralInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Membership">Membership Information</option>
                        <option value="Volunteering">Volunteering Opportunities</option>
                        <option value="Events">Events Information</option>
                        <option value="Technical Support">Website Support</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={generalFormData.message}
                        onChange={handleGeneralInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-6 rounded-md w-full flex items-center justify-center"
                    >
                      {submitting ? 'Sending...' : 'Send Message'} 
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="prayer" className="p-8">
                  <form onSubmit={handlePrayerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="prayer-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          id="prayer-name"
                          name="name"
                          type="text"
                          required
                          value={prayerFormData.name}
                          onChange={handlePrayerInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="prayer-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          id="prayer-email"
                          name="email"
                          type="email"
                          required
                          value={prayerFormData.email}
                          onChange={handlePrayerInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="prayerRequest" className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
                      <textarea
                        id="prayerRequest"
                        name="prayerRequest"
                        rows={5}
                        required
                        value={prayerFormData.prayerRequest}
                        onChange={handlePrayerInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                        placeholder="Share your prayer request here..."
                      ></textarea>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="isPublic"
                        name="isPublic"
                        type="checkbox"
                        checked={prayerFormData.isPublic}
                        onChange={handlePrayerCheckboxChange}
                        className="h-4 w-4 text-iwc-blue focus:ring-iwc-blue border-gray-300 rounded"
                      />
                      <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                        Make this a public prayer request (will be visible on our prayer wall)
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-6 rounded-md w-full flex items-center justify-center"
                    >
                      {submitting ? 'Submitting...' : 'Submit Prayer Request'} 
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <p className="text-sm text-gray-600 text-center">
                      Our prayer team commits to pray for each request submitted.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Map and Service Times */}
            <div className="space-y-8">
              {/* Google Map */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <iframe
                  title="Church Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.4615842517483!2d39.85512337561287!3d-3.63833244406098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19f6a670bb7d7e8f%3A0x8b4f2a0dbfb4b1a3!2sEquity%20Bank%20Kilifi%20Branch!5e0!3m2!1sen!2ske!4v1700921784197!5m2!1sen!2ske"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Service Times */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-iwc-blue text-white py-4 px-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Service Times
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Sunday Morning</div>
                    <div>9:00 AM & 11:00 AM</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Wednesday Bible Study</div>
                    <div>7:00 PM</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Friday Youth Service</div>
                    <div>6:30 PM</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="font-medium">Sunday School</div>
                    <div>9:30 AM</div>
                  </div>
                </div>
              </div>

              {/* Staff Directory */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-iwc-orange text-white py-4 px-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Staff Directory
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Senior Pastor</div>
                    <div>pastor@immanuelworship.org</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Youth Ministry</div>
                    <div>youth@immanuelworship.org</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-100 pb-3">
                    <div className="font-medium">Children's Ministry</div>
                    <div>children@immanuelworship.org</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="font-medium">Office Administrator</div>
                    <div>admin@immanuelworship.org</div>
                  </div>
                </div>
              </div>
              
              {/* Get Involved Button */}
              <div className="bg-iwc-blue/5 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-3">Want to Get Involved?</h3>
                <p className="text-gray-600 mb-6">
                  We have many opportunities to serve and participate in our church community.
                </p>
                <Link to="/services">
                  <Button className="bg-iwc-blue hover:bg-iwc-orange text-white">
                    Volunteer Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
