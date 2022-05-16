const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/societal_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connecting in MongoDB'));

db.once('open', function () {
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;
