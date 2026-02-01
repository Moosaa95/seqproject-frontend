'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import ImageWithLoader from '@/components/ImageWithLoader';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'rent' | 'sale'>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Prepare filters for API
  const queryParams = {
    ...(filterStatus !== 'all' && { status: filterStatus }),
    ...(filterType !== 'all' && { type: filterType }),
    ...(searchTerm && { search: searchTerm }),
  };

  const { data: propertiesData, isLoading: loading, error } = useGetPropertiesQuery(queryParams);
  const properties = propertiesData?.results || [];

  const propertyTypes = useMemo(() => {
    return ['all', ...new Set(properties.map((p: any) => p.type))];
  }, [properties]);

  const filteredProperties = properties;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[35vh] sm:min-h-[40vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithLoader
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
            alt="Properties"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Our Properties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 px-4"
          >
            Find your perfect space from our curated collection
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${filterStatus === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('rent')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${filterStatus === 'rent'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                For Rent
              </button>
              <button
                onClick={() => setFilterStatus('sale')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${filterStatus === 'sale'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                For Sale
              </button>
            </div>

            {/* Type Filter */}
            <div className="relative w-full md:w-auto">
              <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600 text-sm sm:text-base">
            Showing <span className="font-semibold text-emerald-600">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'property' : 'properties'}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <p className="text-xl sm:text-2xl text-red-600 mb-4">
                {'data' in (error as any) ? (error as any).data.detail || 'Failed to load properties' : 'Failed to load properties'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 sm:mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <p className="text-xl sm:text-2xl text-gray-600 mb-4">No properties found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
                className="mt-4 sm:mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
