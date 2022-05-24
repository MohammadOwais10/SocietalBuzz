const User = require('../models/user');
const Token = require('../models/forgotPassword_token');

// before going to this function we should be on the sign in page
module.exports.renderEmail = async (req, res) => {
  return res.render('forgot_password', {
    title: 'Societal',
  });
};

// send the mail to email ,id store the token to change the password
module.exports.generateToken_And_sendMail = async (req, res) => {
  let token_string = crypto.randomBytes(40).toString('hex');
  let user = await User.findOne({ email: req.body.email });

  await Token.create({
    isValid: true,
    accessToken: token_string,
    user: user,
  });
};

// redirect to change password page
module.exports.changePasswordReset = async function (req, res) {
  let tokenLink = req.query.accessToken;
  let token = await Token.findOne({ accessToken: tokenLink });
  if (!token.isValid) {
    return res.redirect('back');
  }
  return res.render('passwordChanged', {
    title: 'Societal| Change Password',
    accessToken: tokenLink,
  });
};

// change the password in the database
module.exports.passwordChanged = function (req, res) {
  let tokenLink = req.body.accessToken;
  let newPassword = req.body.newPassword;
  let confirmPassword = req.body.confirmPassword;
  if (newPassword != confirmPassword) {
    req.flash('error', 'Please enter same Password!');
    return res.redirect('back');
  }
  if (newPassword == '') {
    req.flash('error', 'Please enter the Password!');
    return res.redirect('back');
  }

  /*  get the token
      get user.id from the token
      find (and update) the user with the given userid on the Users model
      mark the isValid in the token as false.
  */
  Token.findOneAndUpdate(
    { accessToken: tokenLink },
    { $set: { isValid: false } },
    function (error, token) {
      console.log(token);
      if (error) {
        console.log(
          'Error in finding the token with given accessToken string!',
          error
        );
        return;
      }
      if (!token.isValid) {
        return res.redirect('back');
      }
      User.findByIdAndUpdate(
        token.user,
        { $set: { password: newPassword } },
        function (error, user) {
          if (error) {
            console.log('Error in finding the user with the provided token!');
            return;
          }
          console.log(user.password, token.isValid);
          return res.redirect('/users/sign-in');
        }
      );
    }
  );
};
