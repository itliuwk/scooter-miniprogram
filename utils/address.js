//  根据经纬度  获取地址

var QQMapWX = require('../lib/qqmap-wx-jssdk.min.js'); //引入 sdk  

var qqmapsdk = new QQMapWX({ // 实例化API核心类
  key: 'MSABZ-XHBWP-BACDF-V5IHV-DY3QF-BQFKI'
});

function address(latitude, longitude) {
  return new Promise(function(resolve, reject) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success: function(res) {
        resolve(res)
      }
    })

  })

}

export default address;