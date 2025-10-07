import {
	RequestHandler,
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction,
} from 'express';
import { RequestWithUser } from '../interfaces/request-with-user-and-session';

/* Middleware global */
export const middlewareGlobal: RequestHandler = (req, res, next) => {
	next();
};

/* Middleware CSRF */
export const csrfMiddleware: RequestHandler = (req, res, next) => {
	res.locals.csrfToken =
		typeof (req as any).csrfToken === 'function'
			? (req as any).csrfToken()
			: null;
	next();
};

/* Middleware de autenticação */
export const authMiddleware: RequestHandler = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	if (!req.session || !req.session.user?._id) {
		return res.status(401).json({ error: 'Usuário não autenticado' });
	}
	next();
};

/* Middleware de erro */
export const checkError: ErrorRequestHandler = (err, req, res, next) => {
	if (err?.code === 'EBADCSRFTOKEN') {
		return res.status(403).json({
			error: 'Operação não permitida. Token CSRF inválido ou ausente.',
		});
	}

	console.error(err);
	return res.status(500).json({ error: 'Erro interno do servidor' });
};

/* Middleware 404 */
export const check404: RequestHandler = (req, res, next) => {
	res.status(404).json({ error: 'A página solicitada não existe' });
};
