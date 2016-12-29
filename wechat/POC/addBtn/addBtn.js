Page({
    data: {
        modalHidden: false,
        flag: 0
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
        console.log(e)
        console.log("send a message....")
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
        wx.showToast({
            title: '成功发送',
            icon: 'success',
            duration: 1000
        })
    }
})