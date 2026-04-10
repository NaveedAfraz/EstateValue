import React, { useState } from 'react';
import { 
  Calculator, Info, Sparkles, MapPin, 
  BedDouble, Bath, Square, RefreshCcw, 
  TrendingDown, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';

export const Prediction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1500,
    location: 'Downtown'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to ML Service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple dummy logic matching ml-service/ml_model/model.py
    const base_price = 50000;
    const price_per_sqft = 150;
    const room_premium = (formData.bedrooms + formData.bathrooms) * 10000;
    let multiplier = 1.0;
    if (formData.location.toLowerCase() === 'downtown') multiplier = 1.5;
    else if (formData.location.toLowerCase() === 'suburb') multiplier = 1.1;

    const predicted = (base_price + (formData.square_feet * price_per_sqft) + room_premium) * multiplier;
    
    setResult(predicted);
    setLoading(false);
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">Advanced ML Engine</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Predict Property <span className="text-blue-600">Market Value</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our AI analyzes historical sales data, localized trends, and property specs to provide high-accuracy estimates in seconds.
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
                  onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  min={0}
                />
                <Input 
                  label="Bathrooms" 
                  type="number" 
                  icon={Bath}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                  min={0}
                />
              </div>

              <Input 
                label="Square Footage (Sqft)" 
                type="number" 
                icon={Square}
                value={formData.square_feet}
                onChange={(e) => setFormData({...formData, square_feet: parseInt(e.target.value)})}
                min={100}
              />

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Location Area</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <MapPin className="h-5 w-5 text-slate-400" />
                   </div>
                   <select 
                     className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                   >
                     <option value="Downtown">Downtown / City Center</option>
                     <option value="Suburb">Suburban Area</option>
                     <option value="Rural">Rural / Outskirts</option>
                     <option value="Waterfront">Waterfront / Coastal</option>
                   </select>
                </div>
              </div>

              <div className="pt-4">
                <Button fullWidth size="lg" disabled={loading}>
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
            
            <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
               <p className="text-xs text-slate-500 leading-relaxed">
                 Predictions are based on algorithmic analysis of the entered parameters and market averages. 
                 Actual values may vary based on property condition and specific local factors.
               </p>
            </div>
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

              {result && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-xs">Estimated Fair Value</div>
                    <div className="text-5xl font-black text-blue-600 mb-6 tracking-tight">
                      {formatter.format(result)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                            <TrendingUp className="h-4 w-4" /> High
                          </div>
                          <div className="text-xs text-emerald-600/80 font-medium">{formatter.format(result * 1.05)}</div>
                       </div>
                       <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                          <div className="flex items-center gap-2 text-rose-700 font-bold mb-1">
                            <TrendingDown className="h-4 w-4" /> Low
                          </div>
                          <div className="text-xs text-rose-600/80 font-medium">{formatter.format(result * 0.95)}</div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                       <h4 className="text-sm font-bold text-slate-900">Analysis Breakdown</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Location Score</span>
                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[85%]" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Space Utilization</span>
                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[70%]" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Market Demand</span>
                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[95%]" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                     <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                           <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                           <div className="font-bold">Next Steps</div>
                           <p className="text-slate-400 text-sm">Find properties matching these specs in our database.</p>
                        </div>
                     </div>
                     <Button variant="outline" className="mt-6 border-slate-700 text-white hover:bg-slate-800" fullWidth>
                        Search Matching Listings
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
