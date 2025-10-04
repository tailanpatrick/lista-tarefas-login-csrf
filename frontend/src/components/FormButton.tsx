import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const FormButton = ({
	type,
	children,
	isLoading,
	onClick,
	className,
}: {
	type?: 'submit' | 'reset' | 'button';
	children: React.ReactNode;
	isLoading?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
}) => {
	return (
		<button
			className={`inline-flex items-center justify-center gap-2 border-none cursor-pointer py-2 px-4 bg-[#9b59b6]
            text-white font-bold w-full text-center rounded outline-none
              ${
					isLoading
						? 'opacity-45 cursor-not-allowed '
						: 'hover:bg-[#7D6C9B]'
				} ${className}`}
			type={type}
			disabled={isLoading}
			onClick={onClick}
		>
			{isLoading && (
				<FaSpinner className="animate-spin mr-2 text-white" />
			)}{' '}
			{children}
		</button>
	);
};

export default FormButton;
