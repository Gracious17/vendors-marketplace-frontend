import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Badge, Phone, Heart } from 'lucide-react';
import { Vendor } from '../lib/types';
import { formatCurrency, getCategoryLabel } from '../lib/utils';
import Card from './ui/Card';

interface VendorCardProps {
  vendor: Vendor;
  onSave?: (vendorId: string) => void;
  isSaved?: boolean;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onSave,
  isSaved = false,
}) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(vendor.id);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card hover className="group overflow-hidden">
      <div className="relative">
        <img
          src={vendor.images[0]}
          alt={vendor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {vendor.featured && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
          {vendor.verified && (
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center">
              <Badge className="h-3 w-3 mr-1" />
              Verified
            </span>
          )}
        </div>
        {onSave && (
          <button
            onClick={handleSaveClick}
            className={`
              absolute top-3 right-3 p-2 rounded-full transition-colors
              ${isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }
            `}
            aria-label={isSaved ? 'Remove from saved' : 'Save vendor'}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {vendor.name}
            </h3>
            <p className="text-sm text-indigo-600 font-medium">
              {getCategoryLabel(vendor.category)}
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {vendor.rating}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              ({vendor.reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {vendor.location.city}, {vendor.location.state}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {vendor.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(vendor.pricing.min || 0, vendor.pricing.currency)} - {formatCurrency(vendor.pricing.max || 0, vendor.pricing.currency)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {vendor.pricing.unit || 'per event'}
            </span>
          </div>
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${vendor.availability 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {vendor.availability ? 'Available' : 'Booked'}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/vendor/${vendor.id}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
          <a
            href={`tel:${vendor.contact.phone}`}
            onClick={handlePhoneClick}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Phone className="h-4 w-4 mr-1" />
            <span className="text-sm">Call</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

export default VendorCard;