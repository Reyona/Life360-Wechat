'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Trace = new Schema({
  userId: {
    type: String
  },
  time: {
    type: Date
  },
  group: {
    type: String
  },
  geo: {
    type: Object
  }
});

mongoose.model('Trace', Trace);
