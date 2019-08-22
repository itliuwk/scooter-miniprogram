// pages/personal/index.js
import fetch from '../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
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
  onShow:function(){
    this.fetchUserInfo()
  },

  fetchUserInfo() {
    fetch({
      url: '/profile',
      isLoading: true
    }).then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  },

  /**
   * 跳转对应页面
   */
  toUrl(e) {
    let url = e.currentTarget.dataset.url;
    console.log(url)

    if (url == '/pages/personal/wallet/index') {
      url += '?status=' + this.data.userInfo.status
    } else if (url == '/pages/personal/setUp/index') {
      url += '?mobile=' + this.data.userInfo.mobile
    }

    wx.navigateTo({
      url
    })
  }
})