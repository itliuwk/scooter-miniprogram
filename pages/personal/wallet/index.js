// pages/personal/wallet/index.js
import fetch from '../../../lib/fetch.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '', //  是否交押金  UNPAIDDEPOSIT 未交  PAIDDEPOSIT 已交
    wallet: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      status: options.status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.data.status == 'UNPAIDDEPOSIT') {
      this.setData({
        wallet: {
          balance: 0,
          frozenBalance: 0
        }
      })
    } else {
      this.fetchWallet()
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  withdraw() {

    if (this.data.status == 'UNPAIDDEPOSIT') {
      wx.showToast({
        title: '您还未交押金或押金为0，退押金无效',
        icon: 'none'
      })
      return false

    }


    if (this.data.wallet.frozenBalance == null || this.data.wallet.frozenBalance === 0) {
      wx.showToast({
        title: '您的押金为0，退押金无效',
        icon: 'none'
      })
      return false
    }

    wx.navigateTo({
      url: './withdraw?balance=' + this.data.wallet.frozenBalance,
    })

  },

  fetchWallet() {

    fetch({
      url: '/settlement/wallet',
      isLoading: true
    }).then(res => {
      this.setData({
        wallet: res.data
      })
    })
  }



})