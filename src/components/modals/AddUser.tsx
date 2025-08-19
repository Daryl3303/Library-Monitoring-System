import { X } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  number: string;
  department: string;
  year: string;
  role: 'Student' | 'Teacher' | 'Admin';
}

interface UserFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const departments = ['Computer Science', 'Engineering', 'Business', 'Administration', 'Education', 'Liberal Arts'];

function UserFormModal({ 
  isOpen, 
  isEdit, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose 
}: UserFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-blue-200">
    
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b border-blue-300 bg-blue-50 rounded-t-2xl">
      <h3 className="text-xl font-bold text-blue-800">
        {isEdit ? 'Edit User' : 'Add New User'}
      </h3>
      <button
        onClick={onClose}
        className="text-blue-500 hover:text-blue-700 transition"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Form */}
    <div className="p-6">
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Year Level</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter year level"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Student' | 'Teacher' | 'Admin' })}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg shadow-md transition"
        >
          {isEdit ? 'Update User' : 'Add User'}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>

  );
}

export default UserFormModal;