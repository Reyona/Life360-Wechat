var userUtils = require('../../../utils/user.js')
var utils = require('../../../utils/utils.js')
var commonAnim = require('../../../utils/commonAnim.js')
var app = getApp()
Page({
  data: {
    page: 1,
    userInfo: {},
    complainDatas: [],
    animation: {}
  },
 onPullDownRefresh: function(){
   wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
   })
   this.setData({
     page:1
   })
   this.loadData(this.data.page, false)
 },
 onReachBottom: function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
   })
   this.loadData(++this.data.page, true)
 },
 onReady:function(){
   var that = this
    //  userUtils.getUserInfo(function(userInfo){
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    that.setData({
     page:1
   })
   that.loadData(that.data.page, false)
    
 },
 onLoad: function () {
    //console.log('onLoad')
   
  },
  addNewComplaint: function(){
      commonAnim.showAddBtnAnim(this)
      setTimeout(function() {
        wx.navigateTo({
          url: '../publish/publish'
        })
      }.bind(this), 1000)
  },
  goToDetail: function(el){
    console.log(el)
    var index = el.currentTarget.dataset.index
    var uniqueId = this.data.complainDatas[index].id
    console.log(uniqueId)
    wx.navigateTo({
      url: '../comment/comment?uniqueId=' + uniqueId
    })
  },

  loadData: function(page, isNext){
    console.log("loadData")
    var that = this;
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
        var datas = []
        for(var i = 0;i<res.data.length; i++){
          if(isNext){
            that.data.complainDatas.push(that.constructData(res.data[i],i))
          } else {
            datas.push(that.constructData(res.data[i],i))
          } 
        }
        if(isNext){
           datas =  that.data.complainDatas 
        }
        that.setData({
             complainDatas: datas
         })
      }
    })
  },

  constructData: function(response, i){
      var rowId = response.rowId
      var id = response._id
      var uniqueId = response.nickName
      var title = response.title == "" ? response.content:response.title 
      var nickName = response.isAnonymity ? "" : "来自" + response.nickName + "于"
      var updateTime = utils.displayHour(response.updatedDate)
      var emoticion = "../icon/" + response.emoticion + ".png"
      var hot = response.comments.length
      var bgcolor = ""
      if(i%2 == 0){
        bgcolor = "top-view-item-yellow"
      } else {
        bgcolor = "top-view-item-blue"
      }
      if(title.length > 60){
        title = title.substring(0,60) + "..."
      }
      return {rowId: rowId,id: id, uniqueId: uniqueId,title:title, nickName:nickName, updateTime: updateTime, emoticion: emoticion, hot:hot, bgcolor: bgcolor}
  },

  onShow: function(){
    if(app.globalData.isNavigateBack){
      app.globalData.isNavigateBack = false
      this.setData({
          page:1
        })
        this.loadData(this.data.page, false)
    }
    commonAnim.resetAnim(this) 
  }
})