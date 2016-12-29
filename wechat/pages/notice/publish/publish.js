var userUtils = require('../../../utils/user.js')
var app = getApp()
var contentFocus=false;
var notice={};
var postData=function (data,callback1,callback2) {
    wx.request({
        url: 'http://liaa2-w7.corp.oocl.com/api/notices', //仅为示例，并非真实的接口地址
        method : 'POST',
        data: data,
        header: {
            'content-type': 'application/json'
        },
        success: function(res){
            callback1(res)
        },
        fail: function(e){
            callback2(e)
        }
    })
}
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
        items: [
            {name: '趣闻', value: 'news', checked: 'true'},
            {name: '公告', value: 'notice'}
        ],
        isAdmin:false,
        isNews:true,
        date: formatDate(new Date())
    },
    onLoad: function () {
        if(userUtils.isAdmin){
            this.setData({
                isAdmin:userUtils.isAdmin(app.globalData)
            })
        }
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            isNews: !(e.detail.value != 'news')
        })
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        })
    },
    getTitle:function(event){
        console.log(event.detail.value)
    },
    getContent:function(event){
        console.log(event.detail.value)
    },
    publish:function(event){
        var newNoticeData=event.detail.value;
        newNoticeData.author=userUtils.getUserUniqueId(app.globalData);
        console.log("newNoticeData:"+JSON.stringify(newNoticeData));
        if(this.doValidate(newNoticeData)){
            postData(newNoticeData,function(res){
                console.log(res.data);
                if(res.data._id){
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 500
                    })
                    wx.navigateBack();
                }
                else {
                    wx.showModal({
                        showCancel:false
                    })
                }
            },function(e){
                wx.showModal({
                    showCancel:false
                })
            });
        }
    },
    doValidate:function(notice){
        if(notice.title==null || notice.title==''){
            wx.showModal({
                content: '给你的头条取一个标题吧~亲',
                showCancel:false
            })
            return false;
        }
        return true;
    },
    switchToContent:function(){
        contentFocus=true;
        this.setData({
            contentFocus:contentFocus
        })
    }
})