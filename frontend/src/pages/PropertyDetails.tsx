import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, BedDouble, Bath, Square, ChevronLeft, 
  Share2, Heart, Calculator, Zap,
  Info,
  ShieldCheck,
  Loader2,
  Building2,
  Sparkles,
  X,
  Phone,
  User,
  Mail,
  Send
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '../components/Input';
import { propertyService, userService, contactService } from '../services/api';
import { toast } from 'react-hot-toast';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Inquiry Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<'contact' | 'tour'>('contact');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await propertyService.getById(id!);
      setProperty(response.data);
    } catch (err: any) {
      setError('Property details not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { icon: '🔗' });
  };

  const handleOpenInquiry = (type: 'contact' | 'tour') => {
    setInquiryType(type);
    setInquiryForm({
      ...inquiryForm,
      message: type === 'tour' 
        ? `I would like to schedule a tour for ${property.title}.` 
        : `I am interested in ${property.title}. Please provide more details.`
    });
    setIsInquiryModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      await contactService.send({
        ...inquiryForm,
        propertyId: Number(id)
      });
      toast.success('Your inquiry has been sent! We will contact you soon.', { duration: 5000 });
      setIsInquiryModalOpen(false);
      setInquiryForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again later.');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Fetching property insights...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-8">{error || 'Property not found'}</p>
          <Button as={Link} to="/listings" variant="primary" fullWidth shadow>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const isFairPrice = property.status === 'fair';
  const gallery = property.gallery ? (typeof property.gallery === 'string' ? JSON.parse(property.gallery) : property.gallery) : [];
  
  const getFullImageUrl = (url: string) => url.startsWith('/uploads') ? `${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'}${url}` : url;
  
  const displayImage = property.image_url ? getFullImageUrl(property.image_url) : '/placeholder_building.png';

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
            <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                  toast.error('Please sign in to save properties');
                  return;
                }
                try {
                  const res = await userService.toggleWishlist(Number(id));
                  toast.success(res.data.message);
                } catch (err) {
                  toast.error('Failed to update wishlist');
                }
              }}
            >
              <Heart className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`mb-12 rounded-3xl overflow-hidden h-[400px] md:h-[600px] bg-slate-100 border border-slate-100 shadow-inner grid gap-4 ${
          gallery.length > 1 ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1'
        }`}>
           <div className={`${gallery.length > 1 ? 'md:col-span-2' : ''} h-full`}>
             <img src={displayImage} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
           </div>
           
           {gallery.length > 1 && (
             <div className="hidden md:flex flex-col gap-4 h-full">
               {gallery.slice(1, 3).map((imgUrl: string, idx: number) => (
                 <img key={idx} src={getFullImageUrl(imgUrl)} alt="Interior" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
               ))}
               {gallery.length === 2 && (
                 <div className="w-full h-1/2 bg-slate-200 flex items-center justify-center text-slate-400">
                    <Building2 className="h-8 w-8" />
                 </div>
               )}
             </div>
           )}

           {gallery.length >= 4 && (
             <div className="hidden md:block relative h-full">
                <img src={getFullImageUrl(gallery[3])} alt="Exterior" className="w-full h-full object-cover brightness-50" />
                {gallery.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold text-xl">
                    +{gallery.length - 4} More
                  </div>
                )}
             </div>
           )}

           {gallery.length > 1 && gallery.length < 4 && (
             <div className="hidden md:block bg-slate-50 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-blue-100" />
             </div>
           )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="info" className="px-3 py-1">Featured</Badge>
                <Badge variant="success" className="px-3 py-1">For Sale</Badge>
                {isFairPrice && <Badge variant="success" className="px-3 py-1">AI Verified: Fair Price</Badge>}
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
                "{property.description || 'No description available for this property.'}"
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
                  ₹{property.actual_price} Lakhs
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
                  ₹{property.predicted_price} Lakhs
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-500/80">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Based on market trends in {property.location}. Our model suggests this represents a {isFairPrice ? 'fair market value' : 'potential premium'}.</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button fullWidth size="lg" shadow onClick={() => handleOpenInquiry('contact')}>Contact Manager</Button>
                <Button fullWidth size="lg" variant="secondary" onClick={() => handleOpenInquiry('tour')}>Request Tour</Button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-3">
                 <ShieldCheck className="h-5 w-5 text-slate-400" />
                 <span className="text-slate-400 text-sm">Secure transaction guaranteed</span>
              </div>
            </motion.div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">Mortgage Calculator</h3>
              <p className="text-slate-400 text-sm mb-6">Estimate your monthly payments for this property.</p>
              <Button fullWidth variant="outline" className="border-slate-700 text-white hover:bg-slate-800" onClick={() => toast('Calculator tool coming in v2!', { icon: '🚧' })}>Calculate Now</Button>
            </div>
          </div>
        </div>
      </div>
      

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsInquiryModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleInquirySubmit}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {inquiryType === 'tour' ? 'Schedule a Tour' : 'Inquire About Property'}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">We usually respond within 24 hours.</p>
                  </div>
                  <button type="button" onClick={() => setIsInquiryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="First Name" icon={User} required
                      value={inquiryForm.firstName}
                      onChange={(e) => setInquiryForm({...inquiryForm, firstName: e.target.value})}
                    />
                    <Input 
                      label="Last Name" icon={User} required
                      value={inquiryForm.lastName}
                      onChange={(e) => setInquiryForm({...inquiryForm, lastName: e.target.value})}
                    />
                  </div>
                  <Input 
                    label="Email Address" type="email" icon={Mail} required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                  />
                  <Input 
                    label="Phone Number" icon={Phone} placeholder="+91 98765 43210"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                  />
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message</label>
                    <textarea 
                      className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/30"
                      rows={4}
                      required
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                  <Button type="submit" fullWidth size="lg" shadow disabled={inquiryLoading}>
                    {inquiryLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" /> Send Inquiry
                      </span>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
                    By clicking send, you agree to our terms of service.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
