import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import path from 'path';
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

if (!CONNECTION_STRING) {
	console.error(
		'ERRO: Variável de ambiente MONGO_DB_CONECTION_STRING não está definida.'
	);
	process.exit(1);
}

mongoose
	.connect(CONNECTION_STRING)
	.then(() => console.log('MongoDB conectado'))
	.catch((e) => console.error('Erro de Conexão com MongoDB:', e));

const isProduction =
	process.env.NODE_ENV === 'production' ||
	process.env.VERCEL_ENV === 'production';

const allowedOrigins = [
	'http://localhost:5173',
	'http://192.168.100.175:5173',
	'https://lista-tarefas-login-csrf.vercel.app',
	process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
];

app.use(
	cors({
		origin: (origin, callback) => {
			const requestOrigin = origin ? origin.replace(/\/$/, '') : null;

			if (!requestOrigin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(requestOrigin)) {
				return callback(null, true);
			}

			if (requestOrigin.endsWith('.vercel.app')) {
				return callback(null, true);
			}

			callback(new Error(`Not allowed by CORS: ${requestOrigin}`));
		},
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions: session.SessionOptions = {
	secret: process.env.SESSION_SECRET || 'asdfgasdfg',
	store: MongoStore.create({ mongoUrl: CONNECTION_STRING }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'none' : 'lax',
	},
	unset: 'destroy',
};
app.use(session(sessionOptions));
app.use(flash());

app.use(csurf());

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
				'http://192.168.100.175:3000',
				'https://*.vercel.app',
			],
		},
	})
);

app.use(middlewareGlobal);

app.use('/api', api);
app.use(routes);

app.use(checkError);

app.use(check404);

export default app;
