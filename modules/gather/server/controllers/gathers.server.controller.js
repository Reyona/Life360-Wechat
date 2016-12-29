'use strict';

const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Gather = mongoose.model('Gather');
const GatherPeople = mongoose.model('GatherPeople');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.list = (req, res) => {
  let limit = parseInt(req.query.limit) || 10;
  let offset = parseInt(req.query.offset) || 0;
  let date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  if (req.query.date) {
    date = new Date(req.query.date)
  }
  let c = {
    'datePeriod.from': {
      $lte: date
    },
    'datePeriod.to': {
      $gte: date
    }
  }
  if (req.query.userId) {
    c['people'] = {
      $elemMatch: {
        userId: req.query.userId,
        date: date
      }
    }
  }
  Gather.find(c)
    .limit(limit)
    .skip(offset)
    .lean()
    .exec((err, gathers) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        gathers.forEach(gather => {
          gather.people = gather.people.filter(v => {
            let match = false
            try {
              match = v.date.getTime() === date.getTime()
            } catch (e) {
              match = false
            }
            return match
          })
        })
        res.json(gathers);
      }
    });
};

exports.create = (req, res) => {
  let gather = new Gather(req.body);
  let from = gather.people[0].datePeriod.from
  let to = gather.people[0].datePeriod.to
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    let people = Object.assign({}, gather.people[0].toJSON())
    people.date = new Date(d)
    gather.people.push(people)
  }
  gather.people.splice(0, 1)
  if (req.user) {
    gather.createdBy = req.user.displayName
  }
  gather.save((err, doc) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(doc)
    }
  });
};

exports.update = (req, res) => {
  let gather = req._gather;
  gather.type = req.body.type;
  gather.timePeriod = req.body.timePeriod;
  gather.datePeriod = req.body.datePeriod;
  gather.gatherLocation = req.body.gatherLocation;
  gather.targetLocation = req.body.targetLocation;
  if (req.user) {
    gather.updatedBy = req.user.displayName
    gather.updatedDate = new Date()
  }
  gather.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.sendStatus(200);
    }
  });
};

exports.read = (req, res) => {
  let date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  if (req.query.date) {
    date = new Date(req.query.date)
  }
  let gather = req._gather ? req._gather.toJSON() : {};
  gather.people = gather.people.filter(v => {
    let match = false
    try {
      match = v.date.getTime() === date.getTime()
    } catch (e) {
      match = false
    }
    return match
  })
  res.json(gather);
};

exports.join = (req, res) => {
  if (req._gather) {
    let people = new GatherPeople(req.body);
    let from = people.datePeriod.from
    from.setUTCHours(0, 0, 0, 0)
    let to = people.datePeriod.to
    to.setUTCHours(0, 0, 0, 0)
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      let index = _.findIndex(req._gather.people, v => {
        let dateEqual = false
        if (v.date) {
          dateEqual = v.date.getTime() === d.getTime()
        }
        return v.userId === people.userId && dateEqual
      })
      if (index < 0) {
        let people2 = new GatherPeople(req.body)
        people2.date = new Date(d)
        req._gather.people.push(people2);
      }
    }
    console.log(people)

    req._gather.save((err, doc) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(doc)
      }
    });
  } else {
    res.sendStatus(422)
  }
};

exports.leave = (req, res) => {
  if (req._gather) {
    let people = new GatherPeople(req.body);
    let date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    if (req.query.date) {
      date = new Date(req.query.date)
    }
    let index = _.findIndex(req._gather.people, v => {
      let dateEqual = false
      if (v.date) {
        dateEqual = v.date.getTime() === date.getTime()
      }
      return v.userId === people.userId && dateEqual
    })
    if (index >= 0) {
      req._gather.people.splice(index, 1);
    }
    req._gather.save((err, doc) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(doc)
      }
    });
  } else {
    res.sendStatus(422)
  }
};


exports.lead = (req, res) => {
  if (req._gather) {
    let people = new GatherPeople(req.body);
    let date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    if (req.query.date) {
      date = new Date(req.query.date)
    }
    let index = _.findIndex(req._gather.people, v => {
      let dateEqual = false
      if (v.date) {
        dateEqual = v.date.getTime() === date.getTime()
      }
      return v.userId === people.userId && dateEqual
    })
    if (index >= 0) {
      req._gather.people[index].leader = true
    }
    req._gather.save((err, doc) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(doc)
      }
    });
  } else {
    res.sendStatus(422)
  }
};

exports.departure = (req, res) => {
  if (req._gather) {
    let people = new GatherPeople(req.body);
    let date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    if (req.query.date) {
      date = new Date(req.query.date)
    }
    let index = _.findIndex(req._gather.people, v => {
      let dateEqual = false
      if (v.date) {
        dateEqual = v.date.getTime() === date.getTime()
      }
      return v.userId === people.userId && dateEqual
    })
    console.log(index)
    if (index >= 0) {
      req._gather.people[index].departure = true
    }
    req._gather.save((err, doc) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(doc)
      }
    });
  } else {
    res.sendStatus(422)
  }
};

exports.delete = (req, res) => {
  var id = req.params.gatherId;
  Gather
    .findById(id)
    .exec((err, gather) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        gather.remove((err) => {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(gather);
          }
        });
      }
    });
};

exports.gatherByID = (req, res, next, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Gather is invalid'
    });
  }

  Gather
    .findById(id)
    .exec((err, gather) => {
      if (err) {
        return next(err);
      } else if (!gather) {
        return res.status(404).send({
          message: 'No gather with that identifier has been found'
        });
      }
      req._gather = gather;
      next();
    });
};

