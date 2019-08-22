
let QRCode = require("../../utils/qrCode.js").default;

 
//index.js
//获取应用实例
const app = getApp()
 
Page({
  data: {
    qrtext : '',
    storeName:''
  },
  //输入框内容改变时触发
  bindKeyInput: function(e){
    this.setData({
      qrtext: e.detail.value
    })
  },
  //单击生成二维码触发
  createQRcode: function(){
    console.log(this.data.qrtext);
    this.QR.clear(); 
    this.QR.makeCode(this.data.qrtext); 
  },
  onLoad: function () {
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    // 获取手机信息
    let  sysinfo = wx.getSystemInfoSync();
    let qrcode = new QRCode('qrcode', {
      text: '',
      //获取手机屏幕的宽和长  进行比例换算
      width: sysinfo.windowWidth * 360 / 750,
      height: sysinfo.windowWidth * 360 / 750,
      //二维码底色尽量为白色， 图案为深色
      colorDark: '#000000',
      colorLight: '#ffffff',  
      correctLevel: QRCode.correctLevel.H
    });
    //将一个局部变量共享
    this.QR = qrcode;
    //获取二维码信息，实时生成二维码
    wx.request({
            url: app.data.api + 'index/receiptCode', //仅为示例，并非真实的接口地址
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
                        qrtext: res.data.data.receiptCode,
                        storeName:res.data.data.storeName
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
    this.QR.makeCode('http://sichuan.95504.net/upay/#/payment/111'); 
  }
})