import Usuario from '../models/Usuario.js';
import bcrypt from "bcrypt";
import passport from "passport";
import comunicador from "../helpers/comunicador.js"

class UsuarioController {

    login = function(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/usuario/login',
            failureFlash: true
        })(req, res, next);
    }

    logout = function(req, res, next) {
        req.logout(function (erro){
            req.flash('success_msg', 'Usuário deslogado com sucesso.')
            res.redirect('/')
        })
    }

    senha = function(req,res){
        bcrypt.genSalt(10, function (erro, salt) {
            bcrypt.hash(req.params.senha, salt, function (erro, hash) {
                res.send(hash)
            })
        })
    }

}

export default new UsuarioController();