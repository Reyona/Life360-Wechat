/**
 * Created by liaa2 on 12/22/2016.
 */
var schedule = require('node-schedule');
var request = require('request');
const path = require('path');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
// var j = schedule.scheduleJob('*/10 * * * * *', function () {
var j = schedule.scheduleJob('* * 12 * * *', function () {
  console.log('The answer to life, the universe, and everything!');
  request('https://api.thinkpage.cn/v3/weather/daily.json?key=1dyops6xurggvn2e&location=zhuhai&language=zh-Hans&unit=c&start=0&days=1', function (error, response, data) {
    if (!error && response.statusCode == 200) {
      data = JSON.parse(data);
      var result = data.results[0].daily[0];
      console.log(result);
      var article = {
        effectiveEndDate:new Date(),
        createdDate:new Date(),
        title: 'Weather Zhu Hai',
        type: 'weather',
        author:'天气小助手',
        content: result.text_day + " 转 " + result.text_night + " 最高温度:" + result.high + " 最低温度:" + result.low+ result.wind_direction
      };
      Article.findOneAndUpdate({ "type": 'weather' }, article, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('update weather')
        }
      });

    }
  })
});

