Page({
    data : {
         files: [],
         complaint : {
             title:'',
             content : '',
             isAnonymity : false,
             emoticion : 'smile'
         },
         emoticionStatus : {
             smile : '#ffffff',
             cry : '',
             soso : '',
             anger : '',
             sleepy: '',
             speechless: ''
         },
         isNotMaxPicture : true,
         isShowPreviewImage : false,
         previewImage : ''
    },

    onReady : function(){
        wx.setNavigationBarTitle({
          title: '吐槽吧',
        });
    },

  chooseImage: function (e) {
        var that = this;
        var maxCount = 5 - this.data.files.length;
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'], 
            count : maxCount,
            success: function (res) {
                var picUrl = res.tempFilePaths;
                //get picture size
               that.valadatePictureSize(picUrl,picUrl.length,function(error,isPass){
                    if(error){
                          wx.showModal({
                            showCancel : false,
                            content : '图片已被盗去火星，请重新上传'
                          });
                    }
                    if(isPass){
                        var isNotMaxPicture = that.data.isNotMaxPicture;
                        if(picUrl.length + that.data.files.length >=5){
                            isNotMaxPicture = false;
                        }
                        that.setData({
                            files: that.data.files.concat(picUrl),
                            isNotMaxPicture : isNotMaxPicture
                        });
                    }else{
                        wx.showModal({
                            showCancel : false,
                            content : '图片大小超过1M，请重新选择'
                        });
                    }
               });

            }
        })
    },
    previewImage: function(e){
        var that = this;
        wx.getSystemInfo({
            success : function(res){
                that.setData({
                    isShowPreviewImage : true,
                    previewImage : e.currentTarget.id
                });
            }
        })
    },

    cancelPreviewImage : function(e){
        this.setData({
            isShowPreviewImage : false
        });
    },

    changeAnonymityEvent : function(e){
        var complaint = this.data.complaint;
        complaint.isAnonymity = e.detail.value;
        this.setData({
            complaint : complaint
        });
    },

    changeEmotictionEvent : function(e){
        var complaint = this.data.complaint;
        var emoticionStatus = this.data.emoticionStatus;
        if(complaint.emoticion != ''){
            emoticionStatus[complaint.emoticion] = '';
        }
        complaint.emoticion = e.currentTarget.id; 
        emoticionStatus[complaint.emoticion] = '#ffffff';
        this.setData({
            complaint : complaint,
            emoticionStatus : emoticionStatus
        });
    },

    // titleInputEvent : function(e){
    //     var complaint = this.data.complaint;
    //     complaint.title = e.detail.value;
    //     this.setData({
    //         complaint : complaint
    //     });
    // },

    contentInputEvent : function(e){
        var complaint = this.data.complaint;
        complaint.content = e.detail.value;
        this.setData({
            complaint : complaint
        });
    },

    publishComplaint : function(e){
        var complaint = this.data.complaint;
        var app = getApp();
        var userInfo = app.globalData.userInfo;
        var picUrls = this.data.files;
        var realUrls = [];
        //check if title and content all is null
        if(this.data.complaint.title=='' && this.data.complaint.content==''){
            wx.showModal({
                showCancel : false,
                content : '还没有输入文字哦~'
            });
            return;
        }
        if(userInfo){
            complaint.nickName = userInfo.nickName;
            complaint.avatarUrl = userInfo.avatarUrl; 
        }
        this.uploadPicture(picUrls,realUrls,function(error){
            if(!error){
                 if(realUrls.length>0){
                    complaint['picUrls'] = realUrls;
                 }
                 wx.request({
                    url: 'http://liaa2-w7/api/complaints',
                    data: complaint,
                    method: 'POST',
                    // header : {"content-type":'multipart/form-data'},
                    success: function(res){
                        //success
                        app.globalData.isNavigateBack = true;
                        wx.navigateBack();
                    },
                    fail: function() {
                        // fail
                        wx.showModal({
                            showCancel : false,
                            content : '服务器迁移火星中，请稍候再戳...'
                        });
                    },
                }); 
            }else{
                wx.showModal({
                    showCancel : false,
                    content : '服务器迁移火星中，请稍候再戳...'
                });
            }
        },this.data.files.length);
       
    },

    anonymousComplaint: function(e){
        var complaint = this.data.complaint;
        complaint.isAnonymity = true;
        var app = getApp();
        var userInfo = app.globalData.userInfo;
        var picUrls = this.data.files;
        var realUrls = [];
        //check if title and content all is null
        if(this.data.complaint.title=='' && this.data.complaint.content==''){
            wx.showModal({
                showCancel : false,
                content : '还没有输入文字哦~'
            });
            return;
        }
        if(userInfo){
            complaint.nickName = userInfo.nickName;
            complaint.avatarUrl = userInfo.avatarUrl;
        }
        this.uploadPicture(picUrls,realUrls,function(error){
            if(!error){
                if(realUrls.length>0){
                    complaint['picUrls'] = realUrls;
                }
                wx.request({
                    url: 'http://liaa2-w7/api/complaints',
                    data: complaint,
                    method: 'POST',
                    // header : {"content-type":'multipart/form-data'},
                    success: function(res){
                        //success
                        app.globalData.isNavigateBack = true;
                        wx.navigateBack();
                    },
                    fail: function() {
                        // fail
                        wx.showModal({
                            showCancel : false,
                            content : '服务器迁移火星中，请稍候再戳...'
                        });
                    },
                });
            }else{
                wx.showModal({
                    showCancel : false,
                    content : '服务器迁移火星中，请稍候再戳...'
                });
            }
        },this.data.files.length);

    },

    uploadPicture : function(picUrls,realUrls,callback,count){
        var that = this;
        if(picUrls.length<=0){
            callback(null);
            return;
        }
        wx.uploadFile({
            url: 'http://liaa2-w7/api/complaints/picture', 
            filePath: picUrls[count-1],
            name: 'file',
            complete : function(data){
                // callback(data.data);
                if(data.statusCode == 200){
                    count--;
                    realUrls.push(JSON.parse(data.data).path);
                    if(count>0){
                        that.uploadPicture(picUrls,realUrls,callback,count);
                    }else{
                        callback(null);
                    }
                }else{
                    // fail
                    console.log(data.errMsg);
                    callback(data.errMsg);
                }
            }
        });
    },

    removePictureEvent : function(e){
        var url = e.currentTarget.id;
        if(url!=undefined && url!=null && url!=''){
            url = url.substring(0,url.length-4);
            var files = this.data.files;
            var isNotMaxPicture = this.data.isNotMaxPicture;
            files.splice(files.indexOf(url),1);
            if(files.length <= 5){
                isNotMaxPicture = true;
            }else{
                isNotMaxPicture = false;
            }
            this.setData({
                files : files,
                isNotMaxPicture : isNotMaxPicture
            });
        }
    },

    valadatePictureSize : function(picUrls,count,callback){
        var that = this,
            maxSize = 1024*1024; //1M
        if(picUrls!=null && picUrls!='' && picUrls!=undefined && picUrls.length>0){
            wx.getSavedFileInfo({
              filePath: picUrls[count-1],
              success: function(res){
                // success
                count--;
                if(res.size >maxSize){
                    callback(null,false);
                }else{
                    if(count>0){
                        that.valadatePictureSize(picUrls,count,callback);
                    }else{
                        callback(null,true);
                    }
                }
              },
              fail: function(error) {
                // fail
                callback(error);
              }
            })
        }
    }

})