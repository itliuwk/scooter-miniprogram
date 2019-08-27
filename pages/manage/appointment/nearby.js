// pages/manage/appointment/nearby.js
import fetch from '../../../lib/fetch.js'
import address from '../../../utils/address.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    longitude: '',
    latitude: '',
    address: ''
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

  inputTyping(e) {
    let value = e.detail.value
    this.setData({
      address: value
    })
  },

  search() {
    this.fetchNearest()
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



  },




  //获取附近所有网点信息
  fetchNearest() {
    let that = this

    fetch({
      url: '/business/nearestStub',
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        address: this.data.address
      },
      isLoading: true
    }).then(result => {
      result.data.map(item => {
        item.distance = parseFloat(item.distance / 1000).toFixed(2)
      })
      this.setData({
        list: result.data
      })
    })

  },
})