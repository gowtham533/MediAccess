import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Filter,
  Check,
  AlertCircle,
  Package,
  Zap,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Tag,
  TrendingUp,
  Star,
  Heart,
  Info,
  User,
  X,
  CheckCircle
} from 'lucide-react';
import { createOrderAPI } from '../services/allAPI';


function AnimateOnScroll({ children, delay = 0 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
    >
      {children}
    </div>
  );
}

function OrderMedicines() {
  // Get store data from URL parameters or use default
  const getStoreFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const storeData = params.get('store');

    if (storeData) {
      try {
        return JSON.parse(decodeURIComponent(storeData));
      } catch (e) {
        console.error('Error parsing store data:', e);
      }
    }


    // Default store data
    return {
      id: 1,
      name: 'City Care Pharmacy',
      address: 'M.G Road, Ernakulam, Kerala',
      phone: '+91 98765 43210'
    };
  };


  const store = getStoreFromUrl();

  const emergencyMedicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      price: 45,
      description: 'Fast-acting fever and pain relief',
      inStock: true,
      popular: true,
      image: '💊',
      packSize: '10 tablets'
    },
    {
      id: 2,
      name: 'Ibuprofen 400mg',
      category: 'Anti-inflammatory',
      price: 85,
      description: 'Reduces inflammation and pain',
      inStock: true,
      popular: true,
      image: '💊',
      packSize: '15 tablets'
    },
    {
      id: 3,
      name: 'Cetirizine 10mg',
      category: 'Antihistamine',
      price: 65,
      description: 'Allergy relief medication',
      inStock: true,
      popular: false,
      image: '💊',
      packSize: '10 tablets'
    },
    {
      id: 4,
      name: 'Antacid Tablets',
      category: 'Digestive',
      price: 55,
      description: 'Relief from acidity and heartburn',
      inStock: true,
      popular: true,
      image: '💊',
      packSize: '20 tablets'
    },
    {
      id: 5,
      name: 'Oral Rehydration Salts',
      category: 'Hydration',
      price: 35,
      description: 'Electrolyte replacement solution',
      inStock: true,
      popular: false,
      image: '💊',
      packSize: '21.8g sachet'
    },
    {
      id: 6,
      name: 'Vitamin C Tablets',
      category: 'Supplements',
      price: 120,
      description: 'Immunity booster supplement',
      inStock: true,
      popular: true,
      image: '💊',
      packSize: '30 tablets'
    },
    {
      id: 7,
      name: 'Antiseptic Cream',
      category: 'First Aid',
      price: 95,
      description: 'For minor cuts and wounds',
      inStock: true,
      popular: false,
      image: '🧴',
      packSize: '30g tube'
    },
    {
      id: 8,
      name: 'Cough Syrup',
      category: 'Respiratory',
      price: 140,
      description: 'Relief from dry and wet cough',
      inStock: true,
      popular: true,
      image: '🧴',
      packSize: '100ml bottle'
    },
    {
      id: 9,
      name: 'Antiseptic Liquid',
      category: 'First Aid',
      price: 110,
      description: 'Disinfectant for wounds',
      inStock: true,
      popular: false,
      image: '🧴',
      packSize: '100ml bottle'
    },
    {
      id: 10,
      name: 'Pain Relief Spray',
      category: 'Pain Relief',
      price: 175,
      description: 'Fast topical pain relief',
      inStock: true,
      popular: true,
      image: '🧴',
      packSize: '60ml spray'
    },
    {
      id: 11,
      name: 'Digestive Enzymes',
      category: 'Digestive',
      price: 145,
      description: 'Helps improve digestion',
      inStock: true,
      popular: false,
      image: '💊',
      packSize: '30 capsules'
    },
    {
      id: 12,
      name: 'Multivitamin Tablets',
      category: 'Supplements',
      price: 280,
      description: 'Complete daily nutrition',
      inStock: true,
      popular: true,
      image: '💊',
      packSize: '60 tablets'
    }
  ];

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(emergencyMedicines.map(m => m.category))];

  const filteredMedicines = emergencyMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery'
  });

  const [errors, setErrors] = useState({});


  const addToCart = (medicine) => {
    const existing = cart.find(item => item.id === medicine.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const validateCustomerInfo = () => {
    const newErrors = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckout = () => {
    setShowCheckout(false);
    setShowCustomerModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderDetails = {
        storeId: store._id?.$oid || store._id || store.id,
        storeName: store.storeName || store.name,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
        medicines: cart.map(item => ({
          medicineId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          packSize: item.packSize
        })),
        totalAmount,
        paymentMethod: customerInfo.paymentMethod
      };

      console.log('Store object:', store);
      console.log('Order details being sent:', orderDetails);

      console.log('Placing order with details:', orderDetails);

      const response = await createOrderAPI(orderDetails);

      console.log('Order response:', response);

      if (response.status === 201 && response.data.success) {
        setOrderNumber(response.data.order.orderNumber);
        setShowCustomerModal(false);
        setShowSuccessModal(true);
        setCart([]);
        setCustomerInfo({
          name: '',
          phone: '',
          address: '',
          paymentMethod: 'Cash on Delivery'
        });
        setErrors({});
      } else {
        throw new Error(response.data?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setOrderNumber('');
  };
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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

      {/* Header */}
      <section className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-white hover:text-purple-300 font-semibold transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
              <span>Back</span>
            </button>

            <div className="text-center flex-1 mx-4">
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {store.name || store.storeName}
              </h1>
              <p className="text-purple-200 text-sm">Emergency Medicines • Store ID: {store.id || store._id}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCheckout(!showCheckout)}
                className="relative p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Medicines List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <AnimateOnScroll>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/10 text-purple-200 hover:bg-white/20'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Info Banner */}
            <AnimateOnScroll delay={100}>
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div className="text-sm text-cyan-100">
                  <strong>No Prescription Required</strong> - These emergency medicines are available over-the-counter for immediate relief.
                </div>
              </div>
            </AnimateOnScroll>

            {/* Medicine Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredMedicines.map((medicine, index) => (
                <AnimateOnScroll key={medicine.id} delay={index * 50}>
                  <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30">
                    {medicine.popular && (
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-bold text-purple-900">Popular</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-5xl">{medicine.image}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                            {medicine.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-500/30 rounded-lg text-purple-200 text-xs font-semibold">
                              {medicine.category}
                            </span>
                            <span className="text-gray-400 text-xs">{medicine.packSize}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        {medicine.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-black text-white">
                          ₹{medicine.price}
                        </div>

                        {cart.find(item => item.id === medicine.id) ? (
                          <div className="flex items-center gap-3 bg-white/20 rounded-xl px-2 py-1">
                            <button
                              onClick={() => updateQuantity(medicine.id, -1)}
                              className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-bold min-w-[2rem] text-center">
                              {cart.find(item => item.id === medicine.id)?.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(medicine.id, 1)}
                              className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(medicine)}
                            className="group/btn px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        )}
                      </div>

                      {medicine.inStock && (
                        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                          <Check className="w-4 h-4" />
                          <span>In Stock - Fast Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* Right - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AnimateOnScroll delay={200}>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      Your Cart
                    </h2>
                  </div>

                  <div className="p-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                        <p className="text-purple-200 mb-2">Your cart is empty</p>
                        <p className="text-purple-300 text-sm">Add medicines to get started</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-bold text-white mb-1">{item.name}</h4>
                                  <p className="text-purple-200 text-sm">{item.packSize}</p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-1 hover:bg-purple-500/50 rounded transition-colors"
                                  >
                                    <Minus className="w-3 h-3 text-white" />
                                  </button>
                                  <span className="text-white font-bold min-w-[1.5rem] text-center text-sm">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-1 hover:bg-purple-500/50 rounded transition-colors"
                                  >
                                    <Plus className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                                <span className="text-white font-bold">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-white/20 pt-4 space-y-3">
                          <div className="flex justify-between text-purple-200">
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                          </div>
                          <div className="flex justify-between text-purple-200">
                            <span>Delivery</span>
                            <span className="text-emerald-400 font-semibold">FREE</span>
                          </div>
                          <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-white/20">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleCheckout}
                          className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl font-bold text-white hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Proceed to Checkout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Delivery Info */}
              <AnimateOnScroll delay={300}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-400" />
                    Delivery Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-purple-200">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>Express delivery in 30-45 mins</span>
                    </div>
                    <div className="flex items-center gap-3 text-purple-200">
                      <MapPin className="w-4 h-4 text-pink-400" />
                      <span className="break-all">{store.address || store.storeAddress}</span>
                    </div>
                    <div className="flex items-center gap-3 text-purple-200">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span>{store.phone}</span>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Customer Details</h2>
                <button
                  onClick={() => {
                    setShowCustomerModal(false);
                    setErrors({});
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <h3 className="font-bold text-white mb-2">Ordering From</h3>
                <p className="text-purple-200 font-semibold">{store.name || store.storeName}</p>
                <p className="text-purple-300 text-sm">Store ID: {store.id || store._id}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <h3 className="font-bold text-white mb-3">Order Summary</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-purple-200">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-lg font-bold text-white">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address *
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  placeholder="Enter complete delivery address"
                  rows="3"
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.address ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all resize-none`}
                />
                {errors.address && (
                  <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Payment Method
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={customerInfo.paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => handleCustomerInfoChange('paymentMethod', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="Online Payment"
                      checked={customerInfo.paymentMethod === 'Online Payment'}
                      onChange={(e) => handleCustomerInfoChange('paymentMethod', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">Online Payment</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl font-bold text-white hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Place Order - ₹{totalAmount}
                  </>
                )}
              </button>

              <p className="text-center text-purple-300 text-xs">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl border border-white/20 max-w-md w-full">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-white mb-2">Order Placed!</h2>
                <p className="text-purple-200">Your order has been successfully placed</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="flex justify-between text-purple-200">
                  <span className="font-semibold">Order Number:</span>
                  <span className="font-mono font-bold text-white">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span className="font-semibold">Store:</span>
                  <span className="text-white">{store.name || store.storeName}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-emerald-400 font-bold text-xl">₹{totalAmount}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 border border-cyan-500/30">
                <p className="text-cyan-100 text-sm">
                  <strong className="text-cyan-200">Expected Delivery:</strong> 30-45 minutes
                </p>
              </div>

              <button
                onClick={handleCloseSuccessModal}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Close
              </button>

              <p className="text-purple-300 text-xs">
                You will be contacted by the store owner shortly
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
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
      `}</style>
    </div>
  );
}

export default OrderMedicines;