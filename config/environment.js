const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
});

const development = {
  name: 'development',
  asset_path: './assets',
  session_cookie_key: 'blahsomething',
  db: 'societal_development',
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sender@gamil.com', //email change before deployment--------------
      pass: 'sender password', //password change before deployment------------
    },
  },
  google_client_id:
    '380788318161-etscse5hou42t587aogjrsd3rq1k2qq1.apps.googleusercontent.com',
  google_client_secret: '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',
  google_call_back_url: 'http://localhost:8000/users/auth/google/callback',

  jwt_secret: 'societal',

  morgan: {
    mode: 'dev',
    options: { stream: accessLogStream },
  },
};

const production = {
  name: 'production',
  asset_path: process.env.SOCIETAL_ASSET_PATH,
  session_cookie_key: process.env.SOCIETAL_SESSION_COOKIE_KEY,
  db: process.env.SOCIETAL_DB,
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SOCIETAL_GMAIL_USERNAME,
      pass: process.env.SOCIETAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.SOCIETAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.SOCIETAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.SOCIETAL_GOOGLE_CALLBACK_URL,

  jwt_secret: process.env.SOCIETAL_JWT_SECRET,

  morgan: {
    mode: 'combined',
    options: { stream: accessLogStream },
  },
};

module.exports =
  eval(process.env.SOCIETAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.SOCIETAL_ENVIRONMENT);
