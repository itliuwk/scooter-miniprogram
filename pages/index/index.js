// pages/index/index.js
import fetch from '../../lib/fetch.js'
import address from '../../utils/address.js'
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
    hasMarkers: false,
    markers: [],
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

    markerDetail: {},





    isMenu: false, // 是否显示主菜单
    isInfo: false, // 是否显示提示信息

    isEmpower: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;

    //  获取是否授权
    wx.getSetting({
      success(res) {
        let isEmpower = false;
        if (res.authSetting['scope.userInfo']) {
          isEmpower = true
        }

        that.setData({
          isEmpower
        })
      }
    })

    // 初始化减去 info 的高度
    this.setData({
      menuH: this.data.infoH + 'rpx',
    })

    //获取附近所有网点信息
    this.fetchNearest()


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


  fetchNearest() {
    fetch({
      url: '/business/nearestStub',
      isLoading: true
    }).then(res => {

      let markers = res.data.map((item, index) => {
        item.iconPath = '../../assets/images/marker.png';
        item.width = 35;
        item.height = 42;
        return item;
      })


      this.setData({
        markers,
        hasMarkers: true
      })
    })
  },


  /**
   * 获取提示的请求是否显示  提示信息
   */
  getInfo() {
    this.setData({
      isInfo: false,
      // isShow: true,
      // menuH: this.data.infoH + 165 + 'rpx', //  165  对应菜单 提示的高度
    })
  },


  /**
   *   获取点击 mak  的详情
   */
  fetchDetail(id) {
    let that = this
    fetch({
      url: '/business/stubDetail?id=' + id,
      isLoading: true
    }).then(result => {

      // 调用接口转换成具体位置
      address(result.latitude, result.longitude).then(res => {
        let markerDetail = {
          ...result,
          address: res.result.address_component.province + res.result.address_component.city + res.result.address_component.district,
          recommend: res.result.formatted_addresses.recommend
        }
        that.setData({
          markerDetail: markerDetail
        })
      })






    })
  },


  /**
   * 点击mak 点
   */
  markertap(e) {
    if (!this.data.isEmpower) {
      wx.showToast({
        title: '请先点击下方授权',
        icon: 'none'
      })
      return false;
    }



    this.fetchDetail(e.markerId);




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


  /**
   * 预约滑板车
   */
  appointment() {
    wx.navigateTo({
      url: "/pages/manage/appointment/index"
    })
  },



  /**
   * 立即出行
   */
  Trip() {

    wx.showToast({
      title: '你还没有支付押金,不能用车',
      icon: 'none'
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/manage/payment/deposit',
      })



    }, 1500)
  },


  Trips() {
    wx.navigateTo({
      url: '/pages/manage/trip/take',
    })
  },


  /**
   * 授权
   */
  empower(res) {

    if (res.detail.errMsg == 'getUserInfo:ok') {

      wx.showLoading({
        title: '',
      })


      setTimeout(() => {
        this.setData({
          isEmpower: true
        }, () => {
          wx.hideLoading()
        })
      }, 1500)
      wx.login({
        success: res => {

          // 登录注册接口
          if (res.code) {
            // 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中

          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
  },


  /**
   *  点击 
   */
  search() {

    if (!this.data.isEmpower) {
      wx.showToast({
        title: '请先点击下方授权',
        icon: 'none'
      })
      return false;
    }
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


    if (!this.data.isEmpower) {
      wx.showToast({
        title: '请先点击下方授权',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/personal/index',
    })
  },

  /**
   * 
   */
  intoMap() {
    wx.openLocation({ //所以这里会显示你当前的位置
      latitude: this.data.markerDetail.latitude,
      longitude: this.data.markerDetail.longitude,
      name: this.data.markerDetail.recommend,
      address: this.data.markerDetail.address,
      scale: 15
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
        wx.navigateTo({
          url: '../manage/repair/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../manage/repair/index',
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