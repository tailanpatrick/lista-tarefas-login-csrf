import mongoose, { Document, Model } from 'mongoose';

interface ITask extends Document {
	title: string;
	stateOfCompletion: boolean;
	createdAt: Date;
	user: mongoose.Types.ObjectId;
}

const TaskSchema = new mongoose.Schema<ITask>({
	title: {
		type: String,
		required: true,
	},
	stateOfCompletion: {
		type: Boolean,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);

class Task {
	body: any;
	errors: string[];
	Task: ITask | null;

	constructor(body: any) {
		this.body = body;
		this.errors = [];
		this.Task = null;
	}

	async register(): Promise<void> {
		await this.validate();

		if (this.errors.length > 0) return;

		this.Task = await TaskModel.create(this.body);
	}

	async edit(taskId: string): Promise<void> {
		if (typeof taskId !== 'string') return;

		await this.validate();

		if (this.errors.length > 0) return;

		this.Task = await TaskModel.findByIdAndUpdate(taskId, this.body, {
			new: true,
		});
	}

	async validate(): Promise<void> {
		this.cleanUp();

		if (!this.body.title) this.errors.push('title é um campo obrigatório.');
		if (!this.body.stateOfCompletion)
			this.errors.push('stateOfCompletion é um campo obrigatório.');
		if (!this.body.user) this.errors.push('Usuário inválido.');
	}

	cleanUp(): void {
		this.body = {
			title: this.body.title?.trim(),
			stateOfCompletion: this.body.stateOfCompletion,
			user: this.body.user,
		};
	}

	static async delete(taskId: string): Promise<ITask | null> {
		return await TaskModel.findByIdAndDelete(taskId);
	}

	static async getTasksFromUser(userId: string): Promise<ITask[]> {
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw new Error('ID de usuário inválido.');
		}

		return await TaskModel.find({ user: userId });
	}

	static async getTask(taskId: string): Promise<ITask | null> {
		if (!mongoose.Types.ObjectId.isValid(taskId)) {
			console.log(`ID inválido fornecido: ${taskId}`);
			throw new Error('ID da tarefa inválido.');
		}

		try {
			const task = await TaskModel.findById(taskId);
			return task || null;
		} catch (error: any) {
			console.error('Erro ao buscar a tarefa:', error.message);
			throw new Error('Erro ao buscar a tarefa no banco de dados.');
		}
	}
}

export default Task;
