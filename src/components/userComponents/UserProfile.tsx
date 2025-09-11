import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { db, auth } from '../../firebase/firebase';
import { User, Eye, EyeOff, Mail, Phone, Building2, CheckCircle, AlertCircle, Loader } from 'lucide-react';


const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    department: "",
    password: "" 
  });
  const [loading, setLoading] = useState(false);
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
   fetchUserData();
  }, []);

  const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          let userDocRef = doc(db, "users", user.uid);
          let userDoc = await getDoc(userDocRef);
  
         
  
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: data.name || "",
              email: data.email || user.email || "",
              address: data.address || "",
              number: data.number || "",
              department: data.department || "",
              password: ""
            });
          } else {
            setUserData({
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
    
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (userData.number && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(userData.number)) {
      newErrors.number = 'Please enter a valid phone number';
    }
    
    if (changePassword) {
      if (!userData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordErrors = validatePassword(userData.password);
        if (passwordErrors.length > 0) {
          newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
        }
      }
    }
    
    if (!userData.department.trim()) {
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
        
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          name: userData.name.trim(),
          email: userData.email.trim(),
          address: userData.address.trim(),
          number: userData.number.trim(),
          department: userData.department,
          updatedAt: new Date().toISOString()
        }, { merge: true });
  
        if (changePassword && userData.password) {
          try {
            await updatePassword(user, userData.password);
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
        setUserData(prev => ({ ...prev, password: '' }));
        
      
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
    setUserData(prev => ({ ...prev, [name]: value }));
    
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className=" overflow-hidden">
          <div className="p-0 sm:p-2 lg:p-3">
            {successMessage && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 shadow-lg mt-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                  <p className="ml-3 text-green-800 font-semibold text-sm sm:text-base lg:text-lg ">{successMessage}</p>
                </div>
              </div>
            )}
            
            {(errors.submit || errors.fetch) && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  </div>
                  <p className="ml-3 text-red-800 font-semibold text-sm sm:text-base lg:text-lg">{errors.submit || errors.fetch}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-gray-100">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                  <span className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </span>
                  <span className="text-lg sm:text-xl lg:text-2xl">Personal Information</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="name" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base lg:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

              
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="email" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-sm sm:text-base lg:text-lg"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="address" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                      Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-sm sm:text-base lg:text-lg"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  

                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="number" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="number"
                        name="number"
                        value={userData.number}
                        onChange={handleInputChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base lg:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.number ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.number && (
                      <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {errors.number}
                      </p>
                    )}
                  </div>

                  {/* Department Field */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="department" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                      Department *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        id="department"
                        name="department"
                        value={userData.department}
                        onChange={handleInputChange}
                        className={`w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base lg:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none ${
                          errors.department ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.department && (
                      <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>

       
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl sm:rounded-3xl border-2 border-red-100 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-4">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-lg sm:text-xl lg:text-2xl">Security</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(!changePassword);
                        if (changePassword) {
                          setUserData(prev => ({ ...prev, password: '' }));
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.password;
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        changePassword 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {changePassword ? 'Cancel Change' : 'Change Password'}
                    </button>
                  </div>

                  {changePassword && (
                    <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-white/50 shadow-inner">
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label htmlFor="password" className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                            New Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={userData.password}
                              onChange={handleInputChange}
                              className={`w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base lg:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                              placeholder="Enter your new secure password"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center rounded-r-xl sm:rounded-r-2xl transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                              ) : (
                                <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="mt-2 sm:mt-3 text-red-600 text-xs sm:text-sm font-medium flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                              <span className="break-words">{errors.password}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4 sm:pt-6 lg:pt-8">
                <button
                  onClick={handleSubmit}
                  disabled={updating}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base sm:text-lg lg:text-xl py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:transform-none disabled:shadow-lg disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <Loader className="animate-spin h-5 w-5 sm:h-6 sm:w-6" />
                      Updating Profile...
                    </span>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;