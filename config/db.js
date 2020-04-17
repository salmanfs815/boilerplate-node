var path = require('path');
require('dotenv').config({path: path.join(process.cwd(), 'config', 'db.env')});
var mysql = require("mysql")

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

con.connect(function(error) {
  if (error) throw error;
});

module.exports = con;
