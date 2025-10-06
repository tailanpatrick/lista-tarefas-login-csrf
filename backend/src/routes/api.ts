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
import { validateObjectId } from '../middlewares/validateID';
import { getCsrfToken } from '../controllers/csrfController';

const route = Router();

route.get('/teste', (req: Request, res: Response) => {
	res.send('Hello World!');
});

route.get('/__sec/__session', getSession);
route.get('/__sec/__csrf-token', getCsrfToken);

route.post('/register', register);
route.post('/login', login);

route.get('/logout', logOut);

route.get('/tasks', authMiddleware, getTasks);
route.get('/task/:id', authMiddleware, validateObjectId, getTask);
route.post('/task', authMiddleware, csrfMiddleware, registerTask);

route.put(
	'/task/:id',
	authMiddleware,
	csrfMiddleware,
	validateObjectId,
	editTask
);
route.delete(
	'/task/:id',
	authMiddleware,
	csrfMiddleware,
	validateObjectId,
	deleteTask
);

export default route;
