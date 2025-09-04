import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaUserCheck } from "react-icons/fa";
import { images } from '../../../assets/assets';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [userType, setUserType] = useState('user');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(120);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [message, setMessage] = useState('');
    const otpInputsRef = useRef([]);


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

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus next input if a digit is entered
        if (value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };
    
    const handleKeyDown = (e) => {
        // Move focus to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(paste)) {
            const digits = paste.split('');
            setOtp(digits);
            otpInputsRef.current[5]?.focus();
        }
    };


    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');

        // Simulate sending OTP API call
        console.log('Sending OTP to:', formData.email);

        setIsOtpSent(true);
        setCanResend(false);
        setTimer(120);
        setOtp(Array(6).fill('')); // Clear previous OTP
        setMessage('An OTP has been sent to your email.');
        
        // Focus the first OTP input
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        const enteredOtp = otp.join('');

        console.log('Verifying OTP:', enteredOtp);
        // This is a mock verification. Replace with your actual API call.
        if (enteredOtp === '123456') { // Mock verification OTP
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

        console.log('User signed up with data:', { ...formData, userType });
        setMessage('Sign up successful!');
        // Here you would typically redirect the user
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
                        <div className="text-center animate-slideInUp">
                            <div className="inline-block">
                                <div className="flex items-center justify-center size-30 text-white mx-auto mb-6 transition-transform duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[var(--primary-color)] /20">
                                    <div className="flex items-center justify-center text-white rounded-full transition-transform duration-300">
                                        <img 
                                            src={images.logo}
                                            alt="CounselDesk logo" 
                                            className="h-full w-full object-contain rounded-full" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Create an Account</h1>
                            <p className="mt-4 max-w-md mx-auto text-lg text-gray-400">
                                Sign up to access your legal dashboard and AI assistant.
                            </p>
                        </div>
                        <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
                            <div className="flex justify-center mb-6">
                                <button
                                    type="button"
                                    onClick={() => setUserType('user')}
                                    className={`cursor-pointer px-4 py-2 rounded-l-lg font-bold text-sm transition-colors duration-200 ${
                                        userType === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                >
                                    User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('lawyer')}
                                    className={`cursor-pointer px-4 py-2 rounded-r-lg font-bold text-sm transition-colors duration-200 ${
                                        userType === 'lawyer' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                >
                                    Lawyer
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="animate-slideInUp stagger-2">
                                    <label className="sr-only" htmlFor="name">Full Name</label>
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
                                <div className="animate-slideInUp stagger-3">
                                    <label className="sr-only" htmlFor="email">Email</label>
                                    <div className="relative">
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
                                        {!isOtpSent && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={!isEmailInputValid}
                                                className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 font-medium text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Send OTP
                                            </button>
                                        )}
                                        {isOtpVerified && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                                <FaUserCheck className="h-6 w-6"/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {isOtpSent && !isOtpVerified && (
                                    <div className="space-y-4 animate-slideInUp stagger-4">
                                        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                                            {otp.map((data, index) => (
                                                <input
                                                    ref={el => otpInputsRef.current[index] = el}
                                                    className="w-10 h-12 sm:w-12 text-center bg-[#2D2D2D] border border-[#3E3E3E] rounded-md text-gray-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                                    type="text"
                                                    name="otp"
                                                    maxLength="1"
                                                    key={index}
                                                    value={data}
                                                    onChange={e => handleOtpChange(e, index)}
                                                    onKeyDown={e => handleKeyDown(e, index)}
                                                    onFocus={e => e.target.select()}
                                                />
                                            ))}
                                        </div>
                                         <p className="text-center text-sm text-gray-400">
                                            {timer > 0 ? `Code expires in ${formatTime(timer)}` : (
                                                <span>
                                                    Didn't receive code?{' '}
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={!canResend}
                                                        className="font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Resend
                                                    </button>
                                                </span>
                                            )}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}
                                
                                <div className="animate-slideInUp stagger-5">
                                    <label className="sr-only" htmlFor="password">Password</label>
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
                                <div className="animate-slideInUp stagger-6">
                                    <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
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
                                {message && (
                                    <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-7">
                                        {message}
                                    </p>
                                )}
                                <div className="animate-slideInUp stagger-7">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 cursor-pointer"
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
                            <div className="animate-slideInUp stagger-5">
                                <button className="cursor-pointer w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-300">
                                    <FcGoogle className="h-5 w-5 mr-2"/>
                                    Sign up with Google
                                </button>
                            </div>
                        </div>
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
