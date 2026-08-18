import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const categoryLinks = [
  { label: 'Catering', category: 'catering' },
  { label: 'Photography', category: 'photography' },
  { label: 'Venues', category: 'venues' },
  { label: 'Music', category: 'music' },
  { label: 'Flowers', category: 'flowers' },
  { label: 'Planning', category: 'planning' },
];

const stats = [
  { number: '500+', label: 'Verified vendors' },
  { number: '10K+', label: 'Events planned' },
  { number: '4.9', label: 'Average rating' },
];

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/vendors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/vendors');
    }
  };

  return (
    <section className="relative overflow-hidden bg-carbon">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1447252/pexels-photo-1447252.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-carbon/75" />
      </div>

      <div
        className={`relative max-w-[1200px] mx-auto px-6 pt-24 pb-20 transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-3xl">
          <h1 className="font-display font-light text-5xl md:text-[72px] leading-[1.05] md:leading-none tracking-display text-paper mb-6">
            Find the right vendor
            <br />
            for your next event
          </h1>

          <p className="text-lg md:text-xl text-mist mb-10 max-w-xl leading-relaxed font-light">
            Verified caterers, photographers, venues, and planners &mdash; compare real
            profiles and book with confidence.
          </p>

          {/* Hero Search Bar */}
          <div className="max-w-xl">
            <div className="flex items-stretch bg-paper rounded border border-mist overflow-hidden focus-within:border-fiverr-green">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for caterers, photographers, venues..."
                className="flex-1 min-w-0 px-5 py-4 text-base text-carbon placeholder-smoke bg-transparent outline-none"
              />
              <button
                onClick={handleSearch}
                aria-label="Search vendors"
                className="w-14 shrink-0 flex items-center justify-center bg-carbon text-paper hover:bg-slate transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category quick links */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categoryLinks.map((cat) => (
              <button
                key={cat.category}
                onClick={() => navigate(`/vendors?category=${cat.category}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-fiverr-green/60 text-fiverr-green text-sm hover:bg-fiverr-green/10 transition-colors"
              >
                {cat.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-6 mt-10">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-paper text-carbon font-medium hover:bg-mist transition-colors"
            >
              Get started free
            </Link>
            <Link to="/vendors" className="text-paper/90 hover:text-paper font-medium text-sm">
              Browse vendors
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-12 gap-y-6 mt-16 pt-10 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-semibold text-paper mb-1">{stat.number}</div>
                <div className="text-smoke text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
