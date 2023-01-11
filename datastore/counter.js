const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => { // num = 1
  return sprintf('%05d', num); // 00001
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData)); //000025
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count); // 00000 string
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callBack) => { // Middleware?
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
  // if (err) {
  //   console.log('uhhhh this doesnt work');
  //   return null;
  // } else {
  //   return data;
  // }

  readCounter((err, data) => {
    if (err) {
      console.log('idk');
      return;
    } else {
      writeCounter(data + 1, callBack);
    }

  });

};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
