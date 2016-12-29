var userUtils = require('../../../utils/user.js')
var utils = require('../../../utils/utils.js')
var commonAnim = require('../../../utils/commonAnim.js')
var app = getApp()
Page({
    data : {
        divCompSize : {
            height : 0,
            width : 0
        },
      loading:false,
      page: 1,
      touchOrigin: undefined,
      touchStartTime: undefined,
      touchEndTime: undefined,
      lastPage: undefined
    },
    onPullDownRefresh: function(){
      wx.showToast({
          title: '刷新中',
          icon: 'loading',
          duration: 2000
      })
      this.setData({
        page:1
      })
      this.loadData(this.data.page)
    },
    onReady : function(){
        var divCompSize = this.data.divCompSize,
            that = this;
        wx.getSystemInfo({
          success: function(res) {
            divCompSize.height = (res.windowHeight-4) * 0.5;
            divCompSize.width = (res.windowWidth-4) * 0.5;
            that.setData({
                divCompSize : divCompSize
            })
          }
        })
        console.log("onReady:" + that.data.page)
        that.loadData(that.data.page)
    },
  touchStart (event) {
    this.data.touchOrigin = event.changedTouches[0]
    this.setData({
      touchStartTime: event.timeStamp
    })
  },
  touchEnd (event) {
    this.setData({
      touchEndTime: event.timeStamp
    })
    let touchEnd = event.changedTouches[0]
    let page = 0
    var touchScope = false
    if (Math.abs(this.data.touchOrigin.clientX - touchEnd.clientX) > Math.abs(this.data.touchOrigin.clientY - touchEnd.clientY)) {
      if (touchEnd.clientX - this.data.touchOrigin.clientX > 100) {
        touchScope = true
        page = this.data.page - 1
        if(page == 0){
          page = 1
          wx.showToast({
              title: '亲，已经是第一页了',
              icon: 'success',
              duration: 1000
          })
        } else {
          if(this.data.lastPage){
            page = page - 1
            this.data.lastPage = undefined
          } 
        }
      } else if (this.data.touchOrigin.clientX - touchEnd.clientX > 100) {
        touchScope = true
        if(this.data.lastPage){
          page = this.data.lastPage
          wx.showToast({
              title: '没有更多了',
              icon: 'success',
              duration: 1000
          })
        } else {
          page = this.data.page + 1
        }
      }
      if(touchScope) {
        this.setData({
          page: page
        })
        this.loadData(this.data.page)
      }
    }
  },
  tapEvent: function(el){
    let that = this;
    var touchTime = that.data.touchEndTime - that.data.touchStartTime;
    if (touchTime > 350) {
      //long tap
      if(userUtils.isAdmin(app.globalData)){
        var index = el.currentTarget.dataset.index
        var commentId = that.data.complainDatas[index].id
        var userId = that.data.complainDatas[index].nickName
        userUtils.adminOperate(userId,commentId,that,app.globalData,'tucao')
      }
    } else {
      //tap
      that.goToDetail(el, that)
    }
  },

   goToDetail: function(el, that){
    var index = el.currentTarget.dataset.index
    var uniqueId = that.data.complainDatas[index].id,
        bgcolor = that.data.complainDatas[index].bgcolor;
    wx.navigateTo({
      url: '../comment/comment?uniqueId=' + uniqueId + '&bgcolor=' + bgcolor
    })
  },

  loadData: function(page){
    console.log("loadData:" + page)
    var that = this;
    that.setData({loading:true})
    wx.request({
      url: 'http://liaa2-w7/api/complaints',
      method: 'PUT',
      data: {
        page: page ,
        count: 4
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        setTimeout(() => {
          that.setData({loading:false})
        },500)
        if(res.data.length > 0){
          var datas = []
          for(var i = 0;i<res.data.length; i++){
            datas.push(that.constructData(res.data[i],i))
          }
          that.setData({
              complainDatas: datas
          })
        } else {
          that.setData({
            lastPage: page - 1
          })
          wx.showToast({
              title: '没有更多了',
              icon: 'success',
              duration: 1000
          })
        }
      }
    })
  },

  constructData: function(response, i){
      var rowId = response.rowId
      var id = response._id
      //var uniqueId = response.nickName
      var title = response.title == "" ? response.content:response.title
      var nickName = response.nickName
      var displayName = response.isAnonymity ? "匿名用户" : response.nickName  
      var updateTime = utils.displayHour(response.updatedDate)
      var emoticion = "../icon/" + response.emoticion + ".png"
      var hot = response.comments.length
      var bgcolor = ""
      if(i == 0){
        bgcolor = "#A4D3EE"
      } else if(i==1){
        bgcolor = "#EEE685"
      } else if(i==2){
        bgcolor = "#EED2EE"
      } else {
        bgcolor = "#B4EEB4"
      }
      if(title.length > 40){
        title = title.substring(0,40) + "..."
      }
      return {rowId: i,id: id,title:title, nickName:nickName, updateTime: updateTime, emoticion: emoticion, hot:hot, bgcolor: bgcolor, displayName: displayName}
  },

   addNewComplaint: function(){
      // commonAnim.showAddBtnAnim(this)
      // setTimeout(function() {

      // }.bind(this), 1000)
      wx.request({
        url: 'http://liaa2-w7/api/wechart/user/'+ userUtils.getUserUniqueId(app.globalData),
        method: 'GET',
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            var flag = res.data[0].enable
            if(flag){
              wx.navigateTo({
                url: '../publish/publish'
              })
            } else {
              wx.showModal({
                content: '亲，你已经被管理员禁言了',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              })
            }
        },
        fail: function(e){
            wx.showToast({
                title: '系统异常',
                icon: 'loading',
                duration: 1000
            })
        }
    })
  },

  onShow: function(){
    if(app.globalData.isNavigateBack){
      app.globalData.isNavigateBack = false
      this.setData({
          page:1
        })
        this.loadData(this.data.page)
    }
  }
})