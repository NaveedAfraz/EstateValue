import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  const bulletPoints = [
    'You must be at least 18 years of age to create an account.',
    'Predictions are based on market trends and are not financial guarantees.',
    'User accounts must be kept secure; do not share credentials.',
    'Automated scraping of our property database is strictly prohibited.'
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 bg-white p-12 rounded-[3rem] shadow-xl shadow-blue-900/5 border border-slate-100"
        >
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
             <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium mb-12">By accessing and using EstateValue, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <div className="space-y-4">
             {bulletPoints.map((point) => (
               <div key={point} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{point}</span>
               </div>
             ))}
          </div>
        </motion.div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-12 px-6">
           <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>The services that EstateValue provides to you are subject to the following Terms of Use ("TOU"). EstateValue reserves the right to update the TOU at any time without notice to you.</p>
           </section>
           <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">2. Accuracy of Predictions</h2>
              <p>While our machine learning models are highly sophisticated, real estate markets are volatile. Our predictions should be used as one of many tools in your decision-making process and should not be taken as professional financial advice.</p>
           </section>
           <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">3. Limitation of Liability</h2>
              <p>EstateValue shall not be liable for any financial losses or damages resulting from the use of our predictive data or property listings.</p>
           </section>
        </div>
      </div>
    </div>
  );
};
