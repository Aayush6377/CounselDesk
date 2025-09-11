import React, { useState } from 'react';
import { CgUnblock } from "react-icons/cg";
import { MdBlock, MdDelete } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { IoMdPersonAdd } from "react-icons/io";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const filterButtons = [{ label: "All", value: ""},{ label: "Users", value: "user"},{ label: "Lawyers", value: "lawyer"},{ label: "Admins", value: "admin"}];

const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    role: 'user',
    status: 'Active',
    joinDate: '2023-10-26',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    role: 'lawyer',
    status: 'Active',
    joinDate: '2023-09-15',
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@legalai.com',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    role: 'admin',
    status: 'Active',
    joinDate: '2023-01-01',
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    role: 'user',
    status: 'Suspended',
    joinDate: '2023-08-20',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
    role: 'lawyer',
    status: 'Suspended',
    joinDate: '2023-07-11',
  },
];

const tableHeaders = ['User', 'Role', 'Status', 'Join Date', 'Actions'];

const getStatusStyles = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/10 text-green-400';
    case 'Suspended':
      return 'bg-yellow-500/10 text-yellow-400';
    default:
      return 'bg-gray-500/10 text-gray-400';
  }
};

const UserActions = ({ status }) => {
  if (status === 'Suspended') {
    return (
      <>
        <button className="p-2 text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
          <CgUnblock className="text-xl" />
        </button>
        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
          <MdDelete className="text-xl" />
        </button>
      </>
    );
  }
  return (
    <>
      <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
        <MdBlock className="text-xl" />
      </button>
      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
        <MdDelete className="text-xl" />
      </button>
    </>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState("");

  const filteredUsers = usersData
    .filter(user => {
      if (!activeFilter) {
        return true;
      }
      return user.role === activeFilter;
    })
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">
              User Management
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Manage all user, lawyer, and admin accounts.</p>
          </div>
          <div className="flex items-center gap-4">
            <NavLink to="/admin/create-admin" className="flex items-center justify-center gap-2 cursor-pointer rounded-lg h-11 px-4 bg-black/30 text-[var(--accent-color)] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
              <IoMdPersonAdd className="text-xl" />
              <span className="truncate">Create Admin</span>
            </NavLink>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-black/20 border border-white/10 rounded-xl">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 text-sm overflow-x-auto pb-2">
                {filterButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFilter(button.value)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activeFilter === button.value
                        ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]'
                        : 'text-gray-400 hover:bg-black/30 hover:text-[var(--accent-color)]'
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search Name or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input w-full rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 h-10 placeholder:text-[#9dabb9] pl-10 pr-4 text-sm font-normal"
                />
              </div>
            </div>
          </div>

          {/* Table for Desktop View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 text-xs text-gray-400 uppercase">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} scope="col" className={`px-6 py-3 font-medium ${header === 'Actions' ? 'text-right' : ''}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar} alt={user.name} className="aspect-square object-cover rounded-full size-10" />
                          <div>
                            <div className="text-sm font-bold text-[var(--accent-color)]">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {user.role !== 'admin' && (
                          <div className="flex justify-end gap-2">
                            <UserActions status={user.status} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center px-6 py-8 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="bg-black/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="aspect-square object-cover rounded-full size-10" />
                      <div>
                        <div className="font-bold text-[var(--accent-color)]">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-white/10"></div>
                   <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Role:</span>
                        <span className="text-white font-medium capitalize">{user.role}</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-gray-400">Join Date:</span>
                        <span className="text-white font-medium">{user.joinDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-gray-400">Status:</span>
                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                   </div>
                   {user.role !== 'admin' && (
                     <>
                      <div className="border-b border-white/10"></div>
                      <div className="flex justify-end gap-2 pt-2">
                        <UserActions status={user.status} />
                      </div>
                     </>
                   )}
                </div>
              ))
            ) : (
               <div className="text-center py-8 text-gray-400 col-span-1 sm:col-span-2">
                No users found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>Showing {filteredUsers.length} of {usersData.length} results</p>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer" disabled>
                <FaChevronCircleLeft className="text-lg" />
              </button>
              <button className="h-8 w-8 rounded-md bg-[var(--primary-color)] text-[var(--secondary-color)] cursor-pointer">1</button>
              <button className="p-2 hover:text-white transition-colors cursor-pointer">
                <FaChevronCircleRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserManagement;
