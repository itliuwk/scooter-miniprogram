// pages/payment/deposit.js
import fetch from '../../../lib/fetch.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  confirmPay() {

    fetch({
      url: '/settlement/recharge',
      method: 'post',
      isLoading: true
    }).then(result => {
      console.log()

      if (result.data.state == "COMPLETED") {
        wx.showToast({
          title: '支付成功',
        })

        setTimeout(() => {
          wx.navigateTo({
            url: './complete',
          })
        }, 1500)
      } else {

      }






    })








  }
})