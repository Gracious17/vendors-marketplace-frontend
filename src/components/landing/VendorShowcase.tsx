import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Star, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import VendorCard from '../VendorCard';
import Button from '../ui/Button';

const VendorShowcase: React.FC = () => {
  const { vendors, loading } = useVendors();
  const [visibleVendors, setVisibleVendors] = useState<number[]>([]);

  // Get premium vendors (those with active subscriptions)
  const premiumVendors = vendors
    .filter(vendor => vendor.subscription?.status === 'active')
    .slice(0, 6);

  // If no premium vendors, show featured vendors
  const showcaseVendors = premiumVendors.length > 0 
    ? premiumVendors 
    : vendors.filter(vendor => vendor.featured).slice(0, 6);

  useEffect(() => {
    if (!loading && showcaseVendors.length > 0) {
      showcaseVendors.forEach((_, index) => {
        setTimeout(() => {
          setVisibleVendors(prev => [...prev, index]);
        }, index * 200);
      });
    }
  }, [loading, showcaseVendors.length]);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-64"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Crown className="h-4 w-4 mr-2" />
            {premiumVendors.length > 0 ? 'Premium Vendors' : 'Featured Vendors'}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {premiumVendors.length > 0 ? (
              <>
                Meet our top
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  premium vendors
                </span>
              </>
            ) : (
              <>
                Discover amazing
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  event vendors
                </span>
              </>
            )}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {premiumVendors.length > 0 
              ? 'Premium vendors with verified quality, exceptional service, and proven track records'
              : 'Professional vendors ready to make your events extraordinary'
            }
          </p>
        </div>

        {/* Vendors Grid */}
        {showcaseVendors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {showcaseVendors.map((vendor, index) => (
                <div
                  key={vendor.id}
                  className={`transform transition-all duration-700 ${
                    visibleVendors.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="relative group">
                    {/* Premium Badge */}
                    {vendor.subscription && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Vendor Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      
                      <VendorCard vendor={vendor} />
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link to="/vendors">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  View All Vendors
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Be the First Premium Vendor
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join our premium vendor program and get featured on the homepage. 
                Premium vendors receive 3x more inquiries and higher booking rates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Become Premium Vendor
                  </Button>
                </Link>
                
                <Link to="/vendors">
                  <Button size="lg" variant="outline">
                    Browse All Vendors
                  </Button>
                </Link>
              </div>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">3x</div>
                  <div className="text-gray-600">More Inquiries</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">85%</div>
                  <div className="text-gray-600">Higher Booking Rate</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Top</div>
                  <div className="text-gray-600">Search Placement</div>
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