import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  address: string;
  number: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
}

interface UserFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: FormData;
  error: string;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const departments = [
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education",
  "Bachelor of Science in Secondary Education",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function UserFormModal({
  isOpen,
  isEdit,
  error,
  formData,
  setFormData,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  

  const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (isOpen) {
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
  
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
  
        return () => {
          document.body.style.overflow = originalOverflow;
          document.body.style.position = originalPosition;
          document.body.style.width = "";
          document.body.style.height = "";
        };
      }
    }, [isOpen]);

    useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
     onClick={handleBackdropClick}
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        margin: 0,
      }}>
      
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-blue-200 flex flex-col mx-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "85vh",
          position: "relative",
          zIndex: 10000,
          transform: "none",
          margin: "0 auto",
          top: "-3%",
          right: "9%",
        }}
      >
     
        <div className="flex justify-between items-center p-6 border-b border-blue-300 bg-blue-50 rounded-t-2xl flex-shrink-0">
          <h3 className="text-xl font-bold text-blue-800">
            {isEdit ? "Edit User" : "Add New User"}
          </h3>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="w-full max-w-sm mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg transform transition-all duration-300 animate-fade-in font-inter">
            <p className="font-medium text-sm sm:text-base">{error}</p>
          </div>
        )}


        <div className="flex-1 overflow-y-auto">

        <form
          className="p-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Email
              </label>
              {isEdit ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {formData.email}
                </div>
              ) : (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              )}
            </div>

            {!isEdit && (
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Password
              </label>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 pr-12 border border-blue-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-r-lg transition-colors"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
              )}

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your current address"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option disabled value="">
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

   
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value as
                    | "Student"
                    | "Teacher"
                    | "Admin";
                  setFormData({
                    ...formData,
                    role: newRole,
                    year: newRole === "Student" ? "1st Year" : "N/A",
                  });
                }}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {formData.role === "Student" && (
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Year Level
                </label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option disabled value="">
                    Select Year
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          

     
          
        </form>
        </div>
        <div className="flex gap-3 p-6 pt-4 border-t border-gray-200 flex-shrink-0">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            {isEdit ? "Update User" : "Add User"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          </div>
      </div>
    </div>
  );
}

export default UserFormModal;
