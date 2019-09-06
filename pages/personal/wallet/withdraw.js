// pages/personal/wallet/withdraw.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      balance: options.balance
    })
  },

  confirm() {

    wx.showModal({
      content: '您确认退还押金嘛',
      success(res) {
        if (res.confirm) {
          fetch({
            url: '/settlement/withdraw',
            method: 'POST',
            data: {
              balance: this.data.balance
            },
            isLoading: true
          }).then(res => {
            wx.showToast({
              title: '提交成功'
            });

            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })








  }
})