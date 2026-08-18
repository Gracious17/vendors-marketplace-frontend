import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Users, Building2, BarChart3, Settings, 
  Search, Filter, MoreVertical, Shield, Crown, 
  Eye, Edit, Trash2, CheckCircle, XCircle,
  TrendingUp, DollarSign, Calendar, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { profilesTable, vendorProfilesTable, vendorSubscriptionsTable } from '../lib/localDb';
import { formatCurrency, formatDate } from '../lib/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalClients: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'vendor';
  is_admin: boolean;
  created_at: string;
  phone?: string;
  profile_image?: string;
}

interface VendorData {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  verified: boolean;
  availability: boolean;
  created_at: string;
  subscription?: {
    plan_type: string;
    status: string;
    end_date: string;
  };
  profile: {
    name: string;
    email: string;
  };
}

const AdminDashboard: React.FC = () => {
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'vendors' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalClients: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'vendor' | 'admin'>('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchVendors(),
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const profiles = profilesTable.getAll();
      const subscriptions = vendorSubscriptionsTable.find(s => s.status === 'active');

      const totalUsers = profiles.length;
      const totalVendors = profiles.filter(p => p.role === 'vendor').length;
      const totalClients = profiles.filter(p => p.role === 'client').length;
      const activeSubscriptions = subscriptions.length;

      // Calculate monthly growth (mock calculation)
      const currentMonth = new Date().getMonth();
      const currentMonthUsers = profiles.filter(p =>
        new Date(p.created_at).getMonth() === currentMonth
      ).length;
      const monthlyGrowth = totalUsers > 0 ? (currentMonthUsers / totalUsers) * 100 : 0;

      setStats({
        totalUsers,
        totalVendors,
        totalClients,
        activeSubscriptions,
        totalRevenue: activeSubscriptions * 5000, // Mock revenue calculation
        monthlyGrowth,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = profilesTable
        .getAll()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const data = vendorProfilesTable
        .getAll()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const vendorsWithSubscriptions = data.map(vendor => {
        const ownerProfile = profilesTable.findOne(p => p.id === vendor.user_id);
        const subscription = vendorSubscriptionsTable.findOne(
          s => s.vendor_id === vendor.user_id && s.status === 'active'
        );

        return {
          ...vendor,
          profile: ownerProfile ? { name: ownerProfile.name, email: ownerProfile.email } : { name: '', email: '' },
          subscription: subscription
            ? { plan_type: subscription.plan_type, status: subscription.status, end_date: subscription.end_date }
            : null,
        };
      });

      setVendors(vendorsWithSubscriptions);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const toggleUserAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      profilesTable.update(userId, { is_admin: !currentStatus });
      await fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const toggleVendorVerification = async (vendorId: string, currentStatus: boolean) => {
    try {
      vendorProfilesTable.update(vendorId, { verified: !currentStatus });
      await fetchVendors();
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || 
                         (filterRole === 'admin' && user.is_admin) ||
                         (filterRole !== 'admin' && user.role === filterRole);
    
    return matchesSearch && matchesFilter;
  });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.profile?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.profile?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={profile?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client'}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-indigo-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage users, vendors, and system settings</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={fetchAdminData}>
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'vendors', label: 'Vendors', icon: Building2 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-emerald-100">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Vendors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalVendors}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalRevenue, 'NGN')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(user.created_at))}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vendors</h3>
                <div className="space-y-3">
                  {vendors.slice(0, 5).map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {vendor.business_name || vendor.profile?.name}
                          </p>
                          <p className="text-xs text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {vendor.verified && (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                        {vendor.subscription && (
                          <Crown className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="vendor">Vendors</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Users Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`
                              px-2 py-1 text-xs font-medium rounded-full
                              ${user.role === 'vendor' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}
                            `}>
                              {user.role}
                            </span>
                            {user.is_admin && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(new Date(user.created_at))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserAdminStatus(user.id, user.is_admin)}
                            >
                              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="Search vendors by business name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Vendors Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {vendor.business_name || vendor.profile?.name}
                              </div>
                              <div className="text-sm text-gray-500">{vendor.profile?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {vendor.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vendor.subscription ? (
                            <div className="flex items-center">
                              <Crown className="h-4 w-4 text-purple-500 mr-1" />
                              <span className="text-sm font-medium text-purple-600">
                                {vendor.subscription.plan_type}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Free</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {vendor.verified ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                            {vendor.availability ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Available
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVendorVerification(vendor.id, vendor.verified)}
                            >
                              {vendor.verified ? 'Unverify' : 'Verify'}
                            </Button>
                            <Link to={`/vendor-preview/${vendor.user_id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">User Registration</h4>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Vendor Verification</h4>
                    <p className="text-sm text-gray-500">Require admin approval for new vendors</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Send system notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Growth Rate</h4>
                  <p className="text-2xl font-bold text-emerald-600">+{stats.monthlyGrowth.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Conversion Rate</h4>
                  <p className="text-2xl font-bold text-blue-600">12.5%</p>
                  <p className="text-sm text-gray-500">Visitors to users</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;