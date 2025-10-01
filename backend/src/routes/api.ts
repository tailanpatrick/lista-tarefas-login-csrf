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
import { authMiddleware, csrfMiddleware } from '../middlewares/middleware';

const route = Router();

route.get('/teste', (req: Request, res: Response) => {
	res.send('Hello World!');
});

route.get('/__sec/__session', getSession);

route.post('/register', register);
route.post('/login', login);

route.get('/logout', logOut);

// Rotas de tasks
route.get('/tasks', authMiddleware, getTasks); // GET protegido
route.get('/task/:id', authMiddleware, getTask); // GET protegido
route.post('/task', authMiddleware, csrfMiddleware, registerTask);
route.put('/task/:id', authMiddleware, csrfMiddleware, editTask);
route.delete('/task/:id', authMiddleware, csrfMiddleware, deleteTask);

export default route;
