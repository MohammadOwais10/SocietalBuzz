const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const IMAGE_PATH = path.join('/uploads/users/postimage');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      //required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    //include the array of ids of all comments in this post schema itself
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    postImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Multer storage for Post Image
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
postSchema.statics.uploadedImage = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only Image are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
}).single('postImage');
postSchema.statics.imagePath = IMAGE_PATH;

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
