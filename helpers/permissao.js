import Usuario from '../models/Usuario.js'

function getCategoria(c){
    switch(c){
        case 0:
            return 'Discente'
        case 1:
            return 'Docente'
        case 2:
            return 'Coordenador'
        case 3:
            return 'DE'
        case 4:
            return 'Supremo'
    }
}

function autorizar(categorias){
    return function (req, res, next){
        if(!req.isAuthenticated()){
            req.flash('success_msg', 'Você precisa realizar o login!')
            return res.redirect('/usuario/login')
        }
        let cat = getCategoria(req.user.categoria)
        if(!categorias.includes(cat)){
            req.flash('error_msg', 'Você não tem permissão para acessar esse conteúdo.')
            return res.redirect('/principal')
        }
        return next()
    }
}

function isLogado(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg', 'Você precisa realizar o login!.')
    res.redirect('/usuario/login')
}

export {autorizar, isLogado}

// const discente = function (req, res, next){
//     //Categoria 0
// }
//
// const docente = function (req, res, next){
//     //Categoria 1
// }
//
// const coordenador = function(req, res, next) {
//     if(req.isAuthenticated() && req.user.categoria === 2) {
//         return next()
//     }
//     req.flash('error_msg', 'Você não tem autorização para acessar esse conteúdo')
//     res.redirect('/principal')
// }
//
// const de = function (req, res, next){
//     if(req.isAuthenticated() && req.user.categoria === 3) {
//         return next()
//     }
//     req.flash('error_msg', 'Você não tem autorização para acessar esse conteúdo')
//     res.redirect('/principal')
// }
//
// const supremo = function (req, res, next){
//     if(req.isAuthenticated() && req.user.categoria === 4) {
//         return next()
//     }
// }
//
// const isLogado = function(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next()
//     }
//     req.flash('error_msg', 'Você não tem autorização para acessar esse conteúdo')
//     res.redirect('/usuario/login')
// }
//
// export {coordenador, de, supremo, isLogado}