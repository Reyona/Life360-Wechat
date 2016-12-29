var adminString = 'admin'

var getUserUniqueId= function (data){
    console.log(data.userInfo.nickName)
    return data.userInfo.nickName
}

var requestUserInfo = function (data,cb) {
    var that = this;
    if(data.userInfo){
        typeof cb == "function" && cb(data.userInfo)
    }else{
        //调用登录接口
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        data.userInfo = res.userInfo;
                        typeof cb == "function" && cb(data.userInfo)
                    }
                })
            }
        });
    }
}

var requestUserRole = function (data,cb) {
    var that = this;
    if(getUserUniqueId(data)){
        wx.request({
            url: 'http://liaa2-w7/api/weChart/user/'+getUserUniqueId(data),
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                data.userRole = (res.data)[0].roles;
                typeof cb == "function" && cb((res.data)[0].roles)
            },
            fail: function(e){
            }
        })
    }
}

var getUserInfo = function(data){
    return data.userInfo;
}

var getUserRole = function (data) {
    return data.userRole;
}

var isAdmin = function (data) {
    return data.isAdmin;
}

var checkAuth = function (data) {
    if(!data.isAdmin){
        data.isAdmin = data.userRole && data.userRole.indexOf(adminString)>-1
    }
    return data.isAdmin;
}

var adminOperate = function (userId, id, that, data, types) {
    var itemLists = []
    var url = ""
    if(types == "tucao"){
        itemLists = ['删除', '禁言'] 
        url = 'http://liaa2-w7/api/complaints/'+id
    } else if(types == "jijie") {
        itemLists = ['删除']
        url = 'http://liaa2-w7/api/gathers/'+id
    } else {
        itemLists = ['删除']
        url = 'http://liaa2-w7.corp.oocl.com/api/notices/'+id
    }
    wx.showActionSheet({
      itemList: itemLists,
      success: function(res) {
        if (!res.cancel) {
          var index = res.tapIndex
          if(index == 0){
            deleteComment(that, url, types)
          } else {

             wx.request({
                url: 'http://liaa2-w7/api/wechart/user/'+ userId,
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    var flag = res.data[0].enable
                    if(flag){
                        disableUser(userId)
                    } else {
                         wx.showModal({
                            content: '该用户已经被禁言了，你还要TA怎样？',
                            showCancel: false,
                            success: function(res) {
                            if (res.confirm) {}
                            }
                        })
                    }
                }
            })  
          }
        }
      }
    })
}

var deleteComment = function (that, url, types) {
     wx.request({
        url: url,
        method: 'DELETE',
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            console.log(res)
             wx.showToast({
                title: '已删除',
                icon: 'success'
            })
             if(types == "tucao"){
                 that.loadData(that.data.page)
            } else if(types == "jijie") {
                that.requestData()
            } else {
                that.onShow()
            }
        },
        fail: function(e){
            wx.showToast({
                title: '系统异常',
                icon: 'loading'
            })
        }
    })
   
}

var disableUser = function (userId) {
     wx.request({
        url: 'http://liaa2-w7/api/users/status',
        method: 'POST',
        data: {
            _id: userId,
            status: false
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            console.log(res)
             wx.showToast({
                title: '已禁言',
                icon: 'success'
            })
        },
        fail: function(e){
            wx.showToast({
                title: '系统异常',
                icon: 'loading'
            })
        }
    })
}



module.exports={
    getUserUniqueId:getUserUniqueId,
    requestUserInfo:requestUserInfo,
    requestUserRole:requestUserRole,
    getUserInfo:getUserInfo,
    getUserRole:getUserRole,
    isAdmin:isAdmin,
    checkAuth:checkAuth,
    adminOperate: adminOperate
}