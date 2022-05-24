const queue = require('../config/kue');
const forgotPassword_mailer = require('../mailers/forgotPassword_mailer');

queue.process('resetPasswordMail', function (job, done) {
  forgotPassword_mailer.forgotPassword(job.data);
  done();
});
