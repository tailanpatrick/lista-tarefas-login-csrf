import { RequestHandler, Response } from 'express';
import User from '../models/User';
import {
	RequestWithUser,
	SessionUser,
} from '../interfaces/request-with-user-and-session';

// Login
export const login: RequestHandler = async (req, res) => {
	const reqWithUser = req as RequestWithUser;

	try {
		const { email, password } = reqWithUser.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ error: 'Preencha todos os campos: email e senha.' });
		}

		const user = new User(req.body);
		await user.login();

		if (user.errors.length > 0) {
			return res.status(400).json({ error: user.errors });
		}

		// Garantindo que session existe
		if (reqWithUser.session) {
			reqWithUser.session.user = user.user as SessionUser;
		}

		return res.status(200).json({ message: 'Usuário logado com sucesso.' });
	} catch (err: any) {
		console.error('Erro no login do usuário:', err);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}
};

export const getSession: RequestHandler = (req, res) => {
	const reqWithUser = req as RequestWithUser;

	if (!reqWithUser.session?.user) {
		return res.status(401).json({ user: null, csrfToken: req.csrfToken() });
	}

	const { password, ...userWithoutPassword } = reqWithUser.session.user;

	// Retorna usuário + CSRF token
	return res.json({ user: userWithoutPassword, csrfToken: req.csrfToken() });
};

export const logOut: RequestHandler = (req, res) => {
	const reqWithUser = req as RequestWithUser;

	reqWithUser.session?.destroy((err) => {
		if (err) {
			console.error('Erro ao destruir sessão:', err);
			return res.status(500).json({ error: 'Erro ao fazer logout' });
		}
		return res.json({ message: 'Logout efetuado com sucesso' });
	});
};

export const register: RequestHandler = async (req, res) => {
	try {
		const user = new User(req.body);
		await user.register();

		if (user.errors.length > 0) {
			return res.status(400).json({ error: user.errors });
		}

		return res
			.status(200)
			.json({ message: 'Usuário criado com sucesso. Faça seu login.' });
	} catch (err: any) {
		console.error('Erro no registro do usuário:', err);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}
};
