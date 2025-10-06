// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
	baseURL: 'https://backend-lista-tarefas-login-csrf.vercel.app/api',
	withCredentials: true,
});

export default api;
