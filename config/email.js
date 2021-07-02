/* ======================= LIBRARY ======================= */
const nodeMailer = require('nodemailer');
/* ======================= CONSTANTS ======================= */
const adminEmail = process.env.ADMINISTRATOR_EMAIL;
const adminPassword = process.env.ADMINISTRATOR_PASSWORD;
const adminHost = process.env.ADMINISTRATOR_HOST;
const adminPort = process.env.ADMINISTRATOR_PORT;

let sendEmail = (to,subject,htmlContent) =>{
    let transporter = nodeMailer.createTransport({
        host : adminHost,
        port : adminPort,
        secure : false,
        auth : {
            user : adminEmail,
            pass : adminPassword
        }
    });

    let options = {
        from : adminEmail,
        to : to,
        subject : subject,
        html : htmlContent
    };
    // return a promise
    return transporter.sendMail(options);
}

module.exports = sendEmail;