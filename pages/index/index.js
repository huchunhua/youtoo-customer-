const app = getApp()
Page({
    data: {
        pageLoaded: true,
        showCodeModel:false,
        showTipsModel:false,
        checksucces:false,
        account:'',
        codeinfo:'',
        tips:'',
        code:''

    },
    computed: {

    },
    onShow(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var account = wx.getStorageSync('account');
        wx.request({
            url: app.data.api + 'index/index', //仅为示例，并非真实的接口地址
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
                        pageLoaded: true,
                        account:account,
                        datas: res.data.data,
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
    onScanCode() {
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                let resultObj, encryptData;
                if(res.scanType == 'WX_CODE' && !res.result){
                   return false; 
                }else{
                    if (res.result.indexOf("id=") > 0) {
                        encryptData = res.result.split("id=")[1];
                        resultObj = JSON.parse(app.utils.base64.decode(encryptData));
                    } else {
                        that.setData({
                            code:res.result
                        })
                    }                    
                }
            }
        });
    },
    changecode:function(e){
      this.setData({
        code:e.detail.value
      });
    }, 
    paymentcode() {
        wx.navigateTo({
            url: '../paymentcode/index',
        })
    },
    check(){
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var code = that.data.code;
        var count = that.data.datas.count;
        wx.request({
            url: app.data.api + 'index/couponInfo', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                coding:code
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        showCodeModel:true,
                        codeinfo: res.data.data,
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
    useCoupon(e){
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var id =  e.currentTarget.dataset.id;
        wx.request({
            url: app.data.api + 'index/couponCheck', //仅为示例，并非真实的接口地址
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
                        pageLoaded: true,
                        showCodeModel:false,
                        showTipsModel:true,
                        checksucces:true
                    });
                } else {
                    that.setData({
                        pageLoaded: true,
                        showCodeModel:false,
                        showTipsModel:true,
                        checksucces:false,
                        tips:res.data.msg
                    });
                }
            }
        });
    },
    hideCodeModal(){
        var that = this;
        that.setData({
            showCodeModel:false,
            code:''
        })
    },
    hideTipsModal(){
        var that = this;
        that.setData({
            showTipsModel:false,
            code:''
        })
    }
});
