// pages/manage/trip/take.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // lattice: [ {
    //     id:  1,
    //      checked: false
    //   },   {
    //     id:  2,
    //      checked:  false
    //   },   {
    //     id:  3,
    //      checked: true
    //   },   {
    //     id:  4,
    //      checked:  false
    //   },   {
    //     id:  5,
    //      checked:  false
    //   },   {
    //     id:  6,
    //      checked:  false
    //   },   {
    //     id:  7,
    //      checked:  false
    //   },   {
    //     id:  8,
    //      checked:  false
    //   },   {
    //     id:  9,
    //      checked:  false
    //   }

    // ],
    lattice: [],
    item: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    if (options.item) {
      this.setData({
        lattice: JSON.parse(options.item).lattice,
        item: JSON.parse(options.item)
      }, () => {
        setTimeout(() => {
          this.toUse()
          console.log(this.data.lattice)
        }, 1500)
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


  toUse() {
    wx.reLaunch({
      url: "./use"
    })
  }
})