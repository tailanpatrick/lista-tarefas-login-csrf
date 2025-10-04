import api from '../lib/api';

export async function deleteTask(taskId: string) {
	await api.delete(`/task/${taskId}`);
}
