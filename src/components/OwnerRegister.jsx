import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Upload,
  Store,
  Activity,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storeOwnerRegisterAPI } from "../services/allAPI";
import { toast, ToastContainer } from "react-toastify";

/* ---------------- Scroll Animation ---------------- */
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

function OwnerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    storeName: "",
    city: "",
    area: "",
    pincode: "",
    storeAddress: "",
    licenseNumber: "",
    licenseFile: null,
    storeImage: null,
    agree: false,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const { ownerName, email, phone, password, storeName, city, area, pincode, storeAddress, licenseNumber, licenseFile, storeImage, agree } = formData;

  if (ownerName && email && phone && password && storeName && city && area && pincode && storeAddress && licenseNumber && licenseFile && storeImage && agree) {
    setIsLoading(true);

    try {
      console.log("Form Data:", formData); // Check what you're sending
      
      const formDataToSend = new FormData();
      formDataToSend.append('username', ownerName);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('phone', phone);
      formDataToSend.append('storeName', storeName);
      formDataToSend.append('city', city);
      formDataToSend.append('area', area);
      formDataToSend.append('pincode', pincode);
      formDataToSend.append('storeAddress', storeAddress);
      formDataToSend.append('licenseNumber', licenseNumber);
      
      if (licenseFile) {
        formDataToSend.append('licenseFile', licenseFile);
      }
      if (storeImage) {
        formDataToSend.append('storeImage', storeImage);
      }

      const result = await storeOwnerRegisterAPI(formDataToSend);
      console.log("API Response:", result); // Check response

      if (result.status === 200) {
        toast.success("Registration successful! Please wait for admin approval.");
        setFormData({
          ownerName: "",
          email: "",
          phone: "",
          password: "",
          storeName: "",
          city: "",
          area: "",
          pincode: "",
          storeAddress: "",
          licenseNumber: "",
          licenseFile: null,
          storeImage: null,
          agree: false,
        });
        setTimeout(() => {
          navigate("/ownerlogin");
        }, 2500);
      } else if (result.status === 409) {
        toast.warning(result.response.data);
      } else {
        console.log(result);
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log("Error Details:", err);
      console.log("Error Response:", err?.response);
      toast.error(err?.response?.data || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  } else {
    toast.info("Please fill the form completely");
  }
};

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 size-[35rem] bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 size-[40rem] bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl">
            <AnimateOnScroll delay={150}>
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                    <Activity className="size-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800">
                    MediAccess
                  </h1>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                  Register Your Pharmacy
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Owner Name */}
                  <Input
                    label="Owner Name"
                    icon={User}
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    error={errors.ownerName}
                    placeholder="Full name"
                  />

                  {/* Email */}
                  <Input
                    label="Email"
                    icon={Mail}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="owner@pharmacy.com"
                  />

                  {/* Phone */}
                  <Input
                    label="Phone"
                    icon={Phone}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="10 digit number"
                  />

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-4 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-colors ${
                          errors.password
                            ? "border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Store Name */}
                  <Input
                    label="Store Name"
                    icon={Store}
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    error={errors.storeName}
                    placeholder="Medical Store Name"
                  />

                  {/* Store Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        formData.storeImage
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      <ImageIcon className="mx-auto mb-3 text-indigo-500" size={40} />
                      <label className="cursor-pointer">
                        <span className="text-indigo-600 font-semibold hover:text-indigo-700">
                          Click to upload store image
                        </span>
                        <input
                          type="file"
                          name="storeImage"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                      {formData.storeImage && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">{formData.storeImage.name}</span>
                        </div>
                      )}
                    </div>
                    {errors.storeImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.storeImage}</p>
                    )}
                  </div>

                  {/* City / Area / Pincode */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      name="city"
                      value={formData.city}
                      placeholder="City"
                      onChange={handleChange}
                      error={errors.city}
                    />
                    <Input
                      name="area"
                      value={formData.area}
                      placeholder="Area"
                      onChange={handleChange}
                      error={errors.area}
                    />
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      placeholder="Pincode"
                      onChange={handleChange}
                      error={errors.pincode}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Address
                    </label>
                    <textarea
                      name="storeAddress"
                      value={formData.storeAddress}
                      placeholder="Full Store Address"
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                        errors.storeAddress
                          ? "border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                    {errors.storeAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.storeAddress}</p>
                    )}
                  </div>

                  {/* License Number */}
                  <Input
                    label="License Number"
                    icon={Hash}
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    error={errors.licenseNumber}
                    placeholder="Pharmacy License Number"
                  />

                  {/* License File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      License Document
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        formData.licenseFile
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      <Upload className="mx-auto mb-3 text-indigo-500" size={40} />
                      <label className="cursor-pointer">
                        <span className="text-indigo-600 font-semibold hover:text-indigo-700">
                          Click to upload license document
                        </span>
                        <input
                          type="file"
                          name="licenseFile"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                      {formData.licenseFile && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">{formData.licenseFile.name}</span>
                        </div>
                      )}
                    </div>
                    {errors.licenseFile && (
                      <p className="mt-1 text-sm text-red-500">{errors.licenseFile}</p>
                    )}
                  </div>

                  {/* Agree Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">
                        I confirm that all details provided are correct and agree to the terms and conditions
                      </span>
                    </label>
                    {errors.agree && (
                      <p className="mt-1 text-sm text-red-500">{errors.agree}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  >
                    {isLoading ? "Submitting..." : "Register Store"}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center mt-6 text-gray-600">
                  Already registered?{" "}
                  <Link
                    to="/ownerlogin"
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    Sign In
                  </Link>
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

/* ---------------- Reusable Input Component ---------------- */
function Input({ label, icon: Icon, error, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-colors ${
            error
              ? "border-red-500"
              : "border-gray-200 focus:border-indigo-500"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default OwnerRegister;