import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Book } from "../userComponents/viewBooks";


interface FormData {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  department: string;
  year: string;
  address: string;
  phone: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  availableBooks: number;
  role: string;
  borrowQuantity: number;
  createdAt: string;
  returnDate: string;
  returnedAt: string;
}

interface ReserveModalProps {
  isOpen: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  book?: Book;
  errorMessage?: string; 
  setErrorMessage?: (error: string) => void;
}

const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  formData,
  setFormData,
  onSubmit,
  onClose,
   errorMessage,
  setErrorMessage,
}) => {
  const departments = [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Hospital Management",
    "Bachelor of Science in Elementary Education",
    "Bachelor of Science in Secondary Education",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
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
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-blue-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "85vh",
          position: "relative",
          zIndex: 10000,
          transform: "none",
          margin: 0,
          top: "-6%",
        }}
      >
   
        <div className="flex justify-between items-center p-4 border-b border-blue-300 bg-blue-50 rounded-t-2xl flex-shrink-0">
          <h3 className="text-xl font-bold text-blue-800">
            Book Reservation Form
          </h3>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 hover:bg-blue-100 rounded-full p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {errorMessage && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <p className="text-red-700 font-medium">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage?.("")}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-6">
           
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-200 pb-1">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    disabled
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                  >
                    <option value="">Select Department</option>
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
                    disabled
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>

                {formData.role === "Student" && (
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-1">
                      Year Level
                    </label>
                    <select
                      value={formData.year}
                      disabled
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                    >
                      <option value="">Select Year Level</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                    disabled
                  />
                </div>
                
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
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
              </div>

              
            </div>

          
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-200 pb-1">
                Book Information
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={formData.bookTitle}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.bookAuthor}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.bookIsbn}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Quantity
                  </label>

                  {formData.borrowQuantity > formData.availableBooks &&
                    formData.borrowQuantity > 0 && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-xs font-medium">
                          Quantity cannot exceed available books (
                          {formData.availableBooks})
                        </p>
                      </div>
                    )}

                  <input
                    type="number"
                    value={
                      formData.borrowQuantity === 0
                        ? ""
                        : formData.borrowQuantity
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);

                      setFormData({ ...formData, borrowQuantity: value });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      formData.borrowQuantity > formData.availableBooks &&
                      formData.borrowQuantity > 0
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-blue-300 focus:ring-blue-500"
                    }`}
                    placeholder="Number of books"
                    min="1"
                    max={formData.availableBooks}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg shadow-md transition-colors duration-200 font-semibold text-sm"
            >
              Submit Reservation
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-6 rounded-lg transition-colors duration-200 font-semibold text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveModal;
