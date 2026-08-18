import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vendor, SearchFilters } from '../lib/types';
import { supabase } from '../lib/supabase';
import { getCategoryLabel } from '../lib/utils';

export const useVendors = (filters?: SearchFilters, searchQuery?: string) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch vendor profiles with basic profile information
      const { data: vendorProfiles, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles!vendor_profiles_user_id_fkey (
            id,
            name,
            email,
            phone,
            profile_image,
            currency
          )
        `);

      if (vendorError) {
        console.error('Error loading vendor profiles:', vendorError);
        throw vendorError;
      }

      // Fetch vendor subscriptions separately
      const vendorIds = vendorProfiles?.map(vp => vp.user_id).filter(Boolean) || [];
      let subscriptionsData: any[] = [];
      
      if (vendorIds.length > 0) {
        const { data: subscriptions, error: subscriptionsError } = await supabase
          .from('vendor_subscriptions')
          .select('*')
          .in('vendor_id', vendorIds);

        if (subscriptionsError) {
          console.warn('Error loading subscriptions:', subscriptionsError);
        } else {
          subscriptionsData = subscriptions || [];
        }
      }

      // Transform the data to match our Vendor interface
      const transformedVendors: Vendor[] = (vendorProfiles || [])
        .filter(vp => vp.profiles) // Only include vendors with valid profiles
        .map(vp => {
          // Get active subscription for this vendor
          const vendorSubscriptions = subscriptionsData.filter(
            sub => sub.vendor_id === vp.user_id
          );
          
          const activeSubscription = vendorSubscriptions.find(
            sub => sub.status === 'active' && new Date(sub.end_date) > new Date()
          );

          return {
            id: vp.user_id,
            name: vp.business_name || vp.profiles.name || 'Unnamed Business',
            category: vp.category || 'planning',
            description: vp.description || 'No description provided',
            services: vp.services || [],
            location: {
              city: vp.location?.city || 'Unknown',
              state: vp.location?.state || 'Unknown',
              address: vp.location?.address || undefined,
            },
            contact: {
              email: vp.profiles.email,
              phone: vp.profiles.phone || '',
              website: undefined,
            },
            pricing: {
              min: vp.pricing?.min || 0,
              max: vp.pricing?.max || 0,
              currency: vp.profiles.currency || 'USD', // Use vendor's preferred currency
              unit: vp.pricing?.unit || 'per event',
            },
            rating: 4.5 + Math.random() * 0.5, // Mock rating for now
            reviewCount: Math.floor(Math.random() * 200) + 10, // Mock review count
            images: vp.profile_image ? [vp.profile_image] : [
              'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            featured: !!activeSubscription, // Featured if has active subscription
            verified: vp.verified || false,
            availability: vp.availability ?? true,
            createdAt: new Date(vp.created_at),
            subscription: activeSubscription || undefined,
          };
        })
        // Sort by subscription status (premium vendors first)
        .sort((a, b) => {
          // Premium vendors with active subscriptions first
          if (a.subscription && !b.subscription) return -1;
          if (!a.subscription && b.subscription) return 1;
          
          // Then by subscription plan type (enterprise > premium > basic)
          if (a.subscription && b.subscription) {
            const planOrder = { enterprise: 3, premium: 2, basic: 1 };
            const aOrder = planOrder[a.subscription.plan_type as keyof typeof planOrder] || 0;
            const bOrder = planOrder[b.subscription.plan_type as keyof typeof planOrder] || 0;
            if (aOrder !== bOrder) return bOrder - aOrder;
          }
          
          // Finally by rating
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

    // Apply search query
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

    // Apply filters
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
      // Fetch specific vendor profile with basic profile information
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles!vendor_profiles_user_id_fkey (
            id,
            name,
            email,
            phone,
            profile_image,
            currency
          )
        `)
        .eq('user_id', id)
        .maybeSingle();

      if (vendorError) {
        throw vendorError;
      }

      if (!vendorProfile || !vendorProfile.profiles) {
        setError('Vendor not found');
        return;
      }

      // Fetch vendor subscriptions separately
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('vendor_subscriptions')
        .select('*')
        .eq('vendor_id', id);

      if (subscriptionsError) {
        console.warn('Error loading subscriptions:', subscriptionsError);
      }

      // Get active subscription
      const activeSubscription = subscriptions?.find(
        sub => sub.status === 'active' && new Date(sub.end_date) > new Date()
      );

      // Transform the data to match our Vendor interface
      const transformedVendor: Vendor = {
        id: vendorProfile.user_id,
        name: vendorProfile.business_name || vendorProfile.profiles.name || 'Unnamed Business',
        category: vendorProfile.category || 'planning',
        description: vendorProfile.description || 'No description provided',
        services: vendorProfile.services || [],
        location: {
          city: vendorProfile.location?.city || 'Unknown',
          state: vendorProfile.location?.state || 'Unknown',
          address: vendorProfile.location?.address || undefined,
        },
        contact: {
          email: vendorProfile.profiles.email,
          phone: vendorProfile.profiles.phone || '',
          website: undefined,
        },
        pricing: {
          min: vendorProfile.pricing?.min || 0,
          max: vendorProfile.pricing?.max || 0,
          currency: vendorProfile.profiles.currency || 'USD', // Use vendor's preferred currency
          unit: vendorProfile.pricing?.unit || 'per event',
        },
        rating: 4.5 + Math.random() * 0.5, // Mock rating for now
        reviewCount: Math.floor(Math.random() * 200) + 10, // Mock review count
        images: vendorProfile.profile_image ? [vendorProfile.profile_image] : [
          'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        featured: !!activeSubscription, // Featured if has active subscription
        verified: vendorProfile.verified || false,
        availability: vendorProfile.availability ?? true,
        createdAt: new Date(vendorProfile.created_at),
        subscription: activeSubscription || undefined,
      };

      setVendor(transformedVendor);
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