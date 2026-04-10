import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, LogOut, User, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [is_admin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      console.log(user);
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUsername(userData.username);
      setIsAdmin(userData.is_admin === 1 || userData.role === 'admin');
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Listings', path: '/listings' },
    { name: 'Predict Price', path: '/predict' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Estate<span className="text-blue-600">Value</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pl-4 ml-4 border-l border-slate-200 flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all bg-white shadow-sm"
                  >
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-bold text-slate-900 leading-none">{username}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{is_admin ? 'Administrator' : 'Verified User'}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      <User className="h-5 w-5" />
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowDropdown(false)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-slate-50 mb-1">
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Menu</div>
                          </div>
                          {is_admin ? (
                            <Link 
                              to="/admin" 
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors mx-2 rounded-xl"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              <span className="font-semibold">Admin Dashboard</span>
                            </Link>
                          ) : (
                            <Link 
                              to="/profile" 
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors mx-2 rounded-xl"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="font-semibold">My Profile</span>
                            </Link>
                          )}
                          <div className="h-px bg-slate-50 my-1 mx-4" />
                          <button 
                            onClick={() => { handleLogout(); setShowDropdown(false); }}
                            className="w-[calc(100%-16px)] flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 transition-colors mx-2 rounded-xl"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="font-semibold">Sign Out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button shadow>Create Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
               {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-slate-500 text-sm font-medium border-b border-slate-50 mb-1">Logged in as {username}</div>
                  {is_admin ? (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-xl"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="font-semibold">Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link 
                      to="/profile" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-xl"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="font-semibold">My Profile</span>
                    </Link>
                  )}
                  <Button variant="outline" fullWidth onClick={() => { handleLogout(); setIsOpen(false); }} className="mt-2 text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button fullWidth>Create Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
