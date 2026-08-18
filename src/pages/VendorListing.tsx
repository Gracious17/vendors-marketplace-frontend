import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import { SearchFilters } from '../lib/types';
import { debounce } from '../lib/utils';
import SearchBar from '../components/ui/SearchBar';
import VendorGrid from '../components/VendorGrid';
import FilterSidebar from '../components/FilterSidebar';

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Reviews', value: 'reviews' },
];

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

  const clearFilter = (filterKey: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="min-h-screen bg-paper font-display">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-[40px] font-normal tracking-heading text-carbon mb-6">
            Find your perfect vendors
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
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden inline-flex items-center px-4 py-2 rounded-lg border border-mist text-carbon font-medium hover:bg-mist/30 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-carbon text-paper text-xs rounded-full px-2 py-0.5">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-fog rounded-xl text-carbon focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
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
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-graphite">
              {loading ? 'Loading...' : `Showing ${filteredCount} of ${totalCount} vendors`}
              {searchQuery && !loading && (
                <span> for &ldquo;{searchQuery}&rdquo;</span>
              )}
            </p>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filters.category && (
                  <span className="px-3 py-1 border border-fiverr-green text-fiverr-green rounded-full text-sm flex items-center">
                    {filters.category}
                    <button
                      onClick={() => clearFilter('category')}
                      className="ml-2 hover:text-forest-stage"
                      aria-label="Remove category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 border border-fiverr-green text-fiverr-green rounded-full text-sm flex items-center">
                    {filters.location}
                    <button
                      onClick={() => clearFilter('location')}
                      className="ml-2 hover:text-forest-stage"
                      aria-label="Remove location filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 border border-fiverr-green text-fiverr-green rounded-full text-sm flex items-center">
                    {filters.rating}+ stars
                    <button
                      onClick={() => clearFilter('rating')}
                      className="ml-2 hover:text-forest-stage"
                      aria-label="Remove rating filter"
                    >
                      <X className="h-3 w-3" />
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
          <div className="hidden lg:block w-80 shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={true}
              onClose={() => {}}
              resultCount={filteredCount}
            />
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              resultCount={filteredCount}
            />
          </div>

          {/* Vendor Grid */}
          <div className="flex-1 min-w-0">
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
                <button className="px-8 py-3 rounded-lg border border-mist text-carbon font-medium hover:bg-mist/30 transition-colors">
                  Load More Vendors
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorListing;
