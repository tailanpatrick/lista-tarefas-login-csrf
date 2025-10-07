import { RequestHandler } from 'express';
import { RequestWithUser } from '../interfaces/request-with-user-and-session';

export const getCsrfToken: RequestHandler = (req, res) => {
	const reqWithUser = req as RequestWithUser;

	return res.json({ csrfToken: reqWithUser.csrfToken?.() });
};
