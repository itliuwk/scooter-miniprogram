// pages/manage/appointment/nearby.js
import fetch from '../../../lib/fetch.js'
import {
  formatYYYY,
  formatHHMM,
  formatValue
} from '../../../utils/date.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
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
    this.fetchNearest()
  },

  /**
   * 获取停车位
   */
  fetchNearest() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          fetch({
            url: '/business/nearestStub',
            data: {
              longitude: res.longitude,
              latitude: res.latitude
            },
            isLoading: true
          }).then(res => {
            res.data.map(item => {
              item.distance = parseInt(item.distance)
            })
            this.setData({
              listData: res.data
            })

          })
        })
      },
    })

  },

  selItem() {
    wx.navigateTo({
      url: './index',
    })
  }
})