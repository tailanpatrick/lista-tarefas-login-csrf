import { Request, Response, NextFunction } from 'express';

// Middleware global
export const middlewareGlobal = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	next();
};

// Middleware CSRF
export const csrfMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Cast local para "any" apenas aqui para acessar csrfToken
	const token = (req as any).csrfToken?.();
	res.locals.csrfToken = token;
	next();
};

// Middleware para verificar erros de CSRF
export const checkError = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err?.code === 'EBADCSRFTOKEN') {
		return res.status(403).json({
			error: 'Operação não permitida. Token CSRF inválido ou ausente.',
		});
	}

	// Outros erros
	res.status(500).json({ error: 'Erro interno do servidor' });
};

// Middleware 404
export const check404 = (req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({ error: 'A página solicitada não existe' });
};
