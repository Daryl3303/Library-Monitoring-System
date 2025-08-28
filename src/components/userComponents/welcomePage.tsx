import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
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
interface WelcomePageProps {
  onViewBooks?: () => void;
}

export default function WelcomePage({onViewBooks}: WelcomePageProps) {

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData: Book[] = querySnapshot.docs.map((document) => {
        const data = document.data() as Book;
        return {
          id: document.id,
          coverPage: data.coverPage || "",
          title: data.title || "Untitled",
          author: data.author || "Unknown",
          overview: data.overview || "",
          publisher: data.publisher || "",
          date: data.date || "",
          isbn: data.isbn || "",
          department: data.department || "",
          quantity: data.quantity || 0,
        };
      });

      setBooks(booksData.slice(0, 3));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleViewBooks = () => {
    onViewBooks?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 leading-tight">
            LCC-Isabela Online Library Reservation System
          </h1>
          <p className="text-blue-700 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore a wide collection of books and resources designed to support
            your academic journey. Enhance your knowledge across different
            fields of study and easily reserve books online at your convenience.
            <br />
            <strong>Start discovering, learning, and reserving today!</strong>
          </p>
        </div>

        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="relative">
              {/* Desktop */}
              <div className="hidden md:block">
                <div
                  className="flex justify-start items-center space-x-4 pb-4 px-4">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="flex-shrink-0 w-60"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 h-full">
                        <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                          <img
                            src={book.coverPage}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop";
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-blue-900 text-sm mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-blue-600 text-xs">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                <div className="flex justify-start items-center overflow-x-auto scrollbar-hide space-x-4 pb-4 px-4">
                  {books.map((book) => (
                    <div key={book.id} className="flex-shrink-0 w-48">
                      <div className="bg-white rounded-xl shadow-lg p-3 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                        <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                          <img
                            src={book.coverPage}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-blue-900 text-sm mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-blue-600 text-xs">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Books Button */}
        <div className="text-center">
          <button
            onClick={handleViewBooks}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg md:text-xl w-full md:w-auto min-w-64"
          >
            View Books
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-blue-600 text-sm">
            LCC-Isabela Smart Library System
          </p>
        </div>
      </div>
    </div>
  );
}
