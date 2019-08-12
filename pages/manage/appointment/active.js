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

  update() {
    wx.navigateTo({
      url: './index?update=true',
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
  stopTip(){
    this.setData({
      isTip: true
    })
  }
})