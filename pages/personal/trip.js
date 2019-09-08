// pages/personal/wallet/trip.js

import fetch from '../../lib/fetch.js'
import {
  formatYYYYSS
} from '../../utils/date.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripList: [],
    listEnd: false,
    listParams: {
      size: 10,
      from: 0
    }
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
    this.fetchList()
  },

  fetchList() {

    if (this.data.listEnd) {
      return
    }

    fetch({
      url: '/journey/list',
      data: {
        ...this.data.listParams
      }
    }).then(res => {

      if (res.data.length < this.data.listParams.size) {
        this.setData({
          listEnd: true
        })
      }

      res.data.map(item => {
        item.createdDate = formatYYYYSS(item.createdDate)
        item.time = parseInt((item.time / 1000) / 60)
        return item;
      })


      this.setData({
        tripList: [...this.data.tripList, ...res.data]
      })
    })
  },


  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchList();
  },


})