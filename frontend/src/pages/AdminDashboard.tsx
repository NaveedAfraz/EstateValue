import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, 
  Search, LayoutDashboard, Database, 
  BarChart3, Loader2, X,
  MapPin, BedDouble, Bath, Square, Image as ImageIcon,
  Type, Inbox, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { propertyService } from '../services/api';
import { toast } from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getAll();
      setProperties(response.data);
    } catch (err) {
      console.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const deletePromise = propertyService.delete(id);
      toast.promise(deletePromise, {
        loading: 'Deleting...',
        success: 'Property deleted!',
        error: 'Failed to delete'
      });
      try {
        await deletePromise;
        setProperties(properties.filter(p => p.id !== id));
      } catch (err) {}
    }
  };

  const handleOpenModal = (property: any = null) => {
    setEditingProperty(property || {
      title: '',
      location: '1st Phase JP Nagar',
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1200,
      actual_price: '',
      description: '',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    if (!editingProperty.title.trim() || !editingProperty.location.trim()) {
      toast.error('Title and Location are required');
      return false;
    }
    if (editingProperty.square_feet <= 0 || editingProperty.actual_price <= 0) {
      toast.error('Sqft and Price must be positive numbers');
      return false;
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModalLoading(true);
    const savePromise = editingProperty.id 
      ? propertyService.update(editingProperty.id, editingProperty)
      : propertyService.create(editingProperty);
    
    toast.promise(savePromise, {
      loading: 'Saving...',
      success: 'Property saved!',
      error: 'Failed to save'
    });

    try {
      await savePromise;
      setIsModalOpen(false);
      fetchProperties();
    } catch (err) {} finally {
      setModalLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: properties.length,
    avgPrice: properties.length > 0 
      ? (properties.reduce((acc, p) => acc + (parseFloat(p.actual_price) || 0), 0) / properties.length).toFixed(1)
      : 0,
    totalArea: properties.reduce((acc, p) => acc + (p.square_feet || 0), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
           <div className="bg-blue-600 p-2 rounded-lg text-white">
              <LayoutDashboard className="h-5 w-5" />
           </div>
           <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-2">
           <button className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-white font-medium text-left">
              <Database className="h-5 w-5" />
              Manage Listings
           </button>
           <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors text-left">
              <BarChart3 className="h-5 w-5" />
              Analytics
           </button>
        </nav>
      </aside>

      <main className="flex-grow p-6 md:p-12 overflow-x-hidden">
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
              <Button onClick={() => handleOpenModal()}>
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Button>
           </div>
        </div>

        {/* Stats Row */}
        {!loading && properties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Listings</div>
                <div className="text-2xl font-black text-slate-900">{stats.total}</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Listing Price</div>
                <div className="text-2xl font-black text-slate-900">₹{stats.avgPrice}L</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Square className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Managed Area</div>
                <div className="text-2xl font-black text-slate-900">{stats.totalArea.toLocaleString()} <span className="text-sm font-medium text-slate-400">sqft</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Syncing with database...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center flex flex-col items-center gap-4">
             <Inbox className="h-12 w-12 text-slate-300" />
             <p className="text-slate-500">No properties found. {searchTerm && "Try a different search term."}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Property</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Actual Price</th>
                        <th className="px-6 py-4">AI Prediction</th>
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
                           <td className="px-6 py-5 font-medium text-slate-900">₹{p.actual_price}L</td>
                           <td className="px-6 py-5 font-bold text-blue-600">₹{p.predicted_price}L</td>
                           <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-blue-600 transition-all">
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
          </div>
        )}
      </main>

      {/* Property Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSave}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProperty?.id ? 'Edit Property' : 'Add New Property'}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                  <Input label="Property Title" icon={Type} value={editingProperty.title} onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})} required />
                  <Input label="Location (Area)" icon={MapPin} value={editingProperty.location} onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})} required />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Bedrooms" type="number" icon={BedDouble} value={editingProperty.bedrooms} onChange={(e) => setEditingProperty({...editingProperty, bedrooms: parseInt(e.target.value)})} required />
                    <Input label="Bathrooms" type="number" icon={Bath} value={editingProperty.bathrooms} onChange={(e) => setEditingProperty({...editingProperty, bathrooms: parseInt(e.target.value)})} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Sq Ft" type="number" icon={Square} value={editingProperty.square_feet} onChange={(e) => setEditingProperty({...editingProperty, square_feet: parseInt(e.target.value)})} required />
                    <Input label="Price (Lakhs)" type="number" icon={Building2} value={editingProperty.actual_price} onChange={(e) => setEditingProperty({...editingProperty, actual_price: e.target.value})} required />
                  </div>

                  <Input label="Image URL" icon={ImageIcon} value={editingProperty.image_url} onChange={(e) => setEditingProperty({...editingProperty, image_url: e.target.value})} placeholder="https://..." />
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Description</label>
                    <textarea 
                      className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      rows={3}
                      value={editingProperty.description}
                      onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={modalLoading}>
                    {modalLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Property'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
