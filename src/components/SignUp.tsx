import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const departments = [
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration ",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education ",
  "Bachelor of Science in Secondary Education",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const SignUp = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const signUpWithEmail = async () => {
    setAuthing(true);
    setError("");

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(response.user, { displayName: name });
      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        name,
        email,
        number,
        department,
        year: role === "Student" ? year : "",
        role,
        createdAt: new Date(),
      });

    
      navigate("/user");
    } catch (err: any) {
  console.error("Signup error:", err);

  let message = "Signup failed.";

  switch (err.code) {
    case "auth/email-already-in-use":
      message = "Email already in use.";
      break;
    case "auth/weak-password":
    case "auth/missing-password":
      if (password.length < 6) {
        message = "Min 6 characters.";
      } else if (!/[A-Z]/.test(password)) {
        message = "Need 1 uppercase letter.";
      } else if (!/[a-z]/.test(password)) {
        message = "Need 1 lowercase letter.";
      } else if (!/[0-9]/.test(password)) {
        message = "Need 1 number.";
      } else {
        message = "Invalid password.";
      }
      break;
    case "auth/invalid-email":
      message = "Invalid email.";
      break;
    default:
      message = err.message?.replace(/^Firebase:\s*/i, "") || message;
      break;
  }

  setError(message);
  setAuthing(false);
}
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-3 sm:p-4 font-inter">
      <div
        className={`relative w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse transform transition-all duration-700 ease-out ${
          isLoaded
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-8"
        }`}
      >
        {/* Mobile Header - Only visible on small screens */}
        <div className="block md:hidden w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 text-center">
          <h2 className="text-2xl sm:text-3xl italic font-medium font-serif text-white tracking-wide mb-2 leading-tight">
            Hello!
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed font-inter">
            Fill up your personal information and start your journey with us
          </p>
        </div>

        {/* Message Side - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-6 lg:p-8 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white transform transition-all duration-700 ease-out">
          <div className="transform transition-all duration-500 hover:scale-105">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl italic font-medium font-serif text-white tracking-wide text-center mb-4 leading-tight">
              Hello!
            </h2>
            <p className="mb-6 lg:mb-8 max-w-sm text-blue-100 leading-relaxed font-inter text-sm lg:text-base">
              Fill up your personal information and start your journey with us
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 lg:px-8 py-2.5 lg:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-inter tracking-wide text-sm lg:text-base"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center bg-white transform transition-all duration-700 ease-out">
          {/* Logo and Title */}
          <div className="w-full flex flex-col justify-center items-center mb-4 sm:mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-blue-600 font-poppins tracking-wide text-center">
              Register
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
              signUpWithEmail();
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-colors"
              >
                {showPassword ? (
                  <Eye className="h-6 w-6 text-gray-400" />
                ) : (
                  <EyeOff className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
            />

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
              required
            >
              <option disabled value="">
                Select Department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>

            {role === "Student" && (
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-2xl border-2 transition-all duration-300 text-lg 
                                 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                                 border-gray-200 hover:border-gray-300 bg-white
                                font-inter placeholder-gray-400 focus:outline-none"
                required
              >
                <option disabled value="">
                  Select Year
                </option>
                {years.map((yearOption, index) => (
                  <option key={index} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            )}

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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Mobile Sign In Link */}
          <div className="block md:hidden mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
