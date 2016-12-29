/**
 * Created by HECH on 12/20/2016.
 */
//import ANONYMOUS_URL from '../../../utils/constant.js'
var utils = require('../../../utils/utils.js');
var socket = require('../../../utils/socket.js');
var autoHideContentLength = 235;
Page({
    data: {

        isCommontsPanelShow: false,
        isCommontsButttonShow: true,
        intervalObject: '',
        windowWidth: '',
        indexList: [],
        bulletScreen: true,
        complaint: {
            title: '',
            content: '',
            isAnonymity: true,
            emoticion: 'smile'
        },
        emoticionStatus: {
            smile: '#50c5b7',
            cry: '',
            soso: '',
            anger: ''
        },
        commentAnonymous: [],
        selectedEmoticion: 'smile',
        inputValue: '',
        uniqueId: '',
        nickName: '',
        avatarUrl: '',
        shortIndex: '',
        contentColor: '',
        tamuList: [{
            'top': '220px',
            'left': '10px',

            'fontSize': '18px',
            'zIndex': '999',
            'text': '亲~吐槽的同时记得保持风度哦~',
            'color': '#50c5b7'
        }],
        modalHidden: false,
        flag: 0,
        chatItemLength: 0,

        //example
        //item: {
        //    id: '',
        //    ANONYMOUS_URL: '/pages/complaint/comment/image/Anonymous.jpg',
        //    avataurl: 'http:img3.imgtn.bdimg.com/it/u=2707806495,3349715794&fm=23&gp=0.jpg',
        //    nickName: 'Charles',
        //    title: '好啊好大家',
        //    content: '这里说说sourcetype.默认是从相册获取和使用相机拍照,跟微信现在选择图片的界面一样,第一格是拍照,后面的是相册照片这里注意:返回的是图片在本地的路径.如果需要将图片上传到服务器,需要用到另一个API.示例代码这里说说sourcetype.默认是从相册获取和使用相机拍照,跟微信现在选择图片的界面一样,第一格是拍照,后面的是相册照片这里注意:返回的是图片在本地的路径.如果需要将图片上传到服务器,需要用到另一个API.示例代码',
        //    createdDate: '2016.12.20',
        //    isAnonymity: false,
        //    emoticion: '',
        //    picUrls: ['http://a.hiphotos.baidu.com/baike/w%3D268%3Bg%3D0/sign=54b8f234ecf81a4c2632ebcfef110764/a5c27d1ed21b0ef4435ed81edac451da81cb3e3f.jpg'],
        //    comments: [
        //        {
        //            nickName: "abcaslo5",
        //            avataurl: "http://b.hiphotos.baidu.com/image/h%3D200/sign=f58e0c7de9f81a4c3932ebc9e72b6029/b8389b504fc2d5627c886ee4e51190ef76c66c33.jpg",
        //            message: "温州老板黄鹤跑啦！！！！！！",
        //            createdDate: "20161203",
        //            emoticion: '',
        //            isAnonymity: false
        //        },
        //        {
        //            nickName: "abcaslo5",
        //            avataurl: "http://pic3.zhimg.com/1ae5f682bba916af97aaaddbf193a0f6_im.jpg",
        //            message: "姐姐真漂亮",
        //            createdDate: 1481866398,
        //            emoticion: '',
        //            isAnonymity: true
        //        }
        //    ]
        //},

        defaultMessage: [
            {
                name: {imageSrc: '../icon/soso.png', text: '啥都不想说，就只想鄙视你~', id: 0, img: 'soso'}
            },
            {
                name: {imageSrc: '../icon/smile.png', text: '我只是一个吃瓜群众，刷一波存在感~', id: 1, img: 'smile'}
            },
            {
                name: {imageSrc: '../icon/cry.png', text: '无力吐槽，已卒~', id: 2, img: 'cry'}
            },
            {
                name: {imageSrc: '../icon/anger.png', text: '这是什么鬼？！~', id: 3, img: 'anger'}
            },
            {
                name: {imageSrc: '../icon/smile.png', text: '寡人认为你说的灰常有道理，萌萌哒~', id: 4, img: 'smile'}
            },
            {
                name: {imageSrc: '../icon/smile.png', text: '我只想路过卖个萌，嘻嘻~', id: 5, img: 'smile'}
            },
            {
                name: {imageSrc: '../icon/cry.png', text: '本宝宝不开心了，童话里都是骗人的~', id: 6, img: 'cry'}
            }
        ]

    },
    imageError: function (e) {
        console.log('image3发生error事件，携带值为', e.detail.errMsg)
    },
    switchChange: function (e) {
        this.data.bulletScreen = e.detail.value;
        this.setData({bulletScreen: this.data.bulletScreen})
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    preview: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.item.picUrls,// 需要预览的图片http链接列表
            success: function (e) {
            }
        })
    },
    checkboxChange: function (e) {
        this.data.commentAnonymous = e.detail.value;
        console.log(this.data.commentAnonymous.length);
    },
    push: function (e, isNotAnonymity) {
        var isNotAnonymity = isNotAnonymity || false;
        console.log(this.selectedEmoticion);
        console.log(this.data.commentAnonymous);
        if (this.data.item.content.length > autoHideContentLength) {
            this.data.item.show = false
        }
        var that = this;
        var commentData = '';
        //    this.tamMuListAdd(this.data.inputValue);
        if (this.data.flag == 0) {
            commentData = {
                _id: this.data.item._id,
                comment: {
                    nickName: this.data.nickName,
                    avataurl: this.data.avatarUrl,
                    message: this.data.inputValue == '' ? '这个用户很懒，什么都没留下' : this.data.inputValue,
                    emoticion: this.selectedEmoticion == undefined ? 'smile' : this.selectedEmoticion,
                    isAnonymity: e.currentTarget.id == 'real' ? false : true
                }
            }
        }
        else {
            commentData = {
                _id: this.data.item._id,
                comment: {
                    nickName: this.data.nickName,
                    avataurl: this.data.avatarUrl,
                    message: this.data.defaultMessage[this.data.shortIndex].name.text,
                    emoticion: this.data.defaultMessage[this.data.shortIndex].name.img,
                    isAnonymity: !isNotAnonymity

                }
            }
        };
        wx.request({
            url: 'http://liaa2-w7/api/complaints/comment',
            data: commentData,
            method: 'POST',
            success: function (res) {

                that.setData({
                    inputValue: ''
                });


                console.log('send send send send send send send to server');
                console.log('comment success');
            },
            fail: function (e) {
                // fail
                wx.showModal({
                    showCancel: false,
                    content: '服务器迁移火星中，请稍等再戳...',
                    title: '错误'
                });
            },
        });
        //}


    },
    //try to get image list here and preview image
    wxAutoImageCal: function (e) {
        //获取图片的原始长宽
        var originalWidth = e.detail.width;
        var originalHeight = e.detail.height;
        this.windowWidth = 0, windowHeight = 0;
        var autoWidth = 0, autoHeight = 0;
        var results = {};
        wx.getSystemInfo({
            success: function (res) {
                this.windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
                //判断按照那种方式进行缩放
                console.log("windowWidth" + this.windowWidth);
                if (originalWidth > this.windowWidth) {//在图片width大于手机屏幕width时候
                    autoWidth = this.windowWidth;
                    console.log("autoWidth" + autoWidth);
                    autoHeight = (autoWidth * originalHeight) / originalWidth;
                    console.log("autoHeight" + autoHeight);
                    results.imageWidth = autoWidth;
                    results.imageheight = autoHeight;
                } else {//否则展示原来的数据
                    results.imageWidth = originalWidth;
                    results.imageheight = originalHeight;
                }
            }
        })
        return results;
    },
    cusImageLoad: function (e) {
        var that = this;
        //这里看你在wxml中绑定的数据格式 单独取出自己绑定即可
        that.setData(this.wxAutoImageCal(e));
    },
    addComment: function (comment) {
        var self = this;
        if (self.data.item && comment) {
            self.data.item.comments.push(comment);

            self.setData({
                item: self.data.item
            });
            self.setScrollviewToBottom();
        }
    },

    setScrollviewToBottom: function () {
        var self = this;
        setTimeout(function () {

            try {
                self.data.chatItemLength += 10000 * self.data.item.comments[self.data.item.comments.length - 1].message.length;
            } catch (e) {

            }
            self.setData({
                chatItemLength: self.data.chatItemLength,
            });
        }, 100);
    },
    collapse: function (event) {
        if (this.data.item.content.length > autoHideContentLength) {
            this.data.item.show = !this.data.item.show;
            this.setData({
                item: this.data.item
            })
        }
        console.log(this.data.item);
    },
    onLoad: function (option) {
        var self = this;
        this.data.contentColor = option.bgcolor;
        wx.closeSocket();
        wx.connectSocket({
            url: 'ws://liaa2-w7/socket.io/chatMessage/?EIO=3&transport=websocket'
        })
        wx.onSocketOpen(function (res) {
            console.log('WebSocket connected');
        })
        wx.onSocketError(function (res) {
            console.log('WebSocket connected fail！')
        })
        wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！')
            wx.connectSocket({
                url: 'ws://liaa2-w7/socket.io/chatMessage/?EIO=3&transport=websocket'
            })
        })
        wx.onSocketMessage(function (res) {
            try {
                var results = JSON.parse(res.data.substr(2, res.data.length))
                var comment = results[1].comment;
                if (self.data.item._id == results[1]._id) {
                    if (comment.message != '这个用户很懒，什么都没留下') {
                        self.tamMuListAdd(comment.message);
                    }
                    self.addComment(comment);

                }
            } catch (e) {
                //Ignore
                console.log('WebSocket error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                console.log(e);
            }
        })
        this.setData({
            uniqueId: option.uniqueId,
            contentColor: option.bgcolor
        });
        var that = this;
        wx.request({
            url: 'http://liaa2-w7/api/complaints/' + that.data.uniqueId,
            method: 'GET',
            success: function (res) {
                that.item = res.data;
                //    that.item.createdDate= utils.displayHour( that.item.createdDate);
                res.data.createdDate = utils.displayHour(that.item.createdDate);
                //res = that.constructEmoData(res);
                if (res.data.content.length < autoHideContentLength) {
                    res.data.show = true;
                } else {
                    res.data.show = false;
                    res.data.needColl = true;
                }
                that.setData({item: res.data})
                self.setScrollviewToBottom();
            },
            fail: function (e) {
                // fail
                wx.showModal({
                    showCancel: false,
                    content: '服务器迁移火星中，请稍等再戳...',
                    title: '错误'
                });
            },
        });
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo;
                that.setData({
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl
                })
            }
        });
    },

    addPX: function (pxContext, add) {
        var pxNum = +pxContext.replace('px', '');
        return pxNum + add + 'px';
    },
    getRandomColor: function () {
        var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
        var colorArray = colorElements.split(",");
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += colorArray[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    tamMuListAdd: function (test) {
        var windowHeight;
        wx.getSystemInfo({
            success: function (res) {
                windowHeight = res.windowHeight;
            }
        })
        var me = this;
        var origText = this.data.tamuList;
        origText.push({
            'top': 1 + Math.random() * windowHeight * 0.5 + 'px',
            'left': '0px',
            'fontSize': '18px',
            'zIndex': '999',
            'text': test,
            'color': me.getRandomColor()
        })
        this.setData({
            tamuList: origText
        });
    },
    onShow: function () {
        var windowWidth;
        wx.getSystemInfo({
            success: function (res) {
                windowWidth = res.windowWidth;
            }
        })
        var me = this;
        this.intervalObject = setInterval(function () {
            var origText = this.data.tamuList;
            for (var i = 0; i < origText.length; i++) {
                origText[i].left = me.addPX(origText[i].left, 20);
                var pxNum = origText[i].left.replace('px', '');
                if (pxNum >= windowWidth) {
                    this.data.indexList.push(i);
                }
            }
            //delete if the text overflow the screen width.
            for (var j = 0; j < this.data.indexList.length; j++) {
                origText.splice(j, 1);
            }
            this.data.indexList = [];
            this.setData({
                tamuList: origText
            });
        }.bind(me), 300);
    },
    addTanMu: function () {
    },
    onUnload: function () {
        clearInterval(this.intervalObject);
        console.log("hideen hideen hideen hideen");
        wx.closeSocket();
        wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！');
        })
    },
    onHide: function () {
        console.log("hideen hideen hideen hideen");
        clearInterval(this.intervalObject);
        wx.closeSocket();
        wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！');
        })
    },
    touch: function () {
        this.isCommontsPanelShow = false;
        this.isCommontsButttonShow = true;
        this.setData({
            modalHidden: false,
            flag: 0
        });
        this.setData({
            isCommontsPanelShow: this.isCommontsPanelShow,
            isCommontsButttonShow: this.isCommontsButttonShow
        });

    },
    commontsPanelShow: function () {

        this.isCommontsPanelShow = true;
        this.isCommontsButttonShow = false;
        this.setData({
            isCommontsPanelShow: this.isCommontsPanelShow,
            isCommontsButttonShow: this.isCommontsButttonShow
        });
    },
    changeEmotictionEvent: function (e) {
        var complaint = this.data.complaint;
        this.data.emoticionStatus.smile = '';
        var emoticionStatus = this.data.emoticionStatus;
        if (complaint.emoticion != '') {
            emoticionStatus[complaint.emoticion] = '';
        }
        complaint.emoticion = e.currentTarget.id;
        this.selectedEmoticion = complaint.emoticion;
        emoticionStatus[complaint.emoticion] = '#50c5b7';
        this.setData({
            complaint: complaint,
            emoticionStatus: emoticionStatus
        });
    },
    addTap: function (e) {
        if (this.data.flag == 0) {
            this.setData({
                modalHidden: true,
                flag: 1
            })
        } else {
            this.setData({
                modalHidden: false,
                flag: 0
            })
        }

    },

    sendTap: function (e) {
        this.data.shortIndex = e.target.id;
        console.log(e)
        console.log("send a message....")
        this.data.shortIndex = e.target.dataset.msgindex || e.currentTarget.dataset.msgindex;

        this.setData({
            flag: 1
        })

        this.push(null, true);
        if (this.data.flag == 0) {
            this.setData({
                modalHidden: true,
                flag: 1
            })
        } else {
            this.data.flag = 0;
            this.setData({
                modalHidden: false,
                flag: 0
            })
        }
    }
})
