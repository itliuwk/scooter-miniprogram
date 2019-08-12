// pages/personal/setUp/binding.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authBtnText: '获取验证码',
    restGetAuthCodeTime: 60,
    getAuthCodeTimer: null,
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

  },



  /**
   * 点击获取验证码
   */
  verificationCode: function() {


    if (this.data.getAuthCodeTimer) return;
    let restTime = this.data.restGetAuthCodeTime;
    let timer = setInterval(() => {
      restTime--;
      if (restTime != 0) {
        this.setData({
          authBtnText: restTime + 's (重新获取)',
        });
      } else {
        clearInterval(this.data.getAuthCodeTimer);
        this.setData({
          getAuthCodeTimer: null,
          authBtnText: '获取验证码'
        });
      }
    }, 1000);
    this.setData({
      getAuthCodeTimer: timer
    });

    wx.showToast({
      title: '获取验证码成功',
    })
  }
})