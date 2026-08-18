import React from 'react';
import { Search, Users, Calendar } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search & discover',
    description: 'Browse our curated directory of professional event vendors using smart filters.',
    icon: Search,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    number: '02',
    title: 'Compare & connect',
    description: 'Compare services, read authentic reviews, and connect directly with vendors that match your vision and budget.',
    icon: Users,
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    number: '03',
    title: 'Plan & execute',
    description: 'Collaborate with trusted vendors using our planning tools to bring your event vision to life.',
    icon: Calendar,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-paper border-t border-mist">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-graphite text-sm font-medium tracking-wide uppercase mb-3">
            Simple process
          </p>
          <h2 className="font-display text-3xl md:text-[48px] font-normal tracking-heading leading-[1.05] text-carbon">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-fiverr-green">{step.number}</span>
                <step.icon className="h-5 w-5 text-carbon" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-semibold text-carbon mb-2">
                {step.title}
              </h3>
              <p className="text-graphite leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
