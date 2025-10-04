import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import Input from './components/Input';
import FormButton from './components/FormButton';
import ErrorMessage from './components/ErrorMessage';
import SuccessMessage from './components/SuccessMessage';

// Schema Zod
const schema = z.object({
	email: z
		.string()
		.nonempty({ message: 'Digite seu Email' })
		.email({ message: 'Email inválido' }),
	password: z
		.string()
		.nonempty({ message: 'Digite sua Senha' })
		.min(6, { message: 'Sua Senha é mínimo 6 caracteres' }),
});

type LoginForm = z.infer<typeof schema>;

function Login() {
	const location = useLocation();
	const message = location.state as string | undefined;

	const { user, loading, login } = useAuth();

	const navigate = useNavigate();

	const [formData, setFormData] = useState<LoginForm>({
		email: '',
		password: '',
	});

	const [fieldErrors, setFieldErrors] = useState<
		z.ZodFormattedError<LoginForm> | undefined
	>(undefined);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (user && !loading) {
			navigate('/');
		}
	}, [user, loading, navigate]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData({
			...formData,
			[e.target.name as keyof LoginForm]: e.target.value,
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setError(''); // limpa erro antigo

		const result = schema.safeParse(formData);

		if (!result.success) {
			setFieldErrors(result.error.format());
			setIsLoading(false);
			return;
		}

		setFieldErrors(undefined);

		try {
			await login(formData);
			window.location.href = '/';
		} catch (err: any) {
			setError(err.response?.data?.error || 'Erro ao fazer login');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Navbar />

			<div
				className="h-full w-full flex justify-center md:shadow-xl bg-gray-900"
				style={{ minHeight: 'calc(100vh - 64px)' }}
			>
				<div className="w-full md:w-[450px] px-10 py-32 md:rounded">
					{message && <SuccessMessage>{message}</SuccessMessage>}

					<h1 className="font-bold text-3xl mb-8 text-white text-center">
						Faça Login em sua conta:
					</h1>
					<form onSubmit={handleSubmit}>
						<Input<LoginForm>
							id="email"
							type="text"
							placeholder="email@provedor.com"
							label="Email:"
							autoComplete
							onChange={handleChange}
							errors={fieldErrors}
							value={formData.email}
						/>

						<Input<LoginForm>
							id="password"
							type="password"
							placeholder="Digite uma senha"
							label="Senha:"
							autoComplete={false}
							onChange={handleChange}
							errors={fieldErrors}
							value={formData.password}
						/>

						{error && <ErrorMessage>{error}</ErrorMessage>}

						<div>
							<FormButton
								type="submit"
								isLoading={isLoading}
								className="mt-3"
							>
								Login
							</FormButton>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Login;
