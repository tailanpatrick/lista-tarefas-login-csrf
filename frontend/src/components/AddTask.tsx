import React, { useState } from 'react';
import FormButton from '../components/FormButton';

interface AddTaskProps {
	handleTaskAddition: (taskTitle: string) => void;
}

const AddTask = ({ handleTaskAddition }: AddTaskProps) => {
	const [inputData, setInputData] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputData(e.target.value);
	};

	const handleInputEnter = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleTaskAddition(inputData);
			setInputData('');
		}
	};

	const handleAddTaskClick = () => {
		handleTaskAddition(inputData);
		setInputData('');
	};

	return (
		<div className="my-4 w-full flex">
			<input
				onChange={handleInputChange}
				onKeyDown={handleInputEnter}
				value={inputData}
				className="h-[40px] px-[10px] rounded border-none w-[70%] bg-[#444] text-[#eee] text-md outline-none"
				type="text"
			/>

			<div className="ml-[10px] mt-0 flex-1">
				<FormButton onClick={handleAddTaskClick}>Adicionar</FormButton>
			</div>
		</div>
	);
};

export default AddTask;
