import config from './config.js'
const BASE_URL = config.BASE_URL;


App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {


    console.log(234)
    let that = this


    wx.login({
      success: res => {
        console.log(234)
        // 登录注册接口
        if (res.code) {
          // 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中


          wx.request({
            url: BASE_URL + '/wxa/login?code=' + res.code,
            method: 'post',
            data: {
              code: res.code
            },
            success: (res) => {
              this.fetchWxlogin(res)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  fetchWxlogin(res) {
    let self = this

    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data: {
        grant_type: 'wxa',
        openId: res.data.openId,
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