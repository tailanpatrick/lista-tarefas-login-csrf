import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from './contexts/AuthContext';
import { register } from './services/register';

import Navbar from './components/Navbar';
import Input from './components/Input';
import FormButton from './components/FormButton';
import ErrorMessage from './components/ErrorMessage';

const schema = z
	.object({
		email: z
			.string()
			.nonempty({ message: 'Digite um Email' })
			.email({ message: 'Email inválido' }),
		password: z
			.string()
			.nonempty({ message: 'Digite uma Senha' })
			.min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
		re_password: z
			.string()
			.nonempty({ message: 'Repita sua Senha' })
			.min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
	})
	.refine((data) => data.password === data.re_password, {
		message: 'As senhas não coincidem',
		path: ['re_password'],
	});

type RegisterForm = z.infer<typeof schema>;

function Register() {
	const navigate = useNavigate();
	const auth = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<RegisterForm>({
		email: '',
		password: '',
		re_password: '',
	});
	const [fieldErrors, setFieldErrors] = useState<
		z.ZodFormattedError<RegisterForm> | undefined
	>(undefined);
	const [error, setError] = useState('');

	const { user, loading } = auth;

	useEffect(() => {
		if (user && !loading) navigate('/');
	}, [user, loading, navigate]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData({
			...formData,
			[e.target.name as keyof RegisterForm]: e.target.value,
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		const result = schema.safeParse(formData);

		if (!result.success) {
			setFieldErrors(result.error.format());
			setIsLoading(false);
			return;
		}

		setFieldErrors(undefined);
		await register(
			formData.email,
			formData.password,
			formData.re_password,
			setError,
			setIsLoading,
			navigate
		);
	}

	return (
		<>
			<Navbar />

			<div
				className="h-full w-full flex justify-center md:shadow-xl bg-gray-900"
				style={{ minHeight: 'calc(100vh - 64px)' }}
			>
				<div className="w-full md:w-[450px] px-10 py-32 md:rounded">
					<h1 className="font-bold text-3xl mb-8 text-white text-center">
						Crie uma Conta:
					</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input<RegisterForm>
							type="text"
							id="email"
							placeholder="email@provedor.com"
							label="Email:"
							autoComplete={false}
							onChange={handleChange}
							errors={fieldErrors}
							value={formData.email}
						/>
						<Input<RegisterForm>
							type="password"
							id="password"
							placeholder="Digite uma senha"
							label="Senha:"
							autoComplete={false}
							onChange={handleChange}
							errors={fieldErrors}
							value={formData.password}
						/>
						<Input<RegisterForm>
							type="password"
							id="re_password"
							placeholder="Repita a senha"
							label="Repita a Senha:"
							autoComplete={false}
							onChange={handleChange}
							errors={fieldErrors}
							value={formData.re_password}
						/>

						{error && <ErrorMessage>{error}</ErrorMessage>}

						<div>
							<FormButton
								type="submit"
								isLoading={isLoading}
								className="mt-3"
							>
								Cadastrar
							</FormButton>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Register;
