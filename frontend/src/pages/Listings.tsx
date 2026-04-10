import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PropertyCard } from '../components/PropertyCard';
import type { Property } from '../components/PropertyCard';

const allProperties: Property[] = [
  {
    id: 1,
    title: "Modern Villa with Pool",
    location: "Beverly Hills, CA",
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2500,
    actual_price: 1250000,
    predicted_price: 1200000,
    is_fair_price: true,
  },
  {
    id: 2,
    title: "Luxury Penthouse",
    location: "Manhattan, NY",
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1800,
    actual_price: 2500000,
    predicted_price: 2600000,
    is_fair_price: true,
  },
  {
    id: 3,
    title: "Cozy Suburban Home",
    location: "Austin, TX",
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2100,
    actual_price: 550000,
    predicted_price: 500000,
    is_fair_price: false,
  },
  {
    id: 4,
    title: "Beachfront Condo",
    location: "Miami, FL",
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    actual_price: 850000,
    predicted_price: 870000,
    is_fair_price: true,
  },
  {
    id: 5,
    title: "Rustic Mountain Cabin",
    location: "Aspen, CO",
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 1000,
    actual_price: 750000,
    predicted_price: 600000,
    is_fair_price: false,
  },
  {
    id: 6,
    title: "Downtown Studio",
    location: "Chicago, IL",
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 700,
    actual_price: 350000,
    predicted_price: 340000,
    is_fair_price: true,
  }
];

export const Listings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Simple filtering logic
  const filteredProperties = allProperties.filter(p => 
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
          {/* Filters Sidebar (Mock) */}
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

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Property Status</label>
                  <div className="space-y-2">
                    {['Fair Price', 'Overpriced'].map(status => (
                      <label key={status} className="flex items-center text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 mr-2" />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                <Button fullWidth variant="secondary">Apply Filters</Button>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-slate-500 font-medium">Showing {filteredProperties.length} properties</span>
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
            
            {filteredProperties.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 text-lg">No properties match your search criteria.</p>
                <Button variant="ghost" className="mt-4" onClick={() => setSearchTerm('')}>Clear Search</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
