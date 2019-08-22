const app = getApp()
Page({
    data: {
        pageLoaded: true,
        bank:'',
        money:''
    },
    bindcard() {
        wx.navigateTo({
            url: '../bindcard/index',
        })
    },    
    selectcard() {
        wx.redirectTo({
            url: '../cardlists/index',
        })
    },
    onLoad(options) {
        var that = this;
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');      
        wx.request({
            url: app.data.api + 'withdraw/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        bank:res.data.data.bank,
                        balance:res.data.data.balance,
                        instructions:res.data.data.instructions
                    });
                    if(options.logo){
                        that.setData({
                            bank:{
                                id:options.cardid,
                                logo:options.logo,
                                bank_name:options.bankname,
                                bank_card:options.card
                            }
                        })
                    }
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
    money:function(e){
        this.setData({
          money:e.detail.value
        });
    },
    all:function(){
        var that = this;
        var all = that.data.balance;
        that.setData({
            money:all
        })
    },
    withdrawal(e) {
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        let cardid = e.currentTarget.dataset.cardid;
        let money = this.data.money;
        let balance = this.data.balance;
        console.log('money:' + money + 'balance:' + balance)
        if(money == '' || money == 0){
            wx.showToast({
                title: '请先正确填写提现金额',
                icon: 'none',
                duration: 2000
            });             
        }else if(!cardid){
            wx.showToast({
                title: '请先选择提现银行卡',
                icon: 'none',
                duration: 2000
            });            
        }else{
            wx.request({
                url: app.data.api + 'withdraw/put', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token:token,
                    money:money,
                    bank_card_id:cardid
                },
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function (res) {
                    // wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: '../ok/index',
                        })
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
    },
    loading(){
 
    }
});
