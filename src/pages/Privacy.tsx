
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { savePrivacyAcceptance, getPrivacyAcceptance } from '@/utils/storage';

const Privacy = () => {
  const { toast } = useToast();
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    const privacyStatus = getPrivacyAcceptance();
    setHasAccepted(privacyStatus.accepted);
  }, []);

  const handleAcceptPrivacy = () => {
    savePrivacyAcceptance(true);
    setHasAccepted(true);
    toast({
      title: "Privacy Policy Accepted",
      description: "Thank you for accepting our Privacy Policy.",
      duration: 3000,
    });

    // If this were connected to a backend, we would send the acceptance to the server here
  };

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How we collect, use, and protect your information
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="prose max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  At Immanuel Worship Centre, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or interact with us.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                  We may collect the following types of information:
                </p>
                <ul>
                  <li>
                    <strong>Personal Information:</strong> This includes names, email addresses, phone numbers, and other identifiers that you provide when filling out forms on our website.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and other analytical data.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP addresses, browser types, device information, and other technical details about your connection to our website.
                  </li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>
                  We use your information for the following purposes:
                </p>
                <ul>
                  <li>To provide and maintain our website</li>
                  <li>To communicate with you about events, services, and updates</li>
                  <li>To respond to inquiries and prayer requests</li>
                  <li>To improve our website and user experience</li>
                  <li>To send newsletters and other communications (with your consent)</li>
                </ul>

                <h2>4. How We Protect Your Information</h2>
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2>5. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can choose to disable cookies through your browser settings, although this may affect certain functionalities of our website.
                </p>

                <h2>6. Third-Party Services</h2>
                <p>
                  Our website may contain links to third-party websites or services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                </p>

                <h2>7. Children's Privacy</h2>
                <p>
                  Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>

                <h2>8. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>

                <h2>9. Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul>
                  <li>The right to access the personal information we hold about you</li>
                  <li>The right to request correction of inaccurate information</li>
                  <li>The right to request deletion of your information</li>
                  <li>The right to opt out of marketing communications</li>
                </ul>

                <h2>10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <address>
                  Immanuel Worship Centre<br />
                  123 Faith Avenue<br />
                  City, Country 12345<br />
                  Email: privacy@immanuelworship.org<br />
                  Phone: +1 (123) 456-7890
                </address>

                <p>
                  Last Updated: May 21, 2025
                </p>
              </div>
            </div>

            <div className="text-center">
              {hasAccepted ? (
                <Button disabled className="bg-green-600 hover:bg-green-700">
                  Privacy Policy Accepted
                </Button>
              ) : (
                <Button 
                  onClick={handleAcceptPrivacy} 
                  className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8"
                >
                  I Accept
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
