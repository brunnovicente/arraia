import passportLocal from 'passport-local';
const localEstrategy = passportLocal.Strategy
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import Professor from "../models/Professor.js";

export default function (passport) {
    passport.use(new localEstrategy({usernameField: "username", passwordField: "password"},
        function (username, password, done) {
        Usuario.findOne({
            where:{
                username: username
            },
        }).then(function (usuario) {
            if(!usuario){
                return done(null, false, {message: 'Usuário não encontrado.'});
            }
            bcrypt.compare(password, usuario.password, function (erro, batem) {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'Senha Incorreta.'});
                }
            })
        })
    }));

    passport.serializeUser(function (usuario, done) {
        done(null, usuario.id)
    })

    passport.deserializeUser(function (id, done) {
        Usuario.findByPk(id, {
            include:{
                model: Professor,
                as: 'professor'
            }
        }).then((usuario) => {
            done(null, usuario)
        })
    })



}//Fim do Module Exports