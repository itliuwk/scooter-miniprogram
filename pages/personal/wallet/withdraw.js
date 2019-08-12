// pages/personal/wallet/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  confirm() {
    wx.showToast({
      title: '提交成功'
    })

    setTimeout(() => {
      wx.navigateBack({
        delta: 2
      })
    }, 1500)
  }
})