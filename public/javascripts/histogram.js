// drop extra unicode chars
const csv = JSON.parse(JSON.stringify(csvData).split('\ufeffstudentID').join('studentID'));

// get totals row from csv
const total = csv.filter(stu => stu.studentID === 'total')[0];

// validate grades file
var courseTotal = 0;
Object.keys(total).filter(key => key != 'studentID').forEach(function(comp){
  courseTotal += total[comp];
});
if (courseTotal !== 100) {
  alert('Invalid File: semester total is not equal to 100. Please upload a valid file.');
  window.location.replace('/upload');
  throw new Error('Invalid File: semester total is not equal to 100. Please upload a valid file.');
}

// compute grades and prepare data for histogram
const students = csv.filter(stu => stu.studentID !== 'total');
const histData = []; // array of final marks for all students
students.forEach(function(student){
  let studentTotal = 0;
  Object.keys(student).filter(key => key != 'studentID').forEach(function(component){
    studentTotal += student[component] * (total[component] / 100);
  });
  studentTotal = Math.round(studentTotal * 100) / 100;
  student['total'] = studentTotal;
  histData.push(studentTotal);
});
histData.sort((a,b)=> a-b < 0);

const errDisp = {
  '#a-plus': '#a-plus-err',
  '#a': '#a-err',
  '#a-minus': '#a-minus-err',
  '#b-plus': '#b-plus-err',
  '#b': '#b-err',
  '#b-minus': '#b-minus-err',
  '#c-plus': '#c-plus-err',
  '#c': '#c-err',
  '#c-minus': '#c-minus-err',
  '#d': '#d-err'
};

const letterGrades = ['F', 'D', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];

function getBinCounts() {
  let cutoffs = [100];
  Object.keys(errDisp).forEach((e) => {
    cutoffs.push(Number($(e).val()));
  });
  cutoffs.sort((a,b)=> a-b < 0);
  let data = [...histData];
  data.unshift(0); // can't have array empty for last iteration
  let binCounts = [0];
  let binLimit = cutoffs.pop();
  let nextData = data.pop();
  while (data.length > 0) {
    if (nextData < binLimit) {
      binCounts.push(binCounts.pop() + 1);
      nextData = data.pop();
    } else {
      binLimit = cutoffs.pop();
      binCounts.push(0);
    }
  }
  for (let i = 0; i < cutoffs.length; i++) {
    binCounts.push(0);
  }
  return binCounts;
}

function updateHistogram() {
  let binCounts = getBinCounts();
  let binMax = binCounts.reduce((max, num) => {return num > max? num : max});
  let binPercents = binCounts.map(num => Math.round((num / binMax) * 10000)/100);
  let graphBars = $('.graph-bar').toArray();
  for (let i = 0; i < binPercents.length; i++) {
    graphBars[i].style['height'] = `${binPercents[i]}%`;
  }
}
updateHistogram();

function showErr(inputId) {
  $(errDisp['#' + inputId]).css('color', 'black');
}

function onInputChange() {
  $('.cutoff-err').css('color', 'white')
  var inputEls = $('.cutoff-input').toArray();
  var allGood = true;
  for (let i = 0; i < inputEls.length; i++) {
    var limit = inputEls[i].value;
    var elId = inputEls[i].id;
    if (i === 0) {
      var limitAfter = inputEls[i+1].value;
      if (limitAfter >= limit) {
        showErr(elId);
        allGood = false;
      }
    } else if (i === inputEls.length-1) {
      var limitBefore = inputEls[i-1].value;
      if (limitBefore <= limit) {
        showErr(elId);
        allGood = false;
      }
    } else {
      var limitBefore = inputEls[i-1].value;
      var limitAfter = inputEls[i+1].value;
      if (limitAfter >= limit || limitBefore <= limit) {
        showErr(elId);
        allGood = false;
      }
    }
  }
  if (allGood) {
    updateHistogram();
  }
}

$('.cutoff-input').toArray().forEach(function(inputEl) {
  inputEl.addEventListener('change', onInputChange);
});

function getStudentGrade(grade) {
  let cutoffs = [];
  Object.keys(errDisp).forEach((e) => {
    cutoffs.push(Number($(e).val()));
  });
  cutoffs.sort((a,b)=> a-b < 0);
  let grades = [...letterGrades];
  c = cutoffs.pop();
  while(grades.length > 0) {
    if (grade < c) {
      return grades.shift();
    } else {
      c = cutoffs.pop();
      grades.shift();
    }
  }
  return letterGrades[letterGrades.length-1];
}

function goToReports() {
  students.forEach(function(stu) {
    stu.grade = getStudentGrade(stu.total);
  });
  $.ajax({
    url: '/report',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(students),
    dataType: 'json',
    complete: function(response) {
      if (response.status === 200) {
        window.location.href = '/report';
      } else if (response.status === 401) {
        window.location.replace('/');
      } else {
        console.log(response.status);
      }
    }
  });
}
$('#viewReports').on('click', goToReports);