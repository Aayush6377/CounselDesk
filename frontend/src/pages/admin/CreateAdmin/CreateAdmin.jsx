import { createNewAdmin } from '../../../services/admin.service';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { IoPersonAdd } from "react-icons/io5";
import { toast } from 'react-toastify';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const { mutate: createAdmin, isPending  } = useMutation({
    mutationFn: (newAdminData) => createNewAdmin(newAdminData),
    onSuccess: (res) => {
      toast.success(res.message || "Admin account created successfully!!");
    },
     onError: (err) => {
          if (err.response?.data?.errors) {
              setErrors(err.response.data.errors);
              toast.error(err.response.data.message);
          } else {
              toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
          }
      }
  });

  const handleChange = (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
    createAdmin(formData);
  };

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-2xl flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col">
          <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">
            Create New Admin
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Add a new administrator to the system.</p>
        </div>

        {/* Create Admin Form */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-6 sm:p-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="name">
                Full Name
              </label>
              <input
                className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-white/10 bg-black/30 h-11 placeholder:text-[#9dabb9] px-4 text-base font-normal leading-normal transition-all duration-300"
                id="name"
                name="name"
                placeholder="Enter full name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} 
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <input
                className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-white/10 bg-black/30 h-11 placeholder:text-[#9dabb9] px-4 text-base font-normal leading-normal transition-all duration-300"
                id="email"
                name="email"
                placeholder="Enter email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} 
            </div>
            <div className="flex justify-end pt-4">
              <button
                className="flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer rounded-md h-12 px-8 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal hover:bg-[var(--accent-color)] transition-colors shadow-[0_0_20px_var(--glow-color)]"
                type="submit" disabled={isPending}
              >
                <IoPersonAdd className="text-xl" />
                <span> {isPending ? 'Creating Account...' : 'Create Admin Account'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateAdmin;