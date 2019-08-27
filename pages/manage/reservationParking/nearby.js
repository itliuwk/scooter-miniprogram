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
    listData: [],
    longitude: '',
    latitude: '',
    address: ''
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



  inputTyping(e) {
    let value = e.detail.value
    this.setData({
      address: value
    })
  },

  search() {
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
              latitude: res.latitude,
              address: this.data.address
            },
            isLoading: true
          }).then(res => {
            res.data.map(item => {
              item.distance = parseFloat(item.distance / 1000).toFixed(2)
            })
            this.setData({
              listData: res.data
            })

          })
        })
      },
    })

  },

  selItem(e) {
    let id = e.currentTarget.dataset.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];


    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })

    prevPage.openMak(id)

  }
})