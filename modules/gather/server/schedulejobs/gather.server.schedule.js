/**
 * Created by liaa2 on 12/22/2016.
 */
var schedule = require('node-schedule');
const path = require('path');
const mongoose = require('mongoose');
const Gather = mongoose.model('Gather');
const Default = mongoose.model('Default');
var j = schedule.scheduleJob('*/10 * * * * *', function () {
  console.log('gather schedule job');
  Default
    .find()
    .sort('-createdDate')
    .exec((err, defaults) => {
      if (err) {
        console.log(err);
      } else {
        var to = new Date();
        to.setDate(to.getDate() + 30);
        var gathers = [];
        defaults.forEach(function (defaultObject) {

          var gather = new Object();
          gather.datePeriod = {
            "from": new Date(),
            "to": to
          }
          gather.createdDate = new Date();
          gather.updatedDate = new Date();
          gather.createdBy='admin';
          gather.updatedBy='admin';
          gather.people =[];
          gather.gatherLocation = defaultObject.gatherLocation;
          gather.homeLocation = defaultObject.homeLocation;
          gather.targetLocation = defaultObject.targetLocation;
          gather.type = defaultObject.type;
          gather.default = defaultObject.default;
          gather.departureTime = defaultObject.departureTime;
          gather.gatherTime = defaultObject.gatherTime;
          delete gather._id;
          gathers.push(gather);
        })
        console.log(gathers);
        gathers.forEach(function (gather) {
          gather = new Gather(gather);
          gather.save((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("success");
            }
          });
        });
      }
    });
});

