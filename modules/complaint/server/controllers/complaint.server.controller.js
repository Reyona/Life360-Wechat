'use strict';

const path = require('path');
const mongoose = require('mongoose');
const Complaint = mongoose.model('Complaint');
const io = require('socket.io')
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  ioSender = require(path.resolve('./modules/chat/server/sockets/chat.server.socket.config'));

var socketIo = undefined;
exports.init = function (io, socket) {

  socketIo = io;
}

exports.create = (req, res) => {
  ``
  console.log(req.body);
  let complaint = new Complaint(req.body);
  complaint.createdBy = req.user;
  complaint.updatedBy = req.user;

  complaint.save((err) => {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(complaint);
    }
  });
};

exports.comment = (req, res) => {
  var id = req.body._id;
  var obejctId = mongoose.mongo.ObjectId(id);
  Complaint
    .findById(id)
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .exec((err, complaint) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var comment = req.body.comment;
        var updateComplaint = JSON.parse(JSON.stringify(complaint));
        updateComplaint.comments.push(comment);
        Complaint.findOneAndUpdate({"_id": obejctId}, updateComplaint, function (err, resultModel) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          if (resultModel == null) {
            return res.status(400).send({message: 'complaint does not exist'})
          } else {
            if (socketIo) {
              socketIo.emit('chatMessage', req.body);
            }
            res.json(resultModel);
          }
        });

        return complaint
      }
    });

};

exports.delete = (req, res) => {
  let complaint = req.complaint;
  var id = req.params.complaintId;
  Complaint
    .findById(id)
    .exec((err, complaint) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        complaint.remove((err) => {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(complaint);
          }
        });
      }
    });
};

exports.addPicture = function (req, res) {
  // Filtering to upload only images
  var multerConfig = config.uploads.complaint.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './modules/complaint/client/img/uploads/')
    },
    filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
  });
  multerConfig.storage = storage;
  var upload = multer(multerConfig).single('file');

  uploadImage()
    .then(function () {
      var host = 'http://' + req.headers.host;
      var path = config.uploads.complaint.image.dest.substr(1, config.uploads.complaint.image.dest.length);
      var filename = req.file.filename;
      console.log(host);
      var filePath = {
        path: host + path + filename
      };
      res.json(filePath);
    })
    .catch(function (err) {
      console.log(err);
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
};

exports.read = (req, res) => {
  // convert mongoose document to JSON
  let complaint = req.complaint ? req.complaint.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  complaint.isCurrentUserOwner = !!(req.user && complaint.createdBy && complaint.createdBy._id.toString() === req.user._id.toString());

  res.json(complaint);
};

exports.list = (req, res) => {
  Complaint
    .find()
    .sort('-created')
    .exec((err, complaints) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(complaints);
      }
    });
};

exports.listPaging = (req, res) => {
  var page = req.body.page - 1;
  if (page < 0) {
    page = 0;
  }
  var count = req.body.count;
  Complaint
    .find()
    .sort('-createdDate')
    .skip(page * count)
    .limit(count)
    .exec((err, complaints) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var i = 0; i < complaints.length; i++) {
          complaints[i].rowId = page * count + i;
        }
        res.json(complaints);
      }
    });
};

exports.complaintByID = (req, res) => {
  var id = req.params.complaintId;
  console.log(id);
  Complaint
    .findById(id)
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .exec((err, complaint) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(complaint);
      }
    });
};
