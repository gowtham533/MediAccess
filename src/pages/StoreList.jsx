import React, { useEffect, useRef, useState } from "react";
import { getAllStoresAPI } from '../services/allAPI';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Navigation,
  Star,
  Truck,
  Info,
  Search,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


/* Scroll reveal animation */
function AnimateOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), delay);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      {children}
    </div>
  );
}

function StoreList() {
  const navigate = useNavigate();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [location, setLocation] = useState('');
  const [hoveredStore, setHoveredStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

 useEffect(() => {
  fetchStores();
}, []);


  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await getAllStoresAPI();

      if (res.data && res.data.stores) {
        const approvedStores = res.data.stores.filter(
          (store) => store.status === "approved"
        );

        const mappedStores = approvedStores.map((store, index) => ({
          id: store._id,
          name: store.storeName,
          location: `${store.city}, ${store.area}`,
          address: store.storeAddress,
          open: store.status === 'approved' ? "Open Now" : "Closed",
          rating: store.rating || 4.5,
          distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
          delivery: "Home Delivery Available",
          services: "Medicines • Wellness",
          phone: store.phone,
          email: store.email,
          description: store.description || "Trusted medical store with verified medicines and fast service.",
          badge: "Verified",
          storeImage: store.storeImage,
          color:
            index % 3 === 0
              ? "from-violet-500 to-purple-600"
              : index % 3 === 1
              ? "from-emerald-500 to-teal-600"
              : "from-blue-500 to-cyan-600",
        }));

        setStores(mappedStores);
        setFilteredStores(mappedStores); 
      }
    } catch (error) {
      console.error("Failed to load stores", error);
      setError("Failed to load stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!location.trim()) {
    setFilteredStores(stores);
    setError(null);
    return;
  }

  const query = location.toLowerCase();

  const filtered = stores.filter((store) =>
    store.name?.toLowerCase().includes(query) ||
    store.location?.toLowerCase().includes(query) ||
    store.address?.toLowerCase().includes(query)
  );

  setFilteredStores(filtered);

  if (filtered.length === 0) {
    setError("No stores found");
  } else {
    setError(null);
  }
}, [location, stores]);


  const handleCallStore = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (address) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleViewDetails = (store) => {
    navigate(`/view/${store.id}`);
  };

 



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <AnimateOnScroll>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Find Your Nearest Pharmacy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient">
                Medical Stores
              </span>
              <br />
              <span className="text-white">Near You</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Trusted pharmacies with verified services, real-time availability,
              and lightning-fast delivery options.
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Enhanced Search Bar */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <AnimateOnScroll delay={100}>
          <div
            className={`relative bg-white/10 backdrop-blur-xl rounded-3xl border transition-all duration-500 ${
              isSearchFocused
                ? 'border-purple-400 shadow-2xl shadow-purple-500/50 scale-[1.02]'
                : 'border-white/20 shadow-xl hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-4 p-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>

              <input
                type="text"
                placeholder="Enter your location (e.g., city, area)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white text-lg placeholder:text-gray-400 font-medium min-w-0"
              />
            </div>

            {/* Animated bottom border */}
            <div className={`h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500 ${
              isSearchFocused ? 'scale-x-100' : 'scale-x-0'
            }`}></div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Store Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center text-white text-xl py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4">Loading stores...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 text-xl py-20">
            {error}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center text-white text-xl py-20">
            No stores found
          </div>
        ) : (
          <div className="space-y-8">
            {filteredStores.map((store, index) => (
              <AnimateOnScroll key={store.id} delay={index * 150}>
                <div
                  onMouseEnter={() => setHoveredStore(store.id)}
                  onMouseLeave={() => setHoveredStore(null)}
                  className="group relative"
                >
                  {/* Card background with glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${store.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-white/30 group-hover:shadow-2xl">
                    
                    {/* Top accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${store.color}`}></div>
                    
                    <div className="p-8">
                      <div className="grid md:grid-cols-3 gap-8">
                        
                        {/* Store Info */}
                        <div className="md:col-span-2 space-y-6">
                          
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300">
                                  {store.name}
                                </h3>
                                {hoveredStore === store.id && (
                                  <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                                )}
                              </div>
                              
                              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${store.color} rounded-full`}>
                                <Award className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-bold">{store.badge}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Verified</span>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                              <MapPin className="w-5 h-5 text-cyan-400" />
                              <span className="text-gray-300 font-medium">{store.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                              <Clock className="w-5 h-5 text-purple-400" />
                              <span className="text-gray-300 font-medium">{store.open}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-bold">{store.rating}</span>
                              <span className="text-gray-400 text-sm">rating</span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                              <Truck className="w-5 h-5 text-pink-400" />
                              <span className="text-gray-300 font-medium">{store.delivery}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-400 leading-relaxed">
                            {store.description}
                          </p>

                          {/* Services tags */}
                          <div className="flex flex-wrap gap-2">
                            {store.services.split(' • ').map((service, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium"
                              >
                                {service}
                              </span>
                            ))}
                            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium">
                              📍 {store.distance} away
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() => handleCallStore(store.phone)}
                            className={`group/btn relative px-6 py-4 bg-gradient-to-r ${store.color} rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105`}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <Phone className="w-5 h-5" />
                              Call Store
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                          </button>

                          <button
                            onClick={() => handleGetDirections(store.address)}
                            className="group/btn relative px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <Navigation className="w-5 h-5" />
                              Get Directions
                            </span>
                          </button>

                          <button 
                            className="group/btn relative px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                            onClick={() => handleViewDetails(store)}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <Info className="w-5 h-5" />
                              View Details
                            </span>
                            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Animated corner accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default StoreList;