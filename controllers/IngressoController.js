import Ingresso  from "../models/Ingresso.js";
import Aluno from "../models/Aluno.js";

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

    listar = async function(req, res){
        const aluno_id = req.params.aluno
        const aluno = await Aluno.findOne({
            where:{
                id: aluno_id
            }
        })

        const ingressos = await Ingresso.findAll({
            where:{
                alunos_id: aluno.id
            }
        })

        res.render('ingresso/listar', {ingressos: ingressos, aluno: aluno})
    }

}

export default new IngressoController();