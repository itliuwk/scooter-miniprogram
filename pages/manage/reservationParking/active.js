// pages/manage/appointment/active.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTip: false
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

  update() {


    // 在C页面内 navigateBack，将返回A页面
    wx.navigateBack({
      delta: 1
    })




  },


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