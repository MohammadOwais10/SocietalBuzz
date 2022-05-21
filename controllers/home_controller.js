const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) {
  //-->here it render but show  only id
  // Post.find({}, function (err, posts) {
  //   return res.render('home', {
  //     title: 'Societal | Home',
  //     posts: posts,
  //   });
  // });

  //populate the user of each post(complete all details render)
  try {
    // populate the likes of each post and comment
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
        populate: {
          path: 'likes',
        },
      })
      .populate('comments')
      .populate('likes');

    let users = await User.find({});

    //get all user
    return res.render('home', {
      title: 'Societal | Home',
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
};
