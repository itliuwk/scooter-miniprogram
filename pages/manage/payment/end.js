// pages/payment/end.js
import fetch from '../../../lib/fetch.js'
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
  }
})