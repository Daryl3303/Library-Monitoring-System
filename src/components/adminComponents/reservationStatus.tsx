import { useState, useEffect } from "react";
import { Search, BookOpenCheck} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface ReservationStatus {
  id?: string;
  uid?: string;
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
  status: string;
}

const ReservationStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Time");

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservationStatus"));
      const reservationStatusData: ReservationStatus[] = querySnapshot.docs.map(
        (document) => ({
          id: document.id,
          ...(document.data() as ReservationStatus),
        })
      );
      setReservationStatus(reservationStatusData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const departments = [
    "All Departments",
    ...new Set(reservationStatus.map((res) => res.department)),
  ];

  const dateFilters = [
    "All Time",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
  ] as const;

  type DateFilter =
    | "All Time"
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const filteredReservationStatus = reservationStatus.filter((res) => {
    const matchesSearch = res.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      res.department === selectedDepartment;
    const matchesDate = isDateInRange(
      res.createdAt,
      selectedDateFilter as DateFilter
    );

    return matchesSearch && matchesDepartment && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">

        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BookOpenCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Reservation
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
                    placeholder="Search by name..."
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
              </div>
            </div>
          </div>

  
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  {[
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
                    "Created At",
                    "Role",
                    "Status",
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
                {filteredReservationStatus
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50">
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
                              ? "bg-yellow-100 text-yellow-800"
                              : res.status === "Confirmed"
                              ? "bg-green-300 text-green-800"
                              : "bg-red-300 text-red-800"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {filteredReservationStatus.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No pending registrations found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationStatus;
