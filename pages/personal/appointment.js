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


      result.date = formatYYYY(result.startTime)
      result.time = formatHHMM(result.startTime) + '-' + formatHHMM(result.endTime)
      result.typeName = result.type == 'RENT' ? '去取车' : '去还车'


      // 调用接口转换成具体位置
      address(result.latitude, result.longitude).then(res => {
        let appointment = {
          ...result,
          address: res.result.address_component.province + res.result.address_component.city + res.result.address_component.district,
          recommend: res.result.formatted_addresses.recommend
        }
        that.setData({
          appointment: appointment
        })
      })

    })
  },


  appointmentTap(e) {
    let type = e.currentTarget.dataset.type;


    
  }
})