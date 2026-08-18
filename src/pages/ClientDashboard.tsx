import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Star, TrendingUp, Users, Eye, Plus, Filter, Search, Settings, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useVendors } from '../hooks/useVendors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import VendorCard from '../components/VendorCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CurrencySelector from '../components/ui/CurrencySelector';
import HelpCenter from '../components/HelpCenter';

const ClientDashboard: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const { vendors, loading } = useVendors();
  const [savedVendors, setSavedVendors] = useState<string[]>(['1', '2']); // Mock saved vendors
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSaveVendor = (vendorId: string) => {
    setSavedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleCurrencyChange = async (currency: 'USD' | 'NGN') => {
    if (profile) {
      try {
        await updateProfile({ currency });
      } catch (error) {
        console.error('Failed to update currency preference:', error);
      }
    }
  };

  const dashboardStats = [
    { label: 'Saved Vendors', value: savedVendors.length, icon: Heart, color: 'text-red-600' },
    { label: 'Events Planned', value: 3, icon: Calendar, color: 'text-indigo-600' },
    { label: 'Reviews Given', value: 8, icon: Star, color: 'text-yellow-600' },
    { label: 'Profile Views', value: 124, icon: Eye, color: 'text-emerald-600' },
  ];

  const recentActivity = [
    { action: 'Saved', vendor: 'Golden Gate Catering', time: '2 hours ago' },
    { action: 'Reviewed', vendor: 'Luminous Photography', time: '1 day ago' },
    { action: 'Contacted', vendor: 'The Grand Ballroom', time: '3 days ago' },
    { action: 'Saved', vendor: 'Bloom & Blossom Florals', time: '1 week ago' },
  ];

  const upcomingEvents = [
    { name: 'Sarah & John Wedding', date: '2024-03-15', status: 'Planning' },
    { name: 'Tech Corp Annual Gala', date: '2024-04-22', status: 'Confirmed' },
    { name: 'Spring Fundraiser', date: '2024-05-10', status: 'Draft' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

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
                  Here's what's happening with your event planning
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
          </div>

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
              {/* Quick Search */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Search className="h-5 w-5 mr-2 text-indigo-600" />
                    Find Vendors
                  </h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search for vendors, services, or locations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <Link to="/vendors">
                    <Button className="w-full sm:w-auto">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Saved Vendors */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Saved Vendors ({savedVendors.length})
                  </h2>
                  <Link to="/vendors">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Find More
                    </Button>
                  </Link>
                </div>

                {savedVendors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vendors
                      .filter(vendor => savedVendors.includes(vendor.id))
                      .slice(0, 4)
                      .map(vendor => (
                        <VendorCard
                          key={vendor.id}
                          vendor={vendor}
                          onSave={handleSaveVendor}
                          isSaved={true}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No saved vendors yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start exploring our vendor directory to find the perfect partners for your events.
                    </p>
                    <Link to="/vendors">
                      <Button>Browse Vendors</Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Upcoming Events */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    Upcoming Events
                  </h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${event.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            event.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {event.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>{' '}
                          {activity.vendor}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/vendors">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Vendors
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Manage Preferences
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
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                  💡 Pro Tip
                </h3>
                <p className="text-sm text-indigo-700">
                  Save vendors to your favorites as you browse to easily compare them later. 
                  You can also add notes to remember what you liked about each one!
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

export default ClientDashboard;