import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaUserCheck } from "react-icons/fa";
import { images } from '../../../assets/assets';
import { GoogleLogin } from '@react-oauth/google';
import { googleAuth, localSignup, sendOtp, verifyOtp } from "../../../services/auth.service";
import { useStore } from '../../../hooks/useStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const Signup = () => {
    const { setUserDetails, setLogedin } = useStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [userType, setUserType] = useState('user');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(120);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [otpToken, setOtpToken] = useState(null);
    const otpInputsRef = useRef([]);

    const { mutate: sendOtpMutation, isPending: isSendingOtp } = useMutation({
        mutationFn: sendOtp,
        onSuccess: (res) => {
            if (res.token) {
                setOtpToken(res.token);
                setIsOtpSent(true);
                setCanResend(false);
                setTimer(120);
                setOtp(Array(6).fill(''));
                toast.success('An OTP has been sent to your email.');
                setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
            } else {
                toast.error(res.message || "Failed to send OTP.");
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        }
    });

    const { mutate: verifyOtpMutation, isPending: isVerifyingOtp } = useMutation({
        mutationFn: ({ enteredOtp, otpToken }) => verifyOtp(enteredOtp, otpToken),
        onSuccess: (res) => {
            if (res.success) {
                setIsOtpVerified(true);
                toast.success('Email verified successfully! You can now complete the sign up.');
            } else {
                toast.error(res.message || "Invalid OTP.");
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "OTP verification failed.");
        }
    });

    const { mutate: signupUser, isPending: isSigningUp } = useMutation({
        mutationFn: localSignup,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Signup successful! Welcome.");
                setUserDetails(res.user);
                setLogedin(true);
            } else {
                setErrors(res.errors || {});
                toast.error(res.message || "Signup failed.");
            }
        },
        onError: (err) => {
            setErrors(err.response?.data?.errors || {});
            toast.error(err.response?.data?.message || "An unexpected error occurred during signup.");
        }
    });
    
    const { mutate: signupWithGoogle, isPending: isGoogleSigningUp } = useMutation({
        mutationFn: (credential) => googleAuth(credential, userType),
        onSuccess: (res) => {
            if (res) {
                toast.success("Google signup successful!");
                setUserDetails(res.user);
                setLogedin(true);
            } else {
                toast.error('Google signup failed. Please try again.');
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Google signup failed. Please try again.');
        }
    });

    useEffect(() => {
        let interval = null;
        if (isOtpSent && !isOtpVerified && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0) {
            clearInterval(interval);
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [isOtpSent, isOtpVerified, timer]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({...prev, [e.target.name]: ""}));
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };
    
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(paste)) {
            setOtp(paste.split(''));
            otpInputsRef.current[5]?.focus();
        }
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error("Please enter your email address");
            return;
        }
        sendOtpMutation(formData.email);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error('Please enter the 6-digit OTP.');
            return;
        }
        verifyOtpMutation({ enteredOtp, otpToken });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (!isOtpVerified) {
            toast.error('Please verify your email address before signing up.');
            return;
        }
        signupUser({ ...formData, role: userType });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const isEmailInputValid = formData.email.includes('@');
    const isFormValid = isOtpVerified && formData.name && formData.email && formData.password && formData.confirmPassword && (formData.password === formData.confirmPassword);
    
    return (
        <div 
            className="relative flex size-full min-h-screen flex-col bg-cover bg-center group/design-root overflow-x-hidden font-['Manrope',_'Noto_Sans',_sans-serif]"
            style={{ backgroundImage: `url('${images.authBackground}')` }}
        >
            <div className="flex h-full grow flex-col">
                <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-gray-300 backdrop-blur-sm bg-black/50">
                    <div className="w-full max-w-md space-y-8">
                        {/* Header Section */}
                        <div className="text-center animate-slideInUp">
                            <div className="inline-block">
                                <div className="flex items-center justify-center size-30 text-white mx-auto mb-6 transition-transform duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[var(--primary-color)]/20">
                                    <img src={images.logo} alt="CounselDesk logo" className="h-full w-full object-contain rounded-full" />
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Create an Account</h1>
                            <p className="mt-4 max-w-md mx-auto text-lg text-gray-400">Sign up to access your legal dashboard and AI assistant.</p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
                            <div className="flex justify-center mb-6">
                                <button
                                    type="button"
                                    onClick={() => setUserType('user')}
                                    className={`cursor-pointer px-4 py-2 rounded-l-lg font-bold text-sm transition-colors duration-200 ${userType === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                >
                                    User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('lawyer')}
                                    className={`cursor-pointer px-4 py-2 rounded-r-lg font-bold text-sm transition-colors duration-200 ${userType === 'lawyer' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                >
                                    Lawyer
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Input */}
                                <div className="animate-slideInUp stagger-2">
                                    <label className="sr-only" htmlFor="name">Full Name</label>
                                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" required
                                        className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                    />
                                    {errors?.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                                </div>
                                
                                {/* Email Input & OTP Button */}
                                <div className="animate-slideInUp stagger-3">
                                    <label className="sr-only" htmlFor="email">Email</label>
                                    <div className="relative">
                                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" disabled={isOtpSent} required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors disabled:opacity-50"
                                        />
                                        {errors?.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                        {!isOtpSent && (
                                            <button type="button" onClick={handleSendOtp} disabled={!isEmailInputValid || isSendingOtp}
                                                className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 font-medium text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                {isSendingOtp ? 'Sending...' : 'Send OTP'}
                                            </button>
                                        )}
                                        {isOtpVerified && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><FaUserCheck className="h-6 w-6"/></div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* OTP Section */}
                                {isOtpSent && !isOtpVerified && (
                                    <div className="space-y-4 animate-slideInUp stagger-4">
                                        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                                            {otp.map((data, index) => (
                                                <input ref={el => otpInputsRef.current[index] = el}
                                                    className="w-10 h-12 sm:w-12 text-center bg-[#2D2D2D] border border-[#3E3E3E] rounded-md text-gray-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                                    type="text" name="otp" maxLength="1" key={index} value={data}
                                                    onChange={e => handleOtpChange(e, index)}
                                                    onKeyDown={e => handleKeyDown(e, index)}
                                                    onFocus={e => e.target.select()}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-center text-sm text-gray-400">
                                            {timer > 0 ? `Code expires in ${formatTime(timer)}` : (
                                                <span>Didn't receive code?{' '}
                                                    <button type="button" onClick={handleSendOtp} disabled={!canResend || isSendingOtp}
                                                        className="font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50 cursor-pointer">
                                                        {isSendingOtp ? 'Resending...' : 'Resend'}
                                                    </button>
                                                </span>
                                            )}
                                        </p>
                                        <button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp}
                                            className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                                            {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                                        </button>
                                    </div>
                                )}
                                
                                {/* Password Inputs */}
                                <div className="animate-slideInUp stagger-5">
                                    <label className="sr-only" htmlFor="password">Password</label>
                                    <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required
                                        className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                    />
                                    {errors?.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                                </div>
                                <div className="animate-slideInUp stagger-6">
                                    <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                                    <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required
                                        className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                    />
                                    {errors?.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
                                </div>

                                {/* Final Signup Button */}
                                <div className="animate-slideInUp stagger-7">
                                    <button type="submit" disabled={!isFormValid || isSigningUp}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 cursor-pointer">
                                        {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>

                            {/* Google Signup */}
                            <div className="relative my-6 animate-slideInUp stagger-8">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#212121] text-gray-400">Or continue with</span></div>
                            </div>
                            <div className="animate-slideInUp stagger-5">
                                <div className="relative w-full">
                                    <button disabled={isGoogleSigningUp} className="cursor-pointer w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-300 disabled:opacity-50">
                                        <FcGoogle className='h-5 w-5 mr-2'/>
                                        {isGoogleSigningUp ? 'Signing Up...' : 'Sign up with Google'}
                                    </button>
                                     <div className="absolute inset-0 opacity-0 z-10 flex justify-center items-center">
                                        <GoogleLogin onSuccess={signupWithGoogle} onError={() => toast.error('Google Sign up Failed')}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Link to Login */}
                        <p className="text-center text-sm text-gray-500 animate-slideInUp stagger-8">
                            Already have an account?
                            <Link to="/login" className="ms-1 font-medium text-[var(--accent-color)] hover:text-amber-300">Log in</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Signup;
