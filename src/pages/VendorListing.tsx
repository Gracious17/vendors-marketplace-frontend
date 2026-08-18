import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import { SearchFilters } from '../lib/types';
import { debounce } from '../lib/utils';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';
import VendorGrid from '../components/VendorGrid';
import FilterSidebar from '../components/FilterSidebar';

const VendorListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedVendors, setSavedVendors] = useState<string[]>(['1', '2']); // Mock saved vendors
  const [sortBy, setSortBy] = useState('relevance');

  const { vendors, loading, error, filteredCount, totalCount } = useVendors(filters, searchQuery);

  // Debounced search to avoid too many requests
  const debouncedSearch = debounce((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  // Initialize search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const handleSaveVendor = (vendorId: string) => {
    setSavedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Reviews', value: 'reviews' },
  ];

  const clearFilter = (filterKey: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Vendors
          </h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search vendors by name, service, or location..."
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                    {Object.keys(filters).length}
                  </span>
                )}
              </Button>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing ${filteredCount} of ${totalCount} vendors`}
              {searchQuery && !loading && (
                <span> for "{searchQuery}"</span>
              )}
            </p>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filters.category && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                    {filters.category}
                    <button
                      onClick={() => clearFilter('category')}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                      aria-label="Remove category filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                    {filters.location}
                    <button
                      onClick={() => clearFilter('location')}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                      aria-label="Remove location filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                    {filters.rating}+ stars
                    <button
                      onClick={() => clearFilter('rating')}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                      aria-label="Remove rating filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={true}
              onClose={() => {}}
              resultCount={filteredCount}
            />
          </div>

          {/* Mobile Sidebar */}
          {/* <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            resultCount={filteredCount}
          /> */}

          {/* Vendor Grid */}
          <div className="flex-1">
            <VendorGrid
              vendors={vendors}
              loading={loading}
              error={error}
              onSaveVendor={handleSaveVendor}
              savedVendors={savedVendors}
            />

            {/* Load More Button */}
            {!loading && !error && vendors.length > 0 && vendors.length < totalCount && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Vendors
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorListing;