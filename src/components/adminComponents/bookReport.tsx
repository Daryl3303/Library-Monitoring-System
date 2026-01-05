import { useState, useEffect } from "react";
import { BookOpen, Filter, Search, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

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

const BookReports = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [bookCounts, setBookCounts] = useState<BookReservationCount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize with current month's start and end dates
  const getCurrentMonthDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };
  
  const defaultDates = getCurrentMonthDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const isDateInRange = (dateString: string): boolean => {
    const date = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set to start of day for accurate comparison
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return date >= start && date <= end;
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
      
      return isDateInRange(dateString);
    });

    console.log(`Filtered reservations for date range:`, filteredReservations.length);

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
      } else {
        console.log(`Unknown role: '${role}'`);
      }
      
      counts[key].totalReservations++;
    });

    console.log("Final book counts:", counts);
    setBookCounts(Object.values(counts));
  };

  const handleExportToExcel = () => {
    // Prepare header data
    const headerData = [
      ['Book Reservation Report'],
      [`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [], // Empty row for spacing
    ];

    // Prepare table headers
    const tableHeaders = [
      'Book Title',
      'ISBN',
      'Student Reservations',
      'Teacher Reservations',
      'Total Reservations'
    ];

    // Prepare table data (sorted by total reservations)
    const tableData = filteredBookCounts
      .sort((a, b) => b.totalReservations - a.totalReservations)
      .map(book => [
        book.bookTitle,
        book.bookIsbn,
        book.studentReservations,
        book.teacherReservations,
        book.totalReservations
      ]);

    // Calculate summary statistics
    const totalUniqueBooks = filteredBookCounts.length;
    const totalStudentReservations = filteredBookCounts.reduce((sum, book) => sum + book.studentReservations, 0);
    const totalTeacherReservations = filteredBookCounts.reduce((sum, book) => sum + book.teacherReservations, 0);
    const totalAllReservations = filteredBookCounts.reduce((sum, book) => sum + book.totalReservations, 0);

    const summaryData = [
      [], // Empty row
      ['Summary Statistics'],
      ['Unique Books', totalUniqueBooks],
      ['Student Reservations', totalStudentReservations],
      ['Teacher Reservations', totalTeacherReservations],
      ['Total Reservations', totalAllReservations]
    ];

    // Combine all data
    const worksheetData = [
      ...headerData,
      tableHeaders,
      ...tableData,
      ...summaryData
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    ws['!cols'] = [
      { wch: 50 }, // Book Title
      { wch: 15 }, // ISBN
      { wch: 20 }, // Student Reservations
      { wch: 20 }, // Teacher Reservations
      { wch: 20 }  // Total Reservations
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Book Reservations');

    // Generate filename with date and filter
    const filename = `Book_Reservation_Report_${startDate}_to_${endDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
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
  }, [reservations, startDate, endDate]);

  return (
    <div className="w-full h-full bg-gray-50 p-5">
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
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-blue-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Search Bar */}
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
                <label className="text-sm font-medium text-gray-700">Date Range:</label>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors sm:ml-auto"
              >
                <FileDown className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
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
  );
}

export default BookReports;