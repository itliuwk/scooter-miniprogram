import config from './config.js'
const BASE_URL = config.BASE_URL;
import CusBase64 from './lib/base64'

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

    let that = this
    try {
      var value = wx.getStorageSync('tokenInfo')
      if (!value) {
        that.login()
      } else {
        if (value.expireTime && value.expireTime < Date.now()) {
          that.login()
        }
      }
    } catch (e) {
      // Do something when catch error
      that.login()
    }
  },


  login() {
    let that = this
    wx.login({
      success: e => {
        let code = e.code

        // 登录注册接口
        if (code) {
          // 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
          wx.getUserInfo({
            success: function(result) {

              wx.request({
                url: BASE_URL + '/wxa/login?code=' + code,
                method: 'post',
                data: {
                  code
                },
                success: (res) => {
                  wx.setStorageSync('codeInfo', result);
                  let encryptedData = result.encryptedData;
                  that.fetchWxlogin(res, encryptedData, result.iv); //调用服务器api

                }
              })

            }
          })
        }
      }
    });
  },


  fetchWxlogin(res, encryptedData, iv) {
    let that = this
    let Authorization = CusBase64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);
    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data: {
        sessionKey: res.data.sessionKey,
        grant_type: 'wxa',
        encryptedData,
        iv
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Authorization}`
      },
      success: result => {
        console.log(result)
        if (result.data.access_token) {
          let expireTime = new Date().valueOf() + result.data.expires_in * 1000;
          result.data.expireTime = expireTime;
          try {
            that.globalData.token = result.data;
            wx.setStorageSync('tokenInfo', result.data);


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