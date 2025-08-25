  import { Trash2 } from 'lucide-react';

  interface User {
    id?: string;
    name: string;
    email: string;
    number: string;
    department: string;
    year: string;
    role: 'Student' | 'Teacher' | 'Admin';
  }

  interface DeleteConfirmationModalProps {
    isOpen: boolean;
    user: User | null;
    onConfirm: () => void;
    onCancel: () => void;
  }

  function DeleteConfirmationModal({ 
    isOpen, 
    user, 
    onConfirm, 
    onCancel 
  }: DeleteConfirmationModalProps) {
    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-sm w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{user.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default DeleteConfirmationModal;