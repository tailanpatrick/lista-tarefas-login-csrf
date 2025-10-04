import React, { useState } from 'react';
import { CgCheck, CgClose, CgPen, CgTrash } from 'react-icons/cg';

import type { TaskItem } from '../types/TaskItem';
import { createEditTask } from '../services/create-edit-task';
import Button from './Button';

interface TaskProp {
	task: TaskItem;
	handleTaskClick: (taskId: string) => void;
	handleTaskDeletion: (taskId: string) => void;
	setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

const Task = ({
	task,
	handleTaskClick,
	handleTaskDeletion,
	setTasks,
}: TaskProp) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(task.title);

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
	};

	const handleCancelEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(false);
		setEditedText(task.title);
	};

	const handleConfirmEdit = async (
		e: React.MouseEvent | React.KeyboardEvent
	) => {
		e.stopPropagation();
		task.title = editedText;
		setIsEditing(false);
		await createEditTask(task, setTasks);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedText(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleConfirmEdit(e);
		if (e.key === 'Escape') handleCancelEdit(e as any as React.MouseEvent);
	};

	return (
		<div
			className="bg-[#444] my-1 py-4 flex justify-between text[#eee] items-center rounded-md cursor-pointer"
			style={
				task.stateOfCompletion
					? { borderLeft: '6px solid #9b59b6' }
					: {}
			}
			onClick={() => handleTaskClick(task._id!)}
		>
			{isEditing ? (
				<input
					type="text"
					className="h-10 ml-2 my-2 py-1 px-2 w-[50%] rounded-md border-2 border-[#6B5B95] outline-none"
					value={editedText}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					autoFocus
					onClick={(e) => e.stopPropagation()}
				/>
			) : (
				<div className="pl-4 text-xl **mr-4** break-words">
					{task.title}
				</div>
			)}

			<div className="flex justify-end gap-2 mx-2">
				{isEditing ? (
					<>
						<Button onClick={handleConfirmEdit}>
							<CgCheck />
						</Button>
						<Button onClick={handleCancelEdit}>
							<CgClose />
						</Button>
					</>
				) : (
					<>
						<Button onClick={handleEditClick}>
							<CgPen />
						</Button>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								handleTaskDeletion(task._id!);
							}}
						>
							<CgTrash />
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default Task;
