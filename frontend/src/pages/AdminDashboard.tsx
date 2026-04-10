import React, { useState } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, 
  Search, LayoutDashboard, Database, 
  ChevronRight, BarChart3, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';

interface PropertyManaged {
  id: number;
  title: string;
  location: string;
  actual_price: number;
  predicted_price: number;
  status: 'published' | 'draft' | 'under_review';
}

const initialProperties: PropertyManaged[] = [
  { id: 1, title: 'Modern Villa with Pool', location: 'Beverly Hills, CA', actual_price: 1250000, predicted_price: 1200000, status: 'published' },
  { id: 2, title: 'Luxury Penthouse', location: 'Manhattan, NY', actual_price: 2500000, predicted_price: 2600000, status: 'published' },
  { id: 3, title: 'Cozy Suburban Home', location: 'Austin, TX', actual_price: 550000, predicted_price: 500000, status: 'published' },
  { id: 4, title: 'Downtown Loft', location: 'Seattle, WA', actual_price: 890000, predicted_price: 910000, status: 'draft' },
];

export const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
           <div className="bg-blue-600 p-2 rounded-lg text-white">
              <LayoutDashboard className="h-5 w-5" />
           </div>
           <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex flex-col gap-2">
           <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-white font-medium transition-colors">
              <Database className="h-5 w-5" />
              Manage Listings
           </a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
              <BarChart3 className="h-5 w-5" />
              Analytics
           </a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
              <TrendingUp className="h-5 w-5" />
              ML Monitoring
           </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-x-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
           <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Inventory Management</h1>
              <p className="text-slate-500">View, edit, and manage all your real estate listings from here.</p>
           </div>
           <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-grow lg:w-72">
                 <Input 
                   placeholder="Find properties..." 
                   icon={Search} 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Listings', value: '142', detail: '+12% from last month', color: 'blue' },
             { label: 'Active Predictions', value: '1,052', detail: 'ML Model v2.4 Active', color: 'emerald' },
             { label: 'Market Accuracy', value: '94.2%', detail: 'Avg. Variance: ±4%', color: 'amber' },
             { label: 'Under Review', value: '8', detail: 'Needs admin approval', color: 'rose' }
           ].map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
             >
                <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.detail}</div>
             </motion.div>
           ))}
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                       <th className="px-6 py-4">Property</th>
                       <th className="px-6 py-4">Location</th>
                       <th className="px-6 py-4">Actual Price</th>
                       <th className="px-6 py-4">AI Prediction</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {properties.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                       <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                   <Building2 className="h-5 w-5" />
                                </div>
                                <div className="font-bold text-slate-900">{p.title}</div>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-500">{p.location}</td>
                          <td className="px-6 py-5 font-medium text-slate-900">{formatter.format(p.actual_price)}</td>
                          <td className="px-6 py-5 font-bold text-blue-600">{formatter.format(p.predicted_price)}</td>
                          <td className="px-6 py-5">
                             <Badge variant={p.status === 'published' ? 'success' : 'warning'}>
                                {p.status.replace('_', ' ')}
                             </Badge>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                                   <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.id)}
                                  className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-rose-600 transition-all font-bold"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 border-t border-slate-50 flex justify-between items-center text-sm text-slate-500">
              Showing {properties.length} active listings
              <div className="flex gap-2 font-bold">
                 <button className="px-3 py-1 text-slate-400 hover:text-slate-900">Prev</button>
                 <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">1</button>
                 <button className="px-3 py-1 text-slate-400 hover:text-slate-900">2</button>
                 <button className="px-3 py-1 text-slate-400 hover:text-slate-900">Next</button>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};
