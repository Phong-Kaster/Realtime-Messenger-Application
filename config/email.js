/* ======================= LIBRARY ======================= */
const nodeMailer = require('nodemailer');
/* ======================= CONSTANTS ======================= */
const adminEmail = process.env.ADMINISTRATOR_EMAIL;
const adminPassword = process.env.ADMINISTRATOR_PASSWORD;
const adminHost = process.env.ADMINISTRATOR_HOST;
const adminPort = process.env.ADMINISTRATOR_PORT;

let sendEmail = (receiver,subject,htmlContent) =>{
    let transporter = nodeMailer.createTransport({
        host : adminHost,
        port : adminPort,
        secure : false,
        authentication : {
            username : adminEmail,
            password : adminPassword
        }
    });

    let option = {
        from : adminEmail,
        receiver : receiver,
        html : htmlContent
    };
    // return a promise
    return transporter.sendMail(option);
}

module.exports = sendEmail;