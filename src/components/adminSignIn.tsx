import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/useAuth";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const { setUserId } = useAuth(); // Get setUserId from context

  const [authing, setAuthing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const signInWithCredentials = async () => {
    setAuthing(true);
    setError("");
    
    console.log("Attempting to sign in with username:", username);
    
    try {
      const adminsRef = collection(db, "admin");
      const q = query(adminsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      console.log("Query snapshot empty?", querySnapshot.empty);

      if (querySnapshot.empty) {
        setError("Invalid username or password. Please try again.");
        setAuthing(false);
        return;
      }

      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      console.log("Admin data found:", { username: adminData.username });

      if (adminData.password !== password) {
        console.log("Password mismatch");
        setError("Invalid username or password. Please try again.");
        setAuthing(false);
        return;
      }

      console.log("Login successful, setting localStorage and context");

      // Store admin session in localStorage FIRST
      localStorage.setItem("userId", adminDoc.id);
      localStorage.setItem("username", adminData.username);
      localStorage.setItem("isAdmin", "true");

      // Update AuthContext
      setUserId(adminDoc.id);

      // Add a small delay to ensure context updates
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Navigating to /admin");
      
      // Navigate to admin page
      navigate("/admin/*", { replace: true });
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-3 sm:p-4 font-inter">
      <div
        className={`relative w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-700 ease-out ${
          isLoaded
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-8"
        }`}
      >
        {/* Mobile Header */}
        <div className="block md:hidden w-full bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white p-6 text-center">
          <h2 className="text-2xl sm:text-3xl italic font-medium font-serif text-white tracking-wide mb-2 leading-tight">
            Admin Access
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed font-inter">
            Administrative portal for LCC-Isabela Library management system.
          </p>
        </div>

        {/* Desktop Left Panel */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-6 lg:p-8 text-center bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white transform transition-all duration-700 ease-out">
          <div className="transform transition-all duration-500 hover:scale-105">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl italic font-medium font-serif text-white tracking-wide text-center mb-4 leading-tight">
              Admin Access
            </h2>
            <p className="mb-6 lg:mb-8 max-w-sm text-blue-200 leading-relaxed font-inter text-sm lg:text-base">
              Administrative portal for LCC-Isabela Library management system.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center bg-white transform transition-all duration-700 ease-out">
          {/* Logo and Title */}
          <div className="w-full flex flex-col justify-center items-center mb-4 sm:mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-blue-800 font-poppins tracking-wide text-center">
              Log In
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-sm mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg transform transition-all duration-300 animate-fade-in font-inter">
              <p className="font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="w-full max-w-sm flex flex-col space-y-4 sm:space-y-5 transform transition-all duration-500">
            <input
              type="text"
              placeholder="Admin Username"
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                         focus:ring-4 focus:ring-blue-200 focus:border-blue-700 
                         border-gray-200 hover:border-gray-300 bg-white
                         font-inter placeholder-gray-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && signInWithCredentials()}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && signInWithCredentials()}
                className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                           focus:ring-4 focus:ring-blue-200 focus:border-blue-700 
                           border-gray-200 hover:border-gray-300 bg-white
                           font-inter placeholder-gray-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center rounded-r-2xl transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="h-6 w-6 text-gray-400" />
                ) : (
                  <EyeOff className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={signInWithCredentials}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3 sm:py-3.5 rounded-full hover:from-blue-800 hover:to-blue-950 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold font-inter tracking-wide text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={authing || !username || !password}
            >
              {authing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In as Admin"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;