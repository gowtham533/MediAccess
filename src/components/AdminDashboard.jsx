import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  FileText,
  TrendingUp,
  LogOut,
  Bell,
  Search,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileCheck,
  X,
  Trash2,
} from "lucide-react";

import {
  dashboardStatsAPI,
  getPendingStoresAPI,
  getApprovedStoresAPI,
  approveStoreAPI,
  rejectStoreAPI,
  getStoreByIdAPI,
  recentActivityAPI,
  deleteStoreAPI,
  updateStoreProfileAPI,
  getStoreByIdAdminAPI
} from "../services/allAPI";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";



function AnimateOnScroll({ children, delay = 0 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
    >
      {children}
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState({});
  const [pendingStores, setPendingStores] = useState([]);
  const [approvedStores, setApprovedStores] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [isApprovedStore, setIsApprovedStore] = useState(false);

  const navigate = useNavigate()

  const token = sessionStorage.getItem("token");

  const reqHeader = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    // Check authentication for ADMIN
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login"); // Navigate to regular login page
      return;
    }

    // Check if user has admin role
    if (storedUser.role !== "admin") {
      console.log("Access denied. User role:", storedUser.role);
      toast.error("Access denied. Admin privileges required.");
      navigate("/login");
      return;
    }

    // Admin authenticated - load dashboard data
    loadDashboard();
    loadPendingStores();
    loadApprovedStores();
    loadRecentActivity();

  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const res = await dashboardStatsAPI(reqHeader);
      console.log("Dashboard stats response:", res);

      if (res?.status === 200) {
        // Handle the response data structure
        const statsData = res.data || {};
        console.log("Stats data:", statsData);
        console.log("Total Users (activeUsers):", statsData.activeUsers);
        console.log("Approved Stores (totalStores):", statsData.totalStores);
        console.log("Pending Requests (pendingApprovals):", statsData.pendingApprovals);
        setStats(statsData);
      } else {
        setStats({});
      }
    } catch (error) {
      console.error("Dashboard stats error", error);
      setStats({});
    }
  };

  const loadPendingStores = async () => {
    try {
      const res = await getPendingStoresAPI(reqHeader);
      console.log("Pending stores response:", res);

      if (res?.status === 200) {
        // Handle both array response and object with stores property
        const storesData = Array.isArray(res.data) ? res.data : res.data.stores || [];
        console.log("Pending stores data:", storesData);
        setPendingStores(storesData);
      } else {
        setPendingStores([]);
      }
    } catch (error) {
      console.error("Pending store fetch failed", error);
      setPendingStores([]);
    }
  };

  const loadApprovedStores = async () => {
    try {
      const res = await getApprovedStoresAPI(reqHeader);
      console.log("Approved stores response:", res);

      if (res?.status === 200) {
        const storesData = Array.isArray(res.data) ? res.data : res.data.stores || [];
        console.log("Approved stores data:", storesData);
        setApprovedStores(storesData);
      } else {
        setApprovedStores([]);
      }
    } catch (error) {
      console.error("Approved store fetch failed", error);
      setApprovedStores([]);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const res = await recentActivityAPI(reqHeader);
      if (res?.status === 200) {
        const activities = res.data.activities || res.data || [];
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error("Recent activity fetch failed", error);
    }
  };

  const approveStore = async (id) => {
    if (!window.confirm("Are you sure you want to approve this store?")) return;

    try {
      const res = await approveStoreAPI(id, reqHeader);
      if (res?.status === 200) {
        alert("Store approved successfully!");
        loadPendingStores();
        loadApprovedStores()
        loadDashboard();
        setShowStoreModal(false);
      }
    } catch (error) {
      console.error("Approve failed", error);
      alert("Failed to approve store");
    }
  };

  const rejectStore = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const res = await rejectStoreAPI(id, reason, reqHeader);
      if (res?.status === 200) {
        alert("Store rejected successfully!");
        loadPendingStores();
        loadDashboard();
        setShowStoreModal(false);
      }
    } catch (error) {
      console.error("Reject failed", error);
      alert("Failed to reject store");
    }
  };

  const viewStore = async (id, isApproved = false) => {
    try {
      // ✅ Use admin endpoint instead of public endpoint
      const res = await getStoreByIdAdminAPI(id, reqHeader);
      console.log("View store response:", res);

      if (res?.status === 200) {
        const storeData = res.data?.store || res.data?.data || res.data;

        console.log("Store data loaded:", storeData);

        setSelectedStore(storeData);
        setIsApprovedStore(isApproved);
        setShowStoreModal(true);
      } else {
        toast.error("Failed to load store details");
      }
    } catch (error) {
      console.error("Failed to load store details", error);
      toast.error(error.response?.data?.message || "Failed to load store details");
    }
  };

  const deleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to remove this store from the database? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await deleteStoreAPI(id, reqHeader);
      if (res?.status === 200) {
        alert("Store removed successfully!");
        loadApprovedStores();
        loadPendingStores();
        loadDashboard();
        setShowStoreModal(false);
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to remove store");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login')
    }, 1000);
  };

  const statsUI = [
    {
      label: "Total Users",
      value: stats.activeUsers || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Approved Stores",
      value: stats.totalStores || 0,
      icon: Store,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Pending Requests",
      value: stats.pendingApprovals || 0,
      icon: FileText,
      color: "from-orange-500 to-amber-500"
    }
  ];

  const menuItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "approvals", icon: FileText, label: "Approvals" },
    { id: "approved-stores", icon: Store, label: "Approved Stores" },
  ];

  const filteredStores = pendingStores.filter(store => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (store.storeName || store.name || "").toLowerCase().includes(query) ||
      (store.username || store.owner || "").toLowerCase().includes(query) ||
      (store.licenseNumber || store.license || "").toLowerCase().includes(query)
    );
  });

  const filteredApprovedStores = approvedStores.filter(store => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (store.storeName || store.name || "").toLowerCase().includes(query) ||
      (store.username || store.owner || "").toLowerCase().includes(query) ||
      (store.licenseNumber || store.license || "").toLowerCase().includes(query) ||
      (store.city || "").toLowerCase().includes(query) ||
      (store.area || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? "w-64" : "w-20"
          }`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
              <Activity className="size-8" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">MediAccess</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                ? "bg-white/20 shadow-lg"
                : "hover:bg-white/10"
                }`}
            >
              <item.icon className="size-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-red-300">
            <LogOut className="size-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="relative max-w-xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stores..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Bell className="size-6 text-gray-600 cursor-pointer hover:text-indigo-600" />
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsUI.map((s, i) => (
                  <AnimateOnScroll key={i} delay={i * 100}>
                    <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300">
                      <div className={`w-12 h-12 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                        <s.icon className="size-6 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold text-gray-800 mb-2">{s.value}</h3>
                      <p className="text-gray-600 font-medium">{s.label}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Recent Activity */}
              {recentActivity.length > 0 && (
                <AnimateOnScroll delay={400}>
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <Activity className="size-5 text-indigo-600" />
                          <div className="flex-1">
                            <p className="font-semibold">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.store}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              )}
            </>
          )}

          {/* Approvals */}
          {activeTab === "approvals" && (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b">
                <h2 className="text-2xl font-bold">Pending Approvals ({filteredStores.length})</h2>
                <Filter className="size-6 text-gray-600 cursor-pointer" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Store</th>
                      <th className="px-6 py-4 text-left font-semibold">Owner</th>
                      <th className="px-6 py-4 text-left font-semibold">License</th>
                      <th className="px-6 py-4 text-left font-semibold">Location</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.length > 0 ? (
                      filteredStores.map((store) => (
                        <tr key={store._id || store.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold">
                            {store.storeName || store.name}
                          </td>
                          <td className="px-6 py-4">{store.username || store.owner}</td>
                          <td className="px-6 py-4 text-sm">
                            {store.licenseNumber || store.license}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {store.location || `${store.city}, ${store.area}`}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => viewStore(store._id || store.id)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="size-5 text-blue-600" />
                              </button>
                              <button
                                onClick={() => approveStore(store._id || store.id)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="size-5 text-green-600" />
                              </button>
                              <button
                                onClick={() => rejectStore(store._id || store.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="size-5 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          {searchQuery ? "No stores match your search" : "No pending approvals"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Approved Stores */}
          {activeTab === "approved-stores" && (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b">
                <div>
                  <h2 className="text-2xl font-bold">Approved Stores ({filteredApprovedStores.length})</h2>
                  <p className="text-sm text-gray-600 mt-1">View all approved and active medical stores</p>
                </div>
                <Filter className="size-6 text-gray-600 cursor-pointer" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Store</th>
                      <th className="px-6 py-4 text-left font-semibold">Owner</th>
                      <th className="px-6 py-4 text-left font-semibold">License</th>
                      <th className="px-6 py-4 text-left font-semibold">Location</th>
                      <th className="px-6 py-4 text-left font-semibold">Contact</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprovedStores.length > 0 ? (
                      filteredApprovedStores.map((store) => (
                        <tr key={store._id || store.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {store.storeImage && (
                                <img
                                  src={store.storeImage?.startsWith('http') ? store.storeImage : `http://localhost:3000/${store.storeImage}`}
                                  alt={store.storeName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-semibold">{store.storeName || store.name}</p>
                                <p className="text-xs text-gray-500">{store.area}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{store.username || store.owner}</td>
                          <td className="px-6 py-4 text-sm font-mono">
                            {store.licenseNumber || store.license}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="size-4 text-gray-400" />
                              {store.location || `${store.city}, ${store.area}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="size-4 text-gray-400" />
                              {store.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => viewStore(store._id || store.id, true)}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Eye className="size-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          {searchQuery ? "No stores match your search" : "No approved stores yet"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Store Details Modal */}
      {showStoreModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Store Details</h2>
              <button
                onClick={() => setShowStoreModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Store Image */}
              {selectedStore.storeImage && (
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={selectedStore.storeImage?.startsWith('http') ? selectedStore.storeImage : `http://localhost:3000/${selectedStore.storeImage}`}
                    alt={selectedStore.storeName}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x300/667eea/ffffff?text=Store+Image';
                    }}
                  />
                </div>
              )}

              {/* Store Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <Store className="size-4" /> Store Name
                    </label>
                    <p className="text-lg font-semibold">{selectedStore.storeName}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Owner Name</label>
                    <p className="text-lg font-semibold">{selectedStore.username}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="size-4" /> Email
                    </label>
                    <p className="text-lg">{selectedStore.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="size-4" /> Phone
                    </label>
                    <p className="text-lg">{selectedStore.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FileCheck className="size-4" /> License Number
                    </label>
                    <p className="text-lg font-mono">{selectedStore.licenseNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="size-4" /> Full Address
                    </label>
                    <p className="text-lg">{selectedStore.storeAddress}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="text-lg">{selectedStore.city}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Area</label>
                    <p className="text-lg">{selectedStore.area}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Pincode</label>
                    <p className="text-lg">{selectedStore.pincode}</p>
                  </div>

                  {selectedStore.submittedDate && (
                    <div>
                      <label className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="size-4" /> Submitted Date
                      </label>
                      <p className="text-lg">{selectedStore.submittedDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* License File */}
              {selectedStore.licenseFile && (
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">License Document</label>
                  <a
                    href={selectedStore.licenseFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                  >
                    <FileCheck className="size-5" />
                    View License Document
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                {isApprovedStore ? (
                  // For Approved Stores - Show Remove Button
                  <button
                    onClick={() => deleteStore(selectedStore._id)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="size-5" />
                    Remove Store
                  </button>
                ) : (
                  // For Pending Stores - Show Approve/Reject Buttons
                  <>
                    <button
                      onClick={() => approveStore(selectedStore._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="size-5" />
                      Approve Store
                    </button>
                    <button
                      onClick={() => rejectStore(selectedStore._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="size-5" />
                      Reject Store
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;