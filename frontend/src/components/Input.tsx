import React from 'react';
import type { ZodFormattedError } from 'zod';

interface InputProps<T> {
	id: keyof T;
	type: string;
	placeholder: string;
	autoComplete?: boolean;
	required?: boolean;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (evt: React.FocusEvent<HTMLInputElement>) => void;
	errors?: ZodFormattedError<T>;
	value: string;
	maxLength?: number;
	label: string;
}

function Input<T>({
	id,
	type,
	placeholder,
	autoComplete = true,
	required,
	label,
	onChange,
	onBlur,
	errors,
	value,
	maxLength,
}: InputProps<T>) {
	const errorsMap = errors as unknown as Record<
		string,
		{ _errors: string[] }
	>;
	const errorMessage = errorsMap?.[id as string]?._errors?.[0];

	return (
		<div className="mb-4 w-full">
			<label
				htmlFor={id as string}
				className="block font-bold mb-1 text-white"
			>
				{label}
			</label>
			<input
				id={id as string}
				name={id as string}
				type={type}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				autoComplete={autoComplete ? 'on' : 'off'}
				maxLength={maxLength}
				required={required}
				className={`w-full min-h-[3rem] px-4 py-3 border rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
					errorMessage ? 'border-red-500' : 'border-[#2a2a2a]'
				} `}
			/>
			{errorMessage && (
				<p className="text-red-500 mt-1 text-sm">{errorMessage}</p>
			)}
		</div>
	);
}

export default Input;
