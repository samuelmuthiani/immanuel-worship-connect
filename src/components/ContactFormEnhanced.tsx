
import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, Phone, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FormField, ValidationMessage } from '@/components/ui/FormValidation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { contactFormSchema } from '@/utils/dataValidation';
import { EnhancedStorage } from '@/utils/enhancedStorage';

const ContactFormEnhanced: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: 'general' as const
  });

  const { errors, isSubmitting, validateField, handleSubmit } = useFormValidation({
    schema: contactFormSchema,
    onSubmit: async (data) => {
      const result = await EnhancedStorage.saveContactSubmission(data);
      
      if (result.success) {
        toast({
          title: 'Message Sent Successfully!',
          description: 'Thank you for contacting us. We\'ll get back to you soon.',
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiry_type: 'general'
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <Mail className="h-12 w-12 text-iwc-blue mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {errors.general && (
          <ValidationMessage type="error" message={errors.general} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Full Name" error={errors.name} required>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          <FormField label="Email Address" error={errors.email} required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Phone Number" error={errors.phone}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          <FormField label="Inquiry Type" error={errors.inquiry_type} required>
            <Select
              value={formData.inquiry_type}
              onValueChange={(value) => handleInputChange('inquiry_type', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select inquiry type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="prayer">Prayer Request</SelectItem>
                <SelectItem value="ministry">Ministry Information</SelectItem>
                <SelectItem value="event">Event Information</SelectItem>
                <SelectItem value="support">Support Request</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField label="Subject" error={errors.subject}>
          <Input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Brief subject of your message"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Message" error={errors.message} required>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please share your message, prayer request, or any questions you may have..."
              className="pl-10 min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </FormField>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-iwc-blue hover:bg-iwc-orange text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Message...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactFormEnhanced;
