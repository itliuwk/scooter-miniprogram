//  根据经纬度  获取地址

var QQMapWX = require('../lib/qqmap-wx-jssdk.min.js'); //引入 sdk  

var qqmapsdk = new QQMapWX({ // 实例化API核心类
  key: 'MSABZ-XHBWP-BACDF-V5IHV-DY3QF-BQFKI'
});

function address(latitude, longitude) {
  wx.showToast({
    title: '加载中',
  })
  return new Promise(function(resolve, reject) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success: function(res) {
        wx.hideToast()
        resolve(res)
      },
      fail: function(res) {
        wx.hideToast()
      },
      complete: function(res) {
        wx.hideToast()
      }
    })

  })

}

export default address;