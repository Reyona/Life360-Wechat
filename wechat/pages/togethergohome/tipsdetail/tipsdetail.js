var app = getApp()
var util = require('../../../utils/utils.js')
var userUtil = require('../../../utils/user.js')
Page({
  data: {
    gatherType: "",
    // time:"23:30",
    // from_site:"圆楼楼下",
    // to_site:"东岸",
    // create_time:"2016-12-20",
    dateFrom: "",
    dateTo: "",
    name: "",
    phone: "",
    id: "",
    date: "",
    nullInputName: "",
    nullInputPhone: "",
    imageName: "go.png",
    isDeparture: false,
    buttonType: "",
    buttonFnc: "join",
    backgroundColor: "",
    buttonText: "加入",
    ischecked: "",
    displayStatus: "none",
    leader: false,
    modalHidden: "true",
    haveLeader: false,
    userList: [],
    userInfo: {},
    list: {},
    defaultCurrentDate: util.formatDate(new Date()),
    afterSevenDate: util.formatDate(util.addDays(new Date(), 7))
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.setData({
      userInfo: userUtil.getUserInfo(app.globalData),
      id: options.id,
      backgroundColor: options.color,
      date: options.date,
      dateFrom:options.date
    })
    console.log(options.date)
  },
  departure: function () {
    var that = this;
    var userId = this.data.userInfo.nickName;
    if (this.data.isDeparture == false) {
      wx.showModal({
        content: '亲，你要出发了吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/departure/' + that.data.id + '?date=' + that.data.date,
              data: {
                departure: true,
                userId: userId
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                // success
              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })

            that.setData({
              isDeparture: !that.data.isDeparture,
              imageName: "leave.png"
            })
          }
        }
      })
    }
  },
  requestDetailData: function () {
    var that = this

    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/' + that.data.id + '?date=' + that.data.date,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        that.setData({
          list: res.data,
          userList: res.data.people,
          displayStatus: "none",
          haveLeader: false,
          gatherType: res.data.type == 'AFTER_WORK' ? '下班' : '上班',
          dateTo:res.data.datePeriod.to.substring(0,10)
        })
        var userId = that.data.userInfo.nickName
        var peopleList = that.data.list.people
        for (var index in peopleList) {
          if (that.data.list.people[index].userId.indexOf(userId) > -1) {
            that.setData({
              buttonType: "warn",
              buttonFnc: "exit",
              displayStatus: "true",
              buttonText: "退出",
              isDeparture: that.data.list.people[index].departure,
              imageName: that.data.list.people[index].departure == true ? 'leave.png' : 'go.png'
            })
          }
          if (that.data.list.people[index].leader == true) {
            that.setData({
              haveLeader: true
            })
          }
        }
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
    // String3
    this.requestDetailData()
  },

  onShow: function () {
    // 页面显示
    // String4
  },
  onHide: function () {
    // 页面隐藏
    // String5
  },
  onUnload: function () {
    // 页面关闭
    // String6
  },
  exit: function () {
    var that = this;
    wx.showModal({
      content: '是否确定退出？',
      success: function (res) {
        if (res.confirm) {
          that.changeButton();
          that.requestDetailData();
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  chooseCheckbox: function (e) {
    this.setData({
      leader: !this.data.leader
    })
  },
  changeButton: function () {
    var that = this;
    var userId = this.data.userInfo.nickName;
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/leave/' + that.data.id + '?date=' + that.data.date,
      data: {
        userId: userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function (e) {
        // complete
        console.log(e)
      }
    })
    this.setData({
      buttonType: "",
      buttonFnc: "join",
      buttonText: "加入"
    })
  },
  modalConfirm: function () {
    var that = this;
    var name = this.data.name;
    var phone = this.data.phone;
    var dateFrom = this.data.dateFrom;
    var dateTo = this.data.dateTo;
    var leader = this.data.leader;
    var userId = this.data.userInfo.nickName;
    var imgSrc = this.data.userInfo.avatarUrl;
    console.log(userId);
    if (name.trim() == '') {
      this.setData({
        nullInputName: "input-null"
      })
      return;
    }
    if (phone.trim() == '') {
      this.setData({
        nullInputPhone: "input-null"
      })
      return;
    }
    if (name.trim() != '' && phone.trim() != '') {
      wx.request({
        url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/join/' + that.data.id + '?date=' + that.data.date,
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
          that.requestDetailData();
        },
        fail: function () {
          // fail
          console.log('Request Fail')
        },
        complete: function (e) {
          // complete
        }
      });
      this.setData({
        modalHidden: true,
        dateFrom: this.data.date,
        dateTo: util.formatDateTime(new Date),
        buttonType: "warn",
        buttonFnc: "exit",
        buttonText: "退出",
        displayStatus: "true",
        name: "",
        phone: ""
      })
    }
  },
  join: function () {
    this.setData({
      modalHidden: false,
      name: "",
      phone: "",
      nullInputName: "",
      nullInputPhone: ""
    })
  },
  modalCancel: function () {
    this.setData({
      modalHidden: true
    })
  },
  bindDateChangeFrom: function (e) {
    this.setData({
      dateFrom: e.detail.value
    })
  },
  bindDateChangeTo: function (e) {
    this.setData({
      dateTo: e.detail.value
    })
  },
  bindInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindInputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindInput: function () {
    this.setData({
      nullInputName: "",
      nullInputPhone: ""
    })
  }
})