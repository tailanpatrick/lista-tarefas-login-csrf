const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.MONGO_DB_CONECTION_STRING
const cors = require('cors');

mongoose.connect(CONNECTION_STRING)
    .then(() => {
        app.emit('pronto')

    })
    .catch(e => console.log(e));

const allowedOrigins = ['http://localhost:3000', 'http://192.168.100.175:3000', 'https://agenda-de-contatos-theta-two.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./src/routes/pages');
const api = require('./src/routes/api');
const path = require('path');
const helmet = require('helmet');
const { middlewareGlobal, checkError, csrfMidddleware, check404 } = require('./src/middlewares/middleware')

const React = require('react');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));


const sessionOptions = session({
    secret: 'asdfgasdfg',
    store: MongoStore.create({
        mongoUrl: CONNECTION_STRING,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
    unset: 'destroy'
})

// usa o helmet
app.use(helmet());


// Configurando a CSP com Helmet
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com"],
            connectSrc: ["'self'", "http://192.168.100.175:3000"]
        },
    })
)

// usa a sessao
app.use(sessionOptions);

app.use(flash());


//usa os middlewares global
app.use(middlewareGlobal);

//usa o middleware da verificação de erro csrf
app.use(checkError);

// Configuração do diretório de views
app.set('views', path.join(__dirname, 'views'));

// Configuração do view engine
app.use(express.static(path.join(__dirname, 'public')));



// usando as rotas do arquivo routes
app.use('/api', api);
app.use(routes);

// !! IMPORTANTE !! - usar o middleware de 404 depois de usar as rotas
app.use(check404);

// verificando se conectado a base a partir de um emit chamado pronto
app.on('pronto', () => {
    // subindo o server
    app.listen(3000, () => {
        console.log('Servidor subiu na porta 3000')
    });
})


