import express from 'express';
const servidor = express();

import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { allowInsecurePrototypeAccess} from "@handlebars/allow-prototype-access";
import session from "express-session";
import flash from "connect-flash"
import passport from "passport"
//import auth from "./config/auth.js";
//auth(passport)

///////////////////////////////
//CONFIGURAÇÕES
///////////////////////////////
const PORTA = 3200
//Sessão
servidor.use(session({
    secret: "iambatman",
    resave: true,
    saveUninitialized: true,
}))
servidor.use(passport.initialize())
servidor.use(passport.session())
servidor.use(flash());

servidor.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.usuario = req.user || null
    next()
});

servidor.engine('handlebars', handlebars.engine({
    defaultLayout: 'principal',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    'helpers':{
        igual:function (a,b){
            return a === b
        },
    }
}))

servidor.set('view engine', 'handlebars');

//Body Parser
servidor.use(bodyParser.urlencoded({ extended: false }));
servidor.use(bodyParser.json());

//Pasta de Arquivos Estásticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
servidor.use(express.static(path.join(__dirname, 'public')));


/////////////////////
/// ROTAS DO SISTEMA
///////////////////////

servidor.get('/', (req, res) => {
    res.render('principal/index')
})

import aluno from './routes/aluno.js'
servidor.use('/aluno', aluno);

import ingresso from './routes/ingresso.js'
servidor.use('/ingresso', ingresso);

servidor.listen(PORTA, function (){
    console.log('Servidor rodando em http://localhost:'+PORTA);
});