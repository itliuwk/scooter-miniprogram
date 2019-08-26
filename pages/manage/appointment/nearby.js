// pages/manage/appointment/nearby.js
import fetch from '../../../lib/fetch.js'
import address from '../../../utils/address.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          //数据初始化
          that.fetchNearest()
        })
      }
    })
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

  selItem() {
    wx.navigateTo({
      url: './index',
    })
  },




  //获取附近所有网点信息
  fetchNearest() {
    let that = this

    fetch({
      url: '/business/nearestStub',
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      isLoading: true
    }).then(result => {
      result.data.map(item => {
        item.distance = parseInt(item.distance)
      })
      this.setData({
        list: result.data
      })
    })

  },
})