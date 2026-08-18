import { useState, useEffect, useCallback } from 'react';
import { vendorProfilesTable, vendorStatsTable, vendorInquiriesTable, vendorBookingsTable } from '../lib/localDb';
import { useAuthStore } from '../stores/authStore';

interface DashboardStats {
  profileViews: number;
  inquiries: number;
  bookings: number;
  revenue: string;
}

interface RecentInquiry {
  id: string;
  client: string;
  event: string;
  date: string;
  status: 'New' | 'Responded' | 'Booked';
  created_at: string;
}

interface UpcomingBooking {
  id: string;
  client: string;
  event: string;
  date: string;
  amount: string;
  status: string;
}

interface VendorProfile {
  id: string;
  business_name?: string;
  category?: string;
  description?: string;
  services?: string[];
  location?: {
    city: string;
    state: string;
  };
  pricing?: {
    min: number;
    max: number;
    unit: string;
  };
  profile_image?: string;
  verified: boolean;
  availability: boolean;
}

export const useVendorDashboard = () => {
  const { user, profile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    inquiries: 0,
    bookings: 0,
    revenue: '$0',
  });
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id || !profile || profile.role !== 'vendor') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData = vendorProfilesTable.findOne(vp => vp.user_id === user.id);
      if (profileData) {
        setVendorProfile(profileData);
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      let statsData = vendorStatsTable.findOne(
        s => s.vendor_id === user.id && s.month_year === currentMonth
      );

      if (!statsData) {
        statsData = vendorStatsTable.insert({
          vendor_id: user.id,
          month_year: currentMonth,
          profile_views: 0,
          inquiries: 0,
          bookings: 0,
          revenue: 0,
        });
      }

      setStats({
        profileViews: statsData.profile_views || 0,
        inquiries: statsData.inquiries || 0,
        bookings: statsData.bookings || 0,
        revenue: `$${(statsData.revenue || 0).toLocaleString()}`,
      });

      const inquiriesData = vendorInquiriesTable
        .find(inquiry => inquiry.vendor_id === user.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setRecentInquiries(inquiriesData.map(inquiry => ({
        id: inquiry.id,
        client: inquiry.client_name || 'Unknown Client',
        event: inquiry.event_type || 'Event',
        date: inquiry.event_date ? new Date(inquiry.event_date).toLocaleDateString() : new Date(inquiry.created_at).toLocaleDateString(),
        status: inquiry.status || 'New',
        created_at: inquiry.created_at,
      })));

      const today = new Date().toISOString().split('T')[0];
      const bookingsData = vendorBookingsTable
        .find(booking => booking.vendor_id === user.id && booking.event_date >= today)
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 5);

      setUpcomingBookings(bookingsData.map(booking => ({
        id: booking.id,
        client: booking.client_name || 'Unknown Client',
        event: booking.event_type || 'Event',
        date: new Date(booking.event_date).toLocaleDateString(),
        amount: `$${(booking.amount || 0).toLocaleString()}`,
        status: booking.status || 'Confirmed',
      })));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateProfileCompletion = useCallback(() => {
    if (!vendorProfile) {
      const baseFields = [
        profile?.name,
        profile?.email,
        profile?.phone,
      ].filter(field => field && field.trim() !== '').length;

      return Math.round((baseFields / 8) * 100); // 8 total possible fields including vendor-specific ones
    }

    const fields = [
      profile?.name,
      profile?.email,
      profile?.phone,
      vendorProfile.business_name,
      vendorProfile.category,
      vendorProfile.description,
      vendorProfile.services?.length,
      vendorProfile.location?.city,
    ];

    const completedFields = fields.filter(field =>
      field !== null && field !== undefined && field !== '' && field !== 0
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  }, [vendorProfile, profile]);

  return {
    stats,
    recentInquiries,
    upcomingBookings,
    vendorProfile,
    profileCompletion: calculateProfileCompletion(),
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
