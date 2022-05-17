const Post = require('../models/post');

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
    .exec(function (err, posts) {
      return res.render('home', {
        title: 'Societal | Home',
        posts: posts,
      });
    });
};
