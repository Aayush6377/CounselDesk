import React, { useEffect, useState } from 'react';
import "./BioData.css";
import { useStore } from '../../../hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaFilePdf, FaTrash } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import CustomSelect from '../../../components/CustomSelect/CustomSelect';

const specializationOptions = [
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law"},
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" }
];

const verificationDocuments = [
    { name: 'barCouncilCertificate', label: 'Bar Council Enrollment Certificate', required: true, description: null },
    { name: 'practiceCertificate', label: 'Certificate of Practice (COP)', required: false, description: 'If applicable.' },
    { name: 'governmentId', label: 'Government Issued Photo ID', required: true, description: 'Aadhaar Card, PAN Card, Passport, etc.' },
    { name: 'lawDegree', label: 'LL.B./Law Degree Certificate', required: true, description: null },
];

const BioData = () => {
  const { userDetails } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails.bioDataProvided){
        navigate("/user-lawyer", {replace: true});
    }
  }, [userDetails, navigate]);

  const [formData, setFormData] = useState({
    fullName: userDetails.name,
    specialization: '',
    bio: '',
    qualifications: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    fees: '',
    profileImage: userDetails.profileImage,
    barCouncilCertificate: null,
    practiceCertificate: null,
    governmentId: null,
    lawDegree: null,
  });


  const [filePreviews, setFilePreviews] = useState({
    barCouncilCertificate: null,
    practiceCertificate: null,
    governmentId: null,
    lawDegree: null,
  });

 
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []); 

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];


    if (filePreviews[name]) {
        URL.revokeObjectURL(filePreviews[name]);
    }

    if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, [name]: file }));
        setFilePreviews((prev) => ({ ...prev, [name]: previewUrl }));
    }
  };

 
  const handleRemoveFile = (name) => {

    if (filePreviews[name]) {
        URL.revokeObjectURL(filePreviews[name]);
    }

    setFormData((prev) => ({ ...prev, [name]: null }));
    setFilePreviews((prev) => ({ ...prev, [name]: null }));

    if (document.getElementById(name)) {
        document.getElementById(name).value = "";
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you would typically use FormData to send the data and files to a server
    // Example:
    // const data = new FormData();
    // Object.keys(formData).forEach(key => {
    //   data.append(key, formData[key]);
    // });
    // axios.post('/api/lawyer-profile', data);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-b from-[var(--secondary-color)] to-[#0d1013] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[rgba(168,145,102,0.1)] to-transparent -z-10 pointer-events-none"></div>
      <div className="layout-container flex h-full grow flex-col">
        <main className="px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
          <form onSubmit={handleSubmit} className="layout-content-container flex flex-col max-w-4xl flex-1 gap-8 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <h1 className="text-[var(--accent-color)] text-3xl font-bold">Lawyer Profile Setup</h1>
              <p className="text-gray-400">Complete your profile and upload documents for verification to connect with clients.</p>
            </div>
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                  <label className="cursor-pointer group" htmlFor="profile-image-upload">
                    <div className="relative w-40 h-40">
                      <div className="w-full h-full bg-black/30 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-[var(--primary-color)] transition-all">
                        {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-5xl text-gray-500 group-hover:text-[var(--primary-color)] transition-all"><FaCamera /></span>
                        )}
                      </div>
                    </div>
                  </label>
                  <input className="hidden" id="profile-image-upload" type="file" onChange={handleImageChange} accept="image/jpeg, image/png" />
                  <p className="text-gray-400 text-sm mt-4 text-center">Upload a profile picture. <br /> (JPG, PNG)</p>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input className="form-input" id="fullName" name="fullName" placeholder="e.g., John Doe" type="text" value={formData.fullName} onChange={handleChange} required/>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="specialization">Specialization</label>
                    <CustomSelect name="specialization" options={specializationOptions} value={formData.specialization} onChange={handleChange} className="relative w-full"/>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input className="form-input bg-black/10 text-gray-500 cursor-not-allowed" disabled id="email" type="email" value={userDetails.email} required/>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-6">
                <div>
                  <label className="form-label" htmlFor="bio">Biography</label>
                  <textarea className="form-input min-h-[120px]" id="bio" name="bio" placeholder="Tell clients about yourself, your experience, and your approach..." value={formData.bio} onChange={handleChange} required></textarea>
                </div>
                <div>
                  <label className="form-label" htmlFor="qualifications">Qualifications</label>
                  <textarea className="form-input min-h-[100px]" id="qualifications" name="qualifications" placeholder="List your degrees, certifications, and bar admissions. e.g., Juris Doctor (J.D.), Harvard Law School..." value={formData.qualifications} onChange={handleChange} required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input className="form-input" id="phone" name="phone" placeholder="+91 12345 67890" type="tel" value={formData.phone} onChange={handleChange} required/>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="fees">Consultion Fees</label>
                    <input className="form-input" id="fees" name="fees" placeholder="₹500/hr" type="number" value={formData.fees} onChange={handleChange} required min="500" max="5000"/>
                  </div>
                </div>

                 {/* --- START: VERIFICATION DOCUMENTS SECTION WITH PREVIEWS --- */}
                 <div className="mt-8 border-t border-white/10 pt-8">
                  <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-4">Verification Documents</h3>
                  <p className="text-gray-400 text-sm mb-6">
                      Please upload the following documents for verification. These are confidential and will only be used to verify your credentials. (PDF, JPG, PNG)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {verificationDocuments.map((doc) => (
                      <div key={doc.name} className="mb-6">
                          <label className="form-label mb-2 block">{doc.label}</label>
                          {filePreviews[doc.name] ? (
                              <div className="mt-2 p-2 border border-white/20 rounded-lg flex items-center justify-between bg-black/20 animate-fadeIn">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                      {formData[doc.name]?.type.startsWith('image/') ? (
                                          <img src={filePreviews[doc.name]} alt="Preview" className="w-12 h-12 object-cover rounded flex-shrink-0" />
                                      ) : (
                                          <div className="flex-shrink-0 text-red-400 p-2"><FaFilePdf size={28} /></div>
                                      )}
                                      <p className="text-gray-300 text-sm truncate" title={formData[doc.name]?.name}>
                                          {formData[doc.name]?.name}
                                      </p>
                                  </div>
                                  <button type="button" onClick={() => handleRemoveFile(doc.name)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                      <FaTrash />
                                  </button>
                              </div>
                          ) : (
                              <div className="flex items-center justify-center w-full">
                                  <label htmlFor={doc.name} className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-rgba(0, 0, 0, 0.3)-50 hover:bg-gray-600">
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <IoMdCloudUpload className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'/>
                                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG, or JPEG</p>
                                      </div>
                                      <input
                                          id={doc.name}
                                          name={doc.name}
                                          type="file"
                                          className="hidden"
                                          onChange={handleFileChange}
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          required={doc.required && !formData[doc.name]}
                                      />
                                  </label>
                              </div>
                          )}
                          {doc.description && <p className="text-gray-500 text-xs mt-2">{doc.description}</p>}
                      </div>
                  ))}
                  </div>
              </div>

                <div>
                  <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-3 mt-8">Practice Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label" htmlFor="city">City</label>
                      <input className="form-input" id="city" name="city" placeholder="e.g., New Delhi" type="text" value={formData.city} onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="state">State</label>
                      <input className="form-input" id="state" name="state" placeholder="e.g., Delhi" type="text" value={formData.state} onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="pincode">Pincode</label>
                      <input className="form-input" id="pincode" name="pincode" placeholder="e.g., 110001" type="text" value={formData.pincode} onChange={handleChange} required/>
                    </div>
                  </div>
                </div>
                {/* --- START: BANK ACCOUNT DETAILS SECTION --- */}
                <div className="mt-8 border-t border-white/10 pt-8">
                  <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-3">Bank Account Details</h3>
                  <p className="text-gray-400 text-sm mb-6">
                      Please provide your bank details to receive payments for your services.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label" htmlFor="accountHolderName">Account Holder Name</label>
                      <input className="form-input" id="accountHolderName" name="accountHolderName" placeholder="e.g., John Doe" type="text" value={formData.accountHolderName} onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="bankName">Bank Name</label>
                      <input className="form-input" id="bankName" name="bankName" placeholder="e.g., State Bank of India" type="text" value={formData.bankName} onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="accountNumber">Account Number</label>
                      <input className="form-input" id="accountNumber" name="accountNumber" placeholder="e.g., 9876543210" type="text" value={formData.accountNumber} onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="ifscCode">IFSC Code</label>
                      <input className="form-input" id="ifscCode" name="ifscCode" placeholder="e.g., SBIN0000123" type="text" value={formData.ifscCode} onChange={handleChange} required/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button type="submit" className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-8 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                  <span>Submit for Verification</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default BioData;