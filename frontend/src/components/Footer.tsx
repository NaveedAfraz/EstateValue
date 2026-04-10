import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-2xl tracking-tight text-white">EstateValue</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EstateValue. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
