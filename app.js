import config from './config.js'
const BASE_URL = config.BASE_URL;
import CusBase64 from './lib/base64'

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {


  },





  globalData: {
    userInfo: null,
    loginInfo: null,
    token: null,
    openId: ''
  }
})