import { RequestHandler, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const validateObjectId: RequestHandler = (req, res, next) => {
	const id = req.params.id;

	if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: 'ID inválido.' });
	}

	next();
};
