import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Clock, Heart, Navigation, Activity, Sparkles, Zap, TrendingUp, CheckCircle, Search } from 'lucide-react';
import Header from '../users/Header';
import Footer from '../users/Footer';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';




// Animated Component - Pops up when scrolling into view
function AnimateOnScroll({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  const [location, setLocation] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); 
 


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span id={`counter-${end}`}>{count}{suffix}</span>;
}

const handleSearch = () => {
    if (location.trim()) {
      navigate(`/storelist?search=${encodeURIComponent(location.trim())}`);
    } else {
      navigate('/storelist');
    }
  };

  // Handle quick location click
  const handleQuickLocation = (loc) => {
    navigate(`/storelist?search=${encodeURIComponent(loc)}`);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

// Home Page Component
  function Home() {
  const [location, setLocation] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const quickLocations = ['ERNAKULAM', 'KOZHIKODE', 'KOLLAM', 'KOTTAYAM', 'ALAPPUZHA'];
  
  const features = [
    {
      icon: Shield,
      title: 'Verified Pharmacies',
      description: 'Admin-approved, licensed stores only',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Clock,
      title: 'Open 24/7',
      description: 'Find stores available at any time of day',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Heart,
      title: 'Emergency Support',
      description: 'Quick access to lifesaving medicines',
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: MapPin,
      title: 'Instant Availability',
      description: 'Real-time stock status updates',
      color: 'teal',
      gradient: 'from-teal-500 to-emerald-600'
    }
  ];

  const stats = [
    { icon: Shield, value: 320, suffix: '+', label: 'Verified Pharmacies', color: 'teal' },
    { icon: Clock, value: 24, suffix: '/7', label: 'Emergency Access', color: 'blue' },
    { icon: Heart, value: 1500, suffix: '+', label: 'Emergency Supported Pharmacies', color: 'pink' },
    { icon: MapPin, value: 60000, suffix: '+', label: 'Searches Assisted', color: 'indigo' }
  ];

   const [authorized,setAuthorized] = useState(false)
   const navigate = useNavigate()

  useEffect(()=>{
    const token = sessionStorage.getItem("token")
    setAuthorized(!!token)
  },[])

  const handleClick = ()=>{
    const token = sessionStorage.getItem("token")
   if(!token){
    toast.warning("Please Login to search")
    return;
   }
   navigate('/storelist')
  }

  return (

    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
  
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 size-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 size-96 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 animate-bounce">
                <Sparkles className="size-5 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">Trusted by 1,500+ Pharmacies</span>
              </div>
  
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 leading-tight mb-6 animate-fade-in">
                Find Emergency Medical Stores Near You
              </h1>
              <p className="text-lg md:text-2xl text-gray-700 mb-10 font-medium">
                Quickly find verified, open pharmacies for urgent medical needs.
              </p>

              {/* Floating Feature Highlights */}
              <div className="flex flex-wrap items-center justify-center gap-4 my-8">
                {[
                  { icon: Shield, text: '100% Verified', color: 'from-emerald-500 to-teal-600' },
                  { icon: Clock, text: '24/7 Available', color: 'from-blue-500 to-cyan-600' },
                  { icon: Zap, text: 'Instant Results', color: 'from-amber-500 to-orange-600' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <item.icon className="size-5 text-indigo-600 group-hover:text-white relative z-10 group-hover:rotate-12 transition-all duration-300" />
                    <span className="font-semibold text-gray-700 group-hover:text-white relative z-10 transition-colors duration-300">
                      {item.text}
                    </span>
                    <div className="absolute -right-1 -top-1 size-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                ))}
              </div>

              
              
              {/* New Main CTA Button */}
            <div className="mb-8">
                <button type='button' onClick={handleClick} 
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 overflow-hidden">
                  {/* Animated background layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl blur-2xl"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl border-4 border-white/50 animate-ping"></div>
                    <div className="absolute inset-0 rounded-2xl border-4 border-white/30 animate-pulse"></div>
                  </div>
                  
                  {/* Content */}
                  <Search className="size-7 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                  <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                    Explore Pharmacies
                  </span>
                  <Navigation className="size-7 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-1 transition-all duration-300" />
                  
                  {/* Corner sparkles */}
                  <Sparkles className="absolute top-2 right-2 size-5 text-white/60 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
                  <Sparkles className="absolute bottom-2 left-2 size-4 text-white/60 opacity-0 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-500" />
                </button>
            </div>
              
              {/* Quick Location Tags */}
              <div className="flex flex-wrap gap-3">
                {quickLocations.map((loc, index) => (
                  <button
                    key={loc}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 font-bold text-sm relative overflow-hidden group"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">{loc}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl"></div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Logo Badge */}
            <div className="mt-16 flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <Activity className="size-10 text-indigo-900 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-3 bg-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-3xl font-black text-indigo-900">MediAccess</span>
            </div>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-purple-50/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
                  <Zap className="size-5 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">OUR FEATURES</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  Find Emergency Medical Stores Near You
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Quickly find verified, open pharmacies for urgent medical needs.
                </p>
              </div>
            </AnimateOnScroll>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                  <div
                    className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-gray-100 relative overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className={`bg-gradient-to-br ${feature.gradient} size-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl relative`}>
                      <feature.icon className="size-10 text-white group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 transform group-hover:translate-x-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{feature.description}</p>
                    
                    <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100`}></div>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Sparkles className="size-5 text-indigo-400" />
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
          {/* Magnetic Feature Cards */}
<div className="mt-10 grid grid-cols-2 gap-3 max-w-md mx-auto">
  {[
    { emoji: '⚡', text: 'Fast Search', gradient: 'from-yellow-400 to-orange-500' },
    { emoji: '🎯', text: 'Accurate', gradient: 'from-red-400 to-pink-500' },
    { emoji: '🔒', text: 'Secure', gradient: 'from-blue-400 to-indigo-500' },
    { emoji: '✨', text: 'Easy to Use', gradient: 'from-purple-400 to-pink-500' }
  ].map((item, idx) => (
    <div
      key={idx}
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
        {item.emoji}
      </div>
      <p className="text-sm font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600">
        {item.text}
      </p>
      <div className="absolute top-2 right-2 size-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
    </div>
  ))}
</div>


        </section>
  
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 size-64 bg-indigo-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 size-64 bg-purple-300/20 rounded-full blur-3xl"></div>
          </div>
  
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 shadow-lg">
                  <TrendingUp className="size-5 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">IMPRESSIVE NUMBERS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  Trusted by hundreds of verified pharmacies
                </h2>
              </div>
            </AnimateOnScroll>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                  <div
                    className="group bg-white/90 backdrop-blur-xl rounded-3xl p-10 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-rotate-2 border-2 border-white hover:border-indigo-200 relative overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className={`bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 p-5 rounded-3xl shadow-2xl transform group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 relative overflow-hidden`}>
                          <stat.icon className="size-12 text-white group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-white/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-5xl md:text-6xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 transform group-hover:scale-110">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-gray-600 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-300">{stat.label}</div>
                    </div>
  
                    <div className={`absolute -bottom-2 -right-2 size-24 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 opacity-10 rounded-full group-hover:scale-[3] transition-transform duration-700`}></div>
                    
                    <div className="absolute inset-0 border-4 border-indigo-400/0 group-hover:border-indigo-400/30 rounded-3xl transition-all duration-500"></div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
            <AnimateOnScroll>
              <CheckCircle className="size-20 text-white mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Find Your Nearest Pharmacy?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of users who trust MediAccess for their emergency medical needs
              </p>
              <button className="px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <Navigation className="size-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/50 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full blur-2xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
              </button>
            </AnimateOnScroll>
          </div>
          {/* Live Progress Indicators */}
          <div className="mt-10 max-w-md mx-auto space-y-4">
            {[
              { label: 'Pharmacy Coverage', value: 95, color: 'from-emerald-500 to-teal-500', icon: Shield },
              { label: 'Response Time', value: 88, color: 'from-blue-500 to-cyan-500', icon: Zap },
              { label: 'User Satisfaction', value: 97, color: 'from-pink-500 to-rose-500', icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-indigo-600">{item.value}%</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{
                      width: `${item.value}%`,
                      animation: `slideIn 1.5s ease-out ${idx * 0.2}s both`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/50 animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

<style>{`
  @keyframes slideIn {
    from { width: 0%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`}</style>
        </section>
      </div>
      <Footer/>
      <ToastContainer position="center" autoClose={3000} theme="colored" />
    </>
  );
}

export default Home