// config/nodemailerConfig.js
//const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    auth: {
        user: "batcaverna@batcaverna.online",
        pass: "Bat#1104"
    }
});

export default transport;