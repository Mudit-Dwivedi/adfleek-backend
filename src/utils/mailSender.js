const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.EMAIL_SERVER_HOST,
                port: 587, 
                auth:{
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASSWORD,
                }
            })


            let info = await transporter.sendMail({
                from: 'Adfleek <noreply@adfleek.com>',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;