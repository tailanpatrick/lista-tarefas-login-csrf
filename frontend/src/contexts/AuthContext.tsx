import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import type { User } from '../types/User';

type LoginType = {
	email: string;
	password: string;
};

interface AuthContextType {
	user: User | null;
	token: string | null;
	csrfToken: string | null;
	loading: boolean;
	login: (data: LoginType) => Promise<void>;
	logout: () => Promise<void>;
	refreshCsrf: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	csrfToken: null,
	loading: true,
	login: async () => {},
	logout: async () => {},
	refreshCsrf: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshCsrf = async () => {
		try {
			const res = await api.get('/__sec/__csrf-token', {
				withCredentials: true,
			});
			if (res.data.csrfToken) {
				setCsrfToken(res.data.csrfToken);
				api.defaults.headers.common['X-CSRF-Token'] =
					res.data.csrfToken;
			}
		} catch (err) {
			console.error('Erro ao atualizar CSRF token:', err);
		}
	};

	const loadSession = async () => {
		try {
			const res = await api.get('/__sec/__session', {
				withCredentials: true,
				timeout: 7000,
			});

			setUser(res.data.user || null);
			setCsrfToken(res.data.csrfToken || null);

			if (res.data.csrfToken) {
				api.defaults.headers.common['X-CSRF-Token'] =
					res.data.csrfToken;
			}
		} catch (err) {
			console.error('Não foi possível carregar a sessão:', err);
			setUser(null);
			setCsrfToken(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (data: LoginType) => {
		await refreshCsrf();
		try {
			const res = await api.post('/login', data, {
				withCredentials: true,
			});
			setUser(res.data.user);
			setToken(res.data.token || null);
			await refreshCsrf();
		} catch (err) {
			console.error('Erro no login:', err);
			throw err;
		}
	};

	const logout = async () => {
		try {
			await api.get('/logout', { withCredentials: true });
			setUser(null);
			setToken(null);
			setCsrfToken(null);
			api.defaults.headers.common['X-CSRF-Token'] = '';
		} catch (err) {
			console.error('Erro ao logout:', err);
		}
	};

	useEffect(() => {
		loadSession();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				csrfToken,
				loading,
				login,
				logout,
				refreshCsrf,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
