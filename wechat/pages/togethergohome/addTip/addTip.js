var util = require('../../../utils/utils.js')
var userUtil = require('../../../utils/user.js')
var app=getApp()
var formatDate = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}
Page({
  data: {
    array: ['上班', '下班'],
    fromDate: util.formatDate(new Date()),
    toDate: util.formatDate(new Date()),
    goTime: '00:00',
    index:0,
    nullInput: "",
    defaultCurrentDate: util.formatDate(new Date()),
    afterSevenDate : util.formatDate(util.addDays(new Date(),7))
  },
  onReady: function(){
    console.log(this.data)
  },
  formSubmit: function(e) {
    var currentTime=new Date();
    var userInfo=userUtil.getUserInfo(app.globalData)
    if(e.detail.value.gatherLocation == "" || e.detail.value.targetLocation == "" || e.detail.value.phoneNum == "" || e.detail.value.captain == ""){
      this.setData({
        nullInput: "border:1px solid red"
      })
      return false
    } else {
      this.setData({
        nullInput: ""
      })
    }
    var data={
      'type':this.data.array[e.detail.value.type]=='上班'?'GO_TO_WORK':'AFTER_WORK',
      'departureTime': e.detail.value.goTime,
      'datePeriod': {
        'from':e.detail.value.fromDate,
        'to':e.detail.value.toDate
      },
      'gatherLocation':e.detail.value.gatherLocation,
      'targetLocation':e.detail.value.targetLocation,
      remark: e.detail.value.remark,
      'people':[{
        userId:userInfo.nickName,
        name:e.detail.value.captain,
        imgSrc:userInfo.avatarUrl,
        datePeriod:{
          'from':e.detail.value.fromDate,
          'to':e.detail.value.toDate
        },
        phone: e.detail.value.phoneNum,
        leader:true
      }],
      'createdDate':currentTime,
      'createdBy':userInfo.nickName,
      'updatedDate':currentTime,
      'updatedBy':userInfo.nickName,
      'default': true,
      'homeLocation':'',
      'gatherTime':''
    }
    console.log('拼出来的data为：',data);
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers',
      data: data,
      method: 'POST',
      success: function(res){
        console.log(res)
        wx.navigateBack();
      },
      fail: function() {
        // fail
      }
    })
  },
  bindGoTimeChange: function(e) {
    this.setData({
      goTime: e.detail.value
    })
  },
  selectTypeChange: function(e) {
    console.log(this.data.array,e.detail.value);
    this.setData({
      index:e.detail.value
    })
  },
  fromDateChange: function(e){
    this.setData({
      fromDate: e.detail.value
    })
  },
  toDateChange: function(e){
    this.setData({
      toDate: e.detail.value
    })
  },
  modalConfirm: function (e) {
    var that = this;
    var name = this.data.name;
    var phone = this.data.phone;
    var dateFrom = e.detail.value.fromDate;
    var dateTo = e.detail.value.toDate;
    var leader = this.data.leader;
    var userId = this.data.userInfo.nickName;
    var imgSrc = this.data.userInfo.avatarUrl;
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/join/' + that.data.id,
      data: {
        name: name,
        imgSrc: imgSrc,
        userId: userId,
        datePeriod: {
          'from': dateFrom,
          'to': dateTo
        },
        phone: phone,
        leader: leader
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // success
        that.loadData(that.data.page, 1);
      },
      fail: function () {
        // fail
        console.log('Request Fail')
      },
      complete: function (e) {
        // complete
      }
    })
  }

})