//index.js
//获取应用实例
var app = getApp()
var util = require('../../../utils/utils.js')
var userUtils = require('../../../utils/user.js')


Page({

  data: {
    modalHidden: true,
    array: ['全部', '上班', '下班'],
    index: 0,
    list: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    displayStatus: "none",
    displayJoinbtn: "true",
    dateFrom: util.formatDate(new Date),
    dateTo: util.formatDate(new Date),
    name: "",
    phone: "",
    id: "",
    nullInputName: "",
    nullInputPhone: "",
    date: util.formatDateTime(new Date),
    queryDate: util.formatDate(new Date),
    time: '23:30',
    divCompSize: {
      height: 0,
      width: 0
    },
    userInfo: {},
    userList: {},
    page: 1,
    haveLeader: false,
    touchOrigin: undefined,
    touchStartTime: undefined,
    touchEndTime: undefined,
    currentDate: util.formatDate(new Date()),
    switchCheck: false,
    defaultCurrentDate: util.formatDate(new Date()),
    afterSevenDate: util.formatDate(util.addDays(new Date(), 7))
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 2000
    })
    this.setData({
      page: 1
    })
    this.loadData(this.data.page, 1)
  },
  requestData: function () {
    var that = this;
    var userId = "";
    if (this.data.switchCheck) {
      userId = app.globalData.userInfo.nickName
    } else {
      userId = ""
    }
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: this.data.page,
        count: 4,
        userId: userId,
        date: this.data.currentDate
      },
      method: "GET",
      success: function (res) {
        that.addCurrentBgColor(res)
        that.setData({
          list: res.data
        })
      }
    })
  },

  loadData: function (page, selectType) {
    var that = this;
    var userId = "";
    if (this.data.switchCheck) {
      userId = app.globalData.userInfo.nickName
    } else {
      userId = ""
    }
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers',
      header: {
        'content-type': 'application/json'
      },
      data: {
        offset: (page - 1) * 4,
        limit: 4,
        userId: userId,
        date: this.data.currentDate
      },
      method: "GET",
      success: function (res) {
        if (res.data.length > 0) {
          that.addCurrentBgColor(res)
          that.setData({
            list: res.data,
            displayStatus: "none",
            displayJoinbtn: "true"
          })
        } else {
          if (selectType == 1) {
            that.setData({
              list: [],
            })
          }
          if(page>1){
            that.setData({
              page: page-1
            })
          }else{
            that.setData({
              page: 1
            })
          }
          
          wx.showToast({
            title: '没有更多了',
            icon: 'success',
            duration: 1000
          })
        }

      }

    })
  },
  verifyData: function (id) {
    var that = this;
    var userId = this.data.userInfo.nickName;
    console.log(userId + id);
    wx.request({
      url: 'http://guoka2-9-w7.corp.oocl.com/api/gathers/' + id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          userList: res.data,
          displayStatus: "none",
          displayJoinbtn: "true",
          haveLeader: false
        })
        var peopleList = that.data.userList.people;
        console.log(peopleList);
        for (var index in peopleList) {
          if (that.data.userList.people[index].userId.indexOf(userId) > -1) {
            that.setData({
              displayStatus: "true",
              displayJoinbtn: "none"
            })
          }
          if (that.data.userList.people[index].leader == true) {
            that.setData({
              haveLeader: true
            })
          }
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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
      userInfo: userUtils.getUserInfo(app.globalData),
      id: options.id
    })
    console.log(options.id)
  },

  addCurrentBgColor: function (res) {
    for (var i = 0; i < res.data.length; i++) {
      if(res.data[i].type == "GO_TO_WORK") {
        res.data[i].bgcolor = "#A4D3EE"
      } else {
        res.data[i].bgcolor = "#B4EEB4"
      }
      // if (i == 0) {
      //   res.data[i].bgcolor = "#A4D3EE"
      // } else if (i == 1) {
      //   res.data[i].bgcolor = "#EEE685"
      // } else if (i == 2) {
      //   res.data[i].bgcolor = "#EED2EE"
      // } else {
      //   res.data[i].bgcolor = "#B4EEB4"
      // }
    }
    for (var j = 0; j < res.data.length; j++) {
      var pList = res.data[j].people
      if (pList.length > 0) {
        res.data[j].haveLeader = false;
        for (var k = 0; k < pList.length; k++) {
          if (pList[k].leader == true) {
            res.data[j].haveLeader = true;
          }
          if (pList[k].userId == app.globalData.userInfo.nickName) {
            res.data[j].displayJoinbtn = "none";
            res.data[j].displayStatus = "true";
            break;
          } else {
            res.data[j].displayJoinbtn = "true";
            res.data[j].displayStatus = "none";
          }
        }
      } else {
        res.data[j].haveLeader = false;
        res.data[j].displayJoinbtn = "true";
        res.data[j].displayStatus = "none"
      }
    }
    return res
  },
  chooseCheckbox: function (e) {
    this.setData({
      leader: !this.data.leader
    })
  },
  onReady: function () {
    // this.requestData()
    var divCompSize = this.data.divCompSize,
      that = this;
    wx.getSystemInfo({
      success: function (res) {
        divCompSize.height = (res.windowHeight * 0.9 - 4) * 0.5;
        divCompSize.width = (res.windowWidth - 4) * 0.5;
        that.setData({
          divCompSize: divCompSize
        })
      }
    })
    console.log("onReady:" + that.data.page)
    that.loadData(that.data.page, 1)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  touchStart(event) {
    this.data.touchOrigin = event.changedTouches[0]
    this.setData({
      touchStartTime: event.timeStamp
    })
  },
  touchEnd(event) {
    this.setData({
      touchEndTime: event.timeStamp
    })
    let touchEnd = event.changedTouches[0]
    let page = 0
    var notLeftMost = true
    var touchScope = false
    if (Math.abs(this.data.touchOrigin.clientX - touchEnd.clientX) > Math.abs(this.data.touchOrigin.clientY - touchEnd.clientY)) {
      if (touchEnd.clientX - this.data.touchOrigin.clientX > 100) {
        touchScope = true
        page = this.data.page - 1
        if (page == 0) {
          wx.showToast({
            title: '亲，已经是第一页了',
            icon: 'success',
            duration: 1000
          })
          notLeftMost = false
        } else if (page < 1) {
          this.setData({
            page: 1
          })
          notLeftMost = false
        }
      } else if (this.data.touchOrigin.clientX - touchEnd.clientX > 100) {
        touchScope = true
        page = this.data.page + 1
        console.log("111")
      }
      if (touchScope && notLeftMost) {
        
        this.setData({
          page: page
        })
        console.log(this.data.page)
        this.loadData(this.data.page, 2)
      }
    }
  },

  bindDateChange: function (e) {
    this.setData({
      currentDate: e.detail.value
    })
    this.loadData(1, 1)
  },
  bindDateChangeFrom: function (e) {
    this.setData({
      dateFrom: e.detail.value,
      //now: new Date
    })
  },
  bindDateChangeTo: function (e) {
    this.setData({
      dateTo: e.detail.value,
      //now: new Date
    })
  },
  modalTap: function (el, that) {
    var item = this.findElementById(el.currentTarget.id);
    this.setData({
      modalHidden: false,
      id: el.currentTarget.id,
      haveLeader: item.haveLeader
    })
    console.log(this.data.id)
  },

  modalCancel: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  onNewTipsTap: function (el) {
    this.goToAddTipsPage();
  },

  goToAddTipsPage: function (e) {
    wx.navigateTo({
      url: '../addTip/addTip'
    })
  },

  bindGoToDetailTap: function (el, that) {
    var id = el.currentTarget.id
    // var index = e.currentTarget.dataset.index
    // console.log(index)
    // var uniqueId = this.data.list[index]
    // console.log(uniqueId)
    var item = this.findElementById(id)
    wx.navigateTo({
      url: '../tipsdetail/tipsdetail?id=' + id + '&color=' + item.bgcolor + '&date=' + this.data.currentDate
    })
  },

  findElementById: function (id) {
    var list = this.data.list
    for (var i = 0; i < list.length; i++) {
      if (list[i]._id == id) {
        return list[i]
      }
    }
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  onShow: function () {
    console.log(this.data.page)
    this.loadData(this.data.page, 1)
  },

  tapEvent: function (el) {
    let that = this;
    var touchTime = that.data.touchEndTime - that.data.touchStartTime;
    if (touchTime > 350) {
      //long tap
      if (userUtils.isAdmin(app.globalData)) {
        var id = el.currentTarget.id
        userUtils.adminOperate(0, id, that, app.globalData, "jijie")
      }
    } else {
      //tap
      that.bindGoToDetailTap(el, that)
    }
  },
  switchChange: function (e) {
    console.log(e.detail.value)
    var that = this;
    this.setData({
      switchCheck: e.detail.value,
      page: 1

    })
    that.loadData(that.data.page, 1)
  },
  bindInput: function () {
    this.setData({
      nullInputName: "",
      nullInputPhone: ""
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
    if (name.trim() == '') {
      this.setData({
        nullInputName: "input-null"
      })
      return;
    }
    else if (phone.trim() == '') {
      this.setData({
        nullInputPhone: "input-null"
      })
      return;
    }
    if (name.trim() != '' && phone.trim() != '') {
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
      });
      that.setData({
        modalHidden: true,
        dateFrom: util.formatDate(new Date),
        dateTo: util.formatDate(new Date),
        displayStatus: "true",
        displayJoinbtn: "none",
        name: "",
        phone: "",
        nullInputName: "",
        nullInputPhone: ""
      })

    }
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
  }


})