import { X } from "lucide-react";
import type { Book } from "../userComponents/viewBooks";

interface FormData {
  name: string;
  email: string;
  department: string;
  year: string;
  address: string;
  phone: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  role: string;
  quantity: number;
  createdAt: string
}


interface BookOverviewProps {
  book: Book;
  currentUser: any; 
  isOpen: boolean;
  formData: FormData;
  onClose: () => void;
  onReserve: (book: Book) => void; 
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
}

const departments = [
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration ",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education ",
  "Bachelor of Science in Secondary Education",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function ReserveModal({
  isOpen,
  formData,
  setFormData,
  onSubmit,
  onClose,
}: BookOverviewProps) {
  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-blue-200">

    <div className="flex justify-between items-center p-4 border-b border-blue-300 bg-blue-50 rounded-2xl">
      <h3 className="text-xl font-bold text-blue-800">
        Book Reservation Form
      </h3>
      <button
        onClick={onClose}
        className="text-blue-500 hover:text-blue-700 transition"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

  
    <form
      className="p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
   
      <div className="mb-5">
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
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your full name"
              required
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
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your email address"
              required
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
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
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
              disabled
              onChange={(e) => {
                const newRole = e.target.value as "Student" | "Teacher";
                setFormData({
                  ...formData,
                  role: newRole,
                  year: newRole === "Student" ? "1st Year" : "N/A",
                });
              }}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
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
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              >
                <option disabled value="">
                  Select Year Level
                </option>
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
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your phone number"
              required
              disabled
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="Enter your permanent address"
            required
          />
        </div>
      </div>

      <div className="mb-5">
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
              onChange={(e) =>
                setFormData({ ...formData, bookTitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter book title"
              required
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
              onChange={(e) =>
                setFormData({ ...formData, bookAuthor: e.target.value })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter author name"
              required
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
              onChange={(e) =>
                setFormData({ ...formData, bookIsbn: e.target.value })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
              readOnly
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity === 0 ? "" : formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Number of books"
              min="1"
              required
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg shadow-md transition-colors duration-200 font-semibold text-sm"
        >
          Submit Reservation
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-6 rounded-lg transition-colors duration-200 font-semibold text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>
);
}

export default ReserveModal;
