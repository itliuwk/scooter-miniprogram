// pages/payment/deposit.js
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
  confirmPay() {

    wx.showToast({
      title: '支付成功',
    })

    setTimeout(() => {
      wx.navigateTo({
        url: './complete',
      })
    }, 1500)




  }
})