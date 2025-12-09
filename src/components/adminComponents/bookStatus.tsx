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
  description: string;
  publisher: string;
  date: string;
  isbn: string;
  genre: string;
  quantity: number;
}

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


export default function LibraryUserTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All Book Genres");
const [genres, setGenres] = useState<string[]>(["All Book Genres"]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<FormData>({
    coverPage: "",
    title: "",
    author: "",
    description: "",
    publisher: "",
    date: "",
    isbn: "",
    genre: "",
    quantity: 0,
  });

  
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenres =
      selectedGenre === "All Book Genres" ||
      book.genre?.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenres;
  });

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData: Book[] = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Book),
      }));
      setBooks(booksData);

      const uniqueGenres = Array.from(
         new Set(
        booksData
          .map((book) => book.genre?.trim().toLowerCase())
          .filter(Boolean))).map((g) => g.charAt(0).toUpperCase() + g.slice(1))
          .sort();

      setGenres(["All Book Genres", ...uniqueGenres]);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);




  const handleAddBook = async () => {
    try {
      const newBook = { ...formData };

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
        const updatedData = { ...formData };

        const bookRef = doc(db, "books", selectedBook.id as string);
        await updateDoc(bookRef, { ...formData });
        setBooks(
          books.map((book) =>
            book.id === selectedBook.id ? { ...book, ...updatedData } : book
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
        await deleteDoc(doc(db, "books", selectedBook.id as string));
        setBooks(books.filter((book) => book.id !== selectedBook.id));
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
      description: "",
      publisher: "",
      date: "",
      isbn: "",
      genre: "",
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
      description: book.description,
      publisher: book.publisher,
      date: book.date,
      isbn: book.isbn,
      genre: book.genre,
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

   const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="w-full h-full bg-gray-50 p-5">
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

      
        <div className="bg-white rounded-[20px] border border-blue-800">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
         
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

             
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

  
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center hover:scale-105 duration-300 gap-2 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm sm:text-base">Add Book</span>
              </button>
            </div>
          </div>

     
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  {[
                    "Title",
                    "Author",
                    "Publisher",
                    "Date Published",
                    "ISBN",
                    "Genre",
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
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 font-semibold text-center">
                      {book.title}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.author}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.publisher}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {formatDate(book.date)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {book.isbn}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 max-w-xs text-center">
                      {book.genre}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                       <span className={`px-3 py-1 text-s font-medium rounded-full text-center                   
                        ${book.quantity ? "text-green-600" : "text-red-500 bg-red-100"}`}> 
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
