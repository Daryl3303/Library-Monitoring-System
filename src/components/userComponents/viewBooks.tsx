import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Book,
  Calendar,
  User,
  Building2,
  Hash,
  FileText,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
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
  department: string;
  quantity: number;
}

const LibraryBookBrowser: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const departments = [
    "All",
    ...Array.from(new Set(books.map((book) => book.department))),
  ];

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData: Book[] = querySnapshot.docs.map((document) => {
        const data = document.data() as Book;

        return {
          id: document.id,
          title: data.title,
          author: data.author,
          publisher: data.publisher,
          date: data.date,
          isbn: data.isbn,
          department: data.department,
          quantity: data.quantity,
          description: data.description,
          coverPage: data.coverPage || "",
        };
      });

      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (book) => book.department === selectedDepartment
      );
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedDepartment, books]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseOverview = () => {
    setSelectedBook(null);
  };

  const handleReserve = (bookId: string) => {
    console.log("Reserving book:", bookId);
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div
      className="group bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1"
      onClick={() => handleBookClick(book)}
    >
      <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
        <img
          src={book.coverPage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGMUY1RjkiLz48cGF0aCBkPSJNNzAgMTAwSDEzMFYyMDBINzBWMTAwWiIgZmlsbD0iIzk0QTNBOCIvPjwvc3ZnPg==";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 bg-white/80 backdrop-blur-sm">
        <h3 className="font-bold text-sm mb-2 text-slate-800 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-slate-600 mb-3 font-medium">{book.author}</p>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm ${
              book.quantity > 0
                ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200"
                : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
            }`}
          >
            {book.quantity > 0 ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </div>
  );

  const BookOverview: React.FC<{
    book: Book;
    onClose: () => void;
    onReserve: (id: string) => void;
  }> = ({ book, onClose, onReserve }) => (
    <div
      className={`bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl border border-slate-200/50 backdrop-blur-sm ${
        isMobile ? "fixed inset-0 z-50 overflow-y-auto" : "sticky top-4"
      }`}
    >
      <div className="p-6 relative">
        {/* Header with gradient background */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            About This Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-110 group"
          >
            <X className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Book Cover with enhanced styling */}
          <div className="relative">
            <div className="aspect-[2/3] w-36 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl overflow-hidden shadow-lg ring-1 ring-slate-200">
              <img
                src={book.coverPage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGMUY1RjkiLz48cGF0aCBkPSJNNzAgMTAwSDEzMFYyMDBINzBWMTAwWiIgZmlsbD0iIzk0QTNBOCIvPjwvc3ZnPg==";
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <Book className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Title
                </p>
                <p className="font-bold text-slate-800 leading-tight">
                  {book.title}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <User className="w-5 h-5 mt-0.5 text-indigo-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Author(s)
                </p>
                <p className="font-medium text-slate-800">{book.author}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <Building2 className="w-5 h-5 mt-0.5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Publisher
                </p>
                <p className="font-medium text-slate-800">{book.publisher}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <Calendar className="w-5 h-5 mt-0.5 text-teal-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Year Published
                </p>
                <p className="font-medium text-slate-800">{book.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <Hash className="w-5 h-5 mt-0.5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  ISBN
                </p>
                <p className="font-medium text-slate-800 font-mono">
                  {book.isbn}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/30">
              <FileText className="w-5 h-5 mt-0.5 text-rose-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {book.description}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50">
            <div className="flex items-center justify-center mb-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  book.quantity > 0
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200"
                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-200"
                }`}
              >
                {book.quantity > 0
                  ? `Available (${book.quantity} copies)`
                  : "Not Available"}
              </span>
            </div>

            <button
              onClick={() => onReserve(book.id!)}
              disabled={book.quantity === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 transform shadow-lg ${
                book.quantity > 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed shadow-gray-200"
              }`}
            >
              {book.quantity > 0 ? "Reserve Book" : "Not Available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 mt-7">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 pointer-events-none z-10">
                <Search size={25} />
              </div>
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-300/50 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-700 hover:shadow-xl hover:border-slate-400/70 outline-none"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 
              transition-colors duration-200 z-10">
                <Filter size={25} />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white/80 backdrop-blur-sm border border-slate-300/50 rounded-2xl shadow-lg focus:ring-4
                 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300 text-slate-700 w-[250px] 
                 hover:shadow-xl hover:border-slate-400/70 cursor-pointer appearance-none bg-white outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
          {/* Books Grid */}
          <div className={`${selectedBook && !isMobile ? "flex-1" : "w-full"}`}>
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-600 inline-block pb-1">
              Library Books
            </h1>

            <div
              className={`grid gap-4 ${
                selectedBook && !isMobile
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No books found</p>
              </div>
            )}
          </div>

          {selectedBook && !isMobile && (
            <div className="w-80 flex-shrink-0">
              <BookOverview
                book={selectedBook}
                onClose={handleCloseOverview}
                onReserve={handleReserve}
              />
            </div>
          )}
        </div>

        {selectedBook && isMobile && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleCloseOverview}
            />
            <BookOverview
              book={selectedBook}
              onClose={handleCloseOverview}
              onReserve={handleReserve}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryBookBrowser;
