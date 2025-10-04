import React, { useEffect, useState } from 'react';
import { CgLogOff } from 'react-icons/cg';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
	const [email, setEmail] = useState<string | undefined>('');
	const { user, logout } = useAuth();

	useEffect(() => {
		setEmail(user?.email);
	}, []); // Executa apenas uma vez ao montar o componente

	const handleLogOutButton = async () => logout();

	return (
		<div className="flex justify-between p-2 py-4">
			<h1 className="text-[#eee] inline-block text-2xl md:text-5xl">
				Minhas Tarefas
			</h1>

			<button
				className="button text-xl flex justify-center items-center bg-[#9b59b6] text-white"
				title={`Sair de ${email}`}
				onClick={handleLogOutButton}
			>
				<CgLogOff />
			</button>
		</div>
	);
};

export default Header;
