import tranporter from "../config/email.js"

function enviarIngressos(destinatario, imagem, arquivo, mensagem){
    const config = {
        from: 'batcaverna@batcaverna.online',
        to: destinatario,
        subject: 'Arrial - Ingressos',
        html: mensagem,

        attachments:[
            {
                filename: arquivo,
                path: imagem,
                cid:'ingresso-img'
            }
        ]

    }



    tranporter.sendMail(config).then(function (mail){
        console.log('Ingresso Enviado por E-mail')
    })
}



export default {enviarIngressos}