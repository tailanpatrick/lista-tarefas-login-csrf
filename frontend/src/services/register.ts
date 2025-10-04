import axios from 'axios';
import api from '../lib/api';

import type { To } from 'react-router-dom';

export async function register(
	email: string,
	password: string,
	re_password: string,
	setError: React.Dispatch<React.SetStateAction<string>>,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	navigate: (to: To, options?: { replace?: boolean; state?: any }) => void
) {
	try {
		const response = await api.post('/register', {
			email: email,
			password: password,
			re_password: re_password,
		});

		setError('');

		navigate('/login', { state: response.data.message });
	} catch (error) {
		if (axios.isAxiosError(error)) {
			setError(error.response?.data);
		} else {
			setError(`${error}`);
		}
	} finally {
		setIsLoading(false);
	}
}
