import Task from './Task';
import type { TaskItem } from '../types/TaskItem';

interface TasksProps {
	tasks: TaskItem[];
	handleTaskClick: (taskId: string) => void;
	handleTaskDeletion: (taskId: string) => void;
	setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

const Tasks = ({
	tasks,
	handleTaskClick,
	handleTaskDeletion,
	setTasks,
}: TasksProps) => {
	return (
		<>
			{tasks.map((task) => (
				<Task
					task={task}
					handleTaskClick={handleTaskClick}
					handleTaskDeletion={handleTaskDeletion}
					setTasks={setTasks}
					key={task._id}
				/>
			))}
		</>
	);
};

export default Tasks;
