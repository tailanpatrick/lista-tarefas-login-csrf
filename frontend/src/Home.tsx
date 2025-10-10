import { useEffect, useState } from 'react';

import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import type { TaskItem } from './types/TaskItem';
import Header from './components/Header';

import { createEditTask } from './services/create-edit-task';
import { deleteTask } from './services/delete-task';
import { fetchTasks } from './services/fetch-tasks';

const Home = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const { tasks } = await fetchTasks();
				setTasks(tasks);
			} catch (error) {}
		};
		loadTasks();
	}, []);

	const handleTaskClick = async (taskId: string) => {
		try {
			let updatedTask = {
				title: '',
				stateOfCompletion: false,
				userId: '',
			} as TaskItem;

			await Promise.all(
				tasks.map(async (task) => {
					if (taskId === task._id) {
						updatedTask = {
							...task,
							stateOfCompletion: !task.stateOfCompletion,
						};
						return updatedTask;
					}
					return task;
				})
			);

			await createEditTask(updatedTask, setTasks);
		} catch (error) {
			console.error('Erro ao atualizar tarefa:', error);
		}
	};

	const handleTaskAddition = async (taskTitle: string) => {
		if (taskTitle === '') return;

		const newTask: TaskItem = {
			title: taskTitle,
			stateOfCompletion: false,
		};

		try {
			await createEditTask(newTask, setTasks);
		} catch (error) {
			console.log('Erro ao criar tarefa. Tente novamente mais tarde.');
		}
	};

	const handleTaskDeletion = async (taskId: string) => {
		try {
			const newTasks = tasks.filter(
				(task: TaskItem) => taskId !== task._id
			) as TaskItem[];

			setTasks(newTasks);

			await deleteTask(taskId);
		} catch (e) {
			console.log('Erro ao excluir tarefa', e);
		}
	};

	return (
		<div className="w-full h-full flex flex-col p-6 md:shadow-xl  bg-gray-900">
			<Header />

			<AddTask handleTaskAddition={handleTaskAddition} />

			<Tasks
				tasks={tasks}
				handleTaskClick={handleTaskClick}
				handleTaskDeletion={handleTaskDeletion}
				setTasks={setTasks}
			/>
		</div>
	);
};

export default Home;
