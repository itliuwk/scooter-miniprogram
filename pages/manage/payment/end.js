// pages/payment/end.js
import fetch from '../../../lib/fetch.js'
import {
  wxpay
} from '../../../utils/wxpay.js'
import {
  formatYYYY,
  formatHHMM
} from '../../../utils/date.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onUnload() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getPending()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  getPending() {
    //订单交易 / 未完成订单
    fetch({
      url: '/transaction/pending'
    }).then(res => {
      res.data.createdDate = formatYYYY(res.data.createdDate)
      res.data.time = parseInt((res.data.time / 1000) / 60)
      this.setData({
        detail: res.data
      })
    })
  },

  confirm() {
    fetch({
      url: '/transaction/pay',
      method: 'post'
    }).then(res => {
      console.log(res)
      if (res.data.state == "COMPLETED") {
        wx.showToast({
          title: '支付成功',
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 1500)
      }
    })
  }
})