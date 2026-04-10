import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Target, Users, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-blue-100 text-blue-600 mb-6">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Revolutionizing Real Estate Valuation</h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            EstateValue combines advanced machine learning with real-time market data to provide the most accurate property price predictions in the industry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">To empower homeowners, buyers, and investors with data-driven insights that eliminate guesswork from the real estate market.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Community</h3>
            <p className="text-slate-600 leading-relaxed">We serve thousands of users daily, helping them make informed decisions about their most significant investments.</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Award className="h-48 w-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-black mb-6 italic">Built for the future of housing.</h2>
            <p className="text-slate-400 text-lg mb-8">Our AI algorithms analyze over 50 variables—from location trends to structural details—to ensure your property is valued exactly where the market is headed.</p>
            <div className="flex gap-8">
               <div>
                  <div className="text-3xl font-black text-blue-400">99.8%</div>
                  <div className="text-xs uppercase font-medium text-slate-500 tracking-widest mt-1">Data Accuracy</div>
               </div>
               <div>
                  <div className="text-3xl font-black text-blue-400">12k+</div>
                  <div className="text-xs uppercase font-medium text-slate-500 tracking-widest mt-1">Active Users</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
