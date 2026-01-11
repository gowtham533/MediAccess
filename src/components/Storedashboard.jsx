import React, { useState, useEffect } from 'react';
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  Bell,
  Settings,
  LogOut,
  Search,
  Edit,
  Menu,
  X,
  ChevronDown,
  Activity,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Image,
  Save,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Truck,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { getStoreProfileAPI, updateStoreProfileAPI, getStoreOrdersAPI, updateOrderStatusAPI } from '../services/allAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function StoreDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editFormData, setEditFormData] = useState({
    storeName: '',
    phone: '',
    city: '',
    area: '',
    pincode: '',
    storeAddress: '',
    storeImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/ownerlogin");
      return;
    }

    if (storedUser.role !== "storeOwner") {
      console.log("Invalid role:", storedUser.role);
      navigate("/ownerlogin");
      return;
    }

    setStoreData(storedUser);
    setEditFormData({
      storeName: storedUser.storeName || "",
      phone: storedUser.phone || "",
      city: storedUser.city || "",
      area: storedUser.area || "",
      pincode: storedUser.pincode || "",
      storeAddress: storedUser.storeAddress || "",
      storeImage: null,
    });

    setIsLoading(false);

    fetchStoreProfile();
    fetchOrders();

    const interval = setInterval(() => {
      fetchStoreProfile();
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10 MB');
        return;
      }

      setEditFormData(prev => ({
        ...prev,
        storeImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/ownerlogin'), 2000);
        return;
      }

      const formData = new FormData();
      formData.append('storeName', editFormData.storeName);
      formData.append('phone', editFormData.phone);
      formData.append('city', editFormData.city);
      formData.append('area', editFormData.area);
      formData.append('pincode', editFormData.pincode);
      formData.append('storeAddress', editFormData.storeAddress);

      if (editFormData.storeImage) {
        formData.append('storeImage', editFormData.storeImage);
      }

      console.log('Submitting update...');
      const response = await updateStoreProfileAPI(formData, token);
      console.log('Update response:', response);

      if (response?.status === 200 && response?.data?.updatedStore) {
        const updatedStore = response.data.updatedStore;
        setStoreData(updatedStore);
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...updatedStore
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Store details updated successfully!');
        setShowEditModal(false);
        setImagePreview(null);

        setTimeout(() => fetchStoreProfile(), 500);
      } else {
        const errorMsg = response?.data?.message || response?.data || 'Failed to update store details';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/ownerlogin';
    }, 1000);
  };

  const openEditModal = () => {
    if (!storeData) {
      toast.error('Store data not loaded yet');
      return;
    }

    setEditFormData({
      storeName: storeData?.storeName || '',
      phone: storeData?.phone || '',
      city: storeData?.city || '',
      area: storeData?.area || '',
      pincode: storeData?.pincode || '',
      storeAddress: storeData?.storeAddress || '',
      storeImage: null,
    });
    setImagePreview(null);
    setShowEditModal(true);
  };

  const fetchStoreProfile = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/ownerlogin');
        return;
      }

      console.log('Fetching store profile...');
      const response = await getStoreProfileAPI(token);
      console.log('Store profile response:', response);

      if (response?.status === 200 && response?.data?.success && response?.data?.data) {
        const freshData = response.data.data;

        // ✅ FIX 1: Normalize approval status
        const normalizedData = {
          ...freshData,
          status: freshData.status || (freshData.isApproved ? 'approved' : 'pending'),
        };

        console.log('Normalized store data:', normalizedData);

        // ✅ Update state
        setStoreData(normalizedData);

        // ✅ Sync sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...normalizedData,
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('Store data updated successfully');
      } else if (response?.status === 401) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/ownerlogin'), 2000);
      }
    } catch (error) {
      console.error('Error fetching store profile:', error);
      // toast.error('Failed to fetch latest store data');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const response = await getStoreOrdersAPI(token);

      if (response?.status === 200 && response?.data?.success) {
        setOrders(response.data.orders || []);
        setOrderStats(response.data.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await updateOrderStatusAPI(orderId, newStatus, token);

      if (response?.status === 200) {
        toast.success('Order status updated successfully!');
        fetchOrders();
        if (showOrderDetails && selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-purple-100 text-purple-800 border-purple-200',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      preparing: <Package className="w-4 h-4" />,
      'out-for-delivery': <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 rounded-xl">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-purple-800">
                      MediAccess
                    </h1>
                    <p className="text-xs text-gray-600">Owner Dashboard</p>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64 lg:w-96">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search medicines, orders..."
                    className="bg-transparent w-full outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {storeData?.username?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-gray-900">{storeData?.username || user?.username || 'Store Owner'}</p>
                        <p className="text-sm text-gray-600">{storeData?.email || user?.email || 'owner@pharmacy.com'}</p>
                      </div>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
          >
            <div className="h-full overflow-y-auto py-6">
              <nav className="space-y-1 px-3">
                <button
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'overview'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </button>

                <button
                  onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'orders'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Store Overview</h2>
                    <p className="text-gray-600 mt-1">Welcome back, {storeData?.username || user?.username || 'Owner'}!</p>
                  </div>
                </div>

                {/* Store Details Card */}
                {!storeData ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 font-medium">Unable to load store details. Please refresh the page.</p>
                    <button
                      onClick={() => {
                        const token = sessionStorage.getItem('token');
                        if (token) fetchStoreOwnerDetails(token);
                      }}
                      className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Store className="w-6 h-6 text-indigo-600" />
                        Store Registration Details
                      </h3>
                      <button
                        onClick={openEditModal}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Details
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Store Image */}
                      {storeData?.storeImage && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Image className="w-4 h-4" /> Store Image
                          </p>
                          <img
                            src={storeData.storeImage?.startsWith('http') ? storeData.storeImage : `http://localhost:3000/${storeData.storeImage}`}
                            alt={storeData.storeName}
                            className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Store+Image';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Store className="w-4 h-4 text-indigo-600" /> Store Name
                        </p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.storeName || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Owner Name</p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.username || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-600" /> Email Address
                        </p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.email || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-indigo-600" /> Phone Number
                        </p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.phone || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-indigo-600" /> License Number
                        </p>
                        <p className="text-lg font-bold text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">
                          {storeData?.licenseNumber || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Approval Status</p>
                        <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${storeData?.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : storeData?.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {storeData?.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">City</p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.city || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Area/Locality</p>
                        <p className="text-lg font-bold text-gray-900">{storeData?.area || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Pincode</p>
                        <p className="text-lg font-bold text-gray-900 font-mono">{storeData?.pincode || 'N/A'}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" /> Complete Store Address
                        </p>
                        <p className="text-lg font-bold text-gray-900 bg-gray-50 p-4 rounded-lg">
                          {storeData?.storeAddress || 'N/A'}
                        </p>
                      </div>

                      {/* License File Link */}
                      {storeData?.licenseFile && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-gray-700 mb-2">License Document</p>
                          <a
                            href={storeData.licenseFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                          >
                            <FileCheck className="w-5 h-5" />
                            View License Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                    <p className="text-gray-600 mt-1">Manage your store orders</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{orderStats.totalOrders}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{orderStats.pendingOrders}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Confirmed</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{orderStats.confirmedOrders}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Delivered</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{orderStats.deliveredOrders}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{orderStats.totalRevenue}</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by order number, customer name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        {searchTerm || filterStatus !== 'all' ? 'No matching orders' : 'No orders yet'}
                      </h4>
                      <p className="text-sm">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Try adjusting your search or filter'
                          : 'Orders from customers will appear here'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order #</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-mono font-semibold text-indigo-600">{order.orderNumber}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">{order.customerName}</p>
                                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-700">{order.medicines.length} items</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  {order.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderDetails(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center rounded-t-3xl">
                        <div>
                          <h2 className="text-2xl font-bold text-white">Order Details</h2>
                          <p className="text-indigo-200 text-sm mt-1">{selectedOrder.orderNumber}</p>
                        </div>
                        <button
                          onClick={() => setShowOrderDetails(false)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Status Update */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Update Order Status</label>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                            className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-indigo-600" />
                            Customer Information
                          </h3>
                          <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-semibold">Name:</span> {selectedOrder.customerName}</p>
                            <p className="text-gray-700"><span className="font-semibold">Phone:</span> {selectedOrder.customerPhone}</p>
                            <p className="text-gray-700 flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-1 text-indigo-600 shrink-0" />
                              <span><span className="font-semibold">Address:</span> {selectedOrder.deliveryAddress}</span>
                            </p>
                            <p className="text-gray-700"><span className="font-semibold">Payment:</span> {selectedOrder.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Ordered Medicines */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            Ordered Medicines
                          </h3>
                          <div className="space-y-3">
                            {selectedOrder.medicines.map((medicine, index) => (
                              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <span className="text-3xl">{medicine.image}</span>
                                    <div>
                                      <h4 className="font-bold text-gray-900">{medicine.name}</h4>
                                      <p className="text-sm text-gray-600">{medicine.packSize}</p>
                                      <p className="text-xs text-gray-500 mt-1 px-2 py-1 bg-gray-100 rounded inline-block">
                                        {medicine.category}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Qty: {medicine.quantity}</p>
                                    <p className="font-bold text-gray-900">₹{medicine.price * medicine.quantity}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">Total Amount</span>
                              <span className="text-2xl font-black text-indigo-600">₹{selectedOrder.totalAmount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Order Timeline
                          </h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-semibold">Placed:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><span className="font-semibold">Last Updated:</span> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold">Edit Store Details</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setImagePreview(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Store Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Store Image
                </label>
                <div className="flex items-center gap-4">
                  {(imagePreview || storeData?.storeImage) && (
                    <img
                      src={imagePreview || storeData?.storeImage}
                      alt="Store preview"
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {imagePreview ? 'Change Image' : 'Upload Store Image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={editFormData.storeName}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={editFormData.area}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={editFormData.pincode}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Store Address *
                  </label>
                  <textarea
                    name="storeAddress"
                    value={editFormData.storeAddress}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setImagePreview(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default StoreDashboard;