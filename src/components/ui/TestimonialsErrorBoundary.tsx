
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card';

const TestimonialsFallback = () => {
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      name: 'Sarah Johnson',
      role: 'Church Member',
      content: 'This church has been a blessing to our family. The community is warm and welcoming, and we\'ve grown spiritually through the teachings and fellowship.',
      rating: 5
    },
    {
      id: 'fallback-2',
      name: 'David Miller',
      role: 'Youth Leader',
      content: 'I\'ve been part of this church for over 5 years. The youth ministry has helped me develop my faith and leadership skills. Truly grateful for this community.',
      rating: 5
    },
    {
      id: 'fallback-3',
      name: 'Grace Kimani',
      role: 'Choir Member',
      content: 'The worship experience here is incredible. Being part of the choir has deepened my relationship with God and connected me with amazing people.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-iwc-blue/5 to-iwc-orange/5 dark:from-iwc-blue/10 dark:to-iwc-orange/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from our church family about their experiences and journey of faith with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fallbackTestimonials.map((testimonial, index) => (
            <EnhancedCard
              key={testimonial.id}
              hover={true}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-iwc-orange fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-iwc-blue to-iwc-orange rounded-full flex items-center justify-center mr-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-iwc-blue dark:text-iwc-orange">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to share your testimony?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-iwc-blue hover:bg-iwc-orange text-white font-semibold rounded-lg transition-colors"
          >
            <Heart className="h-5 w-5 mr-2" />
            Share Your Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsFallback;
