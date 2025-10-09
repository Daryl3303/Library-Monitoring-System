import { useState, useEffect } from "react";
import { BookOpen, Filter, Search } from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface ReservationData {
  id?: string;
  bookIsbn?: string;
  bookTitle?: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
  reservationDate?: any;
  createdAt?: any; 
}

interface BookReservationCount {
  bookIsbn: string;
  bookTitle: string;
  totalReservations: number;
  studentReservations: number;
  teacherReservations: number;
}

const dateFilters = [
  "All Time",
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
] as const;

type DateFilter =
  | "All Time"
  | "Today"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month";

const BookReports = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>("All Time");
  const [bookCounts, setBookCounts] = useState<BookReservationCount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const isDateInRange = (dateString: string, filter: DateFilter): boolean => {
    if (filter === "All Time") return true;

    const date = new Date(dateString);
    const now = new Date();

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysDiff =
      (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24);

    switch (filter) {
      case "Today":
        return daysDiff === 0;
      case "Last 7 Days":
        return daysDiff >= 0 && daysDiff <= 7;
      case "Last 30 Days":
        return daysDiff >= 0 && daysDiff <= 30;
      case "This Month":
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      case "Last Month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );
      default:
        return true;
    }
  };

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservationStatus"));
      const reservationsData: ReservationData[] = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as ReservationData),
      }));
      
      setReservations(reservationsData); 
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const calculateBookCounts = () => {
    const counts: { [key: string]: BookReservationCount } = {};
    
    console.log("Total reservations to process:", reservations.length);

    const filteredReservations = reservations.filter((reservation) => {
      let dateString = reservation.createdAt;
      if (reservation.createdAt && typeof reservation.createdAt.toDate === 'function') {
        dateString = reservation.createdAt.toDate().toISOString();
      } else if (reservation.createdAt && reservation.createdAt.seconds) {
        dateString = new Date(reservation.createdAt.seconds * 1000).toISOString();
      }
      
      return isDateInRange(dateString, selectedDateFilter);
    });

    console.log(`Filtered reservations for ${selectedDateFilter}:`, filteredReservations.length);

    filteredReservations.forEach((reservation, index) => {
      const bookIsbn = reservation.bookIsbn || "Unknown ISBN";
      const bookTitle = reservation.bookTitle || "Unknown Title";
      const key = `${bookIsbn}-${bookTitle}`;
      
      console.log(`Processing reservation ${index + 1}:`, {
        id: reservation.id,
        bookIsbn,
        bookTitle,
        role: reservation.role,
        createdAt: reservation.createdAt
      });
      
      if (!counts[key]) {
        counts[key] = {
          bookIsbn,
          bookTitle,
          totalReservations: 0,
          studentReservations: 0,
          teacherReservations: 0,

        };
      }

      const role = reservation.role?.toString().trim();
      
      if (role === "Student") {
        counts[key].studentReservations++;
        console.log(`Student reservation incremented for ${bookTitle}:`, counts[key].studentReservations);
      } else if (role === "Teacher") {
        counts[key].teacherReservations++;
        console.log(`Teacher reservation incremented for ${bookTitle}:`, counts[key].teacherReservations);
      }else {
        console.log(`Unknown role: '${role}'`);
      }
      
      counts[key].totalReservations++;
    });

    console.log("Final book counts:", counts);
    setBookCounts(Object.values(counts));
  };

 
  const filteredBookCounts = bookCounts.filter((book) =>
    book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookIsbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    calculateBookCounts();
  }, [reservations, selectedDateFilter]);

  return (
    <div>
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Book Reservation Report
              </h1>
              <p className="text-gray-600 mt-1">Track book reservations by title and ISBN</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by book title or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Time Period:</label>
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value as DateFilter)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gray-50 border-b border-blue-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredBookCounts.length}</div>
                <div className="text-sm text-gray-500">Unique Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredBookCounts.reduce((sum, book) => sum + book.studentReservations, 0)}
                </div>
                <div className="text-sm text-gray-500">Student Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredBookCounts.reduce((sum, book) => sum + book.teacherReservations, 0)}
                </div>
                <div className="text-sm text-gray-500">Teacher Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredBookCounts.reduce((sum, book) => sum + book.totalReservations, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Reservations</div>
              </div>    
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Book Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    ISBN
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Student Reservations
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Teacher Reservations
                  </th> 
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Total Reservations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {filteredBookCounts
                  .sort((a, b) => b.totalReservations - a.totalReservations)
                  .map((book) => (
                    <tr key={`${book.bookIsbn}-${book.bookTitle}`} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 text-gray-900 text-xs sm:text-sm">
                        <div className="font-medium">{book.bookTitle}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm text-gray-500">
                        {book.bookIsbn}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {book.studentReservations}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          {book.teacherReservations}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                          {book.totalReservations}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {filteredBookCounts.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                {searchTerm 
                  ? `No books found matching "${searchTerm}" for the selected time period.`
                  : "No book reservation data found for the selected criteria."
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookReports;