import React from 'react';
import { Vendor } from '../lib/types';
import VendorCard from './VendorCard';
import LoadingSpinner from './ui/LoadingSpinner';

interface VendorGridProps {
  vendors: Vendor[];
  loading?: boolean;
  error?: string | null;
  onSaveVendor?: (vendorId: string) => void;
  savedVendors?: string[];
}

const VendorGrid: React.FC<VendorGridProps> = ({
  vendors,
  loading = false,
  error = null,
  onSaveVendor,
  savedVendors = [],
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading vendors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading vendors</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onSave={onSaveVendor}
          isSaved={savedVendors.includes(vendor.id)}
        />
      ))}
    </div>
  );
};

export default VendorGrid;