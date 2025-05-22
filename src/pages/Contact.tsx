import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('site_content')
        .select('content')
        .eq('section', 'contact')
        .single();
      if (!error && data) {
        setContent(data.content || "");
      } else {
        setContent("<p>Contact content not found.</p>");
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with questions, prayer requests, or to get involved.
            </p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/lovable-uploads/ce6f3188-56d4-40eb-9194-1abca3f6a4db.png" alt="Loading" className="w-12 h-12 mb-2 animate-spin-slow" style={{ animationDuration: '2s' }} />
              <span className="text-iwc-blue font-semibold">Loading content...</span>
            </div>
          ) : (
            <div className="prose mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
