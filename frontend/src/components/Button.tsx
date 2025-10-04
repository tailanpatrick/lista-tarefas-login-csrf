import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ children, onClick, ...rest }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className="bg-[#4a4a4a] my-0  border-none focus:outline-none text-xl text-[#9b59b6] font-extrabold cursor-pointer"
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
