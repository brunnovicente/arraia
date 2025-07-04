class PrincipalController {
    index = function (req, res){
        res.render('principal/index');
    }
}

export default new PrincipalController();