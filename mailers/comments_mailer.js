const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    '/comments/new_comment.ejs'
  );

  nodeMailer.transporter.sendMail(
    {
      from: 'sender@gmail.com', // sender email update before deployment
      to: comment.user.email,
      subject: 'New Comment Published!',
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
        return;
      }
      // console.log('Message sent', info);
      return;
    }
  );
};
