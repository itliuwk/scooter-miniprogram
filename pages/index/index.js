// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapH: '100%',
    infoH: 100,
    menuH: '0',
    isShow: false,
    matrixData: null,


    longitude: 0,
    latitude: 0,
    markers: [{
      id: 1,
      latitude: 22.965565,
      longitude: 113.365474,
      iconPath: '../../assets/images/marker.png',
      width: 35,
      height: 42
    }, {
      id: 2,
      latitude: 22.962562,
      longitude: 113.359144,
      iconPath: '../../assets/images/marker.png',
      width: 35,
      height: 42
    }, {
      id: 3,
      latitude: 22.940531,
      longitude: 113.384743,
      iconPath: '../../assets/images/marker.png',
      width: 35,
      height: 42
    }, {
      id: 4,
      latitude: 22.939246,
      longitude: 113.382490,
      iconPath: '../../assets/images/marker.png',
      width: 35,
      height: 42
    }],

    // polyline: [{
    //   points: [{
    //     latitude: 22.93772,
    //     longitude: 113.38424,
    //   }, {
    //     latitude: 22.962562,
    //     longitude: 113.359144,
    //   }],
    //   color: "#000",
    //   width: 10,
    //   dottedLine: true
    // }],
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // wx.showModal({
    //   content: '根据网络安全局要求必须绑定 手机号码后才能使用本服务',
    //   success(res) {
    //     if (res.errMsg == 'showModal:ok') {
    //       wx.getUserInfo({
    //         success(res) {
    //           console.log(res)
    //         }
    //       })
    //     }
    //   }
    // })

    // 初始化减去 info 的高度
    this.setData({
      menuH: this.data.infoH + 'rpx',
    })


    this.timer = options.timer;
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: "../../assets/images/location.png", // 定位
            position: {
              width: 100,
              height: 100,
              left: res.screenWidth - 100,
              top: res.windowHeight - 220
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "../../assets/images/repair.png", //  报修
            position: {
              width: 100,
              height: 100,
              left: res.screenWidth - 100,
              top: res.windowHeight - 300
            },
            clickable: true
          }]
        })
      },
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  movetoCenter: function() {
    this.mapctx.moveToLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.mapctx = wx.createMapContext("map");

    setTimeout(() => {
      this.movetoCenter();
    }, 500)
  },


  /**
   * 点击mak 点
   */
  markertap(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    let markers = this.data.markers.map(item => {
      if (item.id == e.markerId) {
        item.width = 40;
        item.height = 47;
        item.iconPath = '../../assets/images/selMarker.png'
      } else {
        item.width = 35;
        item.height = 42;
        item.iconPath = '../../assets/images/marker.png'
      }
      return item;
    })

    that.setData({
      markers
    })

    if (this.data.isMarker) { //   用于判断是否第二次点击 mak 点
      return;
    }
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
    that.animation = animation
    animation.translateY(270).step()
    that.setData({
      matrixData: animation.export(),
      isShow: !this.data.isShow
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        menuH: 500 + that.data.infoH + 'rpx',
        matrixData: animation.export(),
        isMarker: true //  用于判断是否第二次点击 mak 点
      })
    }, 200)


  },



  /**
   * 点击地图上触发
   */
  bindtapMap(e) {
    this.closeMenu();
  },

  closeMenu() {

    let markers = this.data.markers.map(item => {
      item.width = 35;
      item.height = 42;
      item.iconPath = '../../assets/images/marker.png'
      return item;
    })


    var that = this;

    that.setData({
      menuH: 200 + 'rpx',
    })
    
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })

    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      matrixData: animation.export(),

    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        menuH: that.data.infoH + 'rpx',
        markers,
        matrixData: animation.export(),
        isShow: false,
        isMarker: false //  用于判断是否第二次点击 mak 点
      })
    }, 200)
  },


  borrow() {
    console.log('借车')
  },

  still() {
    console.log('还车')
  },


  search() {
    wx.chooseLocation({
      success(res) {
        console.log(res)
      }
    })
  },


  /**
   * 跳转个人中心 
   */
  personal() {
    wx.navigateTo({
      url: '/pages/personal/index',
    })
  },


  getPhoneNumber(e) {
    console.log(e)
  },



  bindcontroltap: function(e) {
    switch (e.controlId) {
      case 1:
        this.movetoCenter();
        break;
      case 2:
        if (this.timer) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.scanCode({
            success: () => {
              wx.showLoading({
                title: '正在获取密码',
              })
              wx.request({
                url: 'https://www.easy-mock.com/mock/5963172d9adc231f357c8ab1/ofo/getname',

                success: (res) => {
                  console.log(res);
                  wx.hideLoading();
                  wx.redirectTo({
                    url: '../scanResult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                    success: () => {
                      wx.showToast({
                        title: '获取密码成功',
                        duration: 1000
                      })
                    }
                  })
                }
              })
            }
          })
        }
        break;
      case 3:
        wx.navigateTo({
          url: '../my/index',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../warn/index',
        })
        break;

    }
  },
})