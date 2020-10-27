const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //pass in callback function to getNextUniqueId
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('Failed to get new id');
    } else {
      var dirPath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(dirPath, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { 'id': id, 'text': text});
        }
      });
    }
  });

};

// [
//   { id: '00015', text: '00015' },
//   { id: '00016', text: '00016' },
//   { id: '00017', text: '00017' },
//   { id: '00018', text: '00018' },
//   { id: '00019', text: '00019' },
//   { id: '00020', text: '00020' },
//   { id: '00021', text: '00021' },
//   { id: '00022', text: '00022' },
//   { id: '00023', text: '00023' }
// ]

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error('No directory'));
    } else {
      var data = files.map((file) => {
        var id = file.slice(0, 5);
        return { 'id': id, 'text': id};
      });
      callback(null, data);
    }
  });
};

// [
//   { id: '00015', text: '00015' },
//   { id: '00016', text: '00016' },
//   { id: '00017', text: '00017' },
//   { id: '00018', text: '00018' },
//   { id: '00019', text: '00019' },
//   { id: '00020', text: '00020' },
//   { id: '00021', text: '00021' },
//   { id: '00022', text: '00022' },
//   { id: '00023', text: '00023' }
// ]

exports.readOne = (id, callback) => {

  var idPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(idPath, (err, file) => {
    if (err) {
      callback(new Error('No file'));
    } else {
      var text = file.toString();
      callback(null, { id, text});
    }
  });

};

exports.update = (id, text, callback) => {

  var idPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(idPath, (err, file) => {
    if (err) {
      callback(new Error('No file'));
    } else {
      fs.writeFile(idPath, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { 'id': id, 'text': text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  var idPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(idPath, (err, file) => {
    if (err) {
      callback(new Error('No file'));
    } else {
      fs.unlink(idPath, (err) => {
        if (err) {
          throw err;
        } else {
          var text = file.toString();
          callback(null, { 'id': id, 'text': text});
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
