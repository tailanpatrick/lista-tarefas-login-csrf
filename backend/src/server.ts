import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import helmet from 'helmet';
import csurf from 'csurf';

import routes from './routes/api';
import api from './routes/api';
import {
	middlewareGlobal,
	checkError,
	check404,
} from './middlewares/middleware';

dotenv.config();

const app: Application = express();
const CONNECTION_STRING = process.env.MONGO_DB_CONECTION_STRING || '';

const isProduction = process.env.NODE_ENV === 'production';

mongoose
	.connect(CONNECTION_STRING)
	.then(() => app.emit('pronto'))
	.catch((e) => console.error(e));

const allowedOrigins = [
	'http://localhost:5173',
	'http://192.168.100.175:5173',
	'https://lista-tarefas-login-csrf.vercel.app',
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin))
				callback(null, true);
			else callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions: session.SessionOptions = {
	secret: 'asdfgasdfg',
	store: MongoStore.create({ mongoUrl: CONNECTION_STRING }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true,

		secure: isProduction,
		sameSite: isProduction ? 'none' : 'lax',

		domain: isProduction ? '.vercel.app' : undefined,
	},
	unset: 'destroy',
};

app.use(session(sessionOptions));

app.use(flash());

app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			scriptSrc: [
				"'self'",
				"'unsafe-inline'",
				"'unsafe-eval'",
				'https://unpkg.com',
			],
			connectSrc: [
				"'self'",
				'https://lista-tarefas-login-csrf.vercel.app',
			],
		},
	})
);

app.use(middlewareGlobal);

app.use('/api', api);

app.use(routes);

app.use(csurf());

app.use(check404);

app.use(checkError);

export default app;
