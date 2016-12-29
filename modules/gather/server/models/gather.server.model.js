'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GatherPeopleSchema = new Schema({
  userId: {
    type: String,
    default: ''
  },
  name: {
    type: String
  },
  imgSrc: {
    type: String
  },
  datePeriod: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  date: {
    type: Date
  },
  phone: {
    type: String
  },
  leader: {
    type: Boolean,
    default: false
  },
  departure: {
    type: Boolean,
    default: false
  }
});

let GatherSchema = new Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: ''
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['GO_TO_WORK', 'AFTER_WORK']
  },
  gatherTime: {
    type: String
  },
  departureTime: {
    type: String
  },
  datePeriod: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  gatherLocation: {
    type: String
  },
  homeLocation: {
    type: String
  },
  targetLocation: {
    type: String
  },
  remark: {
    type: String
  },
  default: {
    type: Boolean
  },
  people: [GatherPeopleSchema]
});

mongoose.model('Gather', GatherSchema);
mongoose.model('Default', GatherSchema);
mongoose.model('GatherPeople', GatherPeopleSchema);
