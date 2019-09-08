// pages/personal/wallet/recharge.js
import fetch from '../../../lib/fetch.js'
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
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchUserInfo()
  },
  fetchUserInfo() {
    fetch({
      url: '/profile',
      isLoading: true
    }).then(res => {
      if (res.data.creditStatus == 'GOOD') {
        res.data.creditStatus = '信用分良好'
      } else {
        res.data.creditStatus = '信用分较差'
      }
      if (res.data.mobile) {
        res.data.mobile = res.data.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      }

      if (res.data.useTime) {
        res.data.useTime = (res.data.useTime / 60).toFixed(2)
      }



      this.setData({
        userInfo: res.data
      })
    })
  },


  
})