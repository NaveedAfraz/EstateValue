import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PropertyCard } from '../components/PropertyCard';
import type { Property } from '../components/PropertyCard';

const featuredProperties: Property[] = [
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
  }
];

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/listings');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden flex items-center min-h-[600px]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: 'url("/hero_premium.png")' }}
        />
        <div className="absolute inset-0 -z-10 bg-slate-900/60" /> {/* Dark overlay for readability */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
              Find Your Dream Home <br />
              <span className="text-blue-400">at the Right Price</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-12 drop-shadow-md">
              The only premium real estate platform that utilizes advanced AI to predict true property values.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-3 rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 relative z-10 group transition-all duration-300 hover:bg-white/20">
              <div className="flex-grow">
                <Input 
                  placeholder="Search by location (e.g. Whitefield, Indiranagar)..." 
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none focus:ring-0 shadow-none text-lg py-5 bg-white/90 text-slate-900 placeholder:text-slate-500 rounded-2xl"
                />
              </div>
              <Button size="lg" type="submit" className="md:w-56 text-lg font-bold rounded-2xl shadow-lg">
                Search Properties
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Price Predictions</h3>
              <p className="text-slate-500">Our advanced ML models analyze thousands of data points to give you accurate estimates.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fair Value Insights</h3>
              <p className="text-slate-500">Know instantly if a property is overpriced or a hidden gem with our fair value analyzer.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-time Data</h3>
              <p className="text-slate-500">Get the latest market listings and price changes as they happen, direct from our database.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Properties</h2>
              <p className="text-slate-500 text-lg">Handpicked listings with the best value potential.</p>
            </div>
            <Button variant="outline">View All Properties</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
