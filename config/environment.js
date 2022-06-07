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
};

const production = {
  name: 'production',
};

module.exports = development;
