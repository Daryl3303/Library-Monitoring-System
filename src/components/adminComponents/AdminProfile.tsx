import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { db, auth } from '../../firebase/firebase';
import { User, Eye, EyeOff, Mail, Phone, Building2, MapPin} from 'lucide-react';

const UserProfile: React.FC = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    address: "",
    number: "",
    department: "",
    password: "" 
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
   "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education",
  "Bachelor of Science in Secondary Education",
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        let adminDocRef = doc(db, "users", user.uid);
        let adminDoc = await getDoc(adminDocRef);


        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdminData({
            name: data.name || "",
            email: data.email || user.email || "",
            address: data.address || "",
            number: data.number || "",
            department: data.department || "",
            password: ""
          });
        } else {
          setAdminData({
            name: user.displayName || "",
            email: user.email || "",
            address: "",
            number: "",
            department: "",
            password: ""
          });
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setErrors({ fetch: 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('one number');
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!adminData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (adminData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!adminData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (adminData.number && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(adminData.number)) {
      newErrors.number = 'Please enter a valid phone number';
    }
    
    if (changePassword) {
      if (!adminData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordErrors = validatePassword(adminData.password);
        if (passwordErrors.length > 0) {
          newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
        }
      }
    }
    
    if (!adminData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setUpdating(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      const adminDocRef = doc(db, 'users', user.uid);
      await setDoc(adminDocRef, {
        name: adminData.name.trim(),
        email: adminData.email.trim(),
        address: adminData.address.trim(),
        number: adminData.number.trim(),
        department: adminData.department,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (changePassword && adminData.password) {
        try {
          await updatePassword(user, adminData.password);
        } catch (authError: any) {
          console.error('Password update error:', authError);
          if (authError.code === 'auth/requires-recent-login') {
            setErrors({ password: 'For security reasons, please log out and log back in before changing your password.' });
            setUpdating(false);
            return;
          } else if (authError.code === 'auth/weak-password') {
            setErrors({ password: 'Password is too weak. Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.' });
            setUpdating(false);
            return;
          } else if (authError.code === 'auth/operation-not-allowed') {
            setErrors({ password: 'Password update is not allowed. Please contact support.' });
            setUpdating(false);
            return;
          } else if (authError.code === 'auth/user-disabled') {
            setErrors({ password: 'Your account has been disabled. Please contact support.' });
            setUpdating(false);
            return;
          } else if (authError.code === 'auth/user-token-expired') {
            setErrors({ password: 'Your session has expired. Please log out and log back in.' });
            setUpdating(false);
            return;
          }
          throw authError;
        }
      }
      
      setSuccessMessage('Profile updated successfully!');
      setChangePassword(false);
      setAdminData(prev => ({ ...prev, password: '' }));
      
    
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error: any) {
      console.error('Error updating admin:', error);
      setErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            {successMessage && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 rounded-2xl mb-8 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-green-800 font-semibold text-lg">{successMessage}</p>
                </div>
              </div>
            )}
            
            {(errors.submit || errors.fetch) && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-2xl mb-8 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-red-800 font-semibold text-lg">{errors.submit || errors.fetch}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4 mb-8">
                  <span className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </span>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={adminData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2"
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="address" className="block text-lg font-semibold text-gray-700">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={adminData.address}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2"
                        placeholder="Enter your address"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.address}
                      </p>
                    )}
                  </div>

             
                  <div className="space-y-3">
                    <label htmlFor="number" className="block text-lg font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="number"
                        name="number"
                        value={adminData.number}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.number ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.number && (
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.number}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="department" className="block text-lg font-semibold text-gray-700">
                      Department *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="department"
                        name="department"
                        value={adminData.department}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.department ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    {errors.department && (
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>

         
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl border-2 border-red-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                      <span className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Security Settings
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(!changePassword);
                        if (changePassword) {
                          setAdminData(prev => ({ ...prev, password: '' }));
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.password;
                            return newErrors;
                          });
                        }
                      }}
                      className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        changePassword 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {changePassword ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                  </div>

                  {changePassword && (
                    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/50 shadow-inner">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-3">
                            New Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={adminData.password}
                              onChange={handleInputChange}
                              className={`w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                              placeholder="Enter your new secure password"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-4 flex items-center rounded-r-2xl transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Eye className="h-6 w-6 text-gray-400" />
                              ) : (
                                <EyeOff className="h-6 w-6 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="mt-3 text-red-600 text-sm font-medium flex items-start gap-2">
                              <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-blue-800 text-white font-bold text-xl py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:transform-none disabled:shadow-lg"
                >
                  {updating ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </span>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;