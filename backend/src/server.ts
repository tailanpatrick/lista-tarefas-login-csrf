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

mongoose
	.connect(CONNECTION_STRING)
	.then(() => app.emit('pronto'))
	.catch((e) => console.error(e));

const allowedOrigins = [
	'http://localhost:5173',
	'http://192.168.100.175:5173',
	'https://agenda-de-contatos-theta-two.vercel.app',
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
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions: session.SessionOptions = {
	secret: 'asdfgasdfg',
	store: MongoStore.create({ mongoUrl: CONNECTION_STRING }),
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
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
			connectSrc: ["'self'", 'http://192.168.100.175:3000'],
		},
	})
);

/* --------- Middlewares globais --------- */
app.use(middlewareGlobal);

/* --------- Rotas --------- */

app.use('/api', api);
app.use(routes);

/* --------- 404 --------- */
app.use(check404);

/* --------- Middleware de erro --------- */
app.use(checkError);

/* --------- Inicia servidor --------- */
// app.on('pronto', () => {
// 	app.listen(3000, () => {
// 		console.log('Servidor rodando na porta 3000');
// 	});
// });

export default app;
