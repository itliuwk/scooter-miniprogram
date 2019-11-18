// pages/index/index.js

//获取应用实例
const app = getApp();

import config from '../../config.js'
import fetch from '../../lib/fetch.js'
const BASE_URL = config.BASE_URL;
import address from '../../utils/address.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {

    longitude: 0,
    latitude: 0,
    hasMarkers: false,
    markers: [],

    isShowInfo: false,

    markerDetail: {}, //  某个mak 点详细信息



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
              top: res.windowHeight - 270
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "../../assets/images/repair.png", //  报修
            position: {
              width: 100,
              height: 100,
              left: res.screenWidth - 100,
              top: res.windowHeight - 350
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

    let that = this

    setTimeout(() => {
      that.getUserLocation();
      that.movetoCenter();
    }, 1000)



  },
  movetoCenter: function() {
    this.mapctx.moveToLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },



  init() {
    let that = this;

    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          //获取附近所有网点信息
          this.fetchNearest()

        })
      },
      fail(err) {
        wx.showToast({
          title: '取消位置授权,影响该小程序的使用',
          icon: 'none',
          duration: 2500
        });

        setTimeout(() => {
          that.getUserLocation();
        }, 2600)
      },
      complete(res) {}
    })



  },


  //定位方法
  getUserLocation: function() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                });
                setTimeout(() => {
                  _this.getUserLocation();
                }, 1200)
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.init();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.init();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.init();
        }
      }
    })

  },



  //获取附近所有网点信息
  fetchNearest() {
    let that = this

    wx.request({
      url: BASE_URL + '/api/wx/scooter/business/nearestStub',
      method: 'get',
      data: {
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      success: (res) => {
        let markers = res.data.data.map((item, index) => { //设置初始图标
          item.width = 40;
          item.height = 47;
          item.iconPath = '../../assets/images/marker.png'

          return item;
        })

        that.setData({
          markers,
          hasMarkers: true
        }, () => {

        })

      }
    })

  },




  /**
   * 点击mak 点
   */
  markertap(e) {

    wx.showLoading({
      title: '加载中'
    })


    /**
     * 暂时调用，后面开发应该调用后台接口获取信息
     */
    address('23.131125', '113.321486').then(res => {
      this.setData({
        markerDetail: {
          latitude: res.result.ad_info.location.lat,
          longitude: res.result.ad_info.location.lng,
          name: res.result.address_component.street_number,
          address: res.result.address,
        },
        isShowInfo: true
      })

      wx.hideLoading()


      return false;
    })



    let that = this
    fetch({
      url: '/business/stubDetail?id=' + e.markerId,
      isLoading: true
    }).then(result => {
      console.log(result)

      // 用that取代this，防止不必要的情况发生
      let markers = this.data.markers.map(item => {
        if (item.id == id) {
          item.width = 45;
          item.height = 52;
          item.iconPath = '../../assets/images/selMarker.png'
        } else {
          item.width = 40;
          item.height = 47;
          item.iconPath = '../../assets/images/marker.png'
        }
        return item;
      })

      wx.hideLoading()

      that.setData({
        markers,
        markerDetail: result.data,
        isShowInfo: true
      })



    })

  },


  /**
   * 点击地图上触发
   */
  bindtapMap(e) {
    this.setData({
      isShowInfo: false
    })
  },




  /**
   * 调用微信自带导航
   */
  intoMap() {
    wx.openLocation({
      latitude: this.data.markerDetail.latitude,
      longitude: this.data.markerDetail.longitude,
      name: this.data.markerDetail.name,
      address: this.data.markerDetail.address,
      scale: 15
    })
  },





  /**
   *地图  定位 报修 
   */
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
    }
  },
})