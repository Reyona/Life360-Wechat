var userUtils = require('../../../utils/user.js')
var app = getApp()
var messageList=[]
var page=1
var count=5
var autoHideContentLength=50
var typeIcon = {
    "notice":"/resources/icon_notice11.png",
    "weather":"/resources/icon_weather11.png",
    "news":"/resources/icon_news11.png"
}
var type = {
    "notice":"notice",
    "weather":"weather",
    "news":"news"
}
var convertTime = function (date) {
    var before_date = new Date(date);
    var diff_time=new Date()-before_date;
    if(diff_time/(1000)<60){//less then 60secs
        return Math.floor(diff_time/(1000))+'秒前';
    }
    if(diff_time/(60*1000)<60){//less then 60mins
        return Math.floor(diff_time/(60*1000))+'分钟前';
    }
    if(diff_time/(60*60*1000)<24){//less then 24hours
        return Math.floor(diff_time/(60*60*1000))+'小时前';
    }
    if(diff_time/(24*60*60*1000)<2){//less then 24hours
        return Math.floor(diff_time/(24*60*60*1000))+'天前';
    }
    return formatDate(before_date);
}
var formatDate = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}
var isExpired = function(dateString){
    var today=formatDate(new Date());
    return dateString<today;
}
var initData = function(list){
    for(var index in list){
        if(list[index].content.length<=autoHideContentLength){
            list[index].show=true;
        }
        else {
            list[index].show=list[index].show?list[index].show:false;
            list[index].needColl=true;
        }
        list[index].index=index;
        list[index].effectiveEndDate=formatDate(new Date(list[index].effectiveEndDate));
        list[index].isExpired=list[index].type==type["news"]?true:isExpired(list[index].effectiveEndDate);
/*        if(list[index].type==type["news"]){
            list[index].isExpired=true
        }
        else {
            list[index].isExpired=isExpired(list[index].effectiveEndDate);
        }*/
        list[index].isWeather=list[index].type == type["weather"];
    }
    return list;
}
var requestData=function (page,count,callback1,callback2) {
    wx.request({
        url: 'http://liaa2-w7.corp.oocl.com/api/notices', //仅为示例，并非真实的接口地址
        method : 'PUT',
        data: {
            page:page,
            count:count
        },
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
var deleteData=function(obj,callback){
    console.log("delete::"+JSON.stringify(obj));
    wx.request({
        url: 'http://liaa2-w7.corp.oocl.com/api/notices/'+obj._id, //仅为示例，并非真实的接口地址
        method : 'DELETE',
        data: {},
        header: {
            'content-type': 'application/json'
        },
        success: function(res){
            callback(res)
        },
        fail: function(e){
        }
    })
}
Page({
    data: {
        messageList: messageList,
        isAdmin:false,
        typeIcon:typeIcon,
        touchStartTime: undefined,
        touchEndTime: undefined
    },
    onLoad: function () {
        if(userUtils.isAdmin){
            this.setData({
                isAdmin:userUtils.isAdmin(app.globalData)
            })
        }
    },
    onShow: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var that = this;
        requestData(1,count,function(res){
                wx.hideToast();
                console.log(res.data);
                page=1;
                messageList=res.data;
                for(var index in messageList){
                    messageList[index].createdDate=convertTime((res.data)[index].createdDate);
                }
                that.setData({
                    messageList: initData(messageList)
                })
            },
            function(e){
                wx.hideToast();
                wx.showToast({
                    title: '加载失败',
                    icon: 'fail',
                    duration: 1000
                })
            });

    },
    onReady: function() {//test picture********************************************
        this.setData({
            url:url
        })
    },
    doSearch: function(event){
        console.log(event.detail.value);
        var that = this;
        if(event.detail.value.length>3){
            wx.request({
                url: 'http://liaa2-w7/api/notices/search/'+event.detail.value, //仅为示例，并非真实的接口地址
                data: {},
                header: {
                    'content-type': 'application/json'
                },
                success: function(res){
                    console.log(res.data);
                    page=1;
                    messageList=res.data;
                    for(var index in messageList){
                        messageList[index].createdDate=convertTime((res.data)[index].createdDate);
                    }
                    that.setData({
                        messageList: initData(messageList)
                    })
                },
                fail: function(e){
                    console.log(e);
                }
            })
        }
        if(event.detail.value.length==0) {
            this.refresh();
        }
    },
    clearSearch : function(event){
        this.refresh();
    },
    onPullDownRefresh:function(){
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 10000
        })
        this.refresh();
    },
    lower: function (e) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.nextLoad()
    },
    refresh: function () {

        var that = this;
        requestData(1,count,function(res){
            wx.hideToast();
            wx.showToast({
                title: '刷新完成',
                icon: 'success',
                duration: 500
            })
            wx.stopPullDownRefresh();
            console.log(res.data);
            page=1;
            messageList=res.data;
            for(var index in messageList){
                messageList[index].createdDate=convertTime((res.data)[index].createdDate);
            }
            that.setData({
                messageList: initData(messageList)
            })
        },
        function(e){});

    },

    nextLoad: function () {

        var that = this;
        requestData(page+1,count,function(res){

            console.log(res.data);
            if(res.data.length){
                wx.hideToast();
                wx.showToast({
                    title: '加载完成',
                    icon: 'success',
                    duration: 500
                })
                page++;
                var next_data=res.data;
                for(var index in next_data){
                    next_data[index].createdDate=convertTime((res.data)[index].createdDate);
                }
                messageList=that.data.messageList.concat(next_data);
                console.log("page:"+page);
                that.setData({
                    messageList: initData(messageList)
                })
            }
            else {
                wx.hideToast();
                wx.showToast({
                    title: '已经到底啦',
                    icon: 'success',
                    duration: 500
                })
            }

        },
        function(e){
            wx.hideToast();
            wx.showToast({
                title: '加载失败',
                icon: 'fail',
                duration: 1000
            })
        });
    },

    collapse:function(event){
        if(messageList[event.currentTarget.dataset.index].content.length>autoHideContentLength) {
            console.log(event);
            messageList[event.currentTarget.dataset.index].show=!messageList[event.currentTarget.dataset.index].show;
            this.setData({
                messageList:messageList
            })
        }
    },

    delete:function(event){
        var that=this;
        wx.showModal({
            title: '真的要删除吗？',
            success: function(res) {
                if (res.confirm) {
                    deleteData(messageList[event.currentTarget.dataset.index],function(){
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 500,
                            success:function(){
                                messageList.splice(event.currentTarget.dataset.index,1);
                                that.setData({
                                    messageList:messageList
                                })
                            }
                        })

                    })

                }
            }
        })

    },

    publish: function(event) {
        wx.navigateTo({
            url: '../publish/publish'
        })
    },

//test picture***************************
    previewPic:function(event){
        wx.previewImage({
            current: event.currentTarget.dataset.url, // 当前显示图片的http链接
            urls: [event.currentTarget.dataset.url] // 需要预览的图片http链接列表
        })
    },

     touchStart (event) {
        this.setData({  
            touchStartTime: event.timeStamp  
        })  
    },
    touchEnd (event) {
        this.setData({  
            touchEndTime: event.timeStamp  
        })  
    },
    tapEvent: function(el){
        console.log("aa")
        let that = this;     
        var touchTime = that.data.touchEndTime - that.data.touchStartTime;    
        if (touchTime > 350) {
            //long tap
            if(userUtils.isAdmin(app.globalData)){
                var commentId = messageList[el.currentTarget.dataset.index]._id
                console.log(commentId)
                userUtils.adminOperate(0,commentId,that,app.globalData,'')  
            }
        }
    },
})

var url="/resources/more.png";