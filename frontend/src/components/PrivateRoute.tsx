import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

interface PrivateRouterProps {
	children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouterProps) => {
	const { user, loading } = useAuth();

	if (loading) return <Loading />;

	if (!user) return <Navigate to="/login" replace />;

	return children;
};
