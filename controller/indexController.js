const papaparse = require('papaparse');
const fs = require('fs');

module.exports = {
  index: function(req, res, next) {
    if (req.session && req.session.username) {
      res.redirect('/upload');
    } else {
      res.render('index', {title: 'Login'});
    }
  },
  upload: function(req, res, next) {
    if (req.session && req.session.username) {
      res.render('upload', {title: 'Upload Grades'});
    } else {
      res.redirect('/');
    }
  },
  histogram: function(req, res, next) {
    if (req.session && req.session.username) {
      var csvString = fs.readFileSync(req.files.csv.tempFilePath, 'utf-8');
      req.session.csvData = papaparse.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      }).data;
      res.render('histogram', {title: 'Histogram Generator', data: req.session.csvData});
    } else {
      res.redirect('/');
    }
  },
  displayHistogram: function(req, res, next) {
    if (req.session && req.session.username) {
      res.render('histogram', {title: 'Histogram Generator', data: req.session.csvData});
    } else {
      res.redirect('/');
    }
  },
  report: function(req, res, next) {
    if (req.session && req.session.username) {
      req.session.students = req.body;
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  },
  displayReport: function(req, res, next) {
    if (req.session && req.session.username) {
      res.render('report', {title: 'Student Reports', students: req.session.students});
    } else {
      res.redirect('/');
    }
  },
  studentReport: function(req, res, next) {
    if (req.session && req.session.username) {
      res.render('studentReport', {title: `Report for ${req.query.studentID}`, data: req.query});
    } else {
      res.redirect('/');
    }
  }
}