import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Badge, Phone, Mail, Globe, Heart, 
  ArrowLeft, Calendar, Share2, MessageCircle, Camera,
  CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { useVendor } from '../hooks/useVendors';
import { useAuthStore } from '../stores/authStore';
import { mockReviews } from '../lib/mockData';
import { formatCurrency, getCategoryLabel, formatDate } from '../lib/utils';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vendor, loading } = useVendor(id!);
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const vendorReviews = mockReviews.filter(review => review.vendorId === id);
  const isAuthenticated = !!user && !!profile;

  const handleContactVendor = () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } });
      return;
    }
    setShowContactForm(true);
  };

  const handleCheckAvailability = () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } });
      return;
    }
    // Handle availability check for authenticated users
    console.log('Checking availability for authenticated user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading vendor profile..." />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor not found</h1>
          <Link to="/vendors">
            <Button>Browse All Vendors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/vendors"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card padding="none" className="overflow-hidden">
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
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                      {vendor.verified && (
                        <div className="flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          <Badge className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-indigo-600 font-medium mb-2">
                      {getCategoryLabel(vendor.category)}
                    </p>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {vendor.location.city}, {vendor.location.state}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-xl font-bold text-gray-900">{vendor.rating}</span>
                      <span className="text-gray-600 ml-1">({vendor.reviewCount} reviews)</span>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${vendor.availability 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      {vendor.availability ? 'Available' : 'Booked'}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {vendor.description}
                </p>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(vendor.pricing.min, vendor.pricing.currency)} - {formatCurrency(vendor.pricing.max, vendor.pricing.currency)}
                  </div>
                  <p className="text-gray-600">{vendor.pricing.unit}</p>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vendor.services.map((service, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-3" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews & Ratings
                </h2>
                {isAuthenticated ? (
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/login', { state: { from: { pathname: `/vendor/${id}` } } })}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Sign in to Review
                  </Button>
                )}
              </div>

              {/* Rating Overview */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {vendor.rating}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(vendor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {vendor.reviewCount} reviews
                    </p>
                  </div>

                  <div className="flex-1 ml-8">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center mb-1">
                        <span className="text-sm text-gray-600 w-8">
                          {rating}★
                        </span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${Math.random() * 100}%` // Mock data
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {vendorReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {review.eventType}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-600 mr-3" />
                  <a
                    href={`tel:${vendor.contact.phone}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {vendor.contact.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-3" />
                  <a
                    href={`mailto:${vendor.contact.email}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {vendor.contact.email}
                  </a>
                </div>
                
                {vendor.contact.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-600 mr-3" />
                    <a
                      href={vendor.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContactVendor}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isAuthenticated ? 'Send Message' : 'Sign in to Contact'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleCheckAvailability}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isAuthenticated ? 'Check Availability' : 'Sign in to Book'}
                </Button>
              </div>

              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Sign in required:</strong> You need to be logged in to contact vendors or check availability.
                  </p>
                </div>
              )}
            </Card>

            {/* Location */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-900 font-medium">{vendor.location.city}</p>
                <p className="text-gray-600">{vendor.location.state}</p>
                {vendor.location.address && (
                  <p className="text-gray-600">{vendor.location.address}</p>
                )}
              </div>
              
              {/* Mock Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Coming Soon</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(vendor.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">~2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Completed</span>
                  <span className="font-medium">150+</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;