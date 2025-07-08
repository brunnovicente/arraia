import Aluno from '../models/Aluno.js';
import Ingresso from "../models/Ingresso.js";
import qrcode from "qrcode";
import comunicador from "../helpers/comunicador.js";
import puppeteer from "puppeteer";
import express from 'express';
const servidor = express();
import path from "path";
import { fileURLToPath } from 'url';

//Pasta de Arquivos Estásticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
servidor.use(express.static(path.join(__dirname, 'public')));


class AlunoController {

    lista = async function (req, res) {
        const chave = req.params.curso;
        const alunos = await Aluno.findAll({
            where:{
                curso: chave
            },
            order: [['status', 'DESC']]
        });
        res.render('aluno/lista', {alunos: alunos, curso: chave})
    }

    confirmar = async function (req, res){
        res.render('aluno/confirmar')
    }

    presenca = async function (req, res){
        const aluno = await Aluno.findOne({
            where: {
                matricula: req.body.matricula
            }
        })
        if(aluno.status === 1){
            req.flash('error_msg', 'Seus ingressos já foram enviados para '+aluno.email)
            res.redirect('/');
        }else{
            aluno.email = req.body.email
            await Aluno.update({
                email: aluno.email,
                status: 1
            }, {
                where: { id: aluno.id }
            })
            //let qtd = parseInt(req.body.convidados)
            //let url = `${req.protocol}://${req.get('host')}/ingresso/validar`
            for(let i = 0; i < 3; i++){
                let codigo = gerarCodigo()
                let novo = {
                    codigo: codigo,
                    status: 0,
                    descricao: 'Ingresso '+(i+1),
                    alunos_id: aluno.id,
                    qrcode: await gerarQRcode(`https://${req.get('host')}/ingresso/validar/${codigo}`)
                }

                const ingresso = await Ingresso.create(novo)
                enviar(aluno.email, ingresso)
            }

            req.flash('success_msg', 'Presença confirmada com sucesso!')
            if(req.user){
                res.redirect('/aluno/lista/'+aluno.curso)
            }else{
                res.redirect('/');
            }
        }

    }

    ingresso = async function (req, res){
        const ingressos = await Ingresso.findAll({
            where:{
                alunos_id: req.params.aluno,
            }
        })
        res.render('aluno/ingresso', {ingressos: ingressos})
    }

    curso = async function(req, res){
        const alunos = await Aluno.findAll({})

        for(let i = 0; i < alunos.length; i++){
            let aluno = alunos[i]
            let nome_curso = aluno.matricula
            if(nome_curso.includes('CNTI')){
                await Aluno.update({
                    curso: 'TI'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('PIF')){
                await Aluno.update({
                    curso: 'PIF'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('ADS')){
                await Aluno.update({
                    curso: 'ADS'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('TDS')){
                await Aluno.update({
                    curso: 'TDS'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('CNTADM')){
                await Aluno.update({
                    curso: 'TADM'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('BAD')){
                await Aluno.update({
                    curso: 'BADM'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('AI')){
                await Aluno.update({
                    curso: 'TAUT'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('PRO')){
                await Aluno.update({
                    curso: 'PROEJA'
                }, {where: {id: aluno.id}})
            }else if(nome_curso.includes('INF')){
                await Aluno.update({
                    curso: 'TI'
                }, {where: {id: aluno.id}})
            }
        }
        res.redirect('/')
    }

    egresso = async function(req, res){

        const aluno = await Aluno.findOne({
            where: {matricula: req.body.matricula}
        })

        if(aluno){
            req.flash('error_msg', 'Ingresso solicitado para o cpf '+aluno.matricula+' e enviado para o e-mail '+aluno.email)
            res.redirect('/')
        }else {
            const novo = {
                matricula: req.body.matricula,
                nome: req.body.nome,
                email: req.body.email,
                curso: 'EGRESSO',
                status: 0
            }

            Aluno.create(novo).then(async function (aluno) {

                let codigo = gerarCodigo()
                let novo = {
                    codigo: codigo,
                    status: 0,
                    descricao: 'Ingresso 1',
                    alunos_id: aluno.id,
                    qrcode: await gerarQRcode(`https://${req.get('host')}/ingresso/validar/${codigo}`)
                }

                const ingresso = await Ingresso.create(novo)
                //enviar(aluno.email, ingresso)

                req.flash('success_msg', 'Ingresso enviado para o e-mail: '+aluno.email)
                res.redirect('/')
            })
        }

    }

    //API
    buscar = async function (req, res){
        const matricula = req.params.matricula;

        const aluno = await Aluno.findOne({
            where:{
                matricula: matricula
            }
        });
        res.json(aluno)
    }

}//FIM DA CLASSE

//Funções Extras
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

async function enviar(destinatario, ingresso){
    const mensagem = `
        <!doctype html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Ingresso</title>
        
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f8f8;
                padding: 30px;
            }
        
            .ticket {
                max-width: 600px;
                margin: 0 auto;
                background-color: #e1f5e0;
                border: 2px dashed #4CAF50;
                border-radius: 10px;
                padding: 20px;
                position: relative;
            }
        
            .ticket h1 {
                text-align: center;
                color: #2e7d32;
                font-size: 28px;
                margin-bottom: 10px;
            }
        
            .ticket .descricao {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                color: #388e3c;
                margin-bottom: 10px;
            }
        
            .ticket .codigo {
                text-align: center;
                font-size: 16px;
                margin-bottom: 10px;
                color: #2e7d32;
            }
        
            .ticket .qrcode {
                text-align: center;
            }
        
            .ticket .qrcode img {
                max-width: 180px;
                border: 2px solid #388e3c;
                padding: 8px;
                border-radius: 8px;
                background-color: white;
            }
        
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #555;
            }
        </style>
        
        </head>
        <body>
       
        <div class="ticket mb-3">
            <h1>Arraial do IFMA</h1>
            <div class="descricao">${ingresso.descricao}</div>
            <div class="codigo">Código: ${ingresso.codigo}</div>
            <div class="qrcode">'
                <img src="${ingresso.qrcode}" alt="QR Code do ingresso" width="180">
            </div>
            <div class="footer">
                IFMA Campus Coelho Neto - Evento Interno<br>
                Apresente este ingresso na entrada.
            </div>
        </div>
        
        </body>
        </html>
    `
    var imagem = 'public/img/ingresso'+ingresso.codigo+'.png'
    await gerarImagem(mensagem, imagem)
    const msg = `
    
        Seu ingresso está em anexo:
        CÓDIGO DO INGRESSO: ${ingresso.codigo}
    
    `
    comunicador.enviarIngressos(destinatario, imagem, ingresso.descricao+'.png', msg)
}

async function gerarImagem(conteudoHTML, saida='ingresso.png'){
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', //Para o linux
        //args: ['--no-sandbox'], //Para o linux
        headless: 'new'
    });
    const page = await browser.newPage();

    await page.setContent(conteudoHTML, { waitUntil: 'networkidle0' });

    const element = await page.$('body'); // ou algum seletor específico
    await element.screenshot({ path: saida });

    await browser.close();

    return saida;
}

export default new AlunoController()