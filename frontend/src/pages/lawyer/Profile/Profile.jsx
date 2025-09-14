import React, { useState } from 'react';
import { images } from '../../../assets/assets';
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useStore } from '../../../hooks/useStore';

const Profile = () => {
    const { userDetails, logout } = useStore();
    const [profileImage, setProfileImage] = useState(userDetails?.profileImage || images.defaultProfile);
    const [formData, setFormData] = useState({
        personal: {
            name: "Jane Doe",
            email: "jane.doe@example.com", 
            specialization: "Corporate Law",
            phone: "+1 234 567 8900",
            bio: "Experienced corporate lawyer with over 10 years of practice. Specialized in mergers, acquisitions, and corporate governance.",
            qualifications: "J.D., Harvard Law School; Member of the New York State Bar",
            city: "New York",
            state: "NY",
            pincode: "10001",
            fees: 300
        },
        banking: {
            accountHolder: "Jane Doe",
            bankName: "Global Trust Bank",
            accountNumber: "•••• •••• •••• 1234",
            ifscCode: "GTB12345678"
        },
        security: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            security: {
                ...prev.security,
                [name]: value
            }
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfileImage(newImageUrl);
            console.log('New image selected for upload:', file);
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        console.log("Saving all profile changes:", formData);
        alert("Changes Saved! (Check the browser console for the data object)");
    };


    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action is irreversible.')) {
            console.log('Account deleted');
        }
    };


    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col w-full max-w-4xl gap-8 animate-fadeIn">
                <div className="flex flex-col items-start gap-4">
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Profile Management</h1>
                    <p className="text-gray-400 text-lg">Update your profile, professional details, and banking information.</p>
                </div>

                <form onSubmit={handleSaveChanges}>
                    {/* Personal & Professional Information Section */}
                    <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Personal & Professional Information</h2>
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-center bg-cover border-2 border-[var(--primary-color)]" style={{ backgroundImage: `url("${profileImage}")` }}></div>
                                <label htmlFor="image-upload" className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-110 cursor-pointer">
                                    <MdEdit className="text-lg" />
                                    <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="name">Name</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="name" type="text" name="personal.name" value={formData.personal.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-gray-500 bg-black/20 border border-white/10 h-12 px-4 text-base font-normal leading-normal" id="email" readOnly type="email" value={formData.personal.email} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="specialization">Specialization</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="specialization" type="text" name="personal.specialization" value={formData.personal.specialization} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="phone">Phone</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="phone" type="tel" name="personal.phone" value={formData.personal.phone} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="bio">Bio</label>
                                <textarea className="form-textarea w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 p-4 text-base font-normal leading-normal transition-all duration-300" id="bio" rows="4" name="personal.bio" value={formData.personal.bio} onChange={handleChange}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="qualifications">Qualifications</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="qualifications" type="text" name="personal.qualifications" value={formData.personal.qualifications} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="city">City</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="city" type="text" name="personal.city" value={formData.personal.city} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="state">State</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="state" type="text" name="personal.state" value={formData.personal.state} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="pincode">Pincode</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="pincode" type="text" name="personal.pincode" value={formData.personal.pincode} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="fees">Fees (per hour)</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="fees" type="number" name="personal.fees" value={formData.personal.fees} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banking Details Section */}
                    <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Banking Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="account-holder">Account Holder Name</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="account-holder" type="text" name="banking.accountHolder" value={formData.banking.accountHolder} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="bank-name">Bank Name</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="bank-name" type="text" name="banking.bankName" value={formData.banking.bankName} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="account-number">Account Number</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="account-number" type="text" name="banking.accountNumber" value={formData.banking.accountNumber} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="ifsc-code">IFSC Code</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="ifsc-code" type="text" name="banking.ifscCode" value={formData.banking.ifscCode} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Update Password Section */}
                    <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Update Password</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="current-password">Current Password</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="current-password" placeholder="Enter current password" type="password" name="currentPassword" value={formData.security.currentPassword} onChange={handleSecurityChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="new-password">New Password</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="new-password" placeholder="Enter new password" type="password" name="newPassword" value={formData.security.newPassword} onChange={handleSecurityChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="confirm-password">Confirm New Password</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="confirm-password" placeholder="Confirm new password" type="password" name="confirmPassword" value={formData.security.confirmPassword} onChange={handleSecurityChange} />
                            </div>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-8 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                            <span className="truncate">Save Changes</span>
                        </button>
                    </div>
                </form>

                {/* Account Management Section */}
                <div className="bg-black/20 border border-white/10 rounded-xl p-8 mt-8">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Account Management</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-[var(--accent-color)] font-semibold">Log Out</h3>
                            <p className="text-gray-400 text-sm mt-1">You will be returned to the login screen.</p>
                        </div>
                        <button onClick={logout} className="flex items-center gap-2 w-full sm:w-auto cursor-pointer justify-center rounded-lg h-10 px-4 bg-gray-700/50 text-white text-sm font-medium hover:bg-gray-600/70 transition-colors">
                            <IoLogOut className="text-base" />
                            <span>Log Out</span>
                        </button>
                    </div>
                    <div className="border-t border-white/10 my-6"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-red-400 font-semibold">Delete Account</h3>
                            <p className="text-gray-400 text-sm mt-1">Permanently delete your account and all associated data. This action is irreversible.</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="flex items-center gap-2 w-full sm:w-auto cursor-pointer justify-center rounded-lg h-10 px-4 bg-red-800/40 text-red-300 text-sm font-medium hover:bg-red-800/60 transition-colors">
                           <MdDeleteForever className="text-base" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;