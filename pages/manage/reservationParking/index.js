// pages/index/index.js
import fetch from '../../../lib/fetch.js'
import address from '../../../utils/address.js'
import {
  formatYYYY,
  formatHHMM,
  formatValue
} from '../../../utils/date.js'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapH: '100%',
    infoH: 650,
    menuH: '0',
    isShow: false,
    isMarker: true,
    matrixData: null,


    longitude: 0,
    latitude: 0,

    hasMarkers: false,
    markers: [],

    markerDetail: {},



    date: formatYYYY(new Date()),
    multiArray: [
      ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    ],
    multiIndex: [0, 0],



    isMenu: true, // 是否显示主菜单
    isExists: 'false', //是否预约
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      isExists: options.isExists || 'false'
    })


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
    this.fetchNearest()
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
   * 获取停车位
   */
  fetchNearest() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          fetch({
            url: '/business/nearestStub',
            data: {
              longitude: res.longitude,
              latitude: res.latitude
            },
            isLoading: true
          }).then(res => {
            let first = ''
            let markers = res.data.map((item, index) => {
              if (index == 0) {
                item.width = 45;
                item.height = 52;
                item.iconPath = '../../../assets/images/selMarker.png'
                first = item;

              } else {
                item.iconPath = '../../../assets/images/marker.png';
                item.width = 40;
                item.height = 47;

              }

              if (item.slotsNum === 0) {
                item.iconPath = '../../../assets/images/noSpace.png'
              }

              // if (item.vehicleNum === 0) {
              //   item.iconPath = '../../../assets/images/noCar.png'
              // }
              return item;
            })


            that.setData({
              markers,
              hasMarkers: true,
              currId: first.id
            }, () => {
              if (this.data.isExists == 'false') {
                this.fetchDetail(first.id) //  获取第一个点 mak 点
              } else {
                this.fetchAppointment(first.id) //  获取第一个点 mak 点
              }
            })
          })
        })
      },
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
        isShow: true,
        markerDetail: result.data
      })

    })
  },



  fetchAppointment() {
    let that = this;
    fetch({
      url: '/reservation',
      isLoading: true
    }).then(result => {


      let date = formatYYYY(result.data.startTime)
      let start = formatHHMM(result.data.startTime)
      let end = formatHHMM(result.data.endTime)

      let multiArray = this.data.multiArray
      // let multiIndex = this.data.multiIndex



      let multiIndex = []
      multiArray[0].forEach(function(item, index) {
        if (item == start) {
          multiIndex.push(index)
        }
      })

      multiArray[0].forEach(function(item, index) {
        if (item == end) {
          multiIndex.push(index)
        }
      })



      that.setData({
        isShow: true,
        currId: result.data.id,
        date: date,
        multiIndex,
        markerDetail: result.data
      })

    })
  },


  /**
   * 选择滑板车返回更新的方法
   */
  openMak(markerId) {
    let that = this;
    let e = {
      markerId
    }

    that.markertap(e)

  },


  /**
   * 点击mak 点
   */
  markertap(e) {


    this.fetchDetail(e.markerId);

    // 用that取代this，防止不必要的情况发生
    var that = this;
    let markerDetail = {}
    let markers = this.data.markers.map(item => {
      if (item.id == e.markerId) {
        item.width = 45;
        item.height = 52;
        item.iconPath = '../../../assets/images/selMarker.png'
        markerDetail = item
      } else {
        item.width = 40;
        item.height = 47;
        item.iconPath = '../../../assets/images/marker.png'
        if (item.slotsNum === 0) {
          item.iconPath = '../../../assets/images/noSpace.png'
        }

        // if (item.vehicleNum === 0) {
        //   item.iconPath = '../../../assets/images/noCar.png'
        // }
      }
      return item;
    })


    that.setData({
      markers,
      markerDetail,
      currId: e.markerId,
      isMenu: true
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
        menuH: that.data.infoH + 'rpx',
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
      item.iconPath = '../../../assets/images/marker.png'
      if (item.slotsNum === 0) {
        item.iconPath = '../../../assets/images/noSpace.png'
      }

      // if (item.vehicleNum === 0) {
      //   item.iconPath = '../../../assets/images/noCar.png'
      // }
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
        menuH: 0 + 'rpx',
        markers,
        matrixData: animation.export(),
        isShow: false,
        isMarker: false //  用于判断是否第二次点击 mak 点
      })
    }, 200)
  },


  /**
   * 日期的选择
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },


  /**
   * 时间间隔的选择
   */
  bindMultiPickerChange: function(e) {
    let value = e.detail.value
    if (value[0] > value[1]) {
      wx.showToast({
        title: '开始间隔不能大于结束间隔,选择无效',
        icon: 'none'
      })

      this.setData({
        multiIndex: [0, 0]
      })

      return false;
    }


    if (value[0] == value[1]) {
      wx.showToast({
        title: '开始间隔不能相同,选择无效',
        icon: 'none'
      })

      this.setData({
        multiIndex: [0, 0]
      })

      return false;
    }


    this.setData({
      multiIndex: e.detail.value
    })

  },






  borrow() {
    console.log('借车')
  },

  still() {
    console.log('还车')
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



  /**
   * 立即预约
   */
  active(e) {

    // if (this.data.markerDetail.slotsNum === 0) {
    //   wx.showToast({
    //     title: '没有可用车位,请重新选择',
    //     icon: 'none'
    //   })
    //   return false;
    // }

    let multiArray = this.data.multiArray
    let multiIndex = this.data.multiIndex

    if (multiIndex[0] == multiIndex[1]) {
      wx.showToast({
        title: '开始间隔不能相同,请重新选择',
        icon: 'none'
      })

      return false;
    }

    let date = this.data.date

    let start = formatValue(date + ' ' + multiArray[0][multiIndex[0]]);
    let end = formatValue(date + ' ' + multiArray[1][multiIndex[1]]);

    let nowTime = formatValue(new Date());

    if (start < nowTime) {
      wx.showToast({
        title: '开始间隔时间不能小于现在的时间,请重新选择',
        icon: 'none'
      })
      return false;
    }

    if (this.data.markerDetail.slotsNum == 0) {
      wx.showToast({
        title: '当前车厢位置已满,请重新选择其他车厢',
        icon: 'none'
      })

      return false;
    }



    fetch({
      url: '/business/reserve?id=' + this.data.currId + '&type=GIVEBACK',
      method: 'post',
      data: {
        start,
        end,
        id: this.data.currId,
        type: 'GIVEBACK'
      }
    }).then(result => {

      wx.showToast({
        title: '预约车位成功',
      })
      setTimeout(() => {
        wx.navigateTo({
          url: './active?result=' + JSON.stringify(result.data),
        })
      }, 1500)

    })

  },


  /**
   * 取消预约
   */
  cancel(e) {
    let that = this
    wx.showModal({
      title: '确定取消预约嘛?',
      success(res) {
        if (res.confirm) {
          fetch({
            url: '/business/reserve/cancel?type=GIVEBACK',
            method: 'post',
            data: {
              type: 'GIVEBACK'
            }
          }).then(result => {

            wx.showToast({
              title: '取消预约成功',
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/manage/trip/use',
              })
            }, 1500)

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })






  },



  /**
   * 确认预约
   */
  confirm(e) {
    let multiArray = this.data.multiArray
    let multiIndex = this.data.multiIndex

    if (multiIndex[0] == multiIndex[1]) {
      wx.showToast({
        title: '开始间隔不能相同,请重新选择',
        icon: 'none'
      })

      return false;
    }

    let date = this.data.date

    let start = formatValue(date + ' ' + multiArray[0][multiIndex[0]]);
    let end = formatValue(date + ' ' + multiArray[1][multiIndex[1]]);

    let nowTime = formatValue(new Date());

    if (start < nowTime) {
      wx.showToast({
        title: '开始间隔时间不能小于现在的时间,请重新选择',
        icon: 'none'
      })
      return false;
    }




    if (this.data.markerDetail.slotsNum == 0) {
      wx.showToast({
        title: '当前车厢位置已满,请重新选择其他车厢',
        icon: 'none'
      })

      return false;
    }




    fetch({
      url: '/business/reserve',
      method: 'PUT',
      data: {
        start,
        end,
        id: this.data.currId,
        type: 'GIVEBACK'
      }
    }).then(result => {

      wx.showToast({
        title: '修改预约成功',
      })
      setTimeout(() => {
        wx.navigateTo({
          url: './active?result=' + JSON.stringify(result.data),
        })
      }, 1500)

    })

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