'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var Comment = new Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  nickName: {
    type: String,
    default: '',
    trim: true
  },
  avatarUrl: {
    type: String,
    default: '',
    trim: true,
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  emoticion: {
    type: String,
    default: '',
    trim: true,
  },
  isAnonymity: {
    type: Boolean,
    default: false
  }
});


var ComplaintSchema = new Schema({
  rowId: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  nickName: {
    type: String,
    default: '',
    trim: true
  },
  avatarUrl: {
    type: String,
    default: '',
    trim: true,
  },
  emoticion: {
    type: String,
    default: '',
    trim: true,
  },
  picUrls: [{
    type: String,
    default: '',
    trim: true
  }],
  isAnonymity: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  comments: [
    Comment
  ]
});

mongoose.model('Complaint', ComplaintSchema);
