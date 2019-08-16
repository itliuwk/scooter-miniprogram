// pages/index/index.js
import fetch from '../../../lib/fetch.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapH: '100%',
    infoH: 100,
    menuH: '0',
    isMarker: true,
    matrixData: null,
    hasMap: false,

    longitude: 0,
    latitude: 0,

    polyline: [{
      points: [],
      color: "#3ACCE1",
      width: 4,
      dottedLine: true,
      arrowLine: true
    }],

    chargeDetail: {},

    isExists: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    // 初始化减去 info 的高度
    this.setData({
      menuH: this.data.infoH + 'rpx',
    })



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
            iconPath: "../../../assets/images/location.png", // 定位
            position: {
              width: 100,
              height: 100,
              left: res.screenWidth - 100,
              top: res.windowHeight - 220
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "../../../assets/images/repair.png", //  报修
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
    this.fetchCharge();
    this.fecchExist();
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
        item.iconPath = '../../../assets/images/selMarker.png'
      } else {
        item.width = 35;
        item.height = 42;
        item.iconPath = '../../../assets/images/marker.png'
      }
      return item;
    })


    that.setData({
      markers,
      isMenu: true
    })



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

    let markers = this.data.markers.map(item => {
      item.width = 35;
      item.height = 42;
      item.iconPath = '../../../assets/images/marker.png'
      return item;
    })


    var that = this;

    that.setData({
      menuH: 200 + 'rpx',
      isMenu: false
    })

  },


  fetchCharge() {
    fetch({
      url: '/business/charge',
    }).then(res => {

      this.setData({
        chargeDetail: res,
        polyline: [{
          points: res.trail,
          color: "#3ACCE1",
          width: 4,
          dottedLine: true,
          arrowLine: true
        }],
        hasMap: true

      })
    })
  },


  /**
   * 是否预约
   */
  fecchExist() {
    fetch({
      url: '/business/reserve/exist',
    }).then(res => {
      this.setData({
        isExists: res.exists
      })
    })
  },







  borrow() {


    wx.navigateTo({
      url: '/pages/manage/reservationParking/index?isExists=' + this.data.isExists,
    })


  },

  still() {
    wx.navigateTo({
      url: '/pages/manage/trip/still',
    })
  },


  /**
   *  点击 跳转附近滑板车
   */
  search() {
    wx.navigateTo({
      url: './nearby',
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









  bindcontroltap: function(e) {
    switch (e.controlId) {
      case 1:
        this.movetoCenter();
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/manage/repair/index',
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