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
      latitude: 22.963194,
      longitude: 113.362598,
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

    polyline: [{
      points: [{
          latitude: 22.963194,
          longitude: 113.362598,
        },
        {
          latitude: 22.962276,
          longitude: 113.363044,
        }, {
          latitude: 22.962360,
          longitude: 113.363398,
        }, {
          latitude: 22.963165,
          longitude: 113.364347,
        }, {
          latitude: 22.964434,
          longitude: 113.363730,
        }, {
          latitude: 22.964074,
          longitude: 113.363199,
        }, {
          latitude: 22.965145,
          longitude: 113.363414,
        }, {
          latitude: 22.965457,
          longitude: 113.363585,
        }, {
          latitude: 22.965471,
          longitude: 113.363886,
        }, {
          latitude: 22.965457,
          longitude: 113.363585,
        }, {
          latitude: 22.965565,
          longitude: 113.365474
        }
      ],
      color: "#3ACCE1",
      width: 4,
      dottedLine: true
    }],


    isMenu: false, // 显示主菜单
    isInfo: false, // 显示提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    // 初始化减去 info 的高度
    this.setData({
      menuH: this.data.infoH + 'rpx',
    })


    //获取提示的请求是否显示  提示信息
    this.getInfo();

    //  获取当前位置信息
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

    // 地图上的一些操作按钮
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
    this.mapctx = wx.createMapContext("map");
  },
  movetoCenter: function() {
    this.mapctx.moveToLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    setTimeout(() => {
      this.movetoCenter();
    }, 2000)
  },


  /**
   * 获取提示的请求是否显示  提示信息
   */
  getInfo() {
    this.setData({
      isInfo: true,
      isShow: true,
      menuH: this.data.infoH + 165 + 'rpx', //  165  对应菜单 提示的高度
    })
  },


  /**
   * 点击mak 点
   */
  markertap(e) {
    console.log(e)
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
      markers,
      isMenu: true,
      isInfo: false,
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
      isShow: true
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


  /**
   * 关闭菜单
   */
  closeMenu() {


    if (!this.data.isShow) return;
    let markers = this.data.markers.map(item => {
      item.width = 35;
      item.height = 42;
      item.iconPath = '../../assets/images/marker.png'
      return item;
    })


    var that = this;

    that.setData({
      menuH: 200 + 'rpx',
      isMenu: false
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


  /**
   *  点击 
   */
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

  /**
   * 
   */
  intoMap() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) { //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({ //所以这里会显示你当前的位置
          latitude: latitude,
          longitude: longitude,
          name: "骏盈大厦",
          address: "广东省广州市番禺区东沙村",
          scale: 28
        })
      }
    })
  },


  /**
   * 跳转支付页面
   */
  toPay() {
    wx.navigateTo({
      url: '/pages/manage/payment/end',
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