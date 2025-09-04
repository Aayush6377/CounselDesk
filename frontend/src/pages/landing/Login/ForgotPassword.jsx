import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../../assets/assets';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            if(isOtpSent && !isOtpVerified) {
                setMessage('OTP has expired. You can resend the code.');
            }
        }
        return () => clearInterval(interval);
    }, [isOtpSent, isOtpVerified, timer]);

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

    const handleKeyDown = (e) => {
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

    const handleSendOtp = (e) => {
        e.preventDefault();
        setMessage('');
        console.log('Sending OTP to:', email);

        setIsOtpSent(true);
        setCanResend(false);
        setTimer(120);
        setOtp(Array(6).fill(''));
        setMessage('An OTP has been sent to your email.');
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setMessage('');
        const enteredOtp = otp.join('');
        console.log('Verifying OTP:', enteredOtp);
        if (enteredOtp === '123456') { // Mock verification
            setIsOtpVerified(true);
            setMessage('OTP verified successfully! You can now reset your password.');
        } else {
            setMessage('Invalid OTP. Please try again.');
        }
    };
    
    const handleResetPassword = (e) => {
        e.preventDefault();
        setMessage('');
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        setMessage('Your password has been reset successfully.');
        // Here you would typically redirect to the login page
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

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
                                    <div className="flex items-center justify-center text-white rounded-full transition-transform duration-300">
                                        <img
                                            src={images.logo}
                                            alt="Logo"
                                            className="h-full w-full object-contain rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Forgot Password</h1>
                            <p className="mt-4 max-w-md mx-auto text-lg text-gray-400">
                                {isOtpVerified ? 'Create a new password.' : 'Enter your email to receive a verification code.'}
                            </p>
                        </div>
                        <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
                            <form 
                                onSubmit={isOtpVerified ? handleResetPassword : (isOtpSent ? handleVerifyOtp : handleSendOtp)} 
                                className="space-y-6"
                            >
                                {!isOtpVerified && (
                                    <div className="animate-slideInUp stagger-2">
                                        <label className="sr-only" htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            disabled={isOtpSent}
                                            required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                )}

                                {isOtpSent && !isOtpVerified && (
                                    <div className="space-y-4 animate-slideInUp stagger-3">
                                        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                                            {otp.map((data, index) => (
                                                <input
                                                    ref={el => otpInputsRef.current[index] = el}
                                                    className="w-10 h-12 sm:w-12 text-center bg-[#2D2D2D] border border-[#3E3E3E] rounded-md text-gray-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                                    type="text"
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
                                                        className="font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50"
                                                    >
                                                        Resend
                                                    </button>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {isOtpVerified && (
                                    <>
                                        <div className="animate-slideInUp stagger-4">
                                            <label className="sr-only" htmlFor="newPassword">New Password</label>
                                            <input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New Password"
                                                required
                                                className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                            />
                                        </div>
                                        <div className="animate-slideInUp stagger-5">
                                            <label className="sr-only" htmlFor="confirmPassword">Confirm New Password</label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm New Password"
                                                required
                                                className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors" 
                                            />
                                        </div>
                                    </>
                                )}

                                {message && (
                                    <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-4">
                                        {message}
                                    </p>
                                )}

                                <div className="animate-slideInUp stagger-5">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--primary-color)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                    >
                                        {isOtpVerified ? 'Reset Password' : (isOtpSent ? 'Verify OTP' : 'Send OTP')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <p className="text-center text-sm text-gray-500 animate-slideInUp stagger-5">
                            Remember your password?
                            <Link to="/login" className="ms-1 font-medium text-[var(--accent-color)] hover:text-amber-300">Log in</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ForgotPassword;