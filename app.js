import config from './config.js'
const BASE_URL = config.BASE_URL;
import CusBase64 from './lib/base64'

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {


  },

  fetchWxlogin(res) {
    let self = this
    let Authorization = CusBase64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);
    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data: {
        grant_type: 'wxa',
        openId: res.data.openId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Authorization}`
      },
      success: res => {
        if (res.data.access_token) {
          let expireTime = new Date().valueOf() + res.data.expires_in * 1000;
          res.data.expireTime = expireTime;
          try {
            self.globalData.token = res.data;
            wx.setStorageSync('tokenInfo', res.data);

          } catch (err) {
            console.error(err);
          }

        }

      }
    })
  },



  globalData: {
    userInfo: null,
    loginInfo: null,
    token: null,
    openId: ''
  }
})