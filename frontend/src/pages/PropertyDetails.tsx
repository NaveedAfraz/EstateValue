import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, BedDouble, Bath, Square, ChevronLeft, 
  Share2, Heart, Calculator, Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const mockProperties = [
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
    description: "This stunning modern villa offers an unparalleled living experience. Featuring spacious rooms, a private olympic-sized pool, and breathtaking city views. The open-concept design allows for seamless indoor-outdoor living, perfect for entertainment and luxury lifestyle.",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];

export const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === Number(id)) || mockProperties[0];

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/listings" className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Listings
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button variant="outline" size="sm"><Heart className="h-4 w-4 mr-2" /> Save</Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 rounded-3xl overflow-hidden h-[500px]">
          <div className="md:col-span-2 h-full">
            <img src={property.images[0]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <img src={property.images[1]} alt="Interior" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            <img src={property.images[2]} alt="Interior" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
          </div>
          <div className="hidden md:block relative h-full">
             <img src="https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1200" alt="Kitchen" className="w-full h-full object-cover brightness-50" />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold text-xl">
               +12 Photos
             </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="info" className="px-3 py-1">Featured</Badge>
                <Badge variant="success" className="px-3 py-1">For Sale</Badge>
                {property.is_fair_price && <Badge variant="success" className="px-3 py-1">AI Verified: Fair Price</Badge>}
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{property.title}</h1>
              <div className="flex items-center text-slate-500 text-lg">
                <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                {property.location}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Bedrooms</span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                  <BedDouble className="h-6 w-6 text-blue-600" />
                  {property.bedrooms}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Bathrooms</span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                  <Bath className="h-6 w-6 text-blue-600" />
                  {property.bathrooms}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Total Area</span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                  <Square className="h-6 w-6 text-blue-600" />
                  {property.square_feet} sqft
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Status</span>
                <div className="font-bold text-emerald-600 text-xl flex items-center gap-2">
                  <Zap className="h-6 w-6" /> Ready
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Description</h2>
              <p className="text-slate-600 leading-relaxed text-lg italic bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
                "{property.description}"
              </p>
            </div>
          </div>

          {/* Pricing & Contact Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100"
            >
              <div className="mb-8">
                <span className="text-slate-500 text-sm block mb-1">Listed Price</span>
                <div className="text-4xl font-black text-slate-900">
                  {formatter.format(property.actual_price || 0)}
                </div>
              </div>

              {/* AI Prediction Box */}
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <Calculator className="h-5 w-5" />
                    AI Price Prediction
                  </div>
                  <Badge variant="info">Verified</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatter.format(property.predicted_price || 0)}
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-500/80">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Based on market trends, location data, and property features. Our model shows a high confidence score.</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button fullWidth size="lg">Contact Manager</Button>
                <Button fullWidth size="lg" variant="secondary">Request Tour</Button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-3">
                 <ShieldCheck className="h-5 w-5 text-slate-400" />
                 <span className="text-slate-400 text-sm">Secure transaction guaranteed</span>
              </div>
            </motion.div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">Mortgage Calculator</h3>
              <p className="text-slate-400 text-sm mb-6">Estimate your monthly payments for this property.</p>
              <Button fullWidth variant="outline" className="border-slate-700 text-white hover:bg-slate-800">Calculate Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
