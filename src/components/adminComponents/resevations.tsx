import { useState, useEffect } from "react";
import { Search, BookOpenCheck, X, Check } from "lucide-react";
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface Reservation {
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
}


const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");


  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservations"));
      const reservationsData: Reservation[] = querySnapshot.docs.map(
        (document) => ({
          id: document.id,
          ...(document.data() as Reservation),
        })
      );
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const departments = [
    "All Departments",
    ...new Set(reservations.map((res) => res.department)),
  ];

 

 const handleConfirm = async (reservationId: string) => {
    try {
      
      const reservationSnap = await getDoc(doc(db, "reservations", reservationId));
      if (!reservationSnap.exists()) {
        throw new Error("Reservation not found");
      }

      const reservationData = reservationSnap.data() as Reservation;
      const borrowQuantity = reservationData.borrowQuantity;
      const bookIsbn = reservationData.bookIsbn;

      const booksSnapshot = await getDocs(collection(db, "books"));
      const bookDoc = booksSnapshot.docs.find((doc) => doc.data().isbn === bookIsbn);

      if (!bookDoc) {
        throw new Error("Book not found");
      }

      const bookData = bookDoc.data();
      const newQuantity = (bookData.quantity || 0) - borrowQuantity;

     

      await updateDoc(doc(db, "books", bookDoc.id), { quantity: newQuantity });

      
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 7);

   
      await updateDoc(doc(db, "reservationStatus", reservationId), {
        status: "Confirmed",
      });

      await handleDeleteReservation(reservationId);

      console.log("Reservation confirmed successfully!");
    } catch (error) {
      console.error("Error confirming reservation:", error);
      alert("Error confirming reservation. Please try again.");
    }
  };

  const handleDecline = async (reservationId: string) => {
    try {
    await updateDoc(doc(db, "reservationStatus", reservationId), {
      status: "Declined",
    });
      await handleDeleteReservation(reservationId);
    }catch(error){
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
        try {
          await deleteDoc(doc(db, "reservations", reservationId));
          setReservations(reservations.filter((res) => res.id !== reservationId));
        } catch (error) {
          console.error("Error deleting book:", error);
        }
      }

  

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = res.referenceNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      res.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
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
                Pending Resevation
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
                    "Created At",
                    "Role",
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
                {filteredReservations
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((res) => (
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
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleConfirm(res.id!)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 p-2 rounded-lg transition-colors hover:scale-110 duration-200"
                            title="Confirm"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDecline(res.id!)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors hover:scale-110 duration-200"
                            title="Decline"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {filteredReservations.length === 0 && (
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

export default Reservations;