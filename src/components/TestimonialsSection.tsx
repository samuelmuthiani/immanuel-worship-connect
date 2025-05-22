import React, { useEffect, useRef, useState } from "react";
import { getSectionContent } from "@/utils/siteContent";

const testimonials = [
	{
		name: "Sarah O.",
		quote: "Immanuel Worship Centre is truly a family. I've grown so much in my faith here.",
		image: "https://randomuser.me/api/portraits/women/65.jpg",
		role: "Member since 2018",
	},
	{
		name: "James R.",
		quote: "The worship and teaching are inspiring. I always feel welcomed.",
		image: "https://randomuser.me/api/portraits/men/44.jpg",
		role: "Youth Leader",
	},
	{
		name: "Grace L.",
		quote: "A place where my family found hope and community.",
		image: "https://randomuser.me/api/portraits/women/68.jpg",
		role: "Volunteer",
	},
];

const TestimonialsSection = () => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [cmsContent, setCmsContent] = useState<string | null>(null);

	useEffect(() => {
		// Animate in
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("opacity-100");
					entry.target.classList.remove("opacity-0", "translate-y-10");
				}
			},
			{ threshold: 0.1 }
		);
		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}
		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	useEffect(() => {
		// Fetch CMS content
		const fetchContent = async () => {
			const content = await getSectionContent('testimonials');
			if (content) setCmsContent(content);
		};
		
		fetchContent();
	}, []);

	return (
		<div ref={sectionRef} className="transition-all duration-1000 opacity-0 translate-y-10">
			{cmsContent ? (
				<div className="prose mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: cmsContent }} />
			) : (
				<section className="py-16 bg-white" aria-labelledby="testimonials-heading">
					<div className="container mx-auto px-4 text-center">
						<h2 id="testimonials-heading" className="text-3xl font-bold mb-6 text-gray-900">
							What Our Members Say
						</h2>
						<div className="w-20 h-1 bg-iwc-orange mx-auto mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{testimonials.map((t, i) => (
								<figure
									key={i}
									className="bg-gray-50 p-8 rounded-xl shadow-md flex flex-col items-center"
									aria-label={`Testimonial from ${t.name}`}
								>
									<img
										src={t.image}
										alt={t.name}
										className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-iwc-orange"
									/>
									<blockquote className="text-lg italic mb-4">“{t.quote}”</blockquote>
									<figcaption className="font-semibold text-iwc-blue">{t.name}</figcaption>
									<span className="text-sm text-gray-500">{t.role}</span>
								</figure>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
};

export default TestimonialsSection;
