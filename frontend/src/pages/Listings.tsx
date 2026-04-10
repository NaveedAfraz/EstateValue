import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PropertyCard } from '../components/PropertyCard';
import type { Property } from '../components/PropertyCard';
import { propertyService } from '../services/api';

export const Listings: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await propertyService.getAll();
      const mappedData = response.data.map((p: any) => ({
        ...p,
        is_fair_price: p.status === 'fair'
      }));
      setProperties(mappedData);
    } catch (err: any) {
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Property Listings</h1>
            <p className="text-slate-500 text-lg">Browse through available properties and insights.</p>
          </div>
          <div className="w-full md:w-96 flex gap-2">
            <Input
              placeholder="Search listings..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 font-bold text-slate-900">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Price Range</label>
                  <select className="w-full rounded-xl border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Any Price</option>
                    <option>$0 - $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M+</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Bedrooms</label>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4+'].map(num => (
                      <button key={num} className="flex-grow py-2 rounded-lg border border-slate-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <Button fullWidth variant="secondary" onClick={fetchProperties}>Reset Filters</Button>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-slate-500 font-medium">
                {loading ? 'Searching...' : `Showing ${filteredProperties.length} properties`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading the latest listings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-8 rounded-3xl text-center border border-red-100">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProperties}>Try Again</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && filteredProperties.length === 0 && !error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Search className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">No listings match your current search or filters. Try adjusting your criteria.</p>
                </div>
                <Button variant="ghost" className="mt-2" onClick={() => setSearchTerm('')}>Clear all filters</Button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
