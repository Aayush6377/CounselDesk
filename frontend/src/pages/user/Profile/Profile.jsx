import React, { useState } from 'react';
import { useStore } from "../../../hooks/useStore";
import { images } from '../../../assets/assets';
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { profileUpdate } from '../../../services/user.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteAccount, resetPassword } from '../../../services/auth.service';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const Profile = () => {
    const { userDetails, logout, setUserDetails, setLogedin } = useStore();
    const [formData, setFormData] = useState({name: userDetails?.name || ""});
    const [profileImage, setProfileImage] = useState(userDetails?.profileImage || images.defaultProfile);
    const [ security, setSecurity ] = useState({ password: "", confirmPassword: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => profileUpdate(data),
        onSuccess: () => {
            setUserDetails(prev => ({...prev, ...formData, profileImage: profileImage}));
            toast.success("Profile updated successfully!");
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

    const { mutate: updatePassword , isPending: isUpdatingPassword} = useMutation({
        mutationFn: (details) => resetPassword(details),
        onSuccess: () => {
            toast.success("Password changed successfully");
            setSecurity({ password: "", confirmPassword: "" });
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
            }
        }
    })

    const { mutate: deleteUserAccount, isPending: isDeleting } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            toast.success("Account Deleted successfully");
            localStorage.removeItem("accessToken");
            setLogedin(false);
            setUserDetails({});
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

    const handleFormChange = (e) => {
        e.preventDefault();
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
        setErrors(prev => ({...prev, [e.target.name]: ""}));
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfileImage(newImageUrl);
            setFormData(prev => ({...prev, profileImage: file}));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = new FormData();
        dataToSubmit.append("name",formData.name);

        if (formData.profileImage){
            dataToSubmit.append("profileImage",formData.profileImage, formData.profileImage.name);
        }
        mutate(dataToSubmit);
    }

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurity(prev => ({...prev, [name]: value}));
        setErrors(prev => ({...prev, [name]: ""}));
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        updatePassword({email: userDetails.email, password: security.password, confirmPassword: security.confirmPassword});
    };

    const handleConfirmDelete = () => {
        deleteUserAccount();
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col w-full max-w-4xl gap-12 animate-fadeIn">
                <div className="flex flex-col items-start gap-4">
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Profile Settings</h1>
                    <p className="text-gray-400 text-lg">Manage your account details and preferences.</p>
                </div>

                {/* Profile Details Section */}
                <form onSubmit={handleSubmit} className="bg-black/20 border border-white/10 rounded-xl p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-full bg-center bg-cover border-2 border-[var(--primary-color)]"
                                style={{ backgroundImage: `url("${profileImage}")` }}
                            ></div>
                            <label htmlFor="image-upload" className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-110 cursor-pointer">
                                <span className="material-symbols-outlined text-lg"><MdModeEditOutline /></span>
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="name">Name</label>
                                    <input
                                        className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} 
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
                                    <input
                                        className="form-input w-full resize-none overflow-hidden rounded-lg text-gray-500 bg-black/20 border border-white/10 h-12 px-4 text-base font-normal leading-normal"
                                        id="email"
                                        readOnly
                                        type="email"
                                        value={userDetails?.email || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-8 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                            <span className="truncate">{isPending ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>

                {/* Security Section */}
                <form onSubmit={handleUpdatePassword}>
                    <div className="bg-black/20 border border-white/10 rounded-xl p-8">
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Update Password</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="new-password">New Password</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="new-password" placeholder="Enter new password" type="password" name="password" value={security.password} onChange={handleSecurityChange} />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>} 
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="confirm-password">Confirm New Password</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="confirm-password" placeholder="Confirm new password" type="password" name="confirmPassword" value={security.confirmPassword} onChange={handleSecurityChange} />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>} 
                            </div>
                        </div>
                        {/* Submit Button for Password Form */}
                        <div className="flex justify-end mt-6">
                            <button type="submit" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-8 bg-gray-700/60 text-white text-base font-bold leading-normal tracking-wide hover:bg-gray-600/80 transition-all duration-300 transform hover:scale-105">
                                <span className="truncate"> { isUpdatingPassword ? 'Updating...' : 'Update Password' }</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Account Management Section */}
                <div className="bg-black/20 border border-white/10 rounded-xl p-8">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Account Management</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-[var(--accent-color)] font-semibold">Log Out</h3>
                            <p className="text-gray-400 text-sm mt-1">You will be returned to the login screen.</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full sm:w-auto cursor-pointer justify-center rounded-lg h-10 px-4 bg-gray-700/50 text-white text-sm font-medium hover:bg-gray-600/70 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base"><IoLogOut /></span>
                            <span>Log Out</span>
                        </button>
                    </div>
                    <div className="border-t border-white/10 my-6"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-red-400 font-semibold">Delete Account</h3>
                            <p className="text-gray-400 text-sm mt-1">Permanently delete your account and all associated data. This action is irreversible.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 w-full sm:w-auto cursor-pointer justify-center rounded-lg h-10 px-4 bg-red-800/40 text-red-300 text-sm font-medium hover:bg-red-800/60 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base"><MdDeleteForever /></span>
                            <span>{ isDeleting ? "Deleting..." : "Delete Account" }</span>
                        </button>
                    </div>
                </div>
            </div>
             <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Account"
                message="Are you sure you want to permanently delete your account? All of your data will be removed. This action cannot be undone."
                confirmText="Delete Account"
                isConfirming={isDeleting}
            />
        </main>
    )
}

export default Profile;