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
      url: "/pages/index/index"
    })
  },

  filterResult(result) {
    let that = this;
    let date = formatYYYY(result.start) + ' ' + formatHHMM(result.start) + '-' + formatHHMM(result.end)

    // 调用接口转换成具体位置
    address(result.latitude, result.longitude).then(res => {
      let newResult = {
        ...result,
        date,
        address: res.result.address_component.province + res.result.address_component.city + res.result.address_component.district,
        recommend: res.result.formatted_addresses.recommend
      }
      console.log(newResult)
      that.setData({
        result: newResult
      })
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