// pages/manage/repair.js
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  call() {
    wx.makePhoneCall({
      phoneNumber: '13502520162'
    })
  },


  previewImage: function(e) {
    console.log(1);
    var current = e.target.dataset.src; //这里获取到的是一张本地的图片
    wx.previewImage({
      current: current, //需要预览的图片链接列表
      urls: [current] //当前显示图片的链接
    })
  },

  copy(e) {
    var text = e.target.dataset.text; 
    wx.setClipboardData({
      data: text,
      success(res) {
    
      }
    })
  }

})