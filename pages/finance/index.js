const app = getApp()
Page({
    data: {
        pageLoaded: true,
    },
    withdrawCash() {
        wx.navigateTo({
            url: '../withdrawcash/index',
        })
    },    
    details() {
        wx.navigateTo({
            url: '../predetail/index',
        })
    },    
    verification() {
        wx.navigateTo({
            url: '../verification/index',
        })
    },
    onShow(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'financial/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        datas: res.data.data
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
});
