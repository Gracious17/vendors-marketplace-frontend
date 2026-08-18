import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Badge, Phone, Mail, Globe, Heart,
  ArrowLeft, Calendar, Share2, MessageCircle,
  CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { useVendor } from '../hooks/useVendors';
import { useAuthStore } from '../stores/authStore';
import { mockReviews } from '../lib/mockData';
import { formatCurrency, getCategoryLabel, formatDate } from '../lib/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vendor, loading } = useVendor(id!);
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const vendorReviews = mockReviews.filter(review => review.vendorId === id);
  const isAuthenticated = !!user && !!profile;

  const handleContactVendor = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } });
      return;
    }
  };

  const handleCheckAvailability = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } });
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading vendor profile..." />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-carbon mb-4">Vendor not found</h1>
          <Link
            to="/vendors"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-carbon text-paper font-medium hover:bg-slate transition-colors"
          >
            Browse All Vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-display">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/vendors"
            className="inline-flex items-center text-fiverr-green hover:text-forest-stage font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-paper rounded-2xl border border-mist overflow-hidden">
              {/* Image Gallery */}
              <div className="relative">
                <img
                  src={vendor.images[activeImageIndex]}
                  alt={vendor.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {vendor.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === activeImageIndex ? 'bg-paper' : 'bg-paper/50'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    aria-label={isSaved ? 'Remove from saved' : 'Save vendor'}
                    className="p-2 rounded-full bg-paper/90 hover:bg-paper transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-graphite'}`} />
                  </button>
                  <button
                    aria-label="Share vendor"
                    className="p-2 rounded-full bg-paper/90 hover:bg-paper transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-graphite" />
                  </button>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-3xl font-semibold text-carbon">{vendor.name}</h1>
                      {vendor.verified && (
                        <div className="flex items-center px-2.5 py-1 border border-fiverr-green text-fiverr-green rounded-full text-sm">
                          <Badge className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-fiverr-green font-medium mb-2">
                      {getCategoryLabel(vendor.category)}
                    </p>
                    <div className="flex items-center text-graphite">
                      <MapPin className="h-4 w-4 mr-2" />
                      {vendor.location.city}, {vendor.location.state}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end mb-2">
                      <Star className="h-5 w-5 text-fiverr-green fill-current mr-1" />
                      <span className="text-xl font-semibold text-carbon">{vendor.rating.toFixed(1)}</span>
                      <span className="text-graphite ml-1">({vendor.reviewCount} reviews)</span>
                    </div>
                    <div className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${vendor.availability
                        ? 'bg-fiverr-green/10 text-fiverr-green'
                        : 'bg-mist/60 text-graphite'
                      }
                    `}>
                      <Clock className="h-4 w-4 mr-1" />
                      {vendor.availability ? 'Available' : 'Booked'}
                    </div>
                  </div>
                </div>

                <p className="text-graphite text-lg leading-relaxed mb-6">
                  {vendor.description}
                </p>

                {/* Pricing */}
                <div className="bg-mist/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-graphite mr-2" />
                    <h3 className="text-lg font-semibold text-carbon">Pricing</h3>
                  </div>
                  <div className="text-2xl font-semibold text-carbon">
                    {formatCurrency(vendor.pricing.min, vendor.pricing.currency)} - {formatCurrency(vendor.pricing.max, vendor.pricing.currency)}
                  </div>
                  <p className="text-graphite">{vendor.pricing.unit}</p>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-carbon mb-4">Services Offered</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vendor.services.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-fiverr-green mr-3 mt-0.5 shrink-0" />
                        <span className="text-graphite">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-paper rounded-2xl border border-mist p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-2xl font-semibold text-carbon">
                  Reviews &amp; Ratings
                </h2>
                <button
                  onClick={() => !isAuthenticated && navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } })}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-mist text-carbon text-sm font-medium hover:bg-mist/30 transition-colors"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {isAuthenticated ? 'Write Review' : 'Sign in to Review'}
                </button>
              </div>

              {/* Rating Overview */}
              <div className="bg-mist/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="text-center shrink-0">
                    <div className="text-3xl font-semibold text-carbon mb-1">
                      {vendor.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(vendor.rating)
                              ? 'text-fiverr-green fill-current'
                              : 'text-mist'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-graphite">
                      Based on {vendor.reviewCount} reviews
                    </p>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center mb-1">
                        <span className="text-sm text-graphite w-8 shrink-0">
                          {rating}&#9733;
                        </span>
                        <div className="flex-1 mx-3 bg-mist rounded-full h-2">
                          <div
                            className="bg-fiverr-green h-2 rounded-full"
                            style={{ width: `${(rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-graphite w-8 shrink-0 text-right">
                          {rating * 10}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {vendorReviews.map((review) => (
                  <div key={review.id} className="border-b border-mist pb-6 last:border-b-0">
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                      <div className="min-w-0">
                        <h4 className="font-medium text-carbon">{review.userName}</h4>
                        <div className="flex items-center mt-1 flex-wrap gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-fiverr-green fill-current'
                                  : 'text-mist'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-graphite">
                            {review.eventType}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-smoke shrink-0">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-graphite">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-paper rounded-2xl border border-mist p-6">
              <h3 className="text-lg font-semibold text-carbon mb-4">
                Contact Information
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center min-w-0">
                  <Phone className="h-4 w-4 text-graphite mr-3 shrink-0" />
                  <a
                    href={`tel:${vendor.contact.phone}`}
                    className="text-fiverr-green hover:text-forest-stage truncate"
                  >
                    {vendor.contact.phone}
                  </a>
                </div>

                <div className="flex items-center min-w-0">
                  <Mail className="h-4 w-4 text-graphite mr-3 shrink-0" />
                  <a
                    href={`mailto:${vendor.contact.email}`}
                    className="text-fiverr-green hover:text-forest-stage truncate"
                  >
                    {vendor.contact.email}
                  </a>
                </div>

                {vendor.contact.website && (
                  <div className="flex items-center min-w-0">
                    <Globe className="h-4 w-4 text-graphite mr-3 shrink-0" />
                    <a
                      href={vendor.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fiverr-green hover:text-forest-stage truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactVendor}
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isAuthenticated ? 'Send Message' : 'Sign in to Contact'}
                </button>

                <button
                  onClick={handleCheckAvailability}
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg border border-mist text-carbon font-semibold hover:bg-mist/30 transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isAuthenticated ? 'Check Availability' : 'Sign in to Book'}
                </button>
              </div>

              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-mist/30 border border-mist rounded-lg">
                  <p className="text-sm text-graphite">
                    <strong className="text-carbon">Sign in required:</strong> You need to be logged in to contact vendors or check availability.
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="bg-paper rounded-2xl border border-mist p-6">
              <h3 className="text-lg font-semibold text-carbon mb-4">
                Location
              </h3>
              <div className="space-y-1 mb-4">
                <p className="text-carbon font-medium">{vendor.location.city}</p>
                <p className="text-graphite">{vendor.location.state}</p>
                {vendor.location.address && (
                  <p className="text-graphite">{vendor.location.address}</p>
                )}
              </div>

              <div className="bg-mist/40 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-smoke">
                  <MapPin className="h-8 w-8 mx-auto mb-2" strokeWidth={1.5} />
                  <p>Interactive Map</p>
                  <p className="text-sm">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-paper rounded-2xl border border-mist p-6">
              <h3 className="text-lg font-semibold text-carbon mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Member Since</span>
                  <span className="font-medium text-carbon text-right">{formatDate(vendor.createdAt)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Response Time</span>
                  <span className="font-medium text-carbon">~2 hours</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Events Completed</span>
                  <span className="font-medium text-carbon">150+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
