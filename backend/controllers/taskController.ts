import { RequestHandler, Response } from 'express';
import Task from '../models/Task';
import { RequestWithUser } from '../interfaces/request-with-user-and-session';

export const registerTask: RequestHandler = async (req, res: Response) => {
	try {
		const reqWithUser = req as RequestWithUser;

		const userId = reqWithUser.session?.user?._id as string;

		const { title, stateOfCompletion } = req.body;

		const task = new Task({
			title,
			stateOfCompletion,
			user: userId,
		});

		await task.register();

		if (task.errors.length > 0) {
			return res.status(400).json({ error: task.errors });
		}

		return res.status(200).json({ task: task.Task });
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({ error: 'Erro ao criar task' });
	}
};

export const getTasks: RequestHandler = async (req, res: Response) => {
	const reqWithUser = req as RequestWithUser;

	const userId = reqWithUser.session?.user?._id as string;

	try {
		const tasks = await Task.getTasksFromUser(userId);
		return res.status(200).json({ tasks });
	} catch (err: any) {
		console.error(err);
		return res.status(400).json({ message: 'Falha ao buscar Tarefas' });
	}
};

export const getTask: RequestHandler = async (req, res: Response) => {
	const reqWithUser = req as RequestWithUser;

	const userId = reqWithUser.session?.user?._id as string;
	const taskId = reqWithUser.params.id;

	try {
		const task = await Task.getTask(taskId);

		if (!task) {
			return res.status(404).json({ error: 'Tarefa não encontrada.' });
		}

		const taskUserId = task.user._id.toString();

		if (taskUserId !== userId) {
			return res.status(403).json({
				error: 'Você não tem permissão para acessar esta Tarefa.',
			});
		}

		return res.status(200).json({ task });
	} catch (err: any) {
		console.error('Erro ao buscar a task:', err.message);
		return res.status(400).json({ error: err.message });
	}
};

export const deleteTask: RequestHandler = async (req, res: Response) => {
	const reqWithUser = req as RequestWithUser;

	const userId = reqWithUser.session?.user?._id as string;
	const taskId = reqWithUser.params.id;

	if (!taskId) {
		return res
			.status(400)
			.json({ error: 'Forneça o id da Tarefa a ser deletada' });
	}

	const taskExist = await Task.getTask(taskId);
	if (!taskExist) {
		return res.status(400).json({ error: 'Essa Tarefa não existe' });
	}

	const taskUserId = taskExist.user._id.toString();
	if (taskUserId !== userId) {
		return res.status(403).json({
			error: 'Você não tem permissão para deletar esta Tarefa.',
		});
	}

	const taskDeleted = await Task.delete(taskId);

	return res.status(200).json({ task: taskDeleted });
};

export const editTask: RequestHandler = async (req, res: Response) => {
	const reqWithUser = req as RequestWithUser;

	const userId = reqWithUser.session?.user?._id as string;
	const taskId = reqWithUser.params.id;
	if (!taskId) {
		return res
			.status(400)
			.json({ error: 'Forneça o id da task a ser editada' });
	}

	const taskExist = await Task.getTask(taskId);
	if (!taskExist) {
		return res.status(400).json({ error: 'Task não existe' });
	}

	const taskUserId = taskExist.user._id.toString();
	if (taskUserId !== userId) {
		return res
			.status(403)
			.json({ error: 'Você não tem permissão para editar esta task.' });
	}

	const task = new Task({ ...req.body, user: userId });
	await task.edit(taskId);

	if (task.errors.length > 0) {
		return res.status(400).json({ error: task.errors });
	}

	return res.status(200).json({ task: task.Task });
};
