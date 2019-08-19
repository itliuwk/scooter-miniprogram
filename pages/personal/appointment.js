// pages/personal/appointment.js

import fetch from '../../lib/fetch.js'
import address from '../../utils/address.js'
import {
  formatYYYY,
  formatHHMM
} from '../../utils/date.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.fetchAppointment();
  },

  fetchAppointment() {
    let that = this;
    fetch({
      url: '/reservation',
      isLoading: true
    }).then(result => {


      result.data.date = formatYYYY(result.data.startTime)
      result.data.time = formatHHMM(result.data.startTime) + '-' + formatHHMM(result.data.endTime)
      result.data.typeName = result.data.type == 'RENT' ? '去取车' : '去还车'


      that.setData({
        appointment: result.data
      })


    })
  },


  /**
   * 去取车，或者还车
   */
  appointmentTap(e) {
    let type = e.currentTarget.dataset.type;

    let that = this;
    wx.scanCode({
      success(res) {

        if (type == 'RENT') {

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

          return false;
        }

        fetch({
          url: '/business/return?id=' + res.result,
          method: 'POST',
          data: {
            id: res.result
          }
        }).then(res => {
          if (!res.data.full) { // 车位是否已满

            if (res.data.errorCode === 0) { //  是否还车成功
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
                url: '/pages/manage/trip/still?item=' + JSON.stringify(res.data),
              })


            } else {
              wx.showToast({
                title: '还车失败,请重新扫码',
                icon: 'none'
              })
            }



          } else {
            wx.showToast({
              title: '此车位已满,请重新扫码',
              icon: 'none'
            })
          }

        })

      }
    })
  },


  update(e) {
    let type = e.currentTarget.dataset.type;

    if (type == 'RENT') {
      wx.navigateTo({
        url: '/pages/manage/appointment/index?isExists=true',
      })
    } else {
      wx.navigateTo({
        url: '/pages/manage/appointment/index',
      })
    }
  },


  /**
   * 
   */
  intoMap() {
    wx.openLocation({ //所以这里会显示你当前的位置
      latitude: this.data.appointment.latitude,
      longitude: this.data.appointment.longitude,
      name: this.data.appointment.recommend,
      address: this.data.appointment.address,
      scale: 15
    })
  },
})