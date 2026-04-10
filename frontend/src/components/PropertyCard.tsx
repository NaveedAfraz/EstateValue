import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import { Badge } from './Badge';

export interface Property {
  id: number;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  actual_price: number | null;
  predicted_price?: number;
  image_url?: string;
  is_fair_price?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const displayPrice = property.actual_price || property.predicted_price || 0;
  
  // Basic fallback image if none provided
  const imageUrl = property.image_url || `https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800`;

  return (
    <Link to={`/property/${property.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-100 flex flex-col h-full relative cursor-pointer top-0 hover:-top-1">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {property.predicted_price && property.actual_price && (
            property.is_fair_price ? (
               <Badge variant="success" className="shadow-sm backdrop-blur-md bg-emerald-100/90 text-emerald-900 border border-emerald-200">Fair Price</Badge>
            ) : (
               <Badge variant="warning" className="shadow-sm backdrop-blur-md bg-orange-100/90 text-orange-900 border border-orange-200">Overpriced</Badge>
            )
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img 
            src={imageUrl} 
            alt={property.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-4 mb-2">
             <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{property.title}</h3>
             <div className="font-extrabold text-blue-600 text-lg whitespace-nowrap">
               ₹{displayPrice}L
             </div>
          </div>
          
          <div className="flex items-center text-slate-500 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1 shrink-0 text-slate-400" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600 text-sm" title="Bedrooms">
              <BedDouble className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm" title="Bathrooms">
              <Bath className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm" title="Square Feet">
              <Square className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.square_feet}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
