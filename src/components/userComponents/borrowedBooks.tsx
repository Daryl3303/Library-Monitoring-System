import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase'; 
import { BookOpen, Package, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

const BorrowedBooks: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, statusFilter]);

  const getStatusPriority = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'overdue': return 1;
      case 'pending': return 2;
      case 'confirmed': return 3;
      case 'returned': return 4;
      default: return 5;
    }
  };

  const filterAndSortBooks = () => {
    let result = [...books];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(book => book.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Sort by status priority
    result.sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));
    
    setFilteredBooks(result);
  };

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setError('Please sign in to view your borrowed books');
        setLoading(false);
        return;
      }

      const reservationsRef = collection(db, 'reservationStatus');
      const q = query(reservationsRef, where('uid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      const borrowedBooks: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        borrowedBooks.push({
          id: doc.id,
          bookTitle: data.bookTitle || 'Unknown Book',
          quantity: data.quantity || 1,
          status: data.status || 'Pending',
          returnDate: data.returnDate || null,
          createdAt: data.createdAt || null
        });
      });

      setBooks(borrowedBooks);
      setError(null);
    } catch (err) {
      console.error('Error fetching borrowed books:', err);
      setError('Failed to load borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'returned':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'returned':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-blue-700 font-medium">Loading your borrowed books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-200">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={fetchBorrowedBooks}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
           {/* Summary */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    {statusFilter === 'all' ? 'Total Books Borrowed' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Books`}
                  </p>
                  <p className="text-3xl font-bold mt-1">{filteredBooks.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-200 opacity-50" />
              </div>
            </div>
          
        </div>

        {/* Status Filter */}
        {books.length > 0 && (
          <div className="mb-6">
            <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Status
            </label>
            <div className="relative w-full sm:w-64">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-blue-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300"
              >
                <option value="all">All ({books.length})</option>
                <option value="overdue">Overdue ({books.filter(b => b.status.toLowerCase() === 'overdue').length})</option>
                <option value="pending">Pending ({books.filter(b => b.status.toLowerCase() === 'pending').length})</option>
                <option value="confirmed">Confirmed ({books.filter(b => b.status.toLowerCase() === 'confirmed').length})</option>
                <option value="returned">Returned ({books.filter(b => b.status.toLowerCase() === 'returned').length})</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 && books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Borrowed Books</h3>
            <p className="text-gray-500">You haven't borrowed any books yet.</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Books Found</h3>
            <p className="text-gray-500">No books match the selected filter.</p>
          </div>
        ) : (
          <>
            {/* Table View - Both Desktop and Mobile */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Book Title</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Quantity</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBooks.map((book) => (
                      <tr 
                        key={book.id} 
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base break-words">{book.bookTitle}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium text-sm sm:text-base">{book.quantity}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(book.status)}`}>
                            {getStatusIcon(book.status)}
                            <span className="hidden sm:inline">{book.status}</span>
                            <span className="sm:hidden">{book.status.slice(0, 4)}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

           
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;