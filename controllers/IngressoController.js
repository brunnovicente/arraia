import Ingresso  from "../models/Ingresso.js";
import Aluno from "../models/Aluno.js";
import qrcode from "qrcode";

class IngressoController {

    retirar = async function (req, res) {
        const matricula = req.body.matricula;
        const email = req.body.email;

        const aluno = await Aluno.findOne({
            where: {
                matricula: matricula,
            }
        });

        if(!aluno){
            req.flash('error_msg', 'Matrícula ou CPF não encontrado')
            res.redirect('/ingresso/retirar');
        }else{
            if(aluno.email === email){
                const ingressos = await Ingresso.findAll({
                    where: {
                        alunos_id: aluno.id,
                    }
                })

                if(ingressos.length > 0){
                    res.render('ingresso/imprimir', {ingressos: ingressos, aluno: aluno});
                }else{
                    req.flash('error_msg', 'Você ainda não tem ingressos disponíveis! Favor entrar em contato com a comissão do Arraial.')
                    res.redirect('/');
                }
            }else{
                req.flash('error_msg', 'E-mail não encontrado!')
                res.redirect('/ingresso/retirar');
            }

        }

    }

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

    todos = async function(req, res){
        const curso = req.params.curso
        const alunos = await Aluno.findAll({
            where:{
                curso: curso,
                status: 1
            }
        })

        if(!alunos){
            req.flash('error_msg', 'Nenhum aluno confirmou!')
            res.redirect('/admin')
        }else{
            console.log('========================')
            console.log(alunos)
            for(let i = 0; i < alunos.length; i++){
                alunos[i].ingressos = await Ingresso.findAll({
                    where:{
                        alunos_id: alunos[i].id
                    }
                })
            }

            res.render('ingresso/todos', {alunos: alunos, curso: curso})
        }
    }//Fim de Todos

    adicionar = async function (req, res){
        const id = req.params.id;

        const ingressos = await Ingresso.findAll({
            where:{
                alunos_id: id
            }
        })
        const codigo = gerarCodigo()
        const novo = {
            codigo: codigo,
            qrcode: await gerarQRcode(`https://${req.get('host')}/ingresso/validar/${codigo}`),
            status: 0,
            alunos_id: id,
            descricao: 'Ingresso '+(ingressos.length + 1)
        }

        Ingresso.create(novo).then(function(ingresso){
            req.flash('success_msg', 'Ingresso adicionado com sucesso!')
            res.redirect('/ingresso/listar/' + id)
        })

    }

}

//FUNÇÕES EXTRAS
function gerarCodigo (tamanho = 6) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < tamanho; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }
    return codigo;
}

async function gerarQRcode (texto){
    try{
        const codigo = await qrcode.toDataURL(texto);
        return codigo
    }catch (err){
        console.error(err);
    }
}

export default new IngressoController();