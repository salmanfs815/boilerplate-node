var path = require('path');
require('dotenv').config({path: path.join(process.cwd(), 'config', 'db.env')});
var mysql = require("mysql")

var con = mysql.createConnection({
  host: "35.227.146.173",
  user: "readonlyuser",
  password: "readonly",
  database: "cmpt470"
});

con.connect(function(error) {
  if (error) throw error;
});

module.exports = con;
