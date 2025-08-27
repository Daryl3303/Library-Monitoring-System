// LibraryUserTable.tsx
import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, BookText } from "lucide-react";
import AddBookModal from "../modals/AddBook";
import DeleteBookModal from "../modals/DeleteBook";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface Book {
  id?: string;
  coverPage: string;
  title: string;
  author: string;
  overview: string;
  publisher: string;
  date: string;
  isbn: string;
  department: string;
  quantity: number;
}

interface FormData {
  coverPage: string;
  title: string;
  author: string;
  overview: string;
  publisher: string;
  date: string;
  isbn: string;
  department: string;
  quantity: number;
}

const departments = [
  "All Departments",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration ",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education ",
  "Bachelor of Science in Secondary Education",
];

export default function LibraryUserTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<FormData>({
    coverPage: "",
    title: "",
    author: "",
    overview: "",
    publisher: "",
    date: "",
    isbn: "",
    department: "",
    quantity: 0,
  });

  // Filter books based on search and department
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      book.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData: Book[] = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Book),
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


   const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // converts to Base64 string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddBook = async () => {
    if (!file) return;

    try {
      const base64String = await fileToBase64(file);
      const newBook = { ...formData, coverPage: base64String };

      const docRef = await addDoc(collection(db, "books"), newBook);
      setBooks([...books, { id: docRef.id, ...newBook }]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding book:", error);
      console.log(books)
    }
  };

  const handleEditBook = async () => {
    if (selectedBook) {
      try {
        let updatedData = { ...formData };

        if (file) {
        const base64String = await fileToBase64(file);
        updatedData.coverPage = base64String;
      }
        const bookRef = doc(db, "books", selectedBook.id as string);
        await updateDoc(bookRef, { ...formData });

        // Update local state after successful Firestore update
        setBooks(
          books.map((book) =>
            book.id === selectedBook.id ? { ...book, ...formData } : book
          )
        );

        setShowEditModal(false);
        resetForm();
      } catch (error) {
        console.error("Error updating book:", error);
      }
    }
  };

  const handleDeleteBook = async () => {
    if (selectedBook) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "books", selectedBook.id as string));

        // Update local state
        setBooks(books.filter((book) => book.id !== selectedBook.id));

        // Reset UI states
        setShowDeleteModal(false);
        setSelectedBook(null);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      coverPage: "",
      title: "",
      author: "",
      overview: "",
      publisher: "",
      date: "",
      isbn: "",
      department: "",
      quantity: 0,
    });
    setSelectedBook(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      coverPage: book.coverPage,
      title: book.title,
      author: book.author,
      overview: book.overview,
      publisher: book.publisher,
      date: book.date,
      isbn: book.isbn,
      department: book.department,
      quantity: book.quantity,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (book: Book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 h-screen overflow-y-auto">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BookText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Books Status
              </h1>
            </div>
          </div>
        </div>

        {/* Book Management Section */}
        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Left side - Search + Department Filter */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right side - Add Book Button */}
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center hover:scale-105 duration-300 gap-2 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm sm:text-base">Add Book</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  {[
                    "Title",
                    "Author",
                    "Publisher",
                    "Year",
                    "ISBN",
                    "Department",
                    "Quantity",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 text-center">
  {book.coverPage ? (
    <img
      src={book.coverPage}
      alt={book.title}
      className="w-16 h-20 object-cover rounded"
    />
  ) : (
    <span className="text-gray-400">No Cover</span>
  )}
</td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.author}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.publisher}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.date}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.isbn}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 max-w-xs text-center">
                      {book.department}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                       <span className={`px-3 py-1 text-s font-medium rounded-full text-center                   
                        ${book.quantity ? "text-green-500" : "text-red-500 bg-red-100"}`}> 
                      {book.quantity > 0 ? (book.quantity + " " + "left") : "Not Available"}
                      </span>  
                    </td>

                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => openEditModal(book)}
                          className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110 duration-200"
                        >
                          <Edit2 className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(book)}
                          className="text-red-600 hover:text-red-800 transition-colors hover:scale-110 duration-200"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBooks.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No books found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBookModal
        isOpen={showAddModal}
        isEdit={false}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddBook}
        onClose={closeModals}
      />

      <AddBookModal
        isOpen={showEditModal}
        isEdit={true}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditBook}
        onClose={closeModals}
      />

      {selectedBook && (
        <DeleteBookModal
          isOpen={showDeleteModal}
          book={selectedBook}
          onConfirm={handleDeleteBook}
          onCancel={closeModals}
        />
      )}
    </div>
  );
}
