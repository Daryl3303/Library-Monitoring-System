import { X } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-200">

        <div className="flex justify-between items-center p-6 border-b border-blue-300 bg-blue-50 rounded-t-2xl">
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
          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
