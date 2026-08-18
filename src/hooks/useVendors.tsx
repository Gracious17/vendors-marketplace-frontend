import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vendor, SearchFilters } from '../lib/types';
import { profilesTable, vendorProfilesTable, vendorSubscriptionsTable, VendorProfile, Profile, VendorSubscription } from '../lib/localDb';
import { getCategoryLabel } from '../lib/utils';

const planOrder = { enterprise: 3, premium: 2, basic: 1 } as const;

function toVendor(vp: VendorProfile, ownerProfile: Profile, subscription?: VendorSubscription): Vendor {
  return {
    id: vp.user_id,
    name: vp.business_name || ownerProfile.name || 'Unnamed Business',
    category: (vp.category || 'planning') as Vendor['category'],
    description: vp.description || 'No description provided',
    services: vp.services || [],
    location: {
      city: vp.location?.city || 'Unknown',
      state: vp.location?.state || 'Unknown',
      address: vp.location?.address || undefined,
    },
    contact: {
      email: ownerProfile.email,
      phone: ownerProfile.phone || '',
      website: undefined,
    },
    pricing: {
      min: vp.pricing?.min || 0,
      max: vp.pricing?.max || 0,
      currency: ownerProfile.currency || 'USD',
      unit: vp.pricing?.unit || 'per event',
    },
    rating: 4.5 + Math.random() * 0.5, // Mock rating for now
    reviewCount: Math.floor(Math.random() * 200) + 10, // Mock review count
    images: vp.profile_image ? [vp.profile_image] : [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: !!subscription,
    verified: vp.verified || false,
    availability: vp.availability ?? true,
    createdAt: new Date(vp.created_at),
    subscription: subscription
      ? { ...subscription }
      : undefined,
  };
}

function getActiveSubscription(vendorId: string): VendorSubscription | undefined {
  return vendorSubscriptionsTable.find(
    sub => sub.vendor_id === vendorId && sub.status === 'active' && new Date(sub.end_date) > new Date()
  )[0];
}

export const useVendors = (filters?: SearchFilters, searchQuery?: string) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const vendorProfiles = vendorProfilesTable.getAll();

      const transformedVendors: Vendor[] = vendorProfiles
        .map(vp => {
          const ownerProfile = profilesTable.findOne(p => p.id === vp.user_id);
          if (!ownerProfile) return null;

          const activeSubscription = getActiveSubscription(vp.user_id);
          return toVendor(vp, ownerProfile, activeSubscription);
        })
        .filter((v): v is Vendor => v !== null)
        .sort((a, b) => {
          if (a.subscription && !b.subscription) return -1;
          if (!a.subscription && b.subscription) return 1;

          if (a.subscription && b.subscription) {
            const aOrder = planOrder[a.subscription.plan_type as keyof typeof planOrder] || 0;
            const bOrder = planOrder[b.subscription.plan_type as keyof typeof planOrder] || 0;
            if (aOrder !== bOrder) return bOrder - aOrder;
          }

          return b.rating - a.rating;
        });

      setVendors(transformedVendors);
    } catch (err) {
      console.error('Error loading vendors:', err);
      setError('Failed to load vendors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const filteredVendors = useMemo(() => {
    let filtered = vendors;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.description.toLowerCase().includes(query) ||
        vendor.services.some(service => service.toLowerCase().includes(query)) ||
        vendor.location.city.toLowerCase().includes(query) ||
        vendor.location.state.toLowerCase().includes(query) ||
        getCategoryLabel(vendor.category).toLowerCase().includes(query)
      );
    }

    if (filters) {
      if (filters.category) {
        filtered = filtered.filter(vendor => vendor.category === filters.category);
      }

      if (filters.location) {
        const location = filters.location.toLowerCase();
        filtered = filtered.filter(vendor =>
          vendor.location.city.toLowerCase().includes(location) ||
          vendor.location.state.toLowerCase().includes(location)
        );
      }

      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        filtered = filtered.filter(vendor =>
          vendor.pricing.min <= maxPrice && vendor.pricing.max >= minPrice
        );
      }

      if (filters.rating !== undefined) {
        filtered = filtered.filter(vendor => vendor.rating >= filters.rating!);
      }

      if (filters.availability !== undefined) {
        filtered = filtered.filter(vendor => vendor.availability === filters.availability);
      }
    }

    return filtered;
  }, [vendors, filters, searchQuery]);

  return {
    vendors: filteredVendors,
    loading,
    error,
    totalCount: vendors.length,
    filteredCount: filteredVendors.length,
    refetch: loadVendors,
  };
};

export const useVendor = (id: string) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendor = useCallback(async () => {
    if (!id) {
      setError('No vendor ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const vendorProfile = vendorProfilesTable.findOne(vp => vp.user_id === id);
      const ownerProfile = vendorProfile ? profilesTable.findOne(p => p.id === id) : undefined;

      if (!vendorProfile || !ownerProfile) {
        setError('Vendor not found');
        setVendor(null);
        return;
      }

      const activeSubscription = getActiveSubscription(id);
      setVendor(toVendor(vendorProfile, ownerProfile, activeSubscription));
    } catch (err) {
      setError('Failed to load vendor');
      console.error('Error loading vendor:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  return { vendor, loading, error, refetch: loadVendor };
};
