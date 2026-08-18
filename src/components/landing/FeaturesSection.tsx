import React from 'react';
import { Users, Shield, Star, Zap, Award, Clock } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Curated vendors',
    description: 'Hand-picked professional vendors verified for quality and reliability.',
  },
  {
    icon: Shield,
    title: 'Secure platform',
    description: 'Safe and secure platform with verified vendor profiles and reviews.',
  },
  {
    icon: Star,
    title: 'Trusted reviews',
    description: 'Real reviews from event planners to help you make informed decisions.',
  },
  {
    icon: Zap,
    title: 'Fast matching',
    description: 'Smart filters help you find vendors that fit your exact needs in minutes.',
  },
  {
    icon: Award,
    title: 'Premium quality',
    description: 'Only top-rated vendors with proven track records join our platform.',
  },
  {
    icon: Clock,
    title: '24/7 support',
    description: 'Round-the-clock customer support to help you every step of the way.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-paper">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-graphite text-sm font-medium tracking-wide uppercase mb-3">
            Why VendorHub
          </p>
          <h2 className="font-display text-3xl md:text-[48px] font-normal tracking-heading leading-[1.05] text-carbon">
            Everything you need to plan the perfect event
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon className="h-8 w-8 text-carbon mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-carbon mb-2">
                {feature.title}
              </h3>
              <p className="text-graphite leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
