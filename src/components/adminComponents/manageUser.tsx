// LibraryUserTable.tsx
import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import UserFormModal from "../modals/AddUser";
import DeleteConfirmationModal from "../modals/Delete";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface User {
  id?: string;
  name: string;
  email: string;
  number: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
}

interface FormData {
  name: string;
  email: string;
  number: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    number: "",
    department: "",
    year: "",
    role: "Student",
  });

  // Filter users based on search and department
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData: User[] = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as User),
    }));
    setUsers(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  const handleAddUser = async () => {
    try{
    const docRef = await addDoc(collection(db, "users"), formData);
    setUsers([...users, { id: docRef.id, ...formData }]);
    setShowAddModal(false);
    resetForm();
  } catch (error) {
    console.error("Error adding user:", error);
  }
  };

const handleEditUser = async () => {
  if (selectedUser) {
    try {
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...selectedUser, ...formData } : user
        )
      );

      const userRef = doc(db, "users", selectedUser.id as string);
      await updateDoc(userRef, { ...formData });

      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
};

 const handleDeleteUser = async () => {
  if (selectedUser) {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "users", selectedUser.id as string));

      // Optionally update state (not needed if you use onSnapshot)
      setUsers(users.filter((user) => user.id !== selectedUser.id));

      // Reset UI states
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      number: "",
      department: "",
      year: "",
      role: "Student",
    });
    setSelectedUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      number: user.number,
      department: user.department,
      year: user.year,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
  <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
    {/* Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        User Management
      </h1>
    </div>

    {/* User Management Section */}
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
                placeholder="Search by name..."
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

          {/* Right side - Add User Button */}
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center hover:scale-105 duration-300 gap-2 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">Add User</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-50 border-b border-blue-700">
            <tr>
              {["Name", "Email", "Number", "Department", "Year", "Role", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                  {user.name}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500">
                  {user.email}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500">
                  {user.number}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500">
                  {user.department}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500">
                  {user.year}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === "Admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "Teacher"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500">
                  <div className="flex gap-2 justify-start sm:justify-center">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110 duration-200"
                    >
                      <Edit2 className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No users found matching your criteria.
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Modals remain unchanged */}
  <UserFormModal
    isOpen={showAddModal}
    isEdit={false}
    formData={formData}
    setFormData={setFormData}
    onSubmit={handleAddUser}
    onClose={closeModals}
  />

  <UserFormModal
    isOpen={showEditModal}
    isEdit={true}
    formData={formData}
    setFormData={setFormData}
    onSubmit={handleEditUser}
    onClose={closeModals}
  />

{selectedUser && (
  <DeleteConfirmationModal
    isOpen={showDeleteModal}
    user={selectedUser}
    onConfirm={handleDeleteUser}
    onCancel={closeModals}
  />
)}
</div>

  );
}
