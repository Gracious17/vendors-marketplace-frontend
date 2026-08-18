import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Free to use for event planners',
  'Verified vendor profiles',
  'Secure platform with reviews',
  '24/7 customer support',
];

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-paper border-t border-mist">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="font-display font-light text-4xl md:text-[48px] tracking-heading leading-[1.05] text-carbon mb-6">
          Ready to plan your perfect event?
        </h2>

        <p className="text-lg text-graphite mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of event planners who trust VendorHub to find the best vendors
          and create unforgettable experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors"
          >
            Get started free
          </Link>
          <Link
            to="/vendors"
            className="px-8 py-3.5 rounded-lg border border-mist text-carbon font-semibold hover:bg-mist/30 transition-colors"
          >
            Browse vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center justify-center sm:justify-start text-graphite">
              <CheckCircle className="h-4 w-4 text-fiverr-green mr-2 shrink-0" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
