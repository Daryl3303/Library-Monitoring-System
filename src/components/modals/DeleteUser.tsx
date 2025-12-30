import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface User {
  id?: string;
  name: string;
  email: string;
  number: string;
  department: string;
  year: string;
  role: 'Student' | 'Teacher';
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const modalContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
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
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default DeleteConfirmationModal;