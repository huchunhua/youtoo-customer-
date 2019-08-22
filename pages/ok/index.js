const app = getApp()
Page({
    data: {
    },
    onLoad(option) {
        setTimeout(function () {
            wx.navigateBack({
                delta: 2
            })
        }, 2000) 
    }
});
