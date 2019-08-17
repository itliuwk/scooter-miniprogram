// pages/manage/appointment/active.js

import address from '../../../utils/address.js'
import {
  formatYYYY,
  formatHHMM
} from '../../../utils/date.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTip: false,
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.result) {
      this.setData({
        result: JSON.parse(options.result)
      }, () => {
        this.filterResult(JSON.parse(options.result))
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onUnload: function() {
    wx.reLaunch({
      url: "/pages/manage/trip/use"
    })
  },

  filterResult(result) {
    let that = this;
    let newResult = {
      date: formatYYYY(result.startTime) + ' ' + formatHHMM(result.startTime) + '-' + formatHHMM(result.endTime),
      address: result.address,
      estimatedCost: result.estimatedCost,
    }

    console.log(newResult)

    that.setData({
      result: newResult
    })


  },


  /**
   * 
   */
  intoMap() {
    wx.openLocation({ //所以这里会显示你当前的位置
      latitude: this.data.result.latitude,
      longitude: this.data.result.longitude,
      name: this.data.result.recommend,
      address: this.data.result.address,
      scale: 15
    })
  },


  /**
   *  问号提示
   */
  tip() {
    this.setData({
      isTip: true
    })
  },

  closeTip() {
    this.setData({
      isTip: false
    })
  },
  stopTip() {
    this.setData({
      isTip: true
    })
  }
})