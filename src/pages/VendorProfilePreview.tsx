import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Star, Badge, Phone, Mail, Globe, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { getCategoryLabel, formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface VendorProfileData {
  id: string;
  business_name: string;
  category: string;
  description: string;
  services: string[];
  location: {
    city: string;
    state: string;
    address?: string;
  };
  pricing: {
    min: number;
    max: number;
    unit: string;
  };
  profile_image?: string;
  verified: boolean;
  availability: boolean;
  created_at: string;
}

const VendorProfilePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuthStore();
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.id === id;

  useEffect(() => {
    fetchVendorData();
  }, [id]);

  const fetchVendorData = async () => {
    if (!id) return;

    try {
      // Fetch vendor profile
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (vendorError) throw vendorError;

      // Fetch basic profile info
      const { data: basicProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) throw profileError;

      setVendorData(vendorProfile);
      setOwnerProfile(basicProfile);
    } catch (err) {
      console.error('Error fetching vendor data:', err);
      setError('Failed to load vendor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile preview..." />
      </div>
    );
  }

  if (error || !vendorData || !ownerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Profile not found'}
          </h1>
          <Link to="/dashboard/vendor">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mockRating = 4.8;
  const mockReviewCount = 127;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={isOwner ? "/dashboard/vendor" : "/vendors"}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isOwner ? 'Back to Dashboard' : 'Back to Vendors'}
          </Link>
          
          {isOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-900">Profile Preview</h3>
                  <p className="text-blue-700">This is how clients will see your profile</p>
                </div>
                <Link to="/vendor-profile/edit">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card padding="none" className="overflow-hidden">
              {/* Profile Image */}
              <div className="relative">
                {vendorData.profile_image ? (
                  <img
                    src={vendorData.profile_image}
                    alt={vendorData.business_name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {vendorData.business_name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-gray-600">No profile image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vendor Info */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{vendorData.business_name}</h1>
                      {vendorData.verified && (
                        <div className="flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          <Badge className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-indigo-600 font-medium mb-2">
                      {getCategoryLabel(vendorData.category as any)}
                    </p>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {vendorData.location.city}, {vendorData.location.state}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-xl font-bold text-gray-900">{mockRating}</span>
                      <span className="text-gray-600 ml-1">({mockReviewCount} reviews)</span>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${vendorData.availability 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      {vendorData.availability ? 'Available' : 'Booked'}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {vendorData.description}
                </p>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(vendorData.pricing.min)} - {formatCurrency(vendorData.pricing.max)}
                  </div>
                  <p className="text-gray-600">{vendorData.pricing.unit}</p>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vendorData.services.map((service, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-3" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section (Mock) */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews & Ratings
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {mockRating}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(mockRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {mockReviewCount} reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>Reviews will appear here once clients start leaving feedback</p>
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
                  <span className="text-gray-700">{ownerProfile.phone || 'No phone provided'}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">{ownerProfile.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">Website coming soon</span>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Send Message
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    Check Availability
                  </Button>
                </div>
              )}
            </Card>

            {/* Location */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-900 font-medium">{vendorData.location.city}</p>
                <p className="text-gray-600">{vendorData.location.state}</p>
                {vendorData.location.address && (
                  <p className="text-gray-600">{vendorData.location.address}</p>
                )}
              </div>
              
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
                  <span className="font-medium">
                    {new Date(vendorData.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">~2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Completed</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePreview;