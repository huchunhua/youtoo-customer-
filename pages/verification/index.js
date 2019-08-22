const app = getApp()
Page({
    data: {
        pageLoaded: true,
        bindcard:false,
        name:'',
        type:'全部',
        typeid:0,
        lists:[{
            title:'自提订单',
            couponAcount:100,
            couponNum:2,
            couponUseTime:'2019-08-08'

        }],
        startdate: '2019-01-01',//默认起始时间  
        enddate: '2020-01-01',//默认结束时间 
        page:1,
        selectArray: [{
            "id": 0,
            "text": "全部"
        }, {
            "id": 1,
            "text": "优惠券"
        },{
            "id": 2,
            "text": "代金券"            
        },{
            "id": 3,
            "text": "自提"              
        }],
        showType:false
    },
    bindcard() {
        wx.navigateTo({
            url: '../bindcard/index',
        })
    },
    name:function(e){
        var that = this;
        that.setData({
            name:e.detail.value
        });
        that.loading()
    }, 
    openType(){
        var that = this;
        that.setData({
            showType:true
        })
    },
    changeType:function(e){
        var that = this;
        that.setData({
            type:e.target.dataset.text,
            typeid:e.target.dataset.id,
            showType:false
        });
        that.loading()
    },
    onLoad() {
        this.loading();
    },
    bindDateChange(e) {
        let that = this;
        that.setData({
          startdate: e.detail.value,
        });
        that.loading()  
    },   
    bindDateChange2(e) {
        let that = this;
        that.setData({
          enddate: e.detail.value,
        });
        that.loading()  
    },   
    lower(e) {
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
        wx.request({
            url: app.data.api + 'financial/verificationList', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                name:that.data.name,
                type:that.data.typeid,
                time_start: that.data.startdate,
                time_end:that.data.enddate,
                page:page
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        last_page: res.data.datas.last_page,
                        lists: lists.concat(res.data.data.verification)
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
