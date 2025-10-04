import api from '../lib/api';
import type { TaskItem } from '../types/TaskItem';

export async function createEditTask(
	taskItem: TaskItem,
	setTaskItems: React.Dispatch<React.SetStateAction<TaskItem[]>>
): Promise<TaskItem | undefined> {
	const isNewTaskItem = !taskItem._id;
	const savedTaskItem = { ...taskItem };

	try {
		if (isNewTaskItem) {
			const response = await api.post(
				'/task',
				{
					title: savedTaskItem.title,
					stateOfCompletion: savedTaskItem.stateOfCompletion, // usa o valor real
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const createdTask = response.data.task;
			setTaskItems((prev) => [...prev, createdTask]);
			return createdTask;
		} else {
			const response = await api.put(
				`/task/${taskItem._id}`,
				savedTaskItem,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const updatedTask = response.data.task;
			setTaskItems((prev) =>
				prev.map((t) => (t._id === taskItem._id ? updatedTask : t))
			);

			return updatedTask;
		}
	} catch (error) {
		console.error('Error saving TaskItem:', error);
	}
}
