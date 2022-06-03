const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const Friendship = require('../models/friendship');

module.exports.profile = async function (req, res) {
  try {
    let post = await Post.find({ user: req.params.id })
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user likes',
        },
      })
      .populate('likes');

    let user = await User.find({});

    let friends = new Array();
    if (req.user) {
      let all_friendships = await Friendship.find({
        $or: [{ from_user: req.user._id }, { to_user: req.user._id }],
      })
        .populate('from_user')
        .populate('to_user');
      for (let fs of all_friendships) {
        if (fs.from_user._id.toString() == req.user._id.toString()) {
          friends.push({
            friend_name: fs.to_user.name,
            friend_id: fs.to_user._id,
            friend_avatar: fs.to_user.avatar,
          });
        } else if (fs.to_user._id.toString() == req.user._id.toString()) {
          friends.push({
            friend_name: fs.from_user.name,
            friend_id: fs.from_user._id,
            friend_avatar: fs.from_user.avatar,
          });
        }
      }
    }

    let signin_User = await User.findById(req.params.id);

    let are_friends = false;
    Friendship.findOne(
      {
        $or: [
          { from_user: req.user._id, to_user: req.params.id },
          { from_user: req.params.id, to_user: req.user._id },
        ],
      },
      function (error, friendship) {
        if (error) {
          console.log('There was an error in finding the friendship', error);
          return;
        }
        if (friendship) {
          are_friends = true;
        }
        console.log('****', are_friends, '*****');

        return res.render('user_profile', {
          title: 'User Profile',
          profile_user: signin_User,
          posts: post,
          all_users: user,
          all_friends: friends,
          are_friends: are_friends,
        });
      }
    );
  } catch (err) {
    console.log('ERROR', err);
    return;
  }
};

// update profile
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log('*****Multer Error: ', err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized!');
    return res.status(401).send('Unauthorized');
  }
};
// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }
  return res.render('user_sign_up', {
    title: 'Societal | Sign Up',
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }
  return res.render('user_sign_in', {
    title: 'Societal | Sign In',
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Passwords does not match');
    return res.redirect('back');
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash('error', err);
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          req.flash('error', err);
          return;
        }
        req.flash('success', 'You have signed up, login to continue!');
        return res.redirect('/users/sign-in');
      });
    } else {
      req.flash('error', 'Fill correctlly!');
      return res.redirect('back');
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
};

//sign out
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash('success', 'You have Logged Out !!');
  return res.redirect('/');
};
