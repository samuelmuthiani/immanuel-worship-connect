
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveTermsAcceptance, getTermsAcceptance } from '@/utils/storage';

const Terms = () => {
  const { toast } = useToast();
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    const termsStatus = getTermsAcceptance();
    setHasAccepted(termsStatus.accepted);
  }, []);

  const handleAcceptTerms = () => {
    saveTermsAcceptance(true);
    setHasAccepted(true);
    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our Terms of Service.",
      duration: 3000,
    });

    // If this were connected to a backend, we would send the acceptance to the server here
  };

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Terms of Service</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Please review our Terms of Service carefully
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="prose max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to Immanuel Worship Centre's website. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy.
                </p>

                <h2>2. Intellectual Property Rights</h2>
                <p>
                  The content, organization, graphics, design, and other matters related to the Website are protected under applicable copyrights and other proprietary laws, including but not limited to intellectual property laws. The copying, reproduction, use, modification or publication of any such matters or any part of the Website without our express prior written permission is strictly prohibited.
                </p>

                <h2>3. User Conduct</h2>
                <p>
                  You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use of the website.
                </p>
                <p>
                  Prohibited behavior includes:
                </p>
                <ul>
                  <li>Conduct which is unlawful, harassing, or threatening</li>
                  <li>Posting or transmitting any content that is defamatory, obscene, or otherwise objectionable</li>
                  <li>Attempting to disrupt or interfere with the operation of our website</li>
                  <li>Impersonating any person or entity</li>
                </ul>

                <h2>4. Disclaimer of Warranties</h2>
                <p>
                  The Website is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                  In no event shall Immanuel Worship Centre be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>

                <h2>6. Privacy Policy</h2>
                <p>
                  Your use of our website is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
                </p>

                <h2>7. Modifications to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting. Your continued use of our website following the posting of changes to these terms constitutes your acceptance of those changes.
                </p>

                <h2>8. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws applicable in our jurisdiction, without regard to its conflict of law provisions.
                </p>

                <h2>9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <address>
                  Immanuel Worship Centre<br />
                  123 Faith Avenue<br />
                  City, Country 12345<br />
                  Email: info@immanuelworship.org<br />
                  Phone: +1 (123) 456-7890
                </address>
              </div>
            </div>

            <div className="text-center">
              {hasAccepted ? (
                <Button disabled className="bg-green-600 hover:bg-green-700">
                  Terms Accepted
                </Button>
              ) : (
                <Button 
                  onClick={handleAcceptTerms} 
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

export default Terms;
