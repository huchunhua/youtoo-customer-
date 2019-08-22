const app = getApp()
Page({
    data: {
        pageLoaded: true,
        delBtnWidth: 185, //删除按钮宽度单位（rpx） 
        list: []
    },
    bindcard() {
      wx.navigateTo({
        url: '../bindcard/index',
      })
    },    
    withdrawcash(e) {
      var cardid = e.currentTarget.dataset.id;
      var bankname = e.currentTarget.dataset.bankname;
      var card = e.currentTarget.dataset.card;
      var logo = e.currentTarget.dataset.logo;
        wx.redirectTo({
            url: '../withdrawcash/index?bankname=' + bankname + "&card=" + card + "&logo=" + logo +"&cardid=" + cardid,
        })
    },
    onLoad(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'withdraw/bankLists', //仅为示例，并非真实的接口地址
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
                        list: res.data.data,
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

    this.initEleWidth();

    },
    bindPickerChange: function (e) {
        this.setData({
          index: e.detail.value
        });
    },
     // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    var that = this;
    if (e.touches.length == 1) {
      //手指移动时水平方向位置 
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值 
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      // var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
        // txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
        // txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度 
          // txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
 
    }
  },
  // 滑动中事件
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = "";
      txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].shows = txtStyle;
      console.log("1", list[index].shows);
      //更新列表的状态 
      this.setData({
        list: list
      });
    } else {
      console.log("2");
    }
  },
 //获取元素自适应后的实际宽度 
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); 
      // console.log(scale); 
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error 
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件 
  delItem: function (e) {
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var id = e.currentTarget.dataset.id;
    // 打印出当前选中的index
    console.log(e.currentTarget.dataset.index);
    // 获取到列表数据
    var list = that.data.list;
    wx.request({
      url: app.data.api + 'withdraw/delBank', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        id:id
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        // wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.datas,
            icon: 'none',
            duration: 2000
          });
          // 删除
          list.splice(e.currentTarget.dataset.index, 1);
          // 重新渲染
          that.setData({
            list: list
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
});
