import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Star, TrendingUp, Users, Eye, Plus, MessageCircle, AlertTriangle, Edit, Crown, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useVendorDashboard } from '../hooks/useVendorDashboard';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CurrencySelector from '../components/ui/CurrencySelector';
import HelpCenter from '../components/HelpCenter';
import { formatCurrency, convertCurrency } from '../lib/utils';

const VendorDashboard: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const { 
    stats, 
    recentInquiries, 
    upcomingBookings, 
    vendorProfile, 
    profileCompletion, 
    loading, 
    error,
    refetch 
  } = useVendorDashboard();

  const { subscription, fetchSubscription } = useSubscriptionStore();
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  React.useEffect(() => {
    if (profile?.id) {
      fetchSubscription(profile.id);
    }
  }, [profile?.id, fetchSubscription]);

  const handleCurrencyChange = async (currency: 'USD' | 'NGN') => {
    if (profile) {
      try {
        await updateProfile({ currency });
      } catch (error) {
        console.error('Failed to update currency preference:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const userCurrency = profile?.currency || 'USD';

  // Convert revenue to user's preferred currency if needed
  const revenueAmount = parseFloat(stats.revenue.replace(/[^0-9.-]+/g, '')) || 0;
  const convertedRevenue = convertCurrency(revenueAmount, 'USD', userCurrency);

  const dashboardStats = [
    { label: 'Profile Views', value: stats.profileViews, icon: Eye, color: 'text-blue-600' },
    { label: 'Inquiries', value: stats.inquiries, icon: MessageCircle, color: 'text-emerald-600' },
    { label: 'Bookings', value: stats.bookings, icon: Calendar, color: 'text-indigo-600' },
    { label: 'Revenue', value: formatCurrency(convertedRevenue, userCurrency), icon: DollarSign, color: 'text-green-600' },
  ];

  const getProfileStatusColor = () => {
    if (profileCompletion >= 90) return 'emerald';
    if (profileCompletion >= 70) return 'yellow';
    return 'red';
  };

  const getProfileStatusMessage = () => {
    if (profileCompletion >= 90) return 'Your profile is fully optimized and visible to clients';
    if (profileCompletion >= 70) return 'Your profile is good but could use some improvements';
    return 'Your profile needs attention to attract more clients';
  };

  const hasActiveSubscription = subscription?.status === 'active';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {profile?.name}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Here's how your vendor business is performing
                </p>
              </div>
              
              {/* Currency Selector */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Currency:</div>
                <CurrencySelector
                  value={profile?.currency || 'USD'}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
                <Button variant="ghost" size="sm" onClick={refetch} className="ml-auto">
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Subscription Status */}
          {!hasActiveSubscription && (
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">
                      Upgrade to Premium
                    </h3>
                    <p className="text-purple-700">
                      Get featured on homepage and increase your bookings by 3x
                    </p>
                  </div>
                </div>
                <Link to="/subscription">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {hasActiveSubscription && (
            <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-50 border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-emerald-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">
                      Premium Vendor
                    </h3>
                    <p className="text-emerald-700">
                      You're featured as a top vendor • Expires {new Date(subscription.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link to="/subscription">
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    Manage Plan
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Status */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Profile Status
                  </h2>
                  <div className="flex space-x-2">
                    <Link to="/vendor-profile/edit">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link to={`/vendor-preview/${profile?.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className={`
                  bg-gradient-to-r rounded-lg p-6 border
                  ${profileCompletion >= 90 
                    ? 'from-emerald-50 to-emerald-50 border-emerald-200' 
                    : profileCompletion >= 70 
                      ? 'from-yellow-50 to-yellow-50 border-yellow-200'
                      : 'from-red-50 to-red-50 border-red-200'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`
                        text-lg font-semibold mb-2
                        ${profileCompletion >= 90 
                          ? 'text-emerald-900' 
                          : profileCompletion >= 70 
                            ? 'text-yellow-900'
                            : 'text-red-900'
                        }
                      `}>
                        Profile {profileCompletion >= 90 ? 'Complete ✓' : 'Incomplete'}
                      </h3>
                      <p className={`
                        ${profileCompletion >= 90 
                          ? 'text-emerald-700' 
                          : profileCompletion >= 70 
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }
                      `}>
                        {getProfileStatusMessage()}
                      </p>
                      {vendorProfile?.business_name && (
                        <p className="text-sm text-gray-600 mt-2">
                          Business: {vendorProfile.business_name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`
                        text-2xl font-bold
                        ${profileCompletion >= 90 
                          ? 'text-emerald-900' 
                          : profileCompletion >= 70 
                            ? 'text-yellow-900'
                            : 'text-red-900'
                        }
                      `}>
                        {profileCompletion}%
                      </div>
                      <div className={`
                        text-sm
                        ${profileCompletion >= 90 
                          ? 'text-emerald-700' 
                          : profileCompletion >= 70 
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }
                      `}>
                        Complete
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`
                          h-2 rounded-full transition-all duration-300
                          ${profileCompletion >= 90 
                            ? 'bg-emerald-500' 
                            : profileCompletion >= 70 
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }
                        `}
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Inquiries */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-emerald-600" />
                    Recent Inquiries ({recentInquiries.length})
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                {recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{inquiry.client}</h3>
                          <p className="text-sm text-gray-600">{inquiry.event} • {inquiry.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                              inquiry.status === 'Responded' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-emerald-100 text-emerald-800'}
                          `}>
                            {inquiry.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No inquiries yet
                    </h3>
                    <p className="text-gray-600">
                      Inquiries from potential clients will appear here.
                    </p>
                  </div>
                )}
              </Card>

              {/* Upcoming Bookings */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    Upcoming Bookings ({upcomingBookings.length})
                  </h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Booking
                  </Button>
                </div>

                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const bookingAmount = parseFloat(booking.amount.replace(/[^0-9.-]+/g, '')) || 0;
                      const convertedAmount = convertCurrency(bookingAmount, 'USD', userCurrency);
                      
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{booking.client}</h3>
                            <p className="text-sm text-gray-600">{booking.event} • {booking.date}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-emerald-600">
                              {formatCurrency(convertedAmount, userCurrency)}
                            </span>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-gray-600">
                      Your confirmed bookings will appear here.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                  This Month
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold text-gray-900">
                      {stats.profileViews}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inquiries</span>
                    <span className="font-semibold text-emerald-600">
                      {stats.inquiries}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bookings</span>
                    <span className="font-semibold text-emerald-600">
                      {stats.bookings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(convertedRevenue, userCurrency)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/vendor-profile/edit">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                  <Link to={`/vendor-preview/${profile?.id}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Profile
                    </Button>
                  </Link>
                  <Link to="/subscription">
                    <Button variant="outline" className="w-full justify-start">
                      <Crown className="h-4 w-4 mr-2" />
                      {hasActiveSubscription ? 'Manage Subscription' : 'Upgrade to Premium'}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Manage Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Availability
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsHelpOpen(true)}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                </div>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  💡 Growth Tip
                </h3>
                <p className="text-sm text-amber-700">
                  {!hasActiveSubscription 
                    ? "Upgrade to Premium to get featured on the homepage and increase your visibility by 300%!"
                    : profileCompletion < 90 
                      ? "Complete your profile to increase visibility and attract more clients!"
                      : "Respond to inquiries within 2 hours to increase your booking rate by up to 40%!"
                  }
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Help Center Modal */}
      <HelpCenter
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        userRole={profile?.role}
      />
    </>
  );
};

export default VendorDashboard;