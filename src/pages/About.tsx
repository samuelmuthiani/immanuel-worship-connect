
import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Users, Landmark, Heart, Book, Scroll, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const About = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("history");

  // Animation effect for sections coming into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Fetch CMS content if available
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('section', 'about')
          .single();
          
        if (!error && data && data.content) {
          setCmsContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching About content:', error);
      }
    };
    
    fetchContent();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1511448957602-417c5a0cb0e9?q=80&w=1200"
            alt="Church community" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-gray-900/50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Story</h1>
            <div className="w-20 h-1 bg-iwc-orange mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Discover our history, mission, and the values that have shaped Immanuel Worship Centre into the vibrant community it is today.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          {cmsContent ? (
            <div className="prose prose-lg mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: cmsContent }} />
          ) : (
            <>
              {/* Tabbed Navigation */}
              <div className="mb-12">
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-center">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
                      <TabsTrigger value="history" className="px-4 py-2">
                        <Landmark className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Our History</span>
                      </TabsTrigger>
                      <TabsTrigger value="mission" className="px-4 py-2">
                        <Heart className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Mission & Vision</span>
                      </TabsTrigger>
                      <TabsTrigger value="beliefs" className="px-4 py-2">
                        <Book className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Beliefs</span>
                      </TabsTrigger>
                      <TabsTrigger value="leadership" className="px-4 py-2">
                        <Users className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Leadership</span>
                      </TabsTrigger>
                      <TabsTrigger value="community" className="px-4 py-2">
                        <Heart className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Community</span>
                      </TabsTrigger>
                      <TabsTrigger value="gallery" className="px-4 py-2">
                        <Image className="w-5 h-5 mr-2 inline md:hidden" />
                        <span className="hidden md:inline">Gallery</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Our History Content */}
                  <TabsContent value="history" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Journey of Faith</h2>
                        <div className="w-16 h-1 bg-iwc-orange mb-6"></div>
                        <p className="text-gray-700 mb-4">
                          Immanuel Worship Centre began in 1985 as a small prayer group led by Pastor John and Mary Thompson. Meeting in their living room with just seven people, they shared a vision for a church where people could encounter God's presence in a profound way.
                        </p>
                        <p className="text-gray-700 mb-4">
                          As the congregation grew, we moved to our current location in 1992. Through the years, we've seen thousands of lives transformed by God's love and power. Today, we're a diverse community of believers passionate about worship, discipleship, and community impact.
                        </p>
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Milestones</h3>
                          <ul className="space-y-4">
                            <li className="flex">
                              <div className="mr-4 flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-iwc-blue/10 flex items-center justify-center text-iwc-blue font-bold">
                                  1985
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-700">Founded as a home prayer group of 7 people</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="mr-4 flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-iwc-blue/10 flex items-center justify-center text-iwc-blue font-bold">
                                  1992
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-700">Moved to our current location in Kilifi Town</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="mr-4 flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-iwc-blue/10 flex items-center justify-center text-iwc-blue font-bold">
                                  2005
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-700">Expanded to include youth and children's ministries</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="mr-4 flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-iwc-blue/10 flex items-center justify-center text-iwc-blue font-bold">
                                  2015
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-700">Celebrated 30 years of ministry and launched community outreach programs</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" 
                          alt="Church building" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Mission & Vision Content */}
                  <TabsContent value="mission" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission & Vision</h2>
                      <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Guided by faith and purpose, we seek to make a meaningful difference in our community and the world.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                      <div className="bg-white p-10 rounded-xl shadow-md flex flex-col">
                        <div className="w-16 h-16 bg-iwc-orange/10 rounded-full flex items-center justify-center mb-6">
                          <Scroll className="w-8 h-8 text-iwc-orange" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-iwc-orange">Our Mission</h3>
                        <p className="text-gray-700 mb-6 flex-grow">
                          To glorify God by making disciples who love God wholeheartedly, grow in Christlike maturity, and serve others effectively through vibrant worship, biblical teaching, authentic community, compassionate outreach, and Spirit-empowered ministry.
                        </p>
                        <div className="mt-auto">
                          <h4 className="font-semibold mb-2">We accomplish this through:</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Vibrant worship that honors God</li>
                            <li>Biblical teaching and discipleship</li>
                            <li>Authentic community and fellowship</li>
                            <li>Compassionate outreach locally and globally</li>
                            <li>Spirit-empowered ministry in all we do</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-white p-10 rounded-xl shadow-md flex flex-col">
                        <div className="w-16 h-16 bg-iwc-blue/10 rounded-full flex items-center justify-center mb-6">
                          <Heart className="w-8 h-8 text-iwc-blue" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-iwc-blue">Our Vision</h3>
                        <p className="text-gray-700 mb-6 flex-grow">
                          To be a vibrant, Spirit-filled community that equips believers to fulfill their God-given purpose and impacts our city with the love and power of Christ. We envision a church that influences all aspects of society—families, education, business, arts, media, and government—with biblical values and Christ's compassion.
                        </p>
                        <div className="mt-auto">
                          <h4 className="font-semibold mb-2">Our vision encompasses:</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Transformed lives through encounter with Christ</li>
                            <li>Equipped believers fulfilling their God-given purpose</li>
                            <li>Vibrant families built on biblical foundations</li>
                            <li>Transformative impact in our community</li>
                            <li>Gospel spread throughout Kenya and beyond</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Beliefs Content */}
                  <TabsContent value="beliefs" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-gray-900">Statement of Faith</h2>
                      <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our core beliefs are rooted in Scripture and guide everything we do as a church family.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">The Bible</h3>
                            <p className="text-gray-700">
                              We believe the Bible is the inspired, infallible word of God, without error in its original manuscripts, and our final authority for faith and life.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">God</h3>
                            <p className="text-gray-700">
                              We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Jesus Christ</h3>
                            <p className="text-gray-700">
                              We believe in the deity of Jesus Christ, His virgin birth, sinless life, miracles, atoning death, bodily resurrection, ascension to the right hand of the Father, and personal return in power and glory.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Holy Spirit</h3>
                            <p className="text-gray-700">
                              We believe in the present ministry of the Holy Spirit, whose indwelling enables Christians to live godly lives, and whose baptism empowers believers for service.
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Salvation</h3>
                            <p className="text-gray-700">
                              We believe salvation is by grace through faith in Jesus Christ alone, not by works, and is expressed in repentance, confession of Christ as Lord, water baptism, and a life of obedience.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">The Church</h3>
                            <p className="text-gray-700">
                              We believe the Church is the Body of Christ, composed of all believers, with the mission of worshiping God, making disciples, and bringing the gospel to the world.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Spiritual Gifts</h3>
                            <p className="text-gray-700">
                              We believe the Holy Spirit empowers believers with spiritual gifts for the building up of the church and the work of ministry in the world today.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Christ's Return</h3>
                            <p className="text-gray-700">
                              We believe in the personal, visible return of Christ to earth and the establishment of His kingdom, in the resurrection of the body, and the final judgment.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Button variant="outline" size="lg">
                          Download Complete Statement of Faith
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Leadership Content */}
                  <TabsContent value="leadership" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Leadership</h2>
                      <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Meet the dedicated team that guides our church family with wisdom, compassion, and vision.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-white rounded-xl shadow-md overflow-hidden group">
                        <div className="aspect-w-3 aspect-h-4 relative">
                          <img
                            src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
                            alt="Pastor John Thompson"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-6">
                              <div className="flex space-x-4">
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                  </svg>
                                </a>
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.164.568.568.914 1.136 1.168 1.804.247.636.416 1.363.465 2.428.048 1.067.06 1.407.06 4.123v.087c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.9 4.9 0 01-1.168 1.804c-.568.568-1.136.914-1.8 1.168-.636.247-1.363.416-2.428.465-1.066.048-1.407.06-4.123.06h-.087c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.9 4.9 0 01-1.804-1.168 4.9 4.9 0 01-1.168-1.804c-.247-.636-.416-1.363-.465-2.428-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.6-1.235 1.164-1.8.568-.568 1.136-.914 1.804-1.168.636-.247 1.363-.416 2.428-.465 1.024-.047 1.379-.06 3.808-.06h.63zm-.63 1.8h-.63c-2.376 0-2.7.01-3.728.057-1 .045-1.537.207-1.893.344-.471.182-.807.398-1.15.748-.35.35-.566.688-.748 1.15-.137.356-.3.904-.344 1.893-.047 1.027-.058 1.351-.058 3.727v.63c0 2.376.01 2.7.058 3.727.045 1 .207 1.537.344 1.893.182.471.398.807.748 1.15.35.35.687.566 1.15.748.356.137.904.3 1.893.344 1.027.047 1.351.058 3.728.058h.63c2.376 0 2.7-.01 3.727-.058 1-.045 1.537-.207 1.893-.344.471-.182.807-.398 1.15-.748.35-.35.566-.687.748-1.15.137-.356.3-.904.344-1.893.047-1.027.058-1.351.058-3.727v-.63c0-2.376-.01-2.7-.058-3.727-.045-1-.207-1.537-.344-1.893-.182-.471-.398-.807-.748-1.15-.35-.35-.687-.566-1.15-.748-.356-.137-.904-.3-1.893-.344-1.027-.047-1.351-.058-3.727-.058z"></path>
                                    <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.8a3.335 3.335 0 100 6.67 3.335 3.335 0 000-6.67z"></path>
                                    <circle cx="17.25" cy="6.75" r="1.2"></circle>
                                  </svg>
                                </a>
                                <a href="mailto:john@example.com" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-1 text-gray-900">Pastor John Thompson</h3>
                          <p className="text-iwc-blue mb-4">Senior Pastor</p>
                          <p className="text-gray-700">
                            Pastor John has led our church for over 30 years with wisdom, compassion, and vision. His teaching focuses on practical application of biblical principles.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md overflow-hidden group">
                        <div className="aspect-w-3 aspect-h-4 relative">
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
                            alt="Mary Thompson"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-6">
                              <div className="flex space-x-4">
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                  </svg>
                                </a>
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.164.568.568.914 1.136 1.168 1.804.247.636.416 1.363.465 2.428.048 1.067.06 1.407.06 4.123v.087c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.9 4.9 0 01-1.168 1.804c-.568.568-1.136.914-1.8 1.168-.636.247-1.363.416-2.428.465-1.066.048-1.407.06-4.123.06h-.087c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.9 4.9 0 01-1.804-1.168 4.9 4.9 0 01-1.168-1.804c-.247-.636-.416-1.363-.465-2.428-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.6-1.235 1.164-1.8.568-.568 1.136-.914 1.804-1.168.636-.247 1.363-.416 2.428-.465 1.024-.047 1.379-.06 3.808-.06h.63zm-.63 1.8h-.63c-2.376 0-2.7.01-3.728.057-1 .045-1.537.207-1.893.344-.471.182-.807.398-1.15.748-.35.35-.566.688-.748 1.15-.137.356-.3.904-.344 1.893-.047 1.027-.058 1.351-.058 3.727v.63c0 2.376.01 2.7.058 3.727.045 1 .207 1.537.344 1.893.182.471.398.807.748 1.15.35.35.687.566 1.15.748.356.137.904.3 1.893.344 1.027.047 1.351.058 3.728.058h.63c2.376 0 2.7-.01 3.727-.058 1-.045 1.537-.207 1.893-.344.471-.182.807-.398 1.15-.748.35-.35.566-.687.748-1.15.137-.356.3-.904.344-1.893.047-1.027.058-1.351.058-3.727v-.63c0-2.376-.01-2.7-.058-3.727-.045-1-.207-1.537-.344-1.893-.182-.471-.398-.807-.748-1.15-.35-.35-.687-.566-1.15-.748-.356-.137-.904-.3-1.893-.344-1.027-.047-1.351-.058-3.727-.058z"></path>
                                    <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.8a3.335 3.335 0 100 6.67 3.335 3.335 0 000-6.67z"></path>
                                    <circle cx="17.25" cy="6.75" r="1.2"></circle>
                                  </svg>
                                </a>
                                <a href="mailto:mary@example.com" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-1 text-gray-900">Mary Thompson</h3>
                          <p className="text-iwc-blue mb-4">Worship Director</p>
                          <p className="text-gray-700">
                            Mary leads our worship ministry with passion and creativity, facilitating authentic encounters with God through music and arts.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md overflow-hidden group">
                        <div className="aspect-w-3 aspect-h-4 relative">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
                            alt="Michael Roberts"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-6">
                              <div className="flex space-x-4">
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                  </svg>
                                </a>
                                <a href="#" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.164.568.568.914 1.136 1.168 1.804.247.636.416 1.363.465 2.428.048 1.067.06 1.407.06 4.123v.087c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.9 4.9 0 01-1.168 1.804c-.568.568-1.136.914-1.8 1.168-.636.247-1.363.416-2.428.465-1.066.048-1.407.06-4.123.06h-.087c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.9 4.9 0 01-1.804-1.168 4.9 4.9 0 01-1.168-1.804c-.247-.636-.416-1.363-.465-2.428-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.6-1.235 1.164-1.8.568-.568 1.136-.914 1.804-1.168.636-.247 1.363-.416 2.428-.465 1.024-.047 1.379-.06 3.808-.06h.63zm-.63 1.8h-.63c-2.376 0-2.7.01-3.728.057-1 .045-1.537.207-1.893.344-.471.182-.807.398-1.15.748-.35.35-.566.688-.748 1.15-.137.356-.3.904-.344 1.893-.047 1.027-.058 1.351-.058 3.727v.63c0 2.376.01 2.7.058 3.727.045 1 .207 1.537.344 1.893.182.471.398.807.748 1.15.35.35.687.566 1.15.748.356.137.904.3 1.893.344 1.027.047 1.351.058 3.728.058h.63c2.376 0 2.7-.01 3.727-.058 1-.045 1.537-.207 1.893-.344.471-.182.807-.398 1.15-.748.35-.35.566-.687.748-1.15.137-.356.3-.904.344-1.893.047-1.027.058-1.351.058-3.727v-.63c0-2.376-.01-2.7-.058-3.727-.045-1-.207-1.537-.344-1.893-.182-.471-.398-.807-.748-1.15-.35-.35-.687-.566-1.15-.748-.356-.137-.904-.3-1.893-.344-1.027-.047-1.351-.058-3.727-.058z"></path>
                                    <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.8a3.335 3.335 0 100 6.67 3.335 3.335 0 000-6.67z"></path>
                                    <circle cx="17.25" cy="6.75" r="1.2"></circle>
                                  </svg>
                                </a>
                                <a href="mailto:michael@example.com" className="text-white hover:text-iwc-gold">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-1 text-gray-900">Michael Roberts</h3>
                          <p className="text-iwc-blue mb-4">Youth Pastor</p>
                          <p className="text-gray-700">
                            Pastor Michael brings energy and relevant teaching to our youth, helping them navigate life with faith and purpose in today's complex world.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                      <Button variant="default" size="lg">
                        Meet Our Full Leadership Team
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Community Involvement Content */}
                  <TabsContent value="community" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-gray-900">Community Impact</h2>
                      <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Making a difference in our local community and beyond through outreach and service.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=600" 
                          alt="Community outreach" 
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-900">Local Outreach</h3>
                        <p className="text-gray-700 mb-4">
                          Our church is deeply committed to serving the needs of the Kilifi community. Through various initiatives, we strive to be the hands and feet of Christ, showing His love in practical ways.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Monthly food distribution to families in need</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">After-school tutoring program for local students</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Clean water initiatives in surrounding villages</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Quarterly health clinics offering basic medical services</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:flex-row-reverse">
                      <div className="rounded-xl overflow-hidden md:order-last">
                        <img 
                          src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600" 
                          alt="Global missions" 
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-900">Global Missions</h3>
                        <p className="text-gray-700 mb-4">
                          We believe in extending Christ's love beyond our local community. Our church supports and participates in missions work across Kenya and internationally.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Partnership with orphanages in Uganda and Tanzania</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Annual mission trips for church members</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Support for Bible translation projects in unreached areas</span>
                          </li>
                          <li className="flex items-start">
                            <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-700">Disaster relief contributions in times of international crisis</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button variant="default" size="lg">
                        Get Involved
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Photo Gallery Content */}
                  <TabsContent value="gallery" className="mt-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-gray-900">Photo Gallery</h2>
                      <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore moments from our church services, events, and community activities.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1511448957602-417c5a0cb0e9?q=80&w=400" 
                          alt="Worship service" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=400" 
                          alt="Prayer meeting" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=400" 
                          alt="Community outreach" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400" 
                          alt="Youth group" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400" 
                          alt="Praise and worship" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1459542907417-6e7a4e1ed6c9?q=80&w=400" 
                          alt="Church event" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1494531835360-80e9790838b8?q=80&w=400" 
                          alt="Bible study" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=400" 
                          alt="Children's ministry" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1576859958081-27de5c70262d?q=80&w=400" 
                          alt="Church building" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="mt-12 text-center">
                      <Button variant="default" size="lg">
                        View Full Gallery
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-iwc-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Join Our Community</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            We'd love to have you join us for a service or community event. Experience the warmth and welcome of Immanuel Worship Centre for yourself.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="default" className="bg-white text-iwc-blue hover:bg-iwc-orange hover:text-white">
              Plan Your Visit
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-iwc-blue">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
