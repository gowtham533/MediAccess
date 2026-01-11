import React, { useEffect, useState } from "react";
import { getStoreByIdAPI } from '../services/allAPI';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Truck,
  ShieldCheck,
  Navigation,
  Store,
  ArrowLeft,
  Check,
  AlertCircle,
  Mail,
  Heart,
  Share2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from '../users/Header'
import Footer from '../users/Footer'

/* Scroll animation */
function AnimateOnScroll({ children, delay = 0 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      {children}
    </div>
  );
}

function View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStoreById(id);
    }
  }, [id]);

  const fetchStoreById = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIXED: Use the proper API function
      const response = await getStoreByIdAPI(storeId);

      if (response.data && response.data.store) {
        setStore(formatStoreData(response.data.store));
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      setError(error.response?.data?.message || "Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  const formatStoreData = (rawStore) => {
    return {
      id: rawStore._id || rawStore.id,
      name: rawStore.storeName || rawStore.name,
      address: rawStore.storeAddress || rawStore.address,
      phone: rawStore.phone,
      email: rawStore.email || "contact@store.com",
      open: rawStore.status === 'approved' ? "Open 24/7" : "Closed",
      rating: rawStore.rating || 4.8,
      reviews: rawStore.reviews || 245,
      distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km away`,
      delivery: "Home & Express Delivery Available",
      city: rawStore.city,
      area: rawStore.area,
      pincode: rawStore.pincode,
      storeImage: rawStore.storeImage,
      servicesList: [
        "Prescription Medicines",
        "Emergency Supplies",
        "Wellness Products",
        "ICU & Critical Care Medicines",
      ],
      description:
        rawStore.description ||
        "Trusted medical store providing 24/7 emergency services with verified medicines and fast delivery.",
      timings: {
        weekdays: "24/7",
        weekend: "24/7",
      },
      features: [
        "Home Delivery Available",
        "Online Payment Accepted",
        "Insurance Claims Support",
        "Free Consultation Available",
      ],
    };
  };

  const handleCallStore = () => {
    if (store?.phone) {
      window.location.href = `tel:${store.phone}`;
    }
  };

  const handleGetDirections = () => {
    if (store?.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        store.address
      )}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const handleOrderMedicines = () => {
  if (store) {
    const storeData = encodeURIComponent(JSON.stringify({
      _id: store.id,           
      id: store.id,            
      storeName: store.name,   
      name: store.name,       
      storeAddress: store.address,  
      address: store.address,  
      phone: store.phone,
      city: store.city,        
      area: store.area,        
      pincode: store.pincode   
    }));
    
    navigate(`/ordermedicines?store=${storeData}`);
  }
};

  const handleEmailStore = () => {
    if (store?.email) {
      window.location.href = `mailto:${store.email}`;
    }
  };

  const handleShare = async () => {
    if (navigator.share && store) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name} - ${store.description}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      alert("Share feature not supported on this browser");
    }
  };

  // ✅ FIXED: Removed localStorage - now just toggles state
  const handleSave = () => {
    setIsSaved(!isSaved);
    // Note: This state won't persist across page refreshes
    // To persist, you'd need to save to backend or use a different storage method
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <div className="text-2xl font-bold text-indigo-600">Loading store details...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !store) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-4">
              {error || "Store not found"}
            </div>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Enhanced Background with multiple gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-0 size-[35rem] bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-0 size-[40rem] bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[30rem] bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
  
        {/* Sticky Header with Back Button */}
        <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-indigo-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-semibold transition-all duration-300 group"
            >
              <ArrowLeft className="size-5 group-hover:translate-x-[-4px] transition-transform" />
              <span className="hidden sm:inline">Back to Store List</span>
              <span className="sm:hidden">Back</span>
            </button>
  
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all duration-300 transform hover:scale-110"
              >
                <Share2 className="size-5" />
              </button>
              <button
                onClick={handleSave}
                className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isSaved
                    ? "bg-pink-500 text-white"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }`}
              >
                <Heart
                  className={`size-5 ${isSaved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Store Image Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
          <AnimateOnScroll>
            {/* Store Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group">
              {/* Image Container */}
              <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-purple-100">
                {store.storeImage ? (
                  <img
                    src={store.storeImage?.startsWith('http') ? store.storeImage : `http://localhost:3000/${store.storeImage}`}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/1200x400/667eea/ffffff?text=Store+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
                    <Store className="size-24 text-indigo-600 opacity-30" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Store Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-lg">
                        {store.name}
                      </h1>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                          <Star className="size-4 text-yellow-300 fill-current" />
                          <span className="font-bold">{store.rating}</span>
                          <span className="text-white/90 text-sm">
                            ({store.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-400/30">
                          <Check className="size-4" />
                          <span className="font-semibold text-sm">
                            Verified Store
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                      <ShieldCheck className="size-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Details Card */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
  
              <div className="relative z-10">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-white/90">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                    <MapPin className="size-5 shrink-0" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                    <Clock className="size-5 shrink-0" />
                    <span className="font-semibold text-green-300">
                      {store.open}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                    <Store className="size-5 shrink-0" />
                    <span>{store.distance}</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
  
        {/* Main Content */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Store Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <AnimateOnScroll delay={100}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="size-6 text-indigo-600" />
                    About This Store
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {store.description}
                  </p>
                </div>
              </AnimateOnScroll>
  
              {/* Services Section */}
              <AnimateOnScroll delay={150}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="size-6 text-indigo-600" />
                    Services Offered
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {store.servicesList.map((service, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl px-4 py-4 text-gray-800 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                          <Check className="size-4 text-white" />
                        </div>
                        <span className="font-semibold">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
  
              {/* Features Section */}
              <AnimateOnScroll delay={200}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Additional Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {store.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="size-4 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
  
              {/* Contact Information */}
              <AnimateOnScroll delay={250}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-3 rounded-2xl">
                        <Phone className="size-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="text-gray-900 font-semibold">
                          {store.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-2xl">
                        <Mail className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900 font-semibold break-all">
                          {store.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-pink-100 p-3 rounded-2xl">
                        <Clock className="size-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Working Hours
                        </p>
                        <p className="text-gray-900 font-semibold">
                          {store.timings.weekdays}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-2xl">
                        <Truck className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Delivery</p>
                        <p className="text-gray-900 font-semibold">
                          {store.delivery}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
  
            {/* Right Column - Quick Actions (Sticky) */}
            <div className="lg:col-span-1">
              <AnimateOnScroll delay={200}>
                <div className="sticky top-24 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Quick Actions
                  </h3>
  
                  <button
                    onClick={handleCallStore}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Phone className="size-5" />
                      Call Store Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
  
                  <button
                    onClick={handleGetDirections}
                    className="w-full py-4 bg-white border-2 border-indigo-500 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Navigation className="size-5" />
                      Get Directions
                    </span>
                  </button>
  
                  <button
                    onClick={handleOrderMedicines}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Truck className="size-5" />
                      Order Medicines
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
  
                  <button
                    onClick={handleEmailStore}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="size-5" />
                      Email Store
                    </span>
                  </button>
  
                  {/* Store Stats */}
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl">
                        <div className="text-3xl font-black text-indigo-600">
                          {store.rating}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Rating</div>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-2xl">
                        <div className="text-3xl font-black text-pink-600">
                          {store.reviews}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
}

export default View;