
import React from 'react';
import Layout from '@/components/Layout';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveContactSubmission } from '@/utils/storage';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', inquiry_type: 'general' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveContactSubmission(formData);
      if (result.success) {
        toast({ title: 'Message Sent!', description: 'We\'ll get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', inquiry_type: 'general' });
      } else throw new Error('Failed');
    } catch { toast({ title: 'Error', description: 'Failed to send. Please try again.', variant: 'destructive' }); }
    finally { setIsSubmitting(false); }
  };

  const staffMembers = [
    { name: 'Pastor John Thompson', role: 'Senior Pastor', email: 'pastor.john@iwc.org', phone: '(555) 123-4567', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
    { name: 'Pastor Mary Thompson', role: 'Associate Pastor', email: 'pastor.mary@iwc.org', phone: '(555) 123-4568', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=300' },
    { name: 'Michael Roberts', role: 'Youth Pastor', email: 'youth@iwc.org', phone: '(555) 123-4569', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300' },
    { name: 'Sarah Johnson', role: 'Worship Leader', email: 'worship@iwc.org', phone: '(555) 123-4570', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300' },
  ];

  const serviceTimes = [
    { day: 'Sunday', times: ['9:00 AM - Main Service', '11:00 AM - Contemporary'], location: 'Main Sanctuary' },
    { day: 'Wednesday', times: ['7:00 PM - Bible Study'], location: 'Fellowship Hall' },
    { day: 'Friday', times: ['7:00 PM - Youth Group'], location: 'Youth Center' },
    { day: 'Saturday', times: ['10:00 AM - Prayer Meeting'], location: 'Prayer Room' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Reach Out</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Reach out with questions, prayer requests, or to learn more.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full name" className="rounded-xl" />
                  <Input name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Email address" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Phone (optional)" className="rounded-xl" />
                  <select name="inquiry_type" value={formData.inquiry_type} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm">
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Prayer Request</option>
                    <option value="ministry">Ministry Info</option>
                    <option value="event">Event Question</option>
                  </select>
                </div>
                <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="rounded-xl" />
                <Textarea name="message" required rows={5} value={formData.message} onChange={handleInputChange} placeholder="Your message..." className="rounded-xl resize-none" />
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90">
                  {isSubmitting ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Get in Touch</h2>
                {[
                  { icon: MapPin, title: 'Address', text: 'Off Hospital Road, Kilifi Town', sub: 'Next to Equity Bank' },
                  { icon: Phone, title: 'Phone', text: '0721 923213 / 0719838046' },
                  { icon: Mail, title: 'Email', text: 'info@immanuelworship.org' },
                ].map(({ icon: Icon, title, text, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{title}</p>
                      <p className="text-muted-foreground text-sm">{text}</p>
                      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>Service Times</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTimes.map((s) => (
              <div key={s.day} className="bg-card border border-border rounded-2xl p-6 text-center">
                <Clock className="h-6 w-6 text-secondary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{s.day}</h3>
                {s.times.map((t, i) => <p key={i} className="text-muted-foreground text-sm">{t}</p>)}
                <p className="text-primary text-xs font-medium mt-2">{s.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staffMembers.map((s) => (
              <div key={s.name} className="text-center group">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ring-2 ring-border group-hover:ring-secondary transition-all">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-bold text-foreground text-sm">{s.name}</h3>
                <p className="text-secondary text-xs font-medium mb-1">{s.role}</p>
                <p className="text-muted-foreground text-xs">{s.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
