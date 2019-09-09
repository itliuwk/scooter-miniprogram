// pages/personal/wallet/recharge.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    active: '',
    price: ''
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
    this.fetchUserInfo()
  },

  selPrice(e) {
    let price = e.currentTarget.dataset.price;
    let num = e.currentTarget.dataset.num;
    this.setData({
      active: num,
      price: price
    })
  },

  selPriceVal(e) {
    let value = Number(e.detail.value);
    // if (value < 1) {
    //   value = ''
    //   return false;
    // }

    // if (value > 500) {
    //   value = ''
    //   return false;
    // }
    // console.log(value)

    if (value) {
      this.setData({
        active: 0,
        price: value
      })
    }


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