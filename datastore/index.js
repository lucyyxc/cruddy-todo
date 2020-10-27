const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);


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
          callback(null, { id: id, text: text });
        }
      });
    }
  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('No directory');
    } else {
      var data = files.map((file) => {
        var id = file.slice(0, 5);
        var filePath = path.join(exports.dataDir, file);
        return fs.readFileAsync(filePath)
          .then((todo) => {
            return { id: id, text: todo.toString() };
          })
          .catch((err) => {
            console.log('Fail to read files');
          });
      });
      Promise.all(data).then(items => callback(null, items), err => callback(err));
      // Promise.all() method takes iterable of promises as an input, and returns a single Promise that resolve to an array of the results of the input promises.
    }
  });
};

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
      callback(err);
    } else {
      fs.unlink(idPath, (err) => {
        if (err) {
          callback(err);
        } else {
          console.log('deleted file');
          callback(null);
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
