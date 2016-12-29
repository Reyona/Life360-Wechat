'use strict';

const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Trace = mongoose.model('Trace');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = (req, res) => {
  let trace = new Trace(req.body);
  trace.save((err, doc) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(doc)
    }
  });
};

exports.query = (req, res) => {
  let query = req.query
  console.log(query)
  Trace.find(query).exec((err, doc) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(doc)
    }
  })
}

exports.traceByID = (req, res, next, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trace is invalid'
    });
  }

  Trace
    .findById(id)
    .exec((err, trace) => {
      if (err) {
        return next(err);
      } else if (!trace) {
        return res.status(404).send({
          message: 'No trace with that identifier has been found'
        });
      }
      req._trace = trace;
      next();
    });
};

