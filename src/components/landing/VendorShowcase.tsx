import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import VendorCard from '../VendorCard';

const VendorShowcase: React.FC = () => {
  const { vendors, loading } = useVendors();

  const premiumVendors = vendors
    .filter(vendor => vendor.subscription?.status === 'active')
    .slice(0, 6);

  const showcaseVendors = premiumVendors.length > 0
    ? premiumVendors
    : vendors.filter(vendor => vendor.featured).slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 bg-paper border-t border-mist">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-4 bg-mist rounded w-40 mb-4" />
            <div className="h-10 bg-mist rounded w-96 mb-12" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-mist rounded-2xl h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-paper border-t border-mist">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div className="max-w-2xl">
            <p className="text-graphite text-sm font-medium tracking-wide uppercase mb-3">
              {premiumVendors.length > 0 ? 'Premium vendors' : 'Featured vendors'}
            </p>
            <h2 className="font-display text-3xl md:text-[48px] font-normal tracking-heading leading-[1.05] text-carbon">
              {premiumVendors.length > 0 ? 'Meet our top vendors' : 'Discover amazing vendors'}
            </h2>
          </div>
        </div>

        {showcaseVendors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {showcaseVendors.map((vendor) => (
                <div key={vendor.id} className="relative">
                  {vendor.subscription && (
                    <div className="absolute -top-2.5 -right-2.5 z-10">
                      <div className="inline-flex items-center gap-1 bg-paper border border-fiverr-green text-fiverr-green px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Crown className="h-3 w-3" />
                        Premium
                      </div>
                    </div>
                  )}
                  <VendorCard vendor={vendor} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/vendors"
                className="inline-flex items-center px-8 py-3.5 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors"
              >
                View all vendors
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-mist/40 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-7 w-7 text-carbon" strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-semibold text-carbon mb-4">
                Be the first premium vendor
              </h3>

              <p className="text-lg text-graphite mb-8 leading-relaxed">
                Join our premium vendor program and get featured on the homepage.
                Premium vendors receive 3x more inquiries and higher booking rates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Become a premium vendor
                </Link>
                <Link
                  to="/vendors"
                  className="px-6 py-3 rounded-lg border border-mist text-carbon font-semibold hover:bg-mist/30 transition-colors"
                >
                  Browse all vendors
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-paper rounded-2xl p-6 shadow-card">
                  <div className="text-3xl font-semibold text-carbon mb-1">3x</div>
                  <div className="text-graphite text-sm">More inquiries</div>
                </div>
                <div className="bg-paper rounded-2xl p-6 shadow-card">
                  <div className="text-3xl font-semibold text-carbon mb-1">85%</div>
                  <div className="text-graphite text-sm">Higher booking rate</div>
                </div>
                <div className="bg-paper rounded-2xl p-6 shadow-card">
                  <div className="text-3xl font-semibold text-carbon mb-1">Top</div>
                  <div className="text-graphite text-sm">Search placement</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VendorShowcase;
