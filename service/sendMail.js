const sgMail = require('@sendgrid/mail');
require("dotenv").config();
const secret = process.env.SENDGRID_API_KEY;

const sendEmail = async (email, idToken) => {
   sgMail.setApiKey(secret);
   verificationLink = `http://localhost:3000/api/user/verify/${idToken}`;

   const msg = {
      to: email,
      from: 'a.lipsheiev@gmail.com',
      subject: 'Sending verification token',
      text: `verification token : ${verificationLink}`,
      html: `<strong> Tour verification token is : <a href="${verificationLink}">${verificationLink}</a></strong>`,
         };

   await sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch(error => {
    console.error(error);
  });
}

module.exports = { sendEmail };