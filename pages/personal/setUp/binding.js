// pages/personal/setUp/binding.js
import fetch from '../../../lib/fetch.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    authBtnText: '获取验证码',
    restGetAuthCodeTime: 60,
    getAuthCodeTimer: null,

    mobile: '',
    code: '',
    isBid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.mobile) {
      this.setData({
        mobile: options.mobile,
        isBid: true
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

  mobileTap(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  codeTap(e) {
    this.setData({
      code: e.detail.value
    })
  },

  confirm() {

    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return;
    }


    if (!this.isPoneAvailable(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return;
    }

    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }

    let code = this.data.code
    let mobile = this.data.mobile

    fetch({
      url: '/profile/mobile?mobile=' + mobile + '&code=' + code,
      method: 'post',
      data: {
        code,
        mobile
      }
    }).then(res => {
      wx.showToast({
        title: '绑定成功',
      })

      setTimeout(() => {
        wx.navigateBack({
          delta: 2
        })
      }, 1500)
    })


  },


  isPoneAvailable(val) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(val)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 点击获取验证码
   */
  verificationCode: function() {

    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return;
    }


    if (!this.isPoneAvailable(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return;
    }

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


    let mobile = this.data.mobile

    fetch({
      url: '/profile/sendMobileCode?mobile=' + mobile,
      method: 'post',
      data: {
        mobile
      }
    }).then(res => {
      wx.showToast({
        title: '获取验证码成功',
      })
    })
  }
})