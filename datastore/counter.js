const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
  // "%05d" % 24 => "00024"
  // "%05d" % 245 => "00245"
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
exports.getNextUniqueId = (callback) => {
  // fs.writefile to make a file for each todo
  // error first callback pattern
  // should give an id as a zero padded string
  // should give the next id based on the count in the filelu
  // should update the counter file with the next value

  // readCounter(writeCounter(counter, callback));
  // readCounter(cb) -> err -> cb(null, 0)
  readCounter((err, counter) => {
    writeCounter(counter += 1, (err, string) => {
      callback(err, string);
    });
  });

  // 1. first readconter with writecounter as a callback
  // function with callback increament count number
  //

  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
