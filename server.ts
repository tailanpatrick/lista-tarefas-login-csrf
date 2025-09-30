import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import path from 'path';
import helmet from 'helmet';

import routes from './src/backend/routes/api';
import api from './src/backend/routes/api';
import {
	middlewareGlobal,
	checkError,
	csrfMiddleware,
	check404,
} from './src/backend/middlewares/middleware';

dotenv.config();

const app: Application = express();
const CONNECTION_STRING = process.env.MONGO_DB_CONECTION_STRING || '';

mongoose
	.connect(CONNECTION_STRING)
	.then(() => {
		app.emit('pronto');
	})
	.catch((e) => console.error(e));

const allowedOrigins = [
	'http://localhost:3000',
	'http://192.168.100.175:3000',
	'https://agenda-de-contatos-theta-two.vercel.app',
];
app.use(
	cors({
		origin: function (origin: string | undefined, callback: any) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

// Middlewares de parsing e estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Configurando sessão
const sessionOptions: session.SessionOptions = {
	secret: 'asdfgasdfg',
	store: MongoStore.create({ mongoUrl: CONNECTION_STRING }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true,
	},
	unset: 'destroy',
};

app.use(session(sessionOptions));
app.use(flash());

// Helmet para segurança
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

// Middlewares globais e de CSRF
app.use(middlewareGlobal);
app.use(checkError);

// Configuração das views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // ou outro engine que você use

// Rotas
app.use('/api', api);
app.use(routes);

// Middleware 404
app.use(check404);

// Iniciando servidor após conexão com MongoDB
app.on('pronto', () => {
	app.listen(3000, () => {
		console.log('Servidor subiu na porta 3000');
	});
});
