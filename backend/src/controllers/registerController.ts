import { RequestHandler, Response } from 'express';
import User from '../models/User';
import { RequestWithUser } from '../interfaces/request-with-user-and-session';

export const register: RequestHandler = async (req, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ error: 'Preencha todos os campos: email e senha.' });
		}

		const user = new User(req.body);

		await user.register();

		if (user.errors.length > 0) {
			return res.status(400).json({ error: user.errors });
		}

		return res
			.status(200)
			.json({ message: 'Usuário criado com sucesso. Faça seu login.' });
	} catch (err) {
		console.log('Erro no registro do usuário:', err);
		res.status(500).json({ error: 'Erro interno do servidor' });
	}
};
