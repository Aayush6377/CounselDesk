import React, { useEffect, useState } from 'react';
import { localLogin } from '../../../services/auth.service';
import Loader from '../../../components/Loader/Loader'; 
import Error from '../../../components/Error/Error';  
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { useStore } from '../../../hooks/useStore';
import fetchUserLocation from '../../../services/fetchUserLocation';

const DEMO_ACCOUNTS = {
    user: {
        email: 'demouser@counseldesk.com',
        password: 'Counsel@123',
        redirect: '/user'
    },
    lawyer: {
        email: 'demolawyer@counseldesk.com',
        password: 'Counsel@123',
        redirect: '/user-lawyer'
    }
};

const DemoLogin = ({ role }) => {
    const { setUserDetails, setLogedin } = useStore();
    const [error, setError] = useState(null);

    const { mutate: loginUser } = useMutation({
        mutationFn: localLogin,
        onSuccess: async (res) => {
            if (res.success) {
                toast.success("Demo login successful. You’re now exploring the demo account.");
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
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Demo login failed. Please ensure demo accounts are in the database.");
            setError(err.response?.data?.message || "Demo login failed. Please ensure demo accounts are in the database.");
        }
    });

    useEffect(() => {
        const account = DEMO_ACCOUNTS[role];
        if (!account) {
            setError('Invalid demo account role specified.');
            return;
        }

        loginUser({ email: account.email, password: account.password });
    }, [role, loginUser]); 

    if (error) {
        return <Error title="Demo Login Failed" message={error} />;
    }

    return <Loader />;
};

export default DemoLogin;
