import React, { useState } from 'react';
import { useStore } from "../../../hooks/useStore";
import { images } from '../../../assets/assets';
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";

const Profile = () => {
    const { userDetails, setLogedin } = useStore();
    const [name, setName] = useState(userDetails?.name || '');
    const [profileImage, setProfileImage] = useState(userDetails?.profileImage || images.defaultProfile);
    const [security, setSecurity] = useState({
        curPassword: "",
        newPassword: ""
    });

    const handleChange = (e) => {
        setSecurity(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfileImage(newImageUrl);
            console.log('New image selected:', file);
        }
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        console.log(security);
    };

    const handleLogOut = () => {
        console.log('User logged out');
        setLogedin(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action is irreversible.')) {
            console.log('Account deleted');
        }
    };

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col w-full max-w-4xl gap-12 animate-fadeIn">
                <div className="flex flex-col items-start gap-4">
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Profile Settings</h1>
                    <p className="text-gray-400 text-lg">Manage your account details and preferences.</p>
                </div>

                {/* Profile Details Section */}
                <div className="bg-black/20 border border-white/10 rounded-xl p-8">
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
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
                </div>

                {/* Security Section */}
                <form onSubmit={handleUpdatePassword} className="bg-black/20 border border-white/10 rounded-xl p-8">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Security</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="current-password">Current Password</label>
                            <input
                                className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300"
                                id="current-password" name="curPassword" onChange={handleChange}
                                type="password" required value={security.curPassword}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="new-password">New Password</label>
                            <input
                                className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300"
                                id="new-password" name="newPassword" onChange={handleChange}
                                type="password" required value={security.newPassword}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type='submit'
                            className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect"
                        >
                            <span className="truncate">Update Password</span>
                        </button>
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
                            onClick={handleLogOut}
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
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 w-full sm:w-auto cursor-pointer justify-center rounded-lg h-10 px-4 bg-red-800/40 text-red-300 text-sm font-medium hover:bg-red-800/60 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base"><MdDeleteForever /></span>
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile;