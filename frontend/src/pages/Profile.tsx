import React, { useState, useEffect } from 'react';
import { 
  History, Heart, TrendingUp, 
  MapPin, Loader2, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Badge } from '../components/Badge';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'predictions'>('wishlist');
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [wishlistRes, predictionsRes] = await Promise.all([
        userService.getWishlist(),
        userService.getSavedPredictions()
      ]);
      setWishlist(wishlistRes.data);
      setPredictions(predictionsRes.data);
    } catch (err) {
      console.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Header */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-600/20">
            {dashboardUser.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-black text-slate-900 mb-1">
              Welcome back, {dashboardUser.username || 'User'}!
            </h1>
            <p className="text-slate-500 mb-4">{dashboardUser.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600">
                  <Heart className="h-4 w-4 text-rose-500" />
                  {wishlist.length} Favorites
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  {predictions.length} History
               </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'wishlist' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Saved Properties
          </button>
          <button 
            onClick={() => setActiveTab('predictions')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'predictions' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            AI History
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Syncing your personal hub...</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'wishlist' ? (
              wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                   <Building2 className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
                   <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore listings and click the heart icon to save your favorite homes here.</p>
                   <Link to="/listings" className="text-blue-600 font-bold hover:underline">Browse Properties</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wishlist.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )
            ) : (
              predictions.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                   <History className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                   <h3 className="text-xl font-bold text-slate-900 mb-2">No AI history yet</h3>
                   <p className="text-slate-500 mb-8 max-w-sm mx-auto">Use our predictive engine to value any property and save the result for reference.</p>
                   <Link to="/predict" className="text-blue-600 font-bold hover:underline">Get an AI Valuation</Link>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                              <th className="px-6 py-4">Location</th>
                              <th className="px-6 py-4">Specifications</th>
                              <th className="px-6 py-4">AI Prediction</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {predictions.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                       <MapPin className="h-4 w-4 text-blue-500" />
                                       <span className="font-bold text-slate-900">{p.location}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5 text-sm text-slate-500">
                                    {p.bedrooms}BHK • {p.square_feet} sqft
                                 </td>
                                 <td className="px-6 py-5 font-bold text-blue-600">₹{p.predicted_price}L</td>
                                 <td className="px-6 py-5">
                                    <Badge variant={p.status === 'fair' ? 'success' : 'warning'}>
                                       {p.status?.toUpperCase() || 'VALUED'}
                                    </Badge>
                                 </td>
                                 <td className="px-6 py-5 text-sm text-slate-400">
                                    {new Date(p.created_at).toLocaleDateString()}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
