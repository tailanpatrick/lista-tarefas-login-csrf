import { Router, Request, Response } from 'express';
import { register } from '../controllers/registerController';
import { login, logOut, getSession } from '../controllers/loginController';
import {
	registerTask,
	getTask,
	getTasks,
	editTask,
	deleteTask,
} from '../controllers/taskController';

const route = Router();

route.get('/teste', (req: Request, res: Response) => {
	res.send('Hello World!');
});

route.get('/__sec/__session', getSession);

route.post('/register', register);
route.post('/login', login);

route.get('/logout', logOut);

// Rotas de tasks
route.get('/tasks', getTasks); // lista todas as tasks
route.get('/task/:id', getTask); // pega task específica
route.post('/task', registerTask); // cria task
route.put('/task/:id', editTask); // edita task
route.delete('/task/:id', deleteTask); // deleta task

export default route;
