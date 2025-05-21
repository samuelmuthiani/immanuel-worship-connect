
import React, { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';

const servicesData = [
  {
    title: "Sunday Worship",
    time: "9:00 AM & 11:00 AM",
    description: "Our main worship services feature contemporary worship, biblical teaching, and prayer ministry. Children's church is provided for ages 3-12.",
    image: "https://images.unsplash.com/photo-1485872304698-0537e003288d?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Youth Service",
    time: "Friday 6:30 PM",
    description: "Our dynamic youth ministry offers teens (13-18) a place to build authentic community, experience God's presence, and grow in their faith through relevant teaching, worship, and activities.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Bible Study",
    time: "Wednesday 7:00 PM",
    description: "Our midweek service features in-depth Bible teaching, small group discussions, and prayer. This is a great opportunity to go deeper in your understanding of Scripture and connect with others.",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Prayer Meeting",
    time: "Tuesday 6:00 AM",
    description: "Join us for powerful corporate prayer as we intercede for our church, community, nation, and world. All are welcome to participate in this essential ministry.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Children's Ministry",
    time: "Sunday 9:00 AM & 11:00 AM",
    description: "Our children's ministry provides age-appropriate teaching, worship, and activities for children from infants through 6th grade, helping them build a strong foundation of faith.",
    image: "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Small Groups",
    time: "Various Times",
    description: "Our small groups meet throughout the week in homes across the city. These groups provide fellowship, prayer support, and biblical discussion in a more intimate setting.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
  }
];

const upcomingEvents = [
  {
    title: "Easter Service",
    date: "April 9, 2023",
    time: "8:00 AM, 10:00 AM & 12:00 PM",
    description: "Join us for a special celebration of Christ's resurrection. Additional services provided to accommodate guests.",
  },
  {
    title: "Annual Worship Conference",
    date: "June 15-17, 2023",
    time: "Various sessions",
    description: "Three days of powerful worship, teaching, and ministry with guest speakers and worship leaders.",
  },
  {
    title: "Community Outreach Day",
    date: "July 22, 2023",
    time: "9:00 AM - 3:00 PM",
    description: "Serving our community through various projects including food distribution, home repairs, and a free health clinic.",
  },
  {
    title: "Youth Summer Camp",
    date: "August 7-11, 2023",
    time: "Residential",
    description: "An unforgettable week of spiritual growth, adventure, and friendship for teens ages 13-18.",
  }
];

const Services = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Our Services</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for worship, prayer, and community as we grow together in faith
            </p>
          </div>

          <div 
            ref={contentRef}
            className="transition-all duration-1000 opacity-0 translate-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {servicesData.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">{service.title}</h2>
                    <p className="text-iwc-orange font-medium mb-4">{service.time}</p>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-iwc-blue mr-2">📅</span>
                      <span className="text-gray-700 font-medium">{event.date}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-iwc-orange">{event.time}</span>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
