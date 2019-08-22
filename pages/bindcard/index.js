const app = getApp()
Page({
    data: {
        pageLoaded: true,
        bank:'',
        index:'',
        card:'',
        bankId:'',
        bankname:'',
        username:''

    },
    onLoad(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        that.setData({
            mobile:wx.getStorageSync('mobile')
        })
        wx.request({
            url: app.data.api + 'withdraw/allBank', //仅为示例，并非真实的接口地址
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
                        bank: res.data.data,
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
    bindPickerChange: function (e) {
        this.setData({
          index: e.detail.value
        });
    },    
    bankname: function (e) {
        this.setData({
          bankname: e.detail.value
        });
    },    
    card: function (e) {
        this.setData({
          card: e.detail.value
        });
    },    
    username: function (e) {
        this.setData({
          username: e.detail.value
        });
    },    
    code: function (e) {
        this.setData({
          code: e.detail.value
        });
    },    
    sendmsg: function (e) {
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
         wx.request({
            url: app.data.api + 'withdraw/sendSms', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '短信发送成功，请注意查收！',
                        icon: 'none',
                        duration: 2000
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
    addcard:function(e){
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var code = that.data.code;
        var index = that.data.index;
        if(index !== ''){
            var bankId = that.data.bank[that.data.index].id;
        }
        var bankname = that.data.bankname;
        var card = that.data.card;
        var username = that.data.username;
        var reg = /\d{15}|\d{19}/;
        if(index == ''){
            wx.showToast({
              title: '请先选择开户银行',
              icon:"none",
              duration:2000
            });
            return false;
        }else if(card == ''){
            wx.showToast({
              title: '卡号不能为空',
              icon:"none",
              duration:2000
            });
            return false;
        }else if (!reg.test(card)){
            wx.showToast({
              title: '请输入正确的卡号',
              icon:"none",
              duration:2000
            });
            return false;
        }else  if(username == ''){
            wx.showToast({
              title: '姓名不能为空',
              icon:"none",
              duration:2000
            });
            return false;
        }else  if(bankname == ''){
            wx.showToast({
              title: '开户银行网点不能为空',
              icon:"none",
              duration:2000
            });
            return false;
        }else{
            wx.request({
                url: app.data.api + 'withdraw/addBank', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token: token,
                    code:code,
                    bankId:bankId,
                    bank_branches_name:bankname,
                    bank_card:card,
                    user_name:username
                },
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: res.data.datas,
                            icon: 'none',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                        }, 2000) 
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }
    }
});
