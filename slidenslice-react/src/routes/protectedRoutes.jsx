
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authCheckService } from '../services/auth.service';
import Loader from '../components/Loader';

function Protected() {
    const [loading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await authCheckService();
                setIsValid(result.data.success);
            } catch (error) {
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <Loader/>;
    }

    return isValid ? <Outlet /> : <Navigate to="/" replace />;
}

export default Protected;
