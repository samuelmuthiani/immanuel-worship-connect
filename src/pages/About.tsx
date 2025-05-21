
import React, { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';

const About = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">About Us</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our story, mission, and the values that shape our community
            </p>
          </div>

          <div 
            ref={contentRef}
            className="transition-all duration-1000 opacity-0 translate-y-10"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" 
                    alt="Church building" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
                  <p className="text-gray-700 mb-4">
                    Immanuel Worship Centre began in 1985 as a small prayer group led by Pastor John and Mary Thompson. Meeting in their living room with just seven people, they shared a vision for a church where people could encounter God's presence in a profound way.
                  </p>
                  <p className="text-gray-700">
                    As the congregation grew, we moved to our current location in 1992. Through the years, we've seen thousands of lives transformed by God's love and power. Today, we're a diverse community of believers passionate about worship, discipleship, and community impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Mission & Vision</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-iwc-blue">Our Mission</h3>
                  <p className="text-gray-700 mb-4">
                    To glorify God by making disciples who love God wholeheartedly, grow in Christlike maturity, and serve others effectively.
                  </p>
                  <p className="text-gray-700">
                    We accomplish this through vibrant worship, biblical teaching, authentic community, compassionate outreach, and Spirit-empowered ministry.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-iwc-orange">Our Vision</h3>
                  <p className="text-gray-700 mb-4">
                    To be a vibrant, Spirit-filled community that equips believers to fulfill their God-given purpose and impacts our city with the love and power of Christ.
                  </p>
                  <p className="text-gray-700">
                    We envision a church that influences all aspects of society—families, education, business, arts, media, and government—with biblical values and Christ's compassion.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-iwc-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-iwc-gold text-2xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Love</h3>
                  <p className="text-gray-600">
                    We are committed to demonstrating Christ's love to everyone, recognizing that all people are created in God's image.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-iwc-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-iwc-blue text-2xl">📖</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Truth</h3>
                  <p className="text-gray-600">
                    We are anchored in the timeless truths of God's Word, which guides our beliefs, values, and practices.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-iwc-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-iwc-red text-2xl">🙏</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Faith</h3>
                  <p className="text-gray-600">
                    We believe in a God who still performs miracles today, and we approach Him with expectant faith.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-iwc-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-iwc-orange text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community</h3>
                  <p className="text-gray-600">
                    We value authentic relationships where believers can grow, be accountable, and experience the life-giving power of community.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-green-600 text-2xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Growth</h3>
                  <p className="text-gray-600">
                    We are committed to lifelong spiritual growth, continuously learning and becoming more like Christ in character and conduct.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-purple-600 text-2xl">✝️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Worship</h3>
                  <p className="text-gray-600">
                    We prioritize whole-hearted worship that expresses love, gratitude, and reverence to God in spirit and truth.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop" 
                    alt="Pastor John Thompson" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">Pastor John Thompson</h3>
                    <p className="text-iwc-blue mb-4">Senior Pastor</p>
                    <p className="text-gray-600">
                      Pastor John has led our church for over 30 years with wisdom, compassion, and vision.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop" 
                    alt="Mary Thompson" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">Mary Thompson</h3>
                    <p className="text-iwc-blue mb-4">Worship Director</p>
                    <p className="text-gray-600">
                      Mary leads our worship ministry with passion and creativity, facilitating authentic encounters with God.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop" 
                    alt="Michael Roberts" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">Michael Roberts</h3>
                    <p className="text-iwc-blue mb-4">Youth Pastor</p>
                    <p className="text-gray-600">
                      Pastor Michael brings energy and relevant teaching to our youth, helping them navigate life with faith.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
