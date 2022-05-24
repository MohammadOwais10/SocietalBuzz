const nodemailer_config = require('../config/nodemailer');

exports.forgotPassword = (token) => {
  nodemailer_config.transporter.sendMail(
    {
      from: 'sender@gmail.com', // change before deployment and below localhost:8000
      to: token.user.email,
      subject: 'Societal| Link Reset Password',
      html: `
            <h3>This is password reset link to change your password. Please do not share it with anyone.</h3>
            <p>http://localhost:8000/forgotPassword/reset/?accessToken=${token.accessToken}</p><br>
            <p>Kindly click on the above link to change your password.</p>`,
    },
    (error, info) => {
      if (error) {
        console.log('Error in sending email!', error);
        return;
      }
      console.log('Mail delivered!', info);
      return;
    }
  );
};
