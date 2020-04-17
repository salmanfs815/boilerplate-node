var crypto = require('crypto');
var usersModel = require('../model/users');

module.exports = {
  login: function(req, res, next) {
    // verify login, sanitize inputs
    var pword = crypto.createHash('md5').update(req.body.password).digest('hex');
    usersModel.verifyLogin(req.con, req.body.username, pword, function(error, correct) {
      if (error) {
        console.log(error);
        next(error);
      }
      else {
        if (correct) {
          req.session.username = req.body.username;
          res.redirect('/upload');
        } else {
          // display invalid login message
          res.redirect('back');
        }
      }
    });
  },
  logout: function(req, res, next) {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) return next(err);
        else res.redirect('/');
      });
    }
  }
};
