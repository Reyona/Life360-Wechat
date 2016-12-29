var userUtils = require('/utils/user.js')
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;
    userUtils.requestUserInfo(that.globalData,function (result) {
      that.globalData.userInfo=result;
      userUtils.requestUserRole(that.globalData,function (result) {
        that.globalData.userRole = result;
        that.globalData.isAdmin=userUtils.checkAuth(that.globalData);
        console.log("that.globalData.isAdmin::"+that.globalData.isAdmin);
      });
    })
  },
/*  requestUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  requestUserRole:function(cb){
    var that = this;
    if(this.globalData.userInfo.nickName){
      wx.request({
        url: 'http://liaa2-w7/api/weChart/user/'+this.globalData.userInfo.nickName,
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.globalData.userRole = (res.data)[0].roles;
          typeof cb == "function" && cb((res.data)[0].roles)
        },
        fail: function(e){
        }
      })
    }
  },
  getUserInfo:function(){
    return this.globalData.userInfo;
  },
  getUserRole:function(){
    return this.globalData.userRole;
  },
  checkAuth:function(){
    if(!this.globalData.isAdmin){
      this.globalData.isAdmin = this.globalData.userRole && this.globalData.userRole.indexOf('admin')>-1
    }
    return this.globalData.isAdmin;
  },*/
  globalData:{
    userInfo:null,
    userRole:null,
    isAdmin:false,
    isNavigateBack:false
  }
  
})