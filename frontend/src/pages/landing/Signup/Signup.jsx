import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { images } from '../../../assets/assets';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(120);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let interval = null;
        if (isOtpSent && !isOtpVerified && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
            setCanResend(true);
            setMessage('OTP has expired. You can resend the code.');
        }
        return () => clearInterval(interval);
    }, [isOtpSent, isOtpVerified, timer]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');

        // You'll need to implement your own logic here for sending the OTP
        // This is a mock API call
        console.log('Sending OTP to:', formData.email);
        
        // Simulate a successful API call
        setIsOtpSent(true);
        setCanResend(false);
        setTimer(120);
        setMessage('An OTP has been sent to your email.');
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage('');

        // You'll need to implement your own logic here for verifying the OTP
        // This is a mock verification
        console.log('Verifying OTP:', otp);
        if (otp === '123456') { // Mock verification
            setIsOtpVerified(true);
            setMessage('Email verified successfully! You can now sign up.');
        } else {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        if (!isOtpVerified) {
            setMessage('Please verify your email address before signing up.');
            return;
        }

        // You'll need to implement your own logic here for user registration
        console.log('User signed up with data:', formData);
        setMessage('Sign up successful!');
        // Redirect to login or dashboard page after successful signup
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const isEmailInputValid = formData.email.length > 0;
    const isFormValid = isOtpVerified && formData.name && formData.email && formData.password && formData.confirmPassword && (formData.password === formData.confirmPassword);
    
    return (
        <div 
            className="relative flex size-full min-h-screen flex-col bg-cover bg-center group/design-root overflow-x-hidden font-['Manrope',_'Noto_Sans',_sans-serif]"
            style={{ backgroundImage: `url('${images.authBackground}')` }}
        >
            <div className="flex h-full grow flex-col">
                <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-gray-300 backdrop-blur-sm bg-black/50">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center animate-slideInUp">
                            <div className="inline-block">
                                <div className="flex items-center justify-center size-30 text-white mx-auto mb-6 transition-transform duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/20">
                                    <span className="material-symbols-outlined text-5xl">
                                        <div className="flex items-center justify-center text-white rounded-full transition-transform duration-300">
                                            <img 
                                                src={images.logo} 
                                                alt="CounselDesk logo" 
                                                className="h-full w-full object-contain rounded-full" 
                                            />
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Create an Account</h1>
                            <p className="mt-4 max-w-md mx-auto text-lg text-gray-400">
                                Sign up to access your legal dashboard and AI assistant.
                            </p>
                        </div>
                        <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="animate-slideInUp stagger-2">
                                    <label className="sr-only" htmlFor="name">Full Name</label>
                                    <div className="relative">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="animate-slideInUp stagger-3">
                                    <label className="sr-only" htmlFor="email">Email</label>
                                    <div className="relative flex">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            disabled={isOtpSent}
                                            required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors disabled:opacity-50"
                                        />
                                        {!isOtpVerified && (
                                            <button
                                                type="button"
                                                onClick={isOtpSent && !canResend ? handleVerifyOtp : handleSendOtp}
                                                disabled={!isEmailInputValid || (isOtpSent && !canResend && timer > 0)}
                                                className="absolute right-0 top-0 h-full px-4 py-2 font-medium text-sm text-[var(--accent-color)] hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isOtpSent ? (canResend ? 'Resend' : 'Verify') : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {isOtpSent && !isOtpVerified && (
                                    <div className="animate-slideInUp stagger-4">
                                        <label className="sr-only" htmlFor="otp">OTP</label>
                                        <div className="relative">
                                            <input
                                                id="otp"
                                                name="otp"
                                                type="text"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                placeholder="Verification Code"
                                                required
                                                className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                                {isOtpSent && !isOtpVerified && (
                                    <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-4">
                                        {timer > 0 ? `Code expires in ${formatTime(timer)}` : 'Code expired'}
                                    </p>
                                )}
                                <div className="animate-slideInUp stagger-5">
                                    <label className="sr-only" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="animate-slideInUp stagger-6">
                                    <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                        />
                                    </div>
                                </div>
                                {message && (
                                    <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-7">
                                        {message}
                                    </p>
                                )}
                                <div className="animate-slideInUp stagger-7">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--primary-color)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                            <div className="relative my-6 animate-slideInUp stagger-8">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#212121] text-gray-400">Or continue with</span>
                                </div>
                            </div>
                            <div className="animate-slideInUp stagger-8">
                                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-300">
                                    <FcGoogle className="h-5 w-5 mr-2"/>
                                    Sign up with Google
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500 animate-slideInUp stagger-8">
                            Already have an account?
                            <Link to="/login" className="font-medium text-[var(--accent-color)] hover:text-amber-300 ml-1">Log in</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Signup;