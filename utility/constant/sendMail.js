const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendMail = async (data) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.USER_MAIL,
        to: data.to,
        subject: data.subject,
        html: data.html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}

exports.sendMail = sendMail;