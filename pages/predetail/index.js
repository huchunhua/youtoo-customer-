const app = getApp()
Page({
    data: {
        pageLoaded: true,
        bindcard:false,
        lists:[],
        startdate: '2018-01-01',//默认起始时间  
        enddate: '2020-01-01',//默认结束时间 
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false,
        page:1
    },
    bindcard() {
        wx.navigateTo({
            url: '../bindcard/index',
        })
    },
    onLoad() {
        var that = this;
        that.loading()
    },
    bindDateChange(e) {
        let that = this;
        console.log(e.detail.value)
        that.setData({
          startdate: e.detail.value,
        })
    },   
    bindDateChange2(e) {
        let that = this;
        that.setData({
          enddate: e.detail.value,
        })
    },
    lower(e) {
        console.log("a");
        var that = this;
        var page = that.data.page;
        var last_page = that.data.last_page;
        if(page < last_page){
            that.setData({
                page:page + 1
            });  
            that.loading()          
        }
    },
    screen(){
        var that = this;
        that.setData({
            page:1,
            lists:[]
        });
        that.loading()
    },
    loading(){
        var that = this;
        var page = that.data.page;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var lists = that.data.lists;
        var start_time = that.data.startdate;
        var end_time = that.data.enddate;
        wx.request({
            url: app.data.api + 'withdraw/lists', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                page:page,
                start_time:start_time,
                end_time:end_time
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        withdrawal:res.data.data.withdrawal,
                        lists: lists.concat(res.data.data.lists.data)
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
    }
});
