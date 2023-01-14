const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var promisefs = Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var todo = {'id': data, 'text': text};



    fs.writeFile(path.join(exports.dataDir, todo.id + '.txt'), todo.text, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, todo);
      }
    });
  });
};

exports.readAll = (callback) => {


  promisefs.readdirAsync(exports.dataDir)
    .then((fileNameArray) => {

      var resultArray = _.map(fileNameArray, (item) => {

        return promisefs.readFileAsync(path.join(exports.dataDir, item))
          .then((innerText) => {
            var splitString = item.split('.');

            var resultObject = {
              'id': splitString[0],
              'text': innerText.toString()
            };
            return resultObject;
          });
      });

      Promise.all(resultArray).then((data) => {
        callback(null, data);
      });
    }).catch((err) => {
      callback(err, data);
    });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, dataText) => {

    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var resultObject = {
        'id': id,
        'text': dataText.toString()
      };
      callback(null, resultObject);
    }
  });

};

exports.update = (id, text, callback) => {

  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });


};

exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null);
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
