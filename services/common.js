const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
 // token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZWNhM2E5NjI5MDg3MjMzZWNlNzFhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEwMDA3MjUzfQ.h9l_OusMhbEBYcgN4XsC7KLqnIPBeQ1JmDXrmsxfccw"
  return token;
};
