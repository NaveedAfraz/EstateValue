import React, { useState } from 'react';
import { 
  Calculator, Sparkles, MapPin, 
  BedDouble, Bath, Square, RefreshCcw, 
  TrendingUp, AlertCircle,
  CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { propertyService, userService } from '../services/api';
import { toast } from 'react-hot-toast';

export const Prediction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    predicted_price: number;
    status: string;
    message: string;
    location_found: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1500,
    location: '1st Phase JP Nagar'
  });

  const validateForm = () => {
    if (formData.square_feet < 200 || formData.square_feet > 15000) {
      toast.error('Square feet must be between 200 and 15,000');
      return false;
    }
    if (formData.bedrooms < 1 || formData.bedrooms > 10) {
      toast.error('Bedrooms must be between 1 and 10');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const predictionPromise = propertyService.predict(formData);
      
      toast.promise(predictionPromise, {
        loading: 'AI is analyzing market data...',
        success: 'Prediction generated!',
        error: (err) => err.response?.data?.error || 'ML Service is currently offline.'
      });

      const response = await predictionPromise;
      setResult(response.data);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to generate prediction. Please try again later.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">Live AI Engine</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Predict Property <span className="text-blue-600">Market Value</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our AI analyzes historical sales data from Bengaluru to provide high-accuracy estimates in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Prediction Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-8 text-slate-900 font-bold text-xl">
              <Calculator className="h-6 w-6 text-blue-600" />
              Property Details
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Bedrooms" 
                  type="number" 
                  icon={BedDouble}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 0})}
                  min={1}
                  required
                />
                <Input 
                  label="Bathrooms" 
                  type="number" 
                  icon={Bath}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 0})}
                  min={1}
                  required
                />
              </div>

              <Input 
                label="Square Footage (Sqft)" 
                type="number" 
                icon={Square}
                value={formData.square_feet}
                onChange={(e) => setFormData({...formData, square_feet: parseInt(e.target.value) || 0})}
                min={100}
                required
              />

              <LocationAutocomplete 
                value={formData.location}
                onChange={(val) => setFormData({...formData, location: val})}
                required
              />

              <div className="pt-4">
                <Button fullWidth size="lg" disabled={loading} type="submit" shadow>
                  {loading ? (
                    <>
                      <RefreshCcw className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Prediction
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </motion.div>

          {/* Results Area */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-blue-600 rounded-3xl p-12 text-center text-white h-full flex flex-col justify-center items-center gap-6 shadow-2xl shadow-blue-600/20"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready to AI Estimate?</h3>
                    <p className="text-blue-100">Fill in the property details to see the predicted market value instantly.</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-blue-200 h-full flex flex-col justify-center items-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <Calculator className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Calculating...</h3>
                    <div className="flex gap-1 justify-center">
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}

               {result && !loading && !result.location_found && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-orange-50 border border-orange-100 p-10 rounded-3xl text-center shadow-lg"
                 >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <AlertCircle className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Location Not Found</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We couldn't find market data for <strong>"{formData.location}"</strong> in our database. 
                      Please try selecting a location from the suggestions to get an accurate prediction.
                    </p>
                 </motion.div>
               )}

               {result && !loading && result.location_found && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-slate-500 font-medium mb-1 uppercase tracking-wider text-[10px]">Estimated Market Price</div>
                        <div className="text-4xl font-black text-blue-600 tracking-tight">
                          ₹{result.predicted_price} Lakhs
                        </div>
                      </div>
                      <Badge 
                        variant={result.status === 'fair' ? 'success' : 'warning'}
                        className="py-1 px-3"
                      >
                        {(result?.status || 'fair').charAt(0).toUpperCase() + (result?.status || 'fair').slice(1)} Price
                      </Badge>
                    </div>
                    
                    {result.message && (
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 mb-8">
                        {result.status === 'fair' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {result.message}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                       <h4 className="text-sm font-bold text-slate-900 text-center">Market Confidence</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Location Relevance</span>
                            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[92%]" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Model Reliability</span>
                            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[85%]" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-24 w-24" />
                     </div>
                     <div className="relative z-10 flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                           <Sparkles className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                           <div className="font-bold">Next Steps</div>
                           <p className="text-slate-400 text-sm">Save this prediction to your wishlist.</p>
                        </div>
                     </div>
                     <Button 
                       variant="outline" 
                       className="border-slate-700 text-white hover:bg-slate-800" 
                       fullWidth 
                       onClick={async () => {
                         const token = localStorage.getItem('token');
                         if (!token) {
                           toast.error('Please sign in to save predictions');
                           return;
                         }
                         
                         try {
                           await userService.savePrediction({
                             location: formData.location,
                             bedrooms: formData.bedrooms,
                             bathrooms: formData.bathrooms,
                             square_feet: formData.square_feet,
                             predicted_price: result.predicted_price,
                             status: result.status
                           });
                           toast.success('Valuation saved to your history!');
                         } catch (err) {
                           toast.error('Failed to save prediction');
                         }
                       }}
                     >
                        Save Prediction
                     </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
