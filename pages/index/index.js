// pages/index/index.js

//获取应用实例
const app = getApp();

import config from '../../config.js'
import fetch from '../../lib/fetch.js'
const BASE_URL = config.BASE_URL;
import address from '../../utils/address.js'
import CusBase64 from '../../lib/base64'


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
      points: [],
      color: "#3ACCE1",
      width: 4,
      dottedLine: true
    }],

    markerDetail: {}, //  某个mak 点详细信息


    userInfo: {}, //  个人基本信息





    isMenu: false, // 是否显示主菜单
    isInfo: false, // 是否显示提示信息

    isPending: false, // 是否有订单未支付
    pendingTotal: '', //订单未支付的额金额

    isProgressing: false,
    progressingTotal: '', //进行中的订单 多少分钟

    isEmpower: false, // 是否授权
    isExists: false, //是否有预约

    isLoadingShow: false,


    currId: '' //  记录所有车点中的第一个点

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
    let that = this

    setTimeout(() => {

      if (!this.data.isLoadingShow) {
        that.movetoCenter();
        that.getUserLocation();
      }
    }, 1000)


    that.fetchProfile()

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


          //获取提示的请求是否显示  提示信息
          this.getInfo();

        })
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
                })
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
        let first = {} //  记录所有车点中的第一个点
        let markers = res.data.data.map((item, index) => {
          if (index === 0) {
            first = item
          }
          item.iconPath = '../../assets/images/marker.png';
          item.width = 35;
          item.height = 42;
          return item;
        })


        that.setData({
          markers,
          currId: first.id,
          hasMarkers: true
        })

      }
    })

  },







  /**
   * 获取提示的请求是否显示  提示信息
   */
  getInfo() {

    if (!this.data.isEmpower) {
      return false
    }



    //订单交易 / 未完成订单
    fetch({
      url: '/transaction/pending'
    }).then(res => {
      if (res.data) {
        this.setData({
          isPending: true,
          isInfo: true,
          isShow: true,
          pendingTotal: res.data.total,
          menuH: this.data.infoH + 165 + 'rpx', //  165  对应菜单 提示的高度
        })
      }
    })



    //订单交易 / 进行中的订单
    fetch({
      url: '/transaction/progressing'
    }).then(res => {
      if (res.data) {
        this.setData({
          isProgressing: true,
          progressingTotal: res.data.total,
        }, () => {
          setTimeout(() => {
            wx.showToast({
              title: '你有进行中的订单，即将跳转',
              icon: 'none'
            })
          }, 1000)

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/manage/trip/use',
            })
          }, 2000)
        })
      }
    })




    //是否有预约车辆
    fetch({
      url: '/business/reserve/exist?type=RENT',
    }).then(res => {
      if (res.data) {
        this.setData({
          isShow: true,
          isExists: res.data,
          menuH: this.data.infoH + 165 + 'rpx', //  165  对应菜单 提示的高度
        })
      }

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


      that.setData({
        markerDetail: result.data
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


    if (this.data.isPending) {
      wx.showToast({
        title: '你有订单未支付，支付完成后才可以用车',
        icon: 'none'
      })
      return false;
    }


    if (JSON.stringify(this.data.userInfo) == '{}' || !this.data.userInfo.mobile) {
      wx.showToast({
        title: '你还没有绑定手机号码,不能用车',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/personal/setUp/binding',
        })
      }, 1500)
      return false;
    }

    if (JSON.stringify(this.data.userInfo) == '{}' || this.data.userInfo.status == "UNPAIDDEPOSIT") {
      wx.showToast({
        title: '您还没有交押金,还不能用车',
        icon: 'none'
      })


      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/manage/payment/deposit"
        })
      }, 1500)

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

    if (this.data.isPending) {

      return false;
    }


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

    if (this.data.userInfo.status == "UNPAIDDEPOSIT") {
      wx.showToast({
        title: '您还没有交押金,还不能用车',
        icon: 'none'
      })


      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/manage/payment/deposit"
        })
      }, 1500)

      return false;
    }

    wx.navigateTo({
      url: "/pages/manage/appointment/index?isExists=" + this.data.isExists
    })



  },


  /**
   *  获取是否绑定手机号  和 是否交付押金
   */
  fetchProfile() {
    let that = this
    fetch({
      url: '/profile',

    }).then(result => {
      this.setData({
        userInfo: result.data
      })

      wx.setStorageSync('userInfo', result.data);


    })
  },

  /**
   * 立即出行
   */
  Trip() {
    let that = this

    //获取是否绑定手机号  和 是否交付押金



    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          that.getUserLocation()
        } else {
          if (!that.data.userInfo.mobile) {
            wx.showToast({
              title: '你还没有绑定手机号码,不能用车',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/personal/setUp/binding',
              })
            }, 1500)
          } else {
            let e = {
              markerId: that.data.currId
            }

            that.markertap(e)
          }
          return false;
        }
      }
    })




  },


  /**
   * 立即出行
   */
  Trips() {


    if (this.data.userInfo.status == "UNPAIDDEPOSIT") {
      wx.showToast({
        title: '您还没有交押金,还不能用车',
        icon: 'none'
      })


      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/manage/payment/deposit"
        })
      }, 1500)

      return false;
    }



    let that = this

    that.setData({
      isLoadingShow: true
    })

    wx.scanCode({
      success(res) {


        fetch({
          url: '/business/rent?id=' + res.result,
          method: 'POST',
          data: {
            id: res.result
          }
        }).then(res => {


          if (res.data.errorCode === 0) { //  是否借车成功
            let lattice = []
            for (let i = 1; i < res.data.maxSlotsNum + 1; i++) {
              var obj = {}
              if (i == res.data.slotNum) {
                obj = {
                  id: i,
                  checked: true
                }
              } else {
                obj = {
                  id: i,
                  checked: false
                }
              }
              lattice.push(obj)
            }
            res.data.lattice = lattice


            wx.navigateTo({
              url: '/pages/manage/trip/take?item=' + JSON.stringify(res.data),
            })

          } else {
            wx.showToast({
              title: '租车失败,请重新扫码',
              icon: 'none'
            })
          }
        })
      },
      complete(res) {
        that.setData({
          isLoadingShow: true
        })
      }
    })

  },

  /**
   * 去取车
   */
  pickCar() {
    wx.navigateTo({
      url: '/pages/personal/appointment',
    })
  },


  /**
   * 授权
   */
  empower(res) {


    let that = this;

    if (res.detail.errMsg == 'getUserInfo:ok') {

      wx.showLoading({
        title: '加载中',
      })



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
    }
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
        if (result.data.access_token) {
          let expireTime = new Date().valueOf() + result.data.expires_in * 1000;
          result.data.expireTime = expireTime;
          try {
            app.globalData.token = result.data;
            wx.setStorageSync('tokenInfo', result.data);


            that.setData({
              isEmpower: true
            }, () => {
              wx.hideLoading();
              that.fetchProfile()
            })

          } catch (err) {
            console.error(err);
          }

        }

      }
    })
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
    let that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          isLoadingShow: true
        }, () => {
          that.fetchNearest()
        })
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