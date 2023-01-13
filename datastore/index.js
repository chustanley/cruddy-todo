const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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


  // items[id] = text;
  // callback(null, { id, text });

  /*
 // use the id (data) and create a file in data dir with the id in the file name
 // in this file, have the text in it

  */

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  //[ '00001.txt', '00002.txt' ]

  fs.readdir(exports.dataDir, (err, data) => {

    if (err) {
      callback(err, []);
    } else {
      var todosArray = _.map(data, (text) => { //00001.txt

        var splitString = text.split('.');

        var resultObject = {
          'id': splitString[0],
          'text': splitString[0]
        };

        return resultObject;

      });
      console.log(todosArray);
      callback(null, todosArray);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, dataText) => {
    // console.log(dataText.toString());

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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null); //QUESTION
        }
      });
    }
  });


};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
