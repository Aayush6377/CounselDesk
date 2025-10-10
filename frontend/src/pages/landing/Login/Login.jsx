import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { images } from '../../../assets/assets';
import { googleAuth, localLogin } from '../../../services/auth.service';
import { useStore } from '../../../hooks/useStore';
import { GoogleLogin } from '@react-oauth/google';
import fetchUserLocation from '../../../services/fetchUserLocation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const Login = () => {
    const { setUserDetails, setLogedin } = useStore();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
        mutationFn: localLogin,
        onSuccess: async (res) => {
            if (res.success) {
                toast.success("Login successful! Welcome back.");
                setUserDetails(res.user);
                setLogedin(true);
                if (res.user.role === "user") {
                    try {
                        const address = await fetchUserLocation();
                        setUserDetails(prev => ({ ...prev, address }));
                    } catch (locationError) {
                        console.error("Could not fetch user location:", locationError);
                    }
                }
            } else {
                setErrors(res.errors);
            }
        },
        onError: (err) => {
            setErrors(err.response?.data?.errors || {});
            toast.error(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
        }
    });

    const { mutate: loginWithGoogle, isPending: isGoogleLoggingIn } = useMutation({
        mutationFn: (credential) => googleAuth(credential, "user"),
        onSuccess: async (res) => {
            if (res) {
                toast.success("Google login successful!");
                setUserDetails(res.user);
                setLogedin(true);
                if (res.user.role === "user") {
                    try {
                        const address = await fetchUserLocation();
                        setUserDetails(prev => ({ ...prev, address }));
                    } catch (locationError) {
                        console.error("Could not fetch user location:", locationError);
                    }
                }
            } else {
                toast.error('Google login failed. Please try again.');
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Google login failed. Please try again.');
        }
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(formData); 
    };
    
    const handleGoogleLogin = (credential) => {
        loginWithGoogle(credential);
    }

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
                                            alt="CounselDesk logo" 
                                            className="h-full w-full object-contain rounded-full" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                            <p className="mt-4 max-w-md mx-auto text-lg text-gray-400">
                                Log in to access your legal dashboard and AI assistant.
                            </p>
                        </div>
                        <div className="bg-[#212121] border border-[#2D2D2D] shadow-2xl rounded-2xl p-8 sm:p-10 space-y-6 animate-slideInUp stagger-1">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="animate-slideInUp stagger-2">
                                    <label className="sr-only" htmlFor="email">Email</label>
                                    <div className="relative">
                                        <input
                                            id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                                            placeholder="Email Address" required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                        />
                                        {errors?.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="animate-slideInUp stagger-3">
                                    <label className="sr-only" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password" name="password" type="password" value={formData.password} onChange={handleChange}
                                            placeholder="Password" required
                                            className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 pl-4 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                                        />
                                        {errors?.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end animate-slideInUp stagger-4">
                                    <div className="text-sm">
                                        <Link to="/login/forgot-password" className="font-medium text-[var(--accent-color)] hover:text-amber-300">Forgot your password?</Link>
                                    </div>
                                </div>
                                <div className="animate-slideInUp stagger-5">
                                    <button
                                        type="submit"
                                        disabled={isLoggingIn || isGoogleLoggingIn}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--primary-color)] transition-all duration-300 transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoggingIn ? 'Logging In...' : 'Log In'}
                                    </button>
                                </div>
                            </form>
                            <div className="relative my-6 animate-slideInUp stagger-5">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#212121] text-gray-400">Or continue with</span>
                                </div>
                            </div>
                            <div className="animate-slideInUp stagger-5">
                                <div className="relative w-full">
                                    <button
                                        disabled={isLoggingIn || isGoogleLoggingIn}
                                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FcGoogle className="h-5 w-5 mr-2"/>
                                        Log in with Google
                                    </button>
                                    <div className="absolute inset-0 opacity-0 z-10 flex justify-center items-center">
                                        <GoogleLogin 
                                            onSuccess={handleGoogleLogin} 
                                            onError={(error) => {
                                                console.error('Google Login client-side error:', error);
                                                toast.error('Google Login failed. Please try again.');
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500 animate-slideInUp stagger-5">
                            Don't have an account?
                            <Link to="/signup" className="ms-1 font-medium text-[var(--accent-color)] hover:text-amber-300">Sign up</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Login;

