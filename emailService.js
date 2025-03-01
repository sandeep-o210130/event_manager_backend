const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    secure: false,
    auth:{
        user:"psandeepkumark31@gmail.com",
        pass:"xshu yejq msvq cwxw",
    }
});

const sendEmail = (to,subject,text)=>{
    const mailOptions = {
        from:"psandeepkumark31@gmail.com",
        to,
        subject,
        text,
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("Errors sending email",error);
        }
        else{
            console.log("email sent:",info.response);
     }
    })
};

module.exports  = sendEmail;