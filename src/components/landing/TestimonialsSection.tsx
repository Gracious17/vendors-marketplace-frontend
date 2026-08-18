import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Wedding Planner',
    company: 'Elegant Events Co.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'VendorHub transformed how I plan events. The quality of vendors is exceptional, and the platform makes it so easy to find exactly what I need. My clients are always impressed!',
    event: 'Planned 50+ weddings',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Corporate Event Manager',
    company: 'Tech Solutions Inc.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "The vendor verification process gives me complete confidence. Every vendor I've worked with through VendorHub has exceeded expectations. It's become my go-to platform.",
    event: 'Managed 100+ corporate events',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Event Coordinator',
    company: 'Dream Celebrations',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'The time I save using VendorHub is incredible. What used to take weeks of research now takes hours. The review system helps me make informed decisions quickly.',
    event: 'Coordinated 200+ events',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Freelance Event Planner',
    company: 'Thompson Events',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'As a freelancer, VendorHub levels the playing field. I can access the same high-quality vendors as large agencies. The platform has helped me grow my business significantly.',
    event: 'Growing portfolio of 75+ events',
  },
];

const stats = [
  { number: '98%', label: 'Client satisfaction' },
  { number: '10K+', label: 'Successful events' },
  { number: '4.9/5', label: 'Average rating' },
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const active = testimonials[current];

  return (
    <section className="py-20 bg-carbon">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-smoke text-sm font-medium tracking-wide uppercase mb-3">
            Client success stories
          </p>
          <h2 className="font-display text-3xl md:text-[48px] font-normal tracking-heading leading-[1.05] text-paper">
            Loved by event planners worldwide
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="relative bg-paper rounded-2xl shadow-card p-8 md:p-12">
            <Quote className="absolute top-8 right-8 h-8 w-8 text-mist" strokeWidth={1.5} />

            <div className="flex items-center gap-1 mb-6">
              {[...Array(active.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-fiverr-green fill-current" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-carbon leading-relaxed mb-8">
              &ldquo;{active.text}&rdquo;
            </blockquote>

            <div className="flex items-center">
              <img
                src={active.image}
                alt={active.name}
                className="w-14 h-14 rounded-full object-cover mr-4"
              />
              <div>
                <div className="font-semibold text-carbon">{active.name}</div>
                <div className="text-graphite text-sm">
                  {active.role} &middot; {active.company}
                </div>
                <div className="text-smoke text-sm">{active.event}</div>
              </div>
            </div>
          </div>

          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-4 md:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper rounded-full flex items-center justify-center text-carbon hover:bg-mist transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-4 md:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper rounded-full flex items-center justify-center text-carbon hover:bg-mist transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8 mb-16">
          {testimonials.map((t, index) => (
            <button
              key={t.id}
              onClick={() => setCurrent(index)}
              aria-label={`Show testimonial ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index ? 'w-6 bg-fiverr-green' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-semibold text-paper mb-1">{stat.number}</div>
              <div className="text-smoke text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
