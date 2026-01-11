import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Store,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storeOwnerLoginAPI } from "../services/allAPI";
import { toast, ToastContainer } from "react-toastify";

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

function OwnerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (email && password) {
      setIsLoading(true);

      try {
        const result = await storeOwnerLoginAPI({ email, password });
        console.log(result);

        if (result.status === 200) {
          toast.success("Login successful!");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));
          
          setTimeout(() => {
            // Navigate to store owner dashboard
            navigate('/store/dashboard');
          }, 2500);
        } else if (result.status === 401) {
          toast.warning(result.response.data);
          setFormData({ email: "", password: "", rememberMe: false });
        } else if (result.status === 404) {
          toast.warning(result.response.data);
          setFormData({ email: "", password: "", rememberMe: false });
        } else {
          toast.error("Something went wrong!");
          setFormData({ email: "", password: "", rememberMe: false });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data || "Login failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.info("Please fill the form completely");
    }
  };

  const features = [
    {
      icon: Store,
      title: "Manage Your Store",
      description: "Update inventory, prices, and store information",
    },
    {
      icon: ShieldCheck,
      title: "Verified Platform",
      description: "Secure and trusted by 320+ pharmacy owners",
    },
    {
      icon: CheckCircle,
      title: "Real-time Updates",
      description: "Instant notifications for orders and inquiries",
    },
  ];

  return (
    <>
      <div id="ownerlogin" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 size-[35rem] bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 size-[40rem] bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[30rem] bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <AnimateOnScroll delay={100}>
              <div className="hidden lg:block space-y-8">
                {/* Logo & Title */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Activity className="size-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800">
                        MediAccess
                      </h1>
                      <p className="text-gray-600 font-medium">Owner Portal</p>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    Manage Your Pharmacy with Confidence
                  </h2>
                  <p className="text-lg text-gray-600">
                    Join hundreds of verified pharmacy owners on our trusted
                    platform.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-x-2 border border-white"
                    >
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                        <feature.icon className="size-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-white shadow-lg">
                    <div className="text-3xl font-black text-indigo-600">
                      320+
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Stores</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-white shadow-lg">
                    <div className="text-3xl font-black text-purple-600">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Support</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-white shadow-lg">
                    <div className="text-3xl font-black text-pink-600">
                      60k+
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Users</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Right Side - Login Form */}
            <AnimateOnScroll delay={200}>
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center gap-3 mb-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
                    <Activity className="size-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800">
                      MediAccess
                    </h1>
                    <p className="text-sm text-gray-600">Owner Portal</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back!
                    </h2>
                    <p className="text-gray-600">
                      Sign in to manage your pharmacy store
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                          placeholder="owner@pharmacy.com"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        New to MediAccess?
                      </span>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <Link
                      to="/ownerregister"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors group"
                    >
                      Register Your Pharmacy
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Back to Home */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <Link
                      to="/"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ← Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default OwnerLogin;