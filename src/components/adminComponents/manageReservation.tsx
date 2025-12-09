import { useState, useEffect } from "react";
import { Search, BookOpenCheck, CheckCircle, X } from "lucide-react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface ReservationStatus {
  id?: string;
  uid?: string;
  referenceNumber: string;
  name: string;
  email: string;
  department: string;
  year: string;
  address: string;
  phone: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  availableBooks: number;
  role: string;
  borrowQuantity: number;
  createdAt: string;
  returnDate: string;
  returnedDate: string;
  status: string;
}

const ReservationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservationStatus, setReservationStatus] = useState<
    ReservationStatus[]
  >([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Time");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("All Status");

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservationStatus"));
      const reservationStatusData: ReservationStatus[] = querySnapshot.docs.map(
        (document) => ({
          id: document.id,
          ...(document.data() as ReservationStatus),
        })
      );

      const updatedData = reservationStatusData.map((reservation) => {
        const currentDate = new Date();
        const returnDate = new Date(reservation.returnDate);

        if (
          currentDate > returnDate &&
          reservation.status !== "Returned" &&
          reservation.status !== "Overdue"
        ) {
          return { ...reservation, status: "Overdue" };
        }

        return reservation;
      });

      setReservationStatus(updatedData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleReturnBook = async (reservationId: string) => {
    try {
      const currentDate = new Date().toISOString();

      const reservationSnap = await getDoc(
        doc(db, "reservationStatus", reservationId)
      );
      if (!reservationSnap.exists()) {
        throw new Error("Reservation not found");
      }

      const reservationData = reservationSnap.data() as ReservationStatus;
      const borrowQuantity = reservationData.borrowQuantity;
      const bookIsbn = reservationData.bookIsbn;

      const booksSnapshot = await getDocs(collection(db, "books"));
      const bookDoc = booksSnapshot.docs.find(
        (doc) => doc.data().isbn === bookIsbn
      );

      if (!bookDoc) {
        throw new Error("Book not found");
      }

      const bookData = bookDoc.data();
      const newQuantity = (bookData.quantity || 0) + borrowQuantity;

      await updateDoc(doc(db, "books", bookDoc.id), { quantity: newQuantity });

      await updateDoc(doc(db, "reservationStatus", reservationId), {
        status: "Returned",
        returnedDate: currentDate,
      });

      setReservationStatus((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "Returned", returnedDate: currentDate }
            : reservation
        )
      );

      console.log("Reservation confirmed successfully!");
    } catch (error) {
      console.error("Error confirming reservation:", error);
      alert("Error confirming reservation. Please try again.");
    }
  };

  const handlePickupBook = async (reservationId: string) => {
    try {
      await updateDoc(doc(db, "reservationStatus", reservationId), {
        status: "In Use",
      });

      setReservationStatus((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "In Use" }
            : reservation
        )
      );
    } catch (error) {
      console.error("Error confirming reservation:", error);
      alert("Error confirming reservation. Please try again.");
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const reservationSnap = await getDoc(
        doc(db, "reservationStatus", reservationId)
      );
      if (!reservationSnap.exists()) {
        throw new Error("Reservation not found");
      }

      const reservationData = reservationSnap.data() as ReservationStatus;
      const borrowQuantity = reservationData.borrowQuantity;
      const bookIsbn = reservationData.bookIsbn;

      const booksSnapshot = await getDocs(collection(db, "books"));
      const bookDoc = booksSnapshot.docs.find(
        (doc) => doc.data().isbn === bookIsbn
      );

      if (!bookDoc) {
        throw new Error("Book not found");
      }

      const bookData = bookDoc.data();
      const newQuantity = (bookData.quantity || 0) + borrowQuantity;

      await updateDoc(doc(db, "books", bookDoc.id), { quantity: newQuantity });

      await updateDoc(doc(db, "reservationStatus", reservationId), {
        status: "Canceled",
      });

      setReservationStatus((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "Canceled" }
            : reservation
        )
      );

      console.log("Reservation canceled successfully!");
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const departments = [
    "All Departments",
    ...new Set(reservationStatus.map((res) => res.department)),
  ];

  const statusOptions = [
    "All Status",
    ...new Set(reservationStatus.map((res) => res.status)),
  ];

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

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusPriority = (status: string): number => {
    const priorities: { [key: string]: number } = {
      Pending: 1,
      Confirmed: 2,
      "In Use": 3,
      Returned: 4,
      Overdue: 5,
       Declined: 6,
      Canceled: 7,
    };
    return priorities[status] || 8;
  };

  const filteredReservationStatus = reservationStatus
    .filter((res) => {
      const matchesSearch = res.referenceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        res.department === selectedDepartment;
      const matchesDate = isDateInRange(
        res.createdAt,
        selectedDateFilter as DateFilter
      );
      const matchesStatus =
        selectedStatusFilter === "All Status" ||
        res.status === selectedStatusFilter;

      return matchesSearch && matchesDepartment && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      const statusDiff =
        getStatusPriority(a.status) - getStatusPriority(b.status);
      if (statusDiff !== 0) return statusDiff;

      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      <div className="w-full h-full bg-gray-50 p-5">
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BookOpenCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Reservation Management
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by reference #"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>

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

                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  {dateFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  {[
                    "Reference #",
                    "Name",
                    "Email",
                    "Department",
                    "Year",
                    "Address",
                    "Phone#",
                    "Book Title",
                    "Book Author",
                    "Book ISBN",
                    "Borrow Quantity",
                    "Reservation Date",
                    "Due Date",
                    "Returned Date",
                    "Role",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {filteredReservationStatus.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 text-center">
                        {res.referenceNumber}
                      </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 text-center">
                      {res.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {res.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {res.department}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          res.year === "1st Year"
                            ? "bg-red-300 text-red-900"
                            : res.year === "2nd Year"
                            ? "bg-blue-300 text-blue-900"
                            : res.year === "3rd Year"
                            ? "bg-green-300 text-green-900"
                            : res.year === "4th Year"
                            ? "bg-gray-300 text-gray-900"
                            : "bg-yellow-300 text-yellow-900"
                        }`}
                      >
                        {res.year === "" ? "N/A" : res.year}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate" title={res.address}>
                        {res.address}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {res.phone}
                    </td>

                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate" title={res.bookTitle}>
                        {res.bookTitle}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate">{res.bookAuthor}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate">{res.bookIsbn}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate">{res.borrowQuantity}</div>
                    </td>

                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {formatDate(res.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {formatDate(res.returnDate)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {res.status === "Returned" ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {formatDate(res.returnedDate)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          res.role === "Admin"
                            ? "bg-red-100 text-red-800"
                            : res.role === "Teacher"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {res.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          res.status === "Pending"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : res.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : res.status === "Declined"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : res.status === "In Use"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : res.status === "Overdue"
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : res.status === "Returned"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : res.status === "Canceled"
                            ? "bg-gray-100 text-gray-700 border border-gray-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                      {res.status === "Confirmed" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePickupBook(res.id!)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Pick Up
                          </button>
                          <button
                            onClick={() => handleCancelReservation(res.id!)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      ) : res.status === "In Use" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleReturnBook(res.id!)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Return
                          </button>
                        </div>
                      ) : res.status === "Overdue" ? (
                        <button
                          onClick={() => handleReturnBook(res.id!)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Return
                        </button>
                      ) : res.status === "Returned" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReservationStatus.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No reservations found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationManagement;
