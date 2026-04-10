import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'react-hot-toast';
import { contactService } from '../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.send(formData);
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Get in Touch</h1>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed">Have questions about our valuation models or need technical support? We're here to help.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Email Us</div>
                  <div className="text-slate-500">support@estatevalue.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Call Us</div>
                  <div className="text-slate-500">+91 (800) 123-4567</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Our Office</div>
                  <div className="text-slate-500">HSR Layout, Sector 7<br />Bengaluru, Karnataka 560102</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 transition-all"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required 
                />
              </div>
              <Input 
                label="Phone Number" 
                placeholder="+91 98765 43210" 
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Input 
                label="Email Address" 
                type="email" 
                icon={Mail} 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2 uppercase tracking-wide">Your Message</label>
                <textarea 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  rows={4}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              <Button fullWidth size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
