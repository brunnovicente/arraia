import Ingresso  from "../models/Ingresso.js";

class IngressoController {

    validar = async function (req, res){
        const codigo = req.params.codigo;

        const novo = {
            status: 1
        }
        const ingresso = await Ingresso.findOne({
            where:{
                codigo:codigo,
            }
        })

        if(ingresso.status === 1){
            res.render('ingresso/validar', {ingresso: ingresso, status: 1})
        }else{
            Ingresso.update(novo,{
                where: {
                    codigo: codigo
                }
            }).then(function(ingresso){
                res.render('ingresso/validar', {ingresso: ingresso, status: 0});
            })
        }
    }

}

export default new IngressoController();