import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  const sections = [
    {
      title: 'Data Collection',
      icon: Eye,
      content: 'We collect minimal data necessary to provide accurate property valuations, including location interests and basic account details.'
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: 'All user data is encrypted at rest and in transit using industry-standard AES-256 encryption protocols.'
    },
    {
      title: 'Our Commitment',
      icon: ShieldCheck,
      content: 'We never sell your personal information or valuation history to third-party marketing agencies.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Last Updated: April 2026</div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-4">
             <div className="p-2 bg-blue-50 rounded-xl"><FileText className="h-8 w-8 text-blue-600" /></div>
             Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">Your privacy is fundamental to our relationship with you. This policy outlines how we handle and protect your personal information.</p>
        </motion.div>

        <div className="grid gap-8 mb-16">
          {sections.map((section) => (
            <div key={section.title} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex gap-6">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                  <section.icon className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{section.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{section.content}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
           <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us when you create an account, use our AI prediction tools, or communicate with us. This may include your name, email address, password, and property details submitted for valuation.</p>
           </section>
           <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">2. Cookies & Tracking</h2>
              <p>We use cookies to improve your experience on our site, such as keeping you logged in and remembering your recent searches. You can control cookie settings through your browser preferences.</p>
           </section>
        </div>
      </div>
    </div>
  );
};
