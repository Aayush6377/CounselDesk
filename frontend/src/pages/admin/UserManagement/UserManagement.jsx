import React, { useEffect, useState } from 'react';
import { CgUnblock } from "react-icons/cg";
import { MdBlock, MdDelete } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { IoMdPersonAdd } from "react-icons/io";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData, updateUserStatus } from '../../../services/admin.service';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import { images } from '../../../assets/assets';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

const filterButtons = [{ label: "All", value: ""},{ label: "Users", value: "user"},{ label: "Lawyers", value: "lawyer"},{ label: "Admins", value: "admin"}];

const tableHeaders = ['User', 'Role', 'Status', 'Join Date', 'Actions'];

const formatJoinDate = (dateString) => {
    return moment(dateString).tz("Asia/Kolkata").format('MMM Do, YYYY');
}

const getStatusStyles = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-400 capitalize';
    case 'suspended':
      return 'bg-yellow-500/10 text-yellow-400 capitalize';
    default:
      return 'bg-gray-500/10 text-gray-400 capitalize';
  }
};

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
      page: 1,
      search: '',
      role: ''
  });
  const [liveSearchTerm, setLiveSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [userData, setUserData] = useState([]);

  const { data: result,  isPending, isError, error} = useQuery({
      queryKey: ["UserData", filters.page],
      queryFn: () => getUserData(filters.page, filters.role, filters.search),
      keepPreviousData: true,
  });

  useEffect(() => {
      const debounceTimer = setTimeout(() => {
          if (liveSearchTerm !== filters.search) {
              setFilters(prev => ({ ...prev, search: liveSearchTerm, page: 1 }));
          }
      }, 500);
      return () => clearTimeout(debounceTimer);
  }, [liveSearchTerm, filters.search]);

  useEffect(() => {
      queryClient.invalidateQueries({queryKey: ["UserData", filters.page]});
  }, [filters, queryClient]);

  useEffect(() => {
    if (result) {
        setUserData(result.data);
        setPagination(result.pagination);
    }
  }, [result]);

  const handleSearchChange = (e) => {
      setLiveSearchTerm(e.target.value);
      queryClient.invalidateQueries({queryKey: ["UserData", filters.page]});
  }
  
  const handleRoleChange = (newRole) => {
      setFilters(prev => ({ ...prev, role: newRole, page: 1 }));
      queryClient.invalidateQueries({queryKey: ["UserData", filters.page]});
  }

  const handlePageChange = (newPage) => {
      if (typeof newPage !== 'number') return; 
      setFilters(prev => ({ ...prev, page: newPage }));
  };

  //Status update api call
  const { mutate: updateStatus } = useMutation({
    mutationFn: ( {status,userId} ) => updateUserStatus(status,userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({queryKey: ["UserData", filters.page]});
      toast.success(res.message || "User status successfully updated!!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Unable to update status, please try again.");
    }
  });

  if (isPending){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);
      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
  }

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
                    onClick={() => handleRoleChange(button.value)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filters.role === button.value
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
                  value={liveSearchTerm}
                  onChange={handleSearchChange}
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
                {userData.length > 0 ? (
                  userData.map((user) => (
                    <tr key={user._id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img src={user.profileImage || images.defaultProfile} alt={user.name} className="aspect-square object-cover rounded-full size-10" />
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatJoinDate(user.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {user.role !== 'admin' && (
                          <div className="flex justify-end gap-2">
                            { user.status === 'suspended' ? 
                              <button onClick={() => updateStatus({status: 'active', userId: user._id})} className="p-2 text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                                <CgUnblock className="text-xl" />
                              </button>
                             : <button onClick={() => updateStatus({status: 'suspended', userId: user._id})} className="p-2 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
                                <MdBlock className="text-xl" />
                              </button>}
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                              <MdDelete className="text-xl" />
                            </button>
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
            {userData.length > 0 ? (
              userData.map(user => (
                <div key={user._id} className="bg-black/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={user.profileImage || images.defaultProfile} alt={user.name} className="aspect-square object-cover rounded-full size-10" />
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
                        <span className="text-white font-medium">{formatJoinDate(user.createdAt)}</span>
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
                        { user.status === 'suspended' ? 
                          <button onClick={() => updateStatus({status: 'active', userId: user._id})} className="p-2 text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                            <CgUnblock className="text-xl" />
                          </button>
                          : <button onClick={() => updateStatus({status: 'suspended', userId: user._id})} className="p-2 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
                            <MdBlock className="text-xl" />
                          </button>}
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                          <MdDelete className="text-xl" />
                        </button>
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
              <p>Showing {userData.length} of {pagination.totalResults} results</p>
              <div className="flex items-center gap-4">
                  <button
                      onClick={() => handlePageChange(pagination.prevPage)}
                      disabled={!pagination.hasPrevPage}
                      className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
                  >
                      <FaChevronCircleLeft className="text-lg" />
                  </button>
                  
                  <span className="text-white">Page {pagination.currentPage} of {pagination.totalPages || 1}</span>

                  <button
                      onClick={() => handlePageChange(pagination.nextPage)}
                      disabled={!pagination.hasNextPage}
                      className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
                  >
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
