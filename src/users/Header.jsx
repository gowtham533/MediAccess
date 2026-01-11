import { Activity, Menu, X, User, LogOut, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    setToken(null);
    navigate('/login');
    setShowUserMenu(false);
  }

  return (
    <>
      {/* Floating Header with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-6">
        <div className="mx-auto max-w-7xl">
          <div className={`relative rounded-2xl transition-all duration-700 ${
            scrolled 
              ? 'bg-white/70 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 border border-white/20' 
              : 'bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl shadow-2xl shadow-purple-500/30 border border-white/10'
          }`}>
            
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30"></div>
            
            {/* Main Content */}
            <div className="relative px-6 py-4 flex items-center justify-between">
              
              {/* Logo Section */}
              <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  {/* Animated Background Glow */}
                  <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  
                  {/* Icon Container with Glass Effect */}
                  <div className={`relative size-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    scrolled 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50' 
                      : 'bg-white/10 backdrop-blur-lg border border-white/20'
                  }`}>
                    <Activity className={`size-6 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110 ${
                      scrolled ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                </div>
                
                {/* Brand Name with Gradient */}
                <div className="flex flex-col">
                  <span className={`text-2xl font-black tracking-tight transition-all duration-300 bg-clip-text text-transparent ${
                    scrolled 
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' 
                      : 'bg-gradient-to-r from-white to-white/80'
                  }`}>
                    MediAccess
                  </span>
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    scrolled ? 'text-purple-400' : 'text-white/60'
                  }`}>
                    Healthcare Platform
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                
                {/* Owner Login Link */}
                <Link 
                  to='/ownerlogin' 
                  className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 group overflow-hidden ${
                    scrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {/* Hover Background */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    scrolled 
                      ? 'bg-indigo-50 opacity-0 group-hover:opacity-100' 
                      : 'bg-white/10 backdrop-blur-lg opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Settings className="size-4" />
                    Owner Portal
                  </span>
                  
                  {/* Animated Underline */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </Link>

                {/* Auth Buttons */}
                {!token ? (
                  <Link to='/login'>
                    <button className="relative px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 overflow-hidden group shadow-lg hover:shadow-2xl">
                      {/* Animated Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 transition-all duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                      
                      <span className="relative z-10 flex items-center gap-2">
                        <User className="size-4" />
                        LOGIN
                      </span>
                    </button>
                  </Link>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="relative px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 overflow-hidden group shadow-lg hover:shadow-2xl"
                    >
                      {/* Animated Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Avatar Circle */}
                      <span className="relative z-10 flex items-center gap-2">
                        <div className="size-6 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30">
                          <User className="size-3.5" />
                        </div>
                        Account
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 group"
                          >
                            <div className="size-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <LogOut className="size-4 text-white" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'bg-white/10 backdrop-blur-lg text-white border border-white/20'
                }`}
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/10 backdrop-blur-xl">
                <div className="px-6 py-4 space-y-3">
                  <Link 
                    to='/ownerlogin'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 bg-indigo-50 hover:bg-indigo-100' 
                        : 'text-white bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="size-5" />
                      Owner Portal
                    </div>
                  </Link>

                  {!token ? (
                    <Link to='/login' onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-center gap-2">
                          <User className="size-5" />
                          LOGIN
                        </div>
                      </button>
                    </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LogOut className="size-5" />
                        LOGOUT
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="h-24"></div>
    </>
  );
}

export default Header;