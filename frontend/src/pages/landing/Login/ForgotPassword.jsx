import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../../assets/assets';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let interval = null;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setCanResend(true);
      setMessage('OTP has expired. You can resend the code.');
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setMessage('');
    // Placeholder for API call to send OTP
    console.log('Sending OTP to:', email);

    // Simulating a successful OTP send
    setIsOtpSent(true);
    setCanResend(false);
    setTimer(120); // Reset timer to 2 minutes
    setMessage('An OTP has been sent to your email.');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setMessage('');
    // Placeholder for API call to verify OTP
    console.log('Verifying OTP:', otp);
    if (otp === '123456') { // Mock verification
      setMessage('OTP verified successfully! You can now reset your password.');
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
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
                Enter your email address to receive a verification code.
              </p>
            </div>
            <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
              <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                <div className="animate-slideInUp stagger-2">
                  <label className="sr-only" htmlFor="email">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      disabled={isOtpSent && !canResend}
                      required
                      className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {isOtpSent && (
                  <div className="animate-slideInUp stagger-3">
                    <label className="sr-only" htmlFor="otp">OTP</label>
                    <div className="relative">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Verification Code"
                        required
                        className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {isOtpSent && (
                  <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-4">
                    {timer > 0 ? `Code expires in ${formatTime(timer)}` : 'Code expired'}
                  </p>
                )}

                {message && (
                  <p className="text-center text-sm font-semibold text-gray-400 animate-slideInUp stagger-4">
                    {message}
                  </p>
                )}

                <div className="animate-slideInUp stagger-5">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#f59e0b] transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    disabled={isOtpSent && !canResend && timer > 0}
                  >
                    {isOtpSent ? (canResend ? 'Send Again' : 'Verify OTP') : 'Send OTP'}
                  </button>
                </div>
              </form>
            </div>
            <p className="text-center text-sm text-gray-500 animate-slideInUp stagger-5">
              Remember your password?
              <Link to="/login" className="font-medium text-[var(--primary-color)] hover:text-amber-300 ml-1">Log in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;