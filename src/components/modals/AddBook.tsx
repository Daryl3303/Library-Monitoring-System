import { X } from "lucide-react";
import { useEffect } from "react";

interface FormData {
  coverPage: string;
  title: string;
  author: string;
  description: string;
  publisher: string;
  date: string;
  isbn: string;
  genre: string;
  quantity: number;
}

interface AddBookModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function AddBookModal({
  isOpen,
  isEdit,
  formData,
  setFormData,
  onSubmit,
  onClose,
}: AddBookModalProps) {
  
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
        boxSizing: "border-box",
      }}
    >
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
            {isEdit ? "Edit Book" : "Add New Book"}
          </h3>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            className="p-6 pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
     
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Cover Page
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({
                          ...formData,
                          coverPage: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!formData.coverPage}
                />
              </div>


              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book's Title"
                  required
                />
              </div>

 
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author's Name"
                  required
                />
              </div>

            
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) =>
                    setFormData({ ...formData, publisher: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Publisher's Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Year Published
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

          
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ISBN Number"
                  required
                />
              </div>

  
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Book Genre
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fiction, Mystery, Romance"
                  required
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
                      quantity:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Quantity of Books"
                  min="1"
                  required
                />
              </div>

             
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Book Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book's Overview"
                  required
                  rows={4}
                />
              </div>
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
            {isEdit ? "Update Book" : "Add Book"}
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

export default AddBookModal;