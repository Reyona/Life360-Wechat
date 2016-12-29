var userPoint = [];
var mapBounds = [];
var pointAlphaThresholdValueMin = 60;
var minAlpha = 0.5;
var maxAlpha = 1;
var refereshSec = 10;
var sendLocationSec = 10;

const userUtil = require('./../../utils/user.js')

Page({
  data: {
    userPoint: userPoint,
    mapBounds: mapBounds,
    conditionIndex: 0,
    conditionRange: ['1号班车', '2号班车', '3号班车', '4号班车'],
    shareLocation: true
  },
  onReady: function () {
    var me = this;
    me.buildRealTimeMap();
    me.sendLocation();

    setInterval(function () {
      if (me.data.shareLocation) {
        me.buildRealTimeMap();
      }
    }, refereshSec * 1000);
    setInterval(function () {
      if (me.data.shareLocation) {
        me.sendLocation();
      }
    }, sendLocationSec * 1000);
  },
  reloadPoint: function () {
    console.log(this.data.conditionIndex, this.data.shareLocation);
  },
  switchShareLocation: function () {
    var currentIfShareLocation = this.data.shareLocation;
    this.setData({
      shareLocation: !currentIfShareLocation
    });
  },
  sendLocation: function () {
    let self = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let trace = {
          geo: [res.latitude, res.longitude],
          time: new Date(),
          //userId:userUtil.getUserUniqueId(),
          userId: 'wxsm',
          group: self.data.conditionRange[self.data.conditionIndex]
        }
        // Send to Server
        // get user ID from common function
        console.log(trace);
        wx.request({
          url: 'http://guoka2-9-w7.corp.oocl.com/api/trace',
          data: trace,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  buildRealTimeMap: function () {
    var me = this;
    var now = new Date();
    me.getRealTimePoint(function (points) {
      var needRebuildBounds = userPoint.length == 0;
      userPoint = [];
      for (var i = 0; i < points.length; i++) {
        points[i].iconPath = '/pages/realTime/image/location.png';
        points[i].width = 15;
        points[i].height = 15;
        points[i].alpha = me.getPointAlpha(points[i], now);

        userPoint.push(points[i]);
        if (needRebuildBounds) {
          mapBounds.push(points[i]);
        }
      }
      me.setData({
        userPoint: userPoint
      });
      if (needRebuildBounds) {
        me.setData({
          mapBounds: mapBounds
        });
      }
    });
  },
  getPointAlpha: function (point, refDate) {
    var timeDiffMin = (refDate - point.createTime) / 1000 / 60;
    var refMin = timeDiffMin - pointAlphaThresholdValueMin;
    if (refMin < 0) {
      return minAlpha;
    } else {
      return maxAlpha - (maxAlpha - minAlpha) * refMin / 60;
    }

  },
  getRealTimePoint: function (callback) {
    //get real time point from server
    let self = this
    wx.request({
      url: `http://guoka2-9-w7.corp.oocl.com/api/trace/query?group=${self.data.conditionRange[self.data.conditionIndex]}`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list = [];
        for (var i = 0; i < res.data.length; i++) {
          list.push({
            latitude: res.data[i].geo[0],
            longitude: res.data[i].geo[1],
            createTime: res.data[i].time
          });

        }
        callback(list);
      }
    })


  }
});