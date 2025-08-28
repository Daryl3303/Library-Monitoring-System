import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import logo from "logo.png";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const redirectByRole = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const { role } = userDoc.data();
        if (role === "Admin") navigate("/admin");
        else navigate("/user");
      } else {
        setError("No user profile found in Firestore.");
      }
    } catch (err: any) {
      console.error("Error fetching role:", err.message);
      setError("Failed to fetch user role.");
    }
  };

  const signInWithEmail = async () => {
    setAuthing(true);
    setError("");
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await redirectByRole(response.user.uid);
    } catch (err: any) {
      console.error("Sign-in error:", err.message);
      setError("Invalid credentials. Please try again.");
    } finally {
      setAuthing(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthing(true);
    setError("");
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      await redirectByRole(response.user.uid);
    } catch (err: any) {
      console.error("Google sign-in error:", err.message);
      setError("Google sign-in failed.");
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
        {/* Mobile Header - Only visible on small screens */}
        <div className="block md:hidden w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 text-center">
          <h2 className="text-2xl sm:text-3xl italic font-medium font-serif text-white tracking-wide mb-2 leading-tight">
            Welcome!
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed font-inter">
            Online Library Reservation of LCC-Isabela Library making it easy for
            students to reserve and access books anytime, anywhere.
          </p>
        </div>

        {/* Message Side - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-6 lg:p-8 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white transform transition-all duration-700 ease-out">
          <div className="transform transition-all duration-500 hover:scale-105">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl italic font-medium font-serif text-white tracking-wide text-center mb-4 leading-tight">
              Welcome!
            </h2>
            <p className="mb-6 lg:mb-8 max-w-sm text-blue-100 leading-relaxed font-inter text-sm lg:text-base">
              Online Library Reservation of LCC-Isabela Library making it easy
              for students to reserve and access books anytime, anywhere.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 lg:px-8 py-2.5 lg:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-inter tracking-wide text-sm lg:text-base"
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center bg-white transform transition-all duration-700 ease-out">
          {/* Logo and Title */}
          <div className="w-full flex flex-col justify-center items-center mb-4 sm:mb-6">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-blue-600 font-poppins tracking-wide text-center">
              Log In
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-sm mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg transform transition-all duration-300 animate-fade-in font-inter">
              <p className="font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Form */}
          <form
            className="w-full max-w-sm flex flex-col space-y-4 sm:space-y-5 transform transition-all duration-500"
            onSubmit={(e) => {
              e.preventDefault();
              signInWithEmail();
            }}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
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
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:py-3.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold font-inter tracking-wide text-sm sm:text-base"
              disabled={authing}
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
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex max-w-sm items-center justify-center relative py-4 sm:py-6 mt-3 sm:mt-4 mb-3 sm:mb-4">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            <p className="text-xs sm:text-sm absolute text-blue-600 bg-white px-3 sm:px-4 font-semibold font-inter tracking-wide">
              OR
            </p>
          </div>

          {/* Google Sign In */}
          <div className="w-full max-w-sm flex flex-col space-y-4">
            <button
              className="w-full flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 rounded-full px-4 sm:px-6 py-3 sm:py-3.5 hover:bg-blue-50 hover:scale-105 transition-all duration-300 transform hover:shadow-lg font-semibold font-inter tracking-wide text-sm sm:text-base"
              onClick={signInWithGoogle}
              disabled={authing}
            >
              {authing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
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
                  Signing In...
                </span>
              ) : (
                <>
                  <span className="hidden xs:inline">Sign In with Google</span>
                  <span className="xs:hidden">Google</span>
                  <FcGoogle className="ml-2 text-lg sm:text-xl" />
                </>
              )}
            </button>
          </div>

          {/* Mobile Sign Up Link */}
          <div className="block md:hidden mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
