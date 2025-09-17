import React, { useState } from 'react';
import { images } from '../../../assets/assets';
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useStore } from '../../../hooks/useStore';
import { useMutation } from '@tanstack/react-query';
import { profileUpdate } from '../../../services/lawyer.service';
import { resetPassword } from '../../../services/auth.service';
import { toast } from 'react-toastify';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';


const specializationOptions = [
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law" },
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" }
];

const Profile = () => {
    const { userDetails, logout, setUserDetails } = useStore();
    const [ security, setSecurity ] = useState({
        password: "",
        confirmPassword: ""
    });
    const [formData, setFormData] = useState(userDetails);
    const [profileImage, setProfileImage] = useState(formData?.profileImage || images.defaultProfile);
    const [errors, setErrors] = useState({});

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => profileUpdate(data),
        onSuccess: () => {
            formData.profileImage = profileImage;
            setUserDetails(formData);
            toast.success("Profile updated successfully");
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
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length === 1){
            setFormData(prev => ({...prev, [name]: value}));
        }
        else{
            const [section, field] = keys;
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
        setErrors(prev => ({...prev, [name]: ""}));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfileImage(newImageUrl);
            setFormData(prev => ({...prev, profileImage: file}));
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        setErrors({});

        const dataToSubmit = new FormData();
        for (const key in formData) {
            const value = formData[key];
            if (value === null || value === undefined) continue;

            if (key === 'profileImage' && value instanceof File) {
                dataToSubmit.append(key, value, value.name);
            } 
            else if (typeof value === 'object' && !(value instanceof File)) {
                for (const nestedKey in value) {
                    dataToSubmit.append(`${key}[${nestedKey}]`, value[nestedKey]);
                }
            } 
            else {
                dataToSubmit.append(key, value);
            }
        }
        mutate(dataToSubmit);
    };

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurity(prev => ({...prev, [name]: value}));
        setErrors(prev => ({...prev, [name]: ""}));
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const res = await resetPassword({email: userDetails.email, password: security.password, confirmPassword: security.confirmPassword});

        if (res.success){
            toast.success("Password changed successfully.");
            setSecurity({ password: "", confirmPassword: "" });
        }
        else{
            setErrors(res.errors);
            toast.error(res.message);
        }
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
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} 
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-gray-500 bg-black/20 border border-white/10 h-12 px-4 text-base font-normal leading-normal" id="email" readOnly type="email" value={formData.email} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="specialization">Specialization</label>
                                    <CustomSelect name="specialization" options={specializationOptions} value={formData.specialization} onChange={handleChange} className="relative w-full"/>
                                    {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="phone">Phone</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>} 
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="bio">Bio</label>
                                <textarea className="form-textarea w-full resize-none overflow-y-auto rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 p-4 text-base font-normal leading-normal transition-all duration-300" id="bio" rows="4" name="bio" value={formData.bio} onChange={handleChange}></textarea>
                                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="qualifications">Qualifications</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="qualifications" type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} />
                                {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="city">City</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="city" type="text" name="address.city" value={formData?.address?.city} onChange={handleChange} />
                                    {errors["address.city"] && <p className="text-red-500 text-sm mt-1">{errors["address.city"]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="state">State</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="state" type="text" name="address.state" value={formData?.address?.state} onChange={handleChange} />
                                    {errors["address.state"] && <p className="text-red-500 text-sm mt-1">{errors["address.state"]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="pincode">Pincode</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="pincode" type="text" name="address.pincode" value={formData?.address?.pincode} onChange={handleChange} />
                                    {errors["address.pincode"] && <p className="text-red-500 text-sm mt-1">{errors["address.pincode"]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="fees">Fees (per hour)</label>
                                    <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="fees" type="number" name="fees" value={formData.fees} onChange={handleChange} />
                                    {errors["fees"] && <p className="text-red-500 text-sm mt-1">{errors["fees"]}</p>}
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
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="account-holder" type="text" name="bankDetails.accountHolderName" value={formData?.bankDetails?.accountHolderName} onChange={handleChange} />
                                {errors["bankDetails.accountHolderName"] && <p className="text-red-500 text-sm mt-1">{errors["bankDetails.accountHolderName"]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="bank-name">Bank Name</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="bank-name" type="text" name="bankDetails.bankName" value={formData?.bankDetails?.bankName} onChange={handleChange} />
                                {errors["bankDetails.bankName"] && <p className="text-red-500 text-sm mt-1">{errors["bankDetails.bankName"]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="account-number">Account Number</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="account-number" type="text" name="bankDetails.accountNumber" value={formData?.bankDetails?.accountNumber} onChange={handleChange} />
                                {errors["bankDetails.accountNumber"] && <p className="text-red-500 text-sm mt-1">{errors["bankDetails.accountNumber"]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="ifsc-code">IFSC Code</label>
                                <input className="form-input w-full resize-none overflow-hidden rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border border-white/20 bg-black/30 h-12 px-4 text-base font-normal leading-normal transition-all duration-300" id="ifsc-code" type="text" name="bankDetails.ifscCode" value={formData?.bankDetails?.ifscCode} onChange={handleChange} />
                                {errors["bankDetails.ifscCode"] && <p className="text-red-500 text-sm mt-1">{errors["bankDetails.ifscCode"]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-8 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                            <span className="truncate">{isPending ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>

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
                                <span className="truncate">Update Password</span>
                            </button>
                        </div>
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