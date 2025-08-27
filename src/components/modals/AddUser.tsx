import { X } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
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
  "Bachelor of Science in Business Administration ",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education ",
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
  if (!isOpen) return null;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-blue-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-blue-300 bg-blue-50 rounded-t-2xl">
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

        {/* Form */}
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

            {/* Email - Different behavior for edit vs add */}
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

            {/* Password - Different behavior for edit vs add */}
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
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

            {/* Phone Number */}
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

            {/* Department */}
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

            {/* Role */}
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

            {/* Year */}
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

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg shadow-md transition"
            >
              {isEdit ? "Update User" : "Add User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
