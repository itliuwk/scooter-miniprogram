// pages/manage/trip/take.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lattice: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id || 123
    }, () => {
      this.fetchRent()
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

  fetchRent() {
    fetch({
      url: '/business/rent?id=' + this.data.id,
      method: 'POST',
      data: {
        id: this.data.id
      }
    }).then(res => {
      let lattice = []
      for (let i = 1; i < res.maxSlotsNum + 1; i++) {
        var obj = {}
        if (i == res.slotNum) {
          obj = {
            id: i,
            checked: true
          }
        } else {
          obj = {
            id: i,
            checked: false
          }
        }
        lattice.push(obj)
      }

      this.setData({
        lattice
      },()=>{
        setTimeout(() => {
          this.toUse();
        }, 1500)
      })
  
    })
  },


  toUse() {
    wx.reLaunch({
      url: "./use"
    })
  }
})