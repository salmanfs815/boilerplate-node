module.exports = {
  verifyLogin: function(con, user, pass, callback) {
    con.query(`SELECT password FROM users WHERE username = '${user}';`, function(error, results, fields) {
      if (error) {
        callback(error, null);
      } else {
        if (results && results[0] && results[0].password === pass) callback(null, true);
        else callback(null, false);
      }
    });
  }
}