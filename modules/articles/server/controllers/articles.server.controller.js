'use strict';

/**
 * Module dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const async = require('async');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = (req, res) => {
  let article = new Article(req.body);
  article.createdBy = req.user;
  article.updatedBy = req.user;

  article.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.read = (req, res) => {
  // convert mongoose document to JSON
  let article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.createdBy && article.createdBy._id.toString() === req.user._id.toString());

  res.json(article);
};


exports.update = (req, res) => {
  let article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;
  article.updatedDate = new Date();
  article.updatedBy = req.user;

  article.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};


exports.delete = (req, res) => {
  console.log(req.params.id);
  var id = req.params.id;
  Article
    .findById(id)
    .exec((err, article) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(article);
        article.remove((err) => {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(article);
          }
        });
      }
    });

};

exports.listPaging = (req, res) => {
  console.log(req.body);
  var page = req.body.page - 1;
  if (page < 0) {
    page = 0;
  }
  var count = req.body.count;
  getArticles(page, count, function (articles) {
    res.json(articles);
  });
};

function getArticles(page, count, callback) {
  async.waterfall([
    function (cb) {
      Article.find({"type": 'weather'}).sort('-createdDate').exec((err, articles) => {
        if (err) {
          console.log(err);
        } else {
          cb(null, articles[0]);
        }
      });
    },

    function (weatherArticles, cb) {
      var today = new Date();
      today.setHours(0);
      Article.find({$and: [{"type": "notice"}, {effectiveEndDate: {$gte: today}}]}).sort('-createdDate').exec((err, articles) => {
        if (err) {
          console.log(err);
        } else {
          cb(null, articles, weatherArticles)
        }
      });
    },

    function (notices, weather, c) {
      var today = new Date();
      today.setHours(0);
      Article
        .find({"type": {$ne: 'weather'}})
        .sort('-createdDate')
        .skip(page * count)
        .limit(count)
        .populate('createdBy', 'displayName')
        .populate('updatedBy', 'displayName')
        .exec((err, articles) => {
          var resultList = [];
          if (page == 0) {
            resultList.push(weather);
            notices.forEach(function (notice) {
              resultList.push(notice);
            });
          }
          articles.forEach(function (article) {
            var exits = false;
            resultList.forEach(function (result) {
              if (result._id.toString().trim() == article._id.toString().trim()) {
                exits = true;
              }
            });
            if (!exits) {
              resultList.push(article);
            }
          })
          callback(resultList);
        });
    }
  ])
}


exports.queryByKey = (req, res) => {
  console.log(req.params.key);
  var key = new RegExp(req.params.key, 'i');
  Article
    .find().or([{'title': {$regex: key}}, {'content': {$regex: key}}])
    .sort('-createdDate')
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .exec((err, articles) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    });
};


exports.list = (req, res) => {
  Article
    .find()
    .sort('-createdDate')
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .exec((err, articles) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    });
};

exports.articleByID = (req, res, next, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article
    .findById(id)
    .populate('createdBy', 'displayName')
    .populate('updatedBy', 'displayName')
    .exec((err, article) => {
      if (err) {
        return next(err);
      } else if (!article) {
        return res.status(404).send({
          message: 'No article with that identifier has been found'
        });
      }
      req.article = article;
      next();
    });
};
