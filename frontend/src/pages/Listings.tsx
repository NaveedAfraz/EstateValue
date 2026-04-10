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
  const [priceRange, setPriceRange] = useState('Any');
  const [filterBedrooms, setFilterBedrooms] = useState('Any');

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

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const price = parseFloat(p.actual_price as any) || 0;
    let matchesPrice = true;
    if (priceRange === '0-50') matchesPrice = price <= 50;
    else if (priceRange === '50-100') matchesPrice = price > 50 && price <= 100;
    else if (priceRange === '100+') matchesPrice = price > 100;

    let matchesBHK = true;
    if (filterBedrooms !== 'Any') {
      const required = parseInt(filterBedrooms);
      matchesBHK = filterBedrooms.includes('+') ? p.bedrooms >= required : p.bedrooms === required;
    }

    return matchesSearch && matchesPrice && matchesBHK;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (parseFloat(a.actual_price as any) || 0) - (parseFloat(b.actual_price as any) || 0);
    if (sortBy === 'price-high') return (parseFloat(b.actual_price as any) || 0) - (parseFloat(a.actual_price as any) || 0);
    return 0; // Default newest (DB order)
  });

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
                  <select 
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full rounded-xl border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Any">Any Price</option>
                    <option value="0-50">Under ₹50L</option>
                    <option value="50-100">₹50L - ₹1Cr</option>
                    <option value="100+">Above ₹1Cr</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['Any', '1', '2', '3', '4+'].map(num => (
                      <button 
                        key={num} 
                        onClick={() => setFilterBedrooms(num)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          filterBedrooms === num ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <Button fullWidth variant="secondary" onClick={() => { setPriceRange('Any'); setFilterBedrooms('Any'); setSearchTerm(''); }}>Reset Filters</Button>
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
