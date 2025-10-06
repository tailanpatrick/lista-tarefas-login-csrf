// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
	baseURL: 'https://lista-tarefas-login-csrf-k2wg.vercel.app/api',
	withCredentials: true,
});

export default api;
