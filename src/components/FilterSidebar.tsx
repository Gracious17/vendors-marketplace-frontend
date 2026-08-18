import React from 'react';
import { X, Filter } from 'lucide-react';
import { SearchFilters, VendorCategory } from '../lib/types';
import { getCategoryLabel } from '../lib/utils';
import Button from './ui/Button';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  resultCount?: number;
}

const categories: VendorCategory[] = [
  'catering',
  'photography', 
  'venues',
  'music',
  'flowers',
  'decor',
  'transportation',
  'planning',
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  resultCount,
}) => {
  const handleCategoryChange = (category: VendorCategory | undefined) => {
    onFiltersChange({ ...filters, category });
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location: location || undefined });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onFiltersChange({ ...filters, rating });
  };

  const handleAvailabilityChange = (availability: boolean | undefined) => {
    onFiltersChange({ ...filters, availability });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const sidebarClasses = `
    fixed top-16 bottom-0 left-0 z-40 w-80 bg-paper shadow-xl transform transition-transform duration-300 overflow-y-auto
    lg:relative lg:top-0 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-mist
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-graphite" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-carbon">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              {resultCount !== undefined && (
                <span className="text-sm text-smoke">
                  {resultCount} results
                </span>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-smoke hover:text-carbon"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full mb-6"
          >
            Clear All Filters
          </Button>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-carbon mb-3">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => handleCategoryChange(undefined)}
                  className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                />
                <span className="ml-3 text-sm text-graphite">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                  />
                  <span className="ml-3 text-sm text-graphite">
                    {getCategoryLabel(category)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-carbon mb-3">Location</h3>
            <input
              type="text"
              placeholder="City or State"
              value={filters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
            />
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-carbon mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) =>
                    handlePriceRangeChange(
                      parseInt(e.target.value) || 0,
                      filters.priceRange?.[1] || 10000
                    )
                  }
                  className="w-0 flex-1 min-w-0 px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
                />
                <span className="shrink-0 text-smoke">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) =>
                    handlePriceRangeChange(
                      filters.priceRange?.[0] || 0,
                      parseInt(e.target.value) || 10000
                    )
                  }
                  className="w-0 flex-1 min-w-0 px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-carbon mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <label key={rating} className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                  />
                  <span className="ml-3 text-sm text-graphite">
                    {rating}+ stars
                  </span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  checked={!filters.rating}
                  onChange={() => handleRatingChange(undefined)}
                  className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                />
                <span className="ml-3 text-sm text-graphite">Any rating</span>
              </label>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-carbon mb-3">Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === true}
                  onChange={() => handleAvailabilityChange(true)}
                  className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                />
                <span className="ml-3 text-sm text-graphite">Available only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === undefined}
                  onChange={() => handleAvailabilityChange(undefined)}
                  className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog"
                />
                <span className="ml-3 text-sm text-graphite">Show all</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;