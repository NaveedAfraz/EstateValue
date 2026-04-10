import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join EstateValue to start exploring properties</p>
          </div>

          <form className="space-y-6">
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="John Doe"
              icon={User}
              required
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              icon={Mail}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
               <input type="checkbox" className="rounded border-slate-300 text-blue-600" required />
               <span>I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span>
            </div>

            <Button fullWidth size="lg">
              <UserPlus className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-center text-slate-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center mt-2 group">
                Sign in instead
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
