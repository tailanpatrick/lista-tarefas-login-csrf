import {
	RequestHandler,
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction,
} from 'express';
import { RequestWithUser } from '../interfaces/request-with-user-and-session';

/* Middleware global (AGORA INCLUI A EXPOSIÇÃO DO CSRF TOKEN) */
export const middlewareGlobal: RequestHandler = (req, res, next) => {
	res.locals.csrfToken =
		typeof (req as any).csrfToken === 'function'
			? (req as any).csrfToken()
			: null;
	next();
};

/* Middleware CSRF (Função mantida, mas a lógica foi integrada ao middlewareGlobal) */
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

/* Middleware de erro (Tratamento restaurado) */
export const checkError: ErrorRequestHandler = (err, req, res, next) => {
	// 🚨 A lógica CSRF foi restaurada para garantir resposta 403 JSON
	if (err?.code === 'EBADCSRFTOKEN') {
		return res.status(403).json({
			error: 'Operação não permitida. Token CSRF inválido ou ausente.',
		});
	}

	console.error(err);
	// Para todos os outros erros não tratados, retorna um 500 genérico.
	return res.status(500).json({ error: 'Erro interno do servidor' });
};

/* Middleware 404 */
export const check404: RequestHandler = (req, res, next) => {
	res.status(404).json({ error: 'A página solicitada não existe' });
};
