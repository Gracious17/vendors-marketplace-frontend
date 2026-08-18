import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Badge, Phone, Heart, Crown } from 'lucide-react';
import { Vendor } from '../lib/types';
import { formatCurrency, getCategoryLabel } from '../lib/utils';

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
    <div className="group h-full flex flex-col bg-paper rounded-2xl border border-mist overflow-hidden hover:shadow-card transition-shadow">
      <div className="relative">
        <img
          src={vendor.images[0]}
          alt={vendor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 right-14 flex flex-wrap gap-2">
          {vendor.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-carbon text-paper text-xs font-medium rounded-full">
              <Crown className="h-3 w-3" />
              Featured
            </span>
          )}
          {vendor.verified && (
            <span className="px-2.5 py-1 bg-paper border border-fiverr-green text-fiverr-green text-xs font-medium rounded-full flex items-center">
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
                : 'bg-paper/90 text-graphite hover:bg-paper hover:text-red-500'
              }
            `}
            aria-label={isSaved ? 'Remove from saved' : 'Save vendor'}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <Star className="h-3.5 w-3.5 text-fiverr-green fill-current" />
            <span className="ml-1 text-xs font-medium text-carbon">
              {vendor.rating.toFixed(1)}
            </span>
            <span className="ml-1 text-xs text-smoke">
              ({vendor.reviewCount})
            </span>
          </div>
          <h3 className="text-base font-semibold text-carbon group-hover:text-fiverr-green transition-colors">
            {vendor.name}
          </h3>
          <p className="text-xs text-fiverr-green font-medium">
            {getCategoryLabel(vendor.category)}
          </p>
        </div>

        <div className="flex items-center text-xs text-graphite mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {vendor.location.city}, {vendor.location.state}
        </div>

        <p className="text-graphite text-sm mb-3 line-clamp-1">
          {vendor.description}
        </p>

        <div className="mb-4 mt-auto">
          <div className="flex items-baseline flex-wrap gap-x-1">
            <span className="text-base font-semibold text-carbon">
              {formatCurrency(vendor.pricing.min || 0, vendor.pricing.currency)} - {formatCurrency(vendor.pricing.max || 0, vendor.pricing.currency)}
            </span>
            <span className="text-xs text-smoke">
              {vendor.pricing.unit || 'per event'}
            </span>
          </div>
          <div className={`
            inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium
            ${vendor.availability
              ? 'bg-fiverr-green/10 text-fiverr-green'
              : 'bg-mist/60 text-graphite'
            }
          `}>
            {vendor.availability ? 'Available' : 'Booked'}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/vendor/${vendor.id}`}
            className="text-fiverr-green hover:text-forest-stage font-medium text-sm transition-colors"
          >
            View Details &rarr;
          </Link>
          <a
            href={`tel:${vendor.contact.phone}`}
            onClick={handlePhoneClick}
            className="flex items-center text-graphite hover:text-carbon transition-colors"
          >
            <Phone className="h-4 w-4 mr-1" />
            <span className="text-sm">Call</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
