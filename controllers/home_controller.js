const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function (req, res) {
  //-->here it render but show  only id
  // Post.find({}, function (err, posts) {
  //   return res.render('home', {
  //     title: 'Societal | Home',
  //     posts: posts,
  //   });
  // });

  //populate the user of each post(complete all details render)
  Post.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    })
    .exec(function (err, posts) {
      User.find({}, function (err, users) {
        //get all user
        return res.render('home', {
          title: 'Societal | Home',
          posts: posts,
          all_users: users,
        });
      });
    });
};
